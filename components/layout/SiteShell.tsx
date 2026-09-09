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

function loadScriptOnce(src: string, datasetKey: string, legacyAttrs: string[] = []) {
  if (typeof document === 'undefined') return;
  const attr = `data-${datasetKey}`;
  if (document.querySelector(`script[${attr}]`)) return;
  // Skip if a page-level boot already injected the same file
  const file = src.split('?')[0];
  if (document.querySelector(`script[src*="${file}"]`)) return;
  const s = document.createElement('script');
  s.src = src;
  s.async = false;
  s.setAttribute(attr, '1');
  legacyAttrs.forEach((a) => s.setAttribute(a, '1'));
  document.head.appendChild(s);
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const usePixelChrome = PIXEL_ROUTES.has(pathname);

  useEffect(() => {
    if (!usePixelChrome) return;
    ensurePixelSheets();
    loadScriptOnce('/js/pixel-ctc-boot.js?v=ctc-2', 'pixel-ctc-boot-v2');
    loadScriptOnce('/js/pixel-lazy-boot.js?v=lazy-2', 'pixel-lazy-boot-v2');
    loadScriptOnce('/js/pixel-hcaptcha-boot.js', 'pixel-hcaptcha-boot');
    // Bump data-key when sticky/poster boots change so SPA sessions pick up new logic
    loadScriptOnce('/js/pixel-sticky-boot.js?v=sticky-pin-6', 'pixel-sticky-boot-v6');
    loadScriptOnce('/js/pixel-counter-boot.js?v=counter-4', 'pixel-counter-boot-v4', [
      'data-pixel-counter-boot',
    ]);
    loadScriptOnce('/js/pixel-progress-boot.js?v=progress-3', 'pixel-progress-boot-v3');
    loadScriptOnce('/js/pixel-posts-boot.js', 'pixel-posts-boot');
    loadScriptOnce('/js/pixel-advance-slider-boot.js?v=poster-orch-11', 'pixel-advance-slider-boot-v11', [
      'data-pixel-advance-slider-boot',
    ]);
    loadScriptOnce('/js/pixel-swiper-boot.js?v=swiper-3', 'pixel-swiper-boot-v3', [
      'data-pixel-swiper-boot',
    ]);
  }, [usePixelChrome, pathname]);

  // Prefetch sibling service routes after idle for snappier curtain nav
  useEffect(() => {
    const routes = [
      '/',
      '/about-us',
      '/digital-marketing',
      '/search-engine-optimization',
      '/web-development',
      '/contact-us',
      '/portfolio',
    ];
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      routes.forEach((r) => {
        if (r === pathname) return;
        try {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = r;
          link.as = 'document';
          if (!document.querySelector(`link[rel="prefetch"][href="${r}"]`)) {
            document.head.appendChild(link);
          }
        } catch {
          /* ignore */
        }
      });
    };
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const id = ric ? ric(run) : window.setTimeout(run, 1200);
    return () => {
      cancelled = true;
      if (!ric) window.clearTimeout(id as number);
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
