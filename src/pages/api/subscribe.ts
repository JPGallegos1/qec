import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { cleanText, enforceFormRateLimit, hasConsent, isEmail, isSameOrigin, jsonResponse, readFormBody, safeText, verifyTurnstile } from '../../lib/forms';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!isSameOrigin(request)) return jsonResponse({ message: 'No pudimos validar el origen del formulario.' }, 403);
  const parsed = await readFormBody(request);
  if ('response' in parsed) return parsed.response;
  const { body } = parsed;
  if (cleanText(body.company, 100)) return jsonResponse({ message: 'Revisá tu casilla para continuar.' });

  const email = safeText(body.email, 180).toLowerCase();
  if (!isEmail(email)) return jsonResponse({ message: 'Ingresá un email válido.' }, 400);
  if (!hasConsent(body.consent)) return jsonResponse({ message: 'Necesitamos tu consentimiento para suscribirte.' }, 400);

  const rateLimitError = await enforceFormRateLimit(request, 'subscribe', email);
  if (rateLimitError) return rateLimitError;

  const turnstileError = await verifyTurnstile(request, body['cf-turnstile-response'], 'subscribe');
  if (turnstileError) return turnstileError;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return jsonResponse({ message: 'La suscripción todavía no está conectada a Resend.' }, 503);

  const resend = new Resend(apiKey);
  const { data, error } = await resend.contacts.create({
    email,
    unsubscribed: false,
  });

  if (error) {
    console.error('Resend contact creation failed', error);
    return jsonResponse({ message: 'No pudimos completar la suscripción en este momento.' }, 502);
  }

  return jsonResponse({
    id: data?.id,
    message: 'Ya estás en la lista. Vas a recibir la próxima edición.',
  }, 201);
};
