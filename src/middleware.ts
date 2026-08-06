import { defineMiddleware } from 'astro:middleware';
import { createSecurityHeaders } from './lib/security-headers.mjs';

const securityHeaders = createSecurityHeaders(import.meta.env.PUBLIC_POSTHOG_HOST, {
  upgradeInsecureRequests: !import.meta.env.DEV,
});

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const requestUrl = new URL(request.url);
  let response: Response;

  if (requestUrl.hostname === 'www.queestanconstruyendo.com') {
    requestUrl.protocol = 'https:';
    requestUrl.hostname = 'queestanconstruyendo.com';
    requestUrl.port = '';
    response = Response.redirect(requestUrl, 308);
  } else {
    response = await next();
  }
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
