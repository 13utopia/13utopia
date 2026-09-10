import { PIXEL_SHEETS, SHEET_VERSION } from '@/lib/ensurePixelSheets';

/** Start critical pixel CSS with the HTML document (not after hydrate). */
export default function PixelCriticalLinks() {
  return (
    <>
      {PIXEL_SHEETS.map((href) => {
        const url = `${href}${href.includes('?') ? '&' : '?'}v=${SHEET_VERSION}`;
        return (
          <link
            key={href}
            rel="stylesheet"
            href={url}
            data-pixel-href={href}
          />
        );
      })}
    </>
  );
}
