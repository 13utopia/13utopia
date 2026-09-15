import { PIXEL_SHEETS, SHEET_VERSION } from '@/lib/ensurePixelSheets';

function sheetUrl(href: string) {
  return `${href}${href.includes('?') ? '&' : '?'}v=${SHEET_VERSION}`;
}

/** Critical & shared Elementor pixel stylesheets — cleanly rendered for SSR and hydration. */
export default function PixelCriticalLinks() {
  return (
    <>
      {PIXEL_SHEETS.map((href) => (
        <link
          key={href}
          rel="stylesheet"
          href={sheetUrl(href)}
          data-pixel-href={href}
        />
      ))}
    </>
  );
}

