const defaultPosthogHost = 'https://us.i.posthog.com';

export const resolvePosthogOrigin = (host) => {
  try {
    const url = new URL(host || defaultPosthogHost);
    return url.protocol === 'https:' ? url.origin : defaultPosthogHost;
  } catch {
    return defaultPosthogHost;
  }
};

export const createSecurityHeaders = (posthogHost, { upgradeInsecureRequests = true } = {}) => {
  const posthogOrigin = resolvePosthogOrigin(posthogHost);
  const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    `connect-src 'self' https://queestanconstruyendo.com https://www.queestanconstruyendo.com ${posthogOrigin} https://challenges.cloudflare.com`,
    "font-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'frame-src https://challenges.cloudflare.com',
    "img-src 'self' data:",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
  ];

  if (upgradeInsecureRequests) {
    contentSecurityPolicy.push('upgrade-insecure-requests');
  }

  return {
    'Content-Security-Policy': contentSecurityPolicy.join('; '),
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
};

export const serializeStaticHeaders = (posthogHost) => {
  const lines = ['/*'];

  for (const [name, value] of Object.entries(createSecurityHeaders(posthogHost))) {
    lines.push(`  ${name}: ${value}`);
  }

  return `${lines.join('\n')}\n`;
};
