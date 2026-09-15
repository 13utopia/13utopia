/** Live site route mode — all marketing paths use Elementor pixel scrapes. */

export function normalizePathname(pathname: string | null | undefined) {
  if (!pathname) return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

/** Live has no native React routes; always use pixel chrome + sheets. */
export function isNativeRoute(_pathname?: string | null) {
  return false;
}

/** True when this path should use Elementor scrape chrome + CSS/JS boots. */
export function isPixelRoute(_pathname?: string | null) {
  return true;
}
