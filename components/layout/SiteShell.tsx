'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import SmoothScroll from '@/components/motion/SmoothScroll';
import TransitionProvider from '@/components/motion/TransitionProvider';
import { ensurePixelSheets } from '@/lib/ensurePixelSheets';

/** Pixel-exact scrape pages include their own Elementor header/footer. */
const PIXEL_ROUTES = new Set([
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

const SERVICE_SLIDER_ROUTES = new Set([
  '/digital-marketing',
  '/search-engine-optimization',
  '/web-development',
  '/email-marketing',
  '/cgi-videos',
  '/online-reputation-management',
]);

function loadScriptOnce(
  src: string,
  datasetKey: string,
  legacyAttrs: string[] = [],
  opts: { async?: boolean } = {}
) {
  if (typeof document === 'undefined') return;
  const attr = `data-${datasetKey}`;
  if (document.querySelector(`script[${attr}]`)) return;
  const file = src.split('?')[0];
  if (document.querySelector(`script[src*="${file}"]`)) return;
  const s = document.createElement('script');
  s.src = src;
  s.async = opts.async ?? false;
  s.setAttribute(attr, '1');
  legacyAttrs.forEach((a) => s.setAttribute(a, '1'));
  document.head.appendChild(s);
}

function loadScriptVersioned(
  src: string,
  datasetKey: string,
  legacyAttrs: string[] = [],
  opts: { async?: boolean } = {}
) {
  if (typeof document === 'undefined') return;
  const attr = `data-${datasetKey}`;
  if (document.querySelector(`script[${attr}]`)) return;
  const file = src.split('?')[0];
  document.querySelectorAll(`script[src*="${file}"]`).forEach((el) => el.remove());
  legacyAttrs.forEach((a) => {
    document.querySelectorAll(`script[${a}]`).forEach((el) => {
      const s = el.getAttribute('src') || '';
      if (s.includes(file)) el.remove();
    });
  });
  const s = document.createElement('script');
  s.src = src;
  s.async = opts.async ?? false;
  s.setAttribute(attr, '1');
  legacyAttrs.forEach((a) => s.setAttribute(a, '1'));
  document.head.appendChild(s);
}

function whenIdle(run: () => void, timeoutMs = 1800) {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (w.requestIdleCallback) return w.requestIdleCallback(run, { timeout: timeoutMs });
  return window.setTimeout(run, Math.min(1200, timeoutMs));
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const usePixelChrome = PIXEL_ROUTES.has(pathname);

  useEffect(() => {
    if (!usePixelChrome) return;
    ensurePixelSheets();

    // Above-fold / chrome — keep early
    loadScriptVersioned('/js/pixel-lazy-boot.js?v=lazy-4', 'pixel-lazy-boot-v4', [
      'data-pixel-lazy-boot',
    ]);
    loadScriptOnce('/js/pixel-sticky-boot.js?v=sticky-pin-7', 'pixel-sticky-boot-v7', [
      'data-pixel-sticky-boot',
    ]);
    loadScriptOnce('/js/pixel-swiper-boot.js?v=swiper-4', 'pixel-swiper-boot-v4', [
      'data-pixel-swiper-boot',
    ]);

    if (SERVICE_SLIDER_ROUTES.has(pathname)) {
      loadScriptOnce('/js/pixel-advance-slider-boot.js?v=poster-orch-25', 'pixel-advance-slider-boot-v25', [
        'data-pixel-advance-slider-boot',
      ]);
    }

    // Below-fold / third-party — after idle so LCP/TBT improve
    const idleId = whenIdle(() => {
      loadScriptOnce('/js/pixel-ctc-boot.js?v=ctc-2', 'pixel-ctc-boot-v2', ['data-pixel-ctc-boot'], {
        async: true,
      });
      loadScriptOnce('/js/pixel-counter-boot.js?v=counter-4', 'pixel-counter-boot-v4', [
        'data-pixel-counter-boot',
      ], { async: true });
      loadScriptOnce('/js/pixel-progress-boot.js?v=progress-3', 'pixel-progress-boot-v3', [
        'data-pixel-progress-boot',
      ], { async: true });
      if (pathname === '/blog' || pathname.startsWith('/blog/')) {
        loadScriptOnce('/js/pixel-posts-boot.js', 'pixel-posts-boot', [], { async: true });
      }
      if (pathname === '/contact-us') {
        loadScriptOnce('/js/pixel-hcaptcha-boot.js', 'pixel-hcaptcha-boot', [], { async: true });
      }
    });

    const w = window as Window & { __PIXEL_LAZY_RUN?: () => void };
    const run = () => w.__PIXEL_LAZY_RUN?.();
    run();
    const t1 = window.setTimeout(run, 100);
    const t2 = window.setTimeout(run, 600);
    const t3 = window.setTimeout(run, 1800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      const cancel = (window as Window & { cancelIdleCallback?: (id: number) => void })
        .cancelIdleCallback;
      if (cancel) cancel(idleId as number);
      else window.clearTimeout(idleId as number);
    };
  }, [usePixelChrome, pathname]);

  // Prefetch only a few high-traffic routes; skip on slow connections
  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    if (nav.connection?.saveData) return;
    if (nav.connection?.effectiveType && /2g/.test(nav.connection.effectiveType)) return;

    const routes = ['/', '/digital-marketing', '/contact-us', '/about-us'];
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      routes.forEach((r) => {
        if (r === pathname) return;
        try {
          if (document.querySelector(`link[rel="prefetch"][href="${r}"]`)) return;
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = r;
          link.as = 'document';
          document.head.appendChild(link);
        } catch {
          /* ignore */
        }
      });
    };
    const id = whenIdle(run, 2500);
    return () => {
      cancelled = true;
      const cancel = (window as Window & { cancelIdleCallback?: (id: number) => void })
        .cancelIdleCallback;
      if (cancel) cancel(id as number);
      else window.clearTimeout(id as number);
    };
  }, [pathname]);

  const shell = usePixelChrome ? (
    <main className="flex-grow pixel-main">{children}</main>
  ) : (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );

  return (
    <SmoothScroll>
      <TransitionProvider>{shell}</TransitionProvider>
    </SmoothScroll>
  );
}
