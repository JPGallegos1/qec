import { defineMiddleware } from 'astro:middleware';

const posthogOrigin = (() => {
  try {
    return new URL(import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com').origin;
  } catch {
    return 'https://us.i.posthog.com';
  }
})();

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  `connect-src 'self' ${posthogOrigin} https://challenges.cloudflare.com`,
  "font-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'frame-src https://challenges.cloudflare.com',
  "img-src 'self' data:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  'upgrade-insecure-requests',
].join('; ');

export const onRequest = defineMiddleware(async (_, next) => {
  const response = await next();
  const headers = new Headers(response.headers);

  headers.set('Content-Security-Policy', contentSecurityPolicy);
  headers.set('Permissions-Policy', 'camera=(), geolocation=(), microphone=(), payment=(), usb=()');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
