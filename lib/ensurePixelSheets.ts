/** Shared Elementor pixel stylesheets — load once, never tear down on route change. */

/** Must block first paint (layout / FOUC / chrome). */
export const CRITICAL_PIXEL_SHEETS = [
  '/css/pixel-veil.css',
  // Must stay critical — deferring caused LCP ~10s + CLS when layout CSS applied late
  '/css/live-cascade.css',
  '/cdn/google-fonts/DM_Sans_3A300_2C400_3B500_2C600_2C700_2C800_2C900_7CPT_Serif_3A400_3B500_2C600_2C700.css',
  '/css/master-pixel.css',
] as const;

/** Widget/page CSS — defer so it does not block first paint. */
export const DEFERRED_PIXEL_SHEETS = [
  '/css/original-styles.css',
  '/css/live-timeline.min.css',
  '/css/live-widget-posts.min.css',
  '/css/live-widget-spacer.min.css',
  '/css/live-widget-image-box.min.css',
  '/css/live-widget-advance-slider.css',
] as const;

export const PIXEL_SHEETS = [...CRITICAL_PIXEL_SHEETS, ...DEFERRED_PIXEL_SHEETS] as const;

export const SHEET_VERSION = 'pixel-cube-41';

function sheetUrl(href: string) {
  return `${href}${href.includes('?') ? '&' : '?'}v=${SHEET_VERSION}`;
}

function armDeferred(link: HTMLLinkElement) {
  const go = () => {
    link.media = 'all';
  };
  if (link.sheet) {
    go();
    return;
  }
  link.addEventListener('load', go, { once: true });
  link.onload = go;
}

function injectSheet(href: string, defer: boolean) {
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
    if (defer) {
      if (existing.media !== 'all') {
        existing.setAttribute('data-pixel-defer', '');
        if (existing.sheet) existing.media = 'all';
        else {
          existing.media = 'print';
          armDeferred(existing);
        }
      }
    } else {
      existing.media = 'all';
      existing.removeAttribute('data-pixel-defer');
    }
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = want;
  link.setAttribute('data-pixel-href', href);
  if (defer) {
    link.setAttribute('data-pixel-defer', '');
    link.media = 'print';
    armDeferred(link);
  }
  document.head.appendChild(link);
}

export function ensurePixelSheets() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.add('pixel-exact');
  for (const href of CRITICAL_PIXEL_SHEETS) injectSheet(href, false);
  for (const href of DEFERRED_PIXEL_SHEETS) injectSheet(href, true);
}

