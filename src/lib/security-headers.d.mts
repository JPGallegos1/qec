export function resolvePosthogOrigin(host?: string): string;
export function createSecurityHeaders(
  posthogHost?: string,
  options?: { upgradeInsecureRequests?: boolean },
): Record<string, string>;
export function serializeStaticHeaders(posthogHost?: string): string;
