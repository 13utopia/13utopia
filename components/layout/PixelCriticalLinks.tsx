import {
  CRITICAL_PIXEL_SHEETS,
  DEFERRED_PIXEL_SHEETS,
  SHEET_VERSION,
} from '@/lib/ensurePixelSheets';

function sheetUrl(href: string) {
  return `${href}${href.includes('?') ? '&' : '?'}v=${SHEET_VERSION}`;
}

/** Critical CSS blocks first paint; deferred sheets use print→all after load. */
export default function PixelCriticalLinks() {
  const deferScript = `(function(){function arm(l){if(!l)return;var go=function(){l.media='all'};if(l.addEventListener)l.addEventListener('load',go);l.onload=go;if(l.sheet)go()}document.querySelectorAll('link[data-pixel-defer]').forEach(arm);})();`;

  return (
    <>
      {CRITICAL_PIXEL_SHEETS.map((href) => (
        <link
          key={href}
          rel="stylesheet"
          href={sheetUrl(href)}
          data-pixel-href={href}
        />
      ))}
      {DEFERRED_PIXEL_SHEETS.map((href) => (
        <link
          key={href}
          rel="stylesheet"
          href={sheetUrl(href)}
          data-pixel-href={href}
          data-pixel-defer=""
          media="print"
        />
      ))}
      <script dangerouslySetInnerHTML={{ __html: deferScript }} />
      <noscript>
        {DEFERRED_PIXEL_SHEETS.map((href) => (
          <link key={`ns-${href}`} rel="stylesheet" href={sheetUrl(href)} />
        ))}
      </noscript>
    </>
  );
}
