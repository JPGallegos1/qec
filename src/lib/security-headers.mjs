const defaultPosthogHost = 'https://us.i.posthog.com';

export const resolvePosthogOrigin = (host) => {
  try {
    const url = new URL(host || defaultPosthogHost);
    return url.protocol === 'https:' ? url.origin : defaultPosthogHost;
  } catch {
    return defaultPosthogHost;
  }
};

export const resolvePosthogAssetsOrigin = (posthogOrigin) => {
  try {
    const url = new URL(posthogOrigin);
    // us.i.posthog.com → us-assets.i.posthog.com
    url.hostname = url.hostname.replace(/^([^.]+)\.i\.posthog\.com$/, '$1-assets.i.posthog.com');
    return url.origin;
  } catch {
    return 'https://us-assets.i.posthog.com';
  }
};

export const createSecurityHeaders = (posthogHost, { upgradeInsecureRequests = true } = {}) => {
  const posthogOrigin = resolvePosthogOrigin(posthogHost);
  const posthogAssetsOrigin = resolvePosthogAssetsOrigin(posthogOrigin);
  const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    [
      "connect-src 'self'",
      'https://queestanconstruyendo.com',
      'https://www.queestanconstruyendo.com',
      posthogOrigin,
      posthogAssetsOrigin,
      'https://challenges.cloudflare.com',
      'https://*.challenges.cloudflare.com',
      'https://static.cloudflareinsights.com',
    ].join(' '),
    "font-src 'self' data:",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'frame-src https://challenges.cloudflare.com https://*.challenges.cloudflare.com',
    "img-src 'self' data:",
    "object-src 'none'",
    [
      "script-src 'self' 'unsafe-inline'",
      'https://challenges.cloudflare.com',
      posthogAssetsOrigin,
      'https://static.cloudflareinsights.com',
    ].join(' '),
    "style-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
    "worker-src 'self' blob:",
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
