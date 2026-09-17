import assert from 'node:assert/strict';
import {
  CANONICAL_ORIGIN,
  needsCanonicalOrigin,
  redirectOrigin,
} from '../lib/canonical-origin.js';

const TEST_SITE = process.env.TEST_SITE || 'http://127.0.0.1:3100';

async function redirected(path, host = 'aeback.com', language = 'en-US,en;q=0.9') {
  return fetch(`${TEST_SITE}${path}`, {
    headers: {
      host,
      'x-forwarded-host': host,
      'x-forwarded-proto': 'https',
      'accept-language': language,
    },
    redirect: 'manual',
  });
}

const englishSlash = await redirected('/en/');
assert.equal(englishSlash.status, 308);
assert.equal(new URL(englishSlash.headers.get('location'), TEST_SITE).pathname, '/en');

const versionSlash = await redirected('/en/premiere-pro-downgrader/to/2019/');
assert.equal(versionSlash.status, 308);
assert.equal(
  new URL(versionSlash.headers.get('location'), TEST_SITE).pathname,
  '/en/premiere-pro-downgrader/to/2019'
);

const bareRoot = await redirected('/');
assert.equal(bareRoot.status, 307);
assert.equal(new URL(bareRoot.headers.get('location'), TEST_SITE).pathname, '/en');

const canonicalPage = await redirected('/en', 'www.aeback.com');
assert.equal(canonicalPage.status, 200);

const contactSlash = await redirected('/en/contact/', 'www.aeback.com');
assert.equal(contactSlash.status, 308);
assert.equal(new URL(contactSlash.headers.get('location'), TEST_SITE).pathname, '/en/contact');

const apex = new URL('https://aeback.com/en/');
const canonical = new URL(`${CANONICAL_ORIGIN}/en`);
assert.equal(redirectOrigin(apex), CANONICAL_ORIGIN);
assert.equal(needsCanonicalOrigin(apex), true);
assert.equal(redirectOrigin(canonical), CANONICAL_ORIGIN);
assert.equal(needsCanonicalOrigin(canonical), false);

console.log('Canonical redirect guard: 10/10 passed');
