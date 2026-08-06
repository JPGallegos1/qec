import { defineMiddleware } from 'astro:middleware';
import { createSecurityHeaders } from './lib/security-headers.mjs';

const apexHost = 'queestanconstruyendo.com';
const wwwHost = `www.${apexHost}`;

const securityHeaders = createSecurityHeaders(import.meta.env.PUBLIC_POSTHOG_HOST, {
  upgradeInsecureRequests: !import.meta.env.DEV,
});

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const requestUrl = new URL(request.url);
  const isApi = requestUrl.pathname === '/api' || requestUrl.pathname.startsWith('/api/');
  let response: Response;

  // Redirect www → apex for document navigations only.
  // Never redirect /api/*: fetch from www would become a cross-origin
  // redirect and fail CORS (preflight has no Access-Control-Allow-Origin).
  if (requestUrl.hostname === wwwHost && !isApi) {
    requestUrl.protocol = 'https:';
    requestUrl.hostname = apexHost;
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
