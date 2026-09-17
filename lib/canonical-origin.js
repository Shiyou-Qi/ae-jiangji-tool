export const CANONICAL_ORIGIN = 'https://www.aeback.com';

const SITE_HOSTS = new Set(['aeback.com', 'www.aeback.com']);

export function redirectOrigin(url) {
  return SITE_HOSTS.has(url.hostname) ? CANONICAL_ORIGIN : url.origin;
}

export function needsCanonicalOrigin(url) {
  return SITE_HOSTS.has(url.hostname) && url.origin !== CANONICAL_ORIGIN;
}
