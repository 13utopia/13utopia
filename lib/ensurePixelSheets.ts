/** Shared Elementor pixel stylesheets — load once, never tear down on route change. */
export const PIXEL_SHEETS = [
  '/css/live-cascade.css',
  '/css/original-styles.css',
  '/cdn/google-fonts/DM_Sans_3A300_2C400_3B500_2C600_2C700_2C800_2C900_7CPT_Serif_3A400_3B500_2C600_2C700.css',
  '/css/live-timeline.min.css',
  '/css/live-widget-posts.min.css',
  '/css/live-widget-spacer.min.css',
  '/css/live-widget-image-box.min.css',
  '/css/live-widget-advance-slider.css',
  '/css/master-pixel.css',
] as const;

const SHEET_VERSION = 'pixel-cube-16';

export function ensurePixelSheets() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.add('pixel-exact');
  for (const href of PIXEL_SHEETS) {
    const want = `${href}${href.includes('?') ? '&' : '?'}v=${SHEET_VERSION}`;
    const existing = document.querySelector(
      `link[data-pixel-href="${href}"]`
    ) as HTMLLinkElement | null;
    if (existing) {
      // Bump stylesheet URL when SHEET_VERSION changes (SPA keeps old link otherwise)
      if (!existing.href.includes(`v=${SHEET_VERSION}`)) existing.href = want;
      continue;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = want;
    link.setAttribute('data-pixel-href', href);
    document.head.appendChild(link);
  }
}
