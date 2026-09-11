/** Per-route render mode for the hybrid rebuild (local only until ship). */

/** Routes rebuilt as real React (no Elementor scrape / sheets). */
export const NATIVE_ROUTES = new Set<string>([
  '/', // Wave 1 — Home
]);

/** All marketing paths that still use Elementor pixel scrapes. */
export const PIXEL_ROUTES = new Set<string>([
  '/',
  '/about-us',
  '/digital-marketing',
  '/search-engine-optimization',
  '/web-development',
  '/email-marketing',
  '/cgi-videos',
  '/online-reputation-management',
  '/portfolio',
  '/blog',
  '/contact-us',
  '/privacy-policy',
  '/terms-and-condition',
  '/refund-and-return',
]);

export function normalizePathname(pathname: string | null | undefined) {
  if (!pathname) return '/';
  const p = pathname.replace(/\/+$/, '') || '/';
  return p;
}

export function isNativeRoute(pathname: string | null | undefined) {
  return NATIVE_ROUTES.has(normalizePathname(pathname));
}

/** True when this path should use Elementor scrape chrome + CSS/JS boots. */
export function isPixelRoute(pathname: string | null | undefined) {
  const p = normalizePathname(pathname);
  if (isNativeRoute(p)) return false;
  return PIXEL_ROUTES.has(p);
}
