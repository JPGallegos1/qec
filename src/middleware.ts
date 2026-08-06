import { defineMiddleware } from 'astro:middleware';
import { createSecurityHeaders } from './lib/security-headers.mjs';

const securityHeaders = createSecurityHeaders(import.meta.env.PUBLIC_POSTHOG_HOST);

export const onRequest = defineMiddleware(async (_, next) => {
  const response = await next();
  const headers = new Headers(response.headers);

  for (const [name, value] of Object.entries(securityHeaders)) {
    headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
