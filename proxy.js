import { NextResponse } from 'next/server';
import { needsCanonicalOrigin, redirectOrigin } from './lib/canonical-origin.js';

const LANGS = new Set(['zh', 'en']);
const CHINESE_COUNTRIES = new Set(['CN', 'HK', 'MO', 'TW']);
const PUBLIC_FILE = /\.[a-z0-9]+$/i;

const LEGACY_REDIRECTS = {
  '/en/aep-downgrader': '/en/after-effects-downgrader',
  '/en/ae-2026-to-2023': '/en/after-effects-downgrader/to/2023',
  '/en/ae-2025-to-2024': '/en/after-effects-downgrader/to/2024',
  '/en/ae-2026-to-2024': '/en/after-effects-downgrader/to/2024',
  '/en/downgrade-after-effects-project': '/en/guide/downgrade-newer-after-effects-project',
  '/en/open-aep-in-older-version': '/en/guide/old-adobe-version-open-project',
  '/ae-2026-to-2023': '/after-effects-downgrader/to/2023',
  '/aeback': '',
};

const FIXED_LEGACY_REDIRECTS = {
  '/contact': '/zh/contact',
  '/terms': '/zh/terms',
  '/privacy': '/zh/privacy',
  '/about': '/zh/how-it-works',
  '/after-effects-di-banben-dakai': '/zh/guide/old-adobe-version-open-project',
  '/ae-2025-to-2023': '/zh/after-effects-downgrader/to/2023',
  '/ae-2025-to-2022': '/zh/after-effects-downgrader/to/2022',
  '/en/aep-file-cannot-open': '/en/guide/project-version-too-new',
  '/en/disclaimer': '/en/terms',
  '/en/ae-2024-to-2022': '/en/after-effects-downgrader/to/2022',
  '/ae-jiangji': '/zh/guide/ae-jiangji',
  '/aep-jiangji': '/zh/guide/ae-jiangji',
  '/pr-jiangji': '/zh/guide/pr-jiangji',
};

function firstSegment(pathname) {
  return pathname.split('/').filter(Boolean)[0] || '';
}

function normalizedPath(pathname) {
  const lower = pathname.toLowerCase();
  return lower.length > 1 ? lower.replace(/\/+$/, '') : lower;
}

function shouldSkip(pathname) {
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/brand/') ||
    pathname.startsWith('/hero/') ||
    pathname.startsWith('/og/') ||
    pathname.startsWith('/wasm/') ||
    PUBLIC_FILE.test(pathname)
  );
}

function prefersChineseLanguage(header) {
  const [primary] = header
    .split(',')
    .map((part) => {
      const [tag, qPart] = part.trim().split(';');
      const q = qPart?.startsWith('q=') ? Number(qPart.slice(2)) : 1;
      return { tag: tag.toLowerCase(), q: Number.isFinite(q) ? q : 1 };
    })
    .filter((item) => item.q > 0)
    .sort((a, b) => b.q - a.q);

  return primary?.tag === 'zh' || primary?.tag.startsWith('zh-');
}

function preferredLang(request) {
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.geo?.country ||
    '';

  if (CHINESE_COUNTRIES.has(country.toUpperCase())) return 'zh';
  if (prefersChineseLanguage(request.headers.get('accept-language') || '')) return 'zh';
  return 'en';
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const segment = firstSegment(pathname);
  const normalized = normalizedPath(pathname);

  const fixedLegacyTarget = FIXED_LEGACY_REDIRECTS[normalized];
  const legacyTarget = LEGACY_REDIRECTS[normalized];
  if (fixedLegacyTarget !== undefined || legacyTarget !== undefined) {
    const target = fixedLegacyTarget ?? legacyTarget;
    const targetPath =
      target.startsWith('/zh/') || target.startsWith('/en/')
        ? target
        : `/${preferredLang(request)}${target}`;
    const response = NextResponse.redirect(
      `${redirectOrigin(request.nextUrl)}${targetPath}${request.nextUrl.search}`,
      308
    );
    response.headers.set('Cache-Control', 'public, max-age=86400');
    return response;
  }

  if (
    LANGS.has(segment) &&
    (needsCanonicalOrigin(request.nextUrl) || (pathname.length > 1 && pathname.endsWith('/')))
  ) {
    const response = NextResponse.redirect(
      `${redirectOrigin(request.nextUrl)}${normalized}${request.nextUrl.search}`,
      308
    );
    response.headers.set('Cache-Control', 'public, max-age=86400');
    return response;
  }

  if (LANGS.has(segment) || shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const lang = preferredLang(request);
  const targetPath = pathname === '/' ? `/${lang}` : `/${lang}${normalized}`;

  const response = NextResponse.redirect(
    `${redirectOrigin(request.nextUrl)}${targetPath}${request.nextUrl.search}`,
    307
  );
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Vary', 'Accept-Language, x-vercel-ip-country, cf-ipcountry');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
