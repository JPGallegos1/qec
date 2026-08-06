import { env } from 'cloudflare:workers';

export const jsonResponse = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
});

export const cleanText = (value: unknown, maxLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

const unsafeSingleLine = /[\u0000-\u001f\u007f]/;
const unsafeMultiline = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

export const safeText = (value: unknown, maxLength: number, multiline = false) => {
  if (typeof value !== 'string' || value.length > maxLength) return '';
  if ((multiline ? unsafeMultiline : unsafeSingleLine).test(value)) return '';
  return value.trim();
};

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isWebUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isSameOrigin = (request: Request) => {
  const origin = request.headers.get('Origin');
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
};

type FormBodyResult = { body: Record<string, unknown> } | { response: Response };

export const readFormBody = async (request: Request, maxBytes = 16_384): Promise<FormBodyResult> => {
  const contentType = request.headers.get('Content-Type')?.toLowerCase() || '';
  const isJson = contentType.startsWith('application/json');
  const isUrlEncoded = contentType.startsWith('application/x-www-form-urlencoded');
  if (!isJson && !isUrlEncoded) {
    return { response: jsonResponse({ message: 'El formulario tiene un formato no compatible.' }, 415) } as const;
  }

  const declaredLength = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { response: jsonResponse({ message: 'El formulario supera el tamaño permitido.' }, 413) } as const;
  }

  if (!request.body) {
    return { response: jsonResponse({ message: 'El formulario está vacío.' }, 400) } as const;
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      return { response: jsonResponse({ message: 'El formulario supera el tamaño permitido.' }, 413) } as const;
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder().decode(bytes);
    const value = isJson
      ? JSON.parse(text) as unknown
      : Object.fromEntries(new URLSearchParams(text));
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid body');
    return { body: value as Record<string, unknown> } as const;
  } catch {
    return { response: jsonResponse({ message: 'El formulario no tiene un formato válido.' }, 400) } as const;
  }
};

export const hasConsent = (value: unknown) => value === true || value === 'on' || value === 'true';

export const enforceFormRateLimit = async (request: Request, action: string, identity?: string): Promise<Response | null> => {
  const actor = identity
    || request.headers.get('CF-Connecting-IP')
    || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim()
    || 'unknown';
  const actorHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(actor));
  const key = Array.from(new Uint8Array(actorHash), (byte) => byte.toString(16).padStart(2, '0')).join('');
  const { success } = await env.FORM_RATE_LIMITER.limit({ key: `${action}:${key}` });

  if (success) return null;
  return jsonResponse({ message: 'Recibimos demasiados envíos desde esta conexión. Esperá un minuto.' }, 429);
};

interface TurnstileResult {
  success: boolean;
  hostname?: string;
  action?: string;
  'error-codes'?: string[];
}

export const verifyTurnstile = async (
  request: Request,
  token: unknown,
  expectedAction: string,
): Promise<Response | null> => {
  const usesTestCredentials = import.meta.env.DEV;
  const secret = usesTestCredentials
    ? '1x0000000000000000000000000000000AA'
    : process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return jsonResponse({ message: 'La verificación anti-spam no está disponible temporalmente.' }, 503);
  }

  const responseToken = safeText(token, 2_048);
  if (!responseToken) {
    return jsonResponse({ message: 'Completá la verificación anti-spam.' }, 403);
  }

  const payload = new URLSearchParams({ secret, response: responseToken });
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) payload.set('remoteip', remoteIp);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload,
      signal: AbortSignal.timeout(10_000),
    });
    const result = await response.json() as TurnstileResult;
    const expectedHostname = new URL(request.url).hostname;

    const invalidMetadata = !usesTestCredentials
      && (result.hostname !== expectedHostname || result.action !== expectedAction);

    if (!response.ok || !result.success || invalidMetadata) {
      console.warn('Turnstile validation failed', {
        action: result.action,
        errors: result['error-codes'],
        hostname: result.hostname,
      });
      return jsonResponse({ message: 'No pudimos validar la verificación anti-spam.' }, 403);
    }
  } catch (error) {
    console.error('Turnstile request failed', error);
    return jsonResponse({ message: 'La verificación anti-spam no respondió. Probá nuevamente.' }, 503);
  }

  return null;
};
