/** Shared Elementor pixel stylesheets — load once, never tear down on route change. */

/** Must block first paint (layout / FOUC / chrome). */
export const CRITICAL_PIXEL_SHEETS = [
  '/css/pixel-veil.css',
  '/css/live-cascade.css',
  '/css/original-styles.css',
  '/cdn/google-fonts/DM_Sans_3A300_2C400_3B500_2C600_2C700_2C800_2C900_7CPT_Serif_3A400_3B500_2C600_2C700.css',
  '/css/master-pixel.css',
] as const;

/** Widget/page CSS. */
export const DEFERRED_PIXEL_SHEETS = [
  '/css/live-timeline.min.css',
  '/css/live-widget-posts.min.css',
  '/css/live-widget-spacer.min.css',
  '/css/live-widget-image-box.min.css',
  '/css/live-widget-advance-slider.css',
] as const;

export const PIXEL_SHEETS = [...CRITICAL_PIXEL_SHEETS, ...DEFERRED_PIXEL_SHEETS] as const;

export const SHEET_VERSION = 'pixel-cube-73';

function sheetUrl(href: string) {
  return `${href}${href.includes('?') ? '&' : '?'}v=${SHEET_VERSION}`;
}

function injectSheet(href: string) {
  const want = sheetUrl(href);
  const matches = Array.from(
    document.querySelectorAll(
      `link[data-pixel-href="${href}"], link[rel="stylesheet"][href*="${href}"]`
    )
  ) as HTMLLinkElement[];

  // Keep one stylesheet tag; drop duplicates (SSR + client inject race).
  const existing = matches.find((l) => l.getAttribute('data-pixel-href') === href) || matches[0] || null;
  for (const l of matches) {
    if (existing && l !== existing) l.remove();
  }

  if (existing) {
    if (!existing.href.includes(`v=${SHEET_VERSION}`)) existing.href = want;
    existing.setAttribute('data-pixel-href', href);
    existing.media = 'all';
    existing.removeAttribute('data-pixel-defer');
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = want;
  link.setAttribute('data-pixel-href', href);
  link.media = 'all';
  document.head.appendChild(link);
}

export function ensurePixelSheets() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.add('pixel-exact');
  for (const href of PIXEL_SHEETS) injectSheet(href);
}
