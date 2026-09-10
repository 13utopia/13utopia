'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ensurePixelSheets } from '@/lib/ensurePixelSheets';
import { bindScrollAwaken, choreographPageEnter } from '@/lib/pixelChoreography';
import {
  HERO_AFTER_REVEAL_MS,
  playHomeHeroEntrance,
  prepareHomeHeroEntrance,
} from '@/lib/pixelHeroEntrance';

type TransitionApi = {
  navigate: (href: string) => void;
};

type VeilMode = 'idle' | 'cover' | 'hold' | 'reveal';

const TransitionCtx = createContext<TransitionApi | null>(null);

export function usePageTransition() {
  return useContext(TransitionCtx);
}

function normalizePath(path: string) {
  if (!path) return '/';
  try {
    const u = new URL(path, typeof window !== 'undefined' ? window.location.origin : 'https://13utopia.com');
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p + u.search + u.hash;
  } catch {
    return path;
  }
}

function isInternalHref(href: string) {
  if (
    !href ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:')
  ) {
    return false;
  }
  try {
    const u = new URL(href, window.location.origin);
    if (u.origin !== window.location.origin) return false;
    const nextPath = u.pathname.replace(/\/+$/, '') || '/';
    if (/\.(pdf|zip|png|jpe?g|webp|svg|css|js)(\?|$)/i.test(u.pathname)) return false;
    if (nextPath.startsWith('/wp-') || nextPath.startsWith('/api/')) return false;
    return true;
  } catch {
    return false;
  }
}

function stampDesktopNav() {
  document.querySelectorAll('.wcf__nav-menu').forEach((nav) => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      nav.classList.add('desktop-menu-active');
      nav.classList.remove('mobile-menu-active', 'wcf-nav-is-toggled');
    }
  });
}

/** Polished curtain timings (post-logo / no-neon — the approved sequence). */
const EXIT_MS = 680;
const ENTER_HOLD_MS = 420;
const ENTER_CLEANUP_MS = 1650;
/** First visit: hold long enough for pixel sheets; cleanup after hero intro can start. */
const FIRST_HOLD_MS = 720;
const FIRST_CLEANUP_MS = 2100;

/**
 * Soft client-side nav — cinematic black veil + centered logo + staggered content awaken.
 * Veil mode is React state (not a hardcoded JSX attr) so route re-renders never
 * snap data-mode back to idle mid-transition (that caused the page flash).
 */
export default function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const navigating = useRef(false);
  const firstPaint = useRef(true);
  const [veilMode, setVeilMode] = useState<VeilMode>('idle');
  const veilModeRef = useRef<VeilMode>('idle');

  const setVeil = useCallback((mode: VeilMode) => {
    veilModeRef.current = mode;
    setVeilMode(mode);
  }, []);

  useLayoutEffect(() => {
    ensurePixelSheets();
    document.documentElement.classList.add('pixel-exact');
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const target = normalizePath(href);
      const current = normalizePath(pathname);
      const targetPath = target.split('#')[0];
      const currentPath = current.split('#')[0];

      if (targetPath === currentPath && target.includes('#')) {
        const id = decodeURIComponent(target.split('#')[1] || '');
        const el = id && document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (targetPath === currentPath) return;
      if (navigating.current) return;
      navigating.current = true;

      ensurePixelSheets();
      document.documentElement.classList.add('pixel-route-exit');
      document.documentElement.classList.remove('pixel-route-enter');
      stampDesktopNav();
      setVeil('cover');

      window.setTimeout(() => {
        // Hold before push so the next render never lands on idle/empty curtain
        setVeil('hold');
        router.push(targetPath);
        window.setTimeout(() => {
          if (navigating.current) navigating.current = false;
        }, 1600);
      }, EXIT_MS);
    },
    [pathname, router, setVeil]
  );

  // BEFORE paint on every route: keep/force hold so new HTML never peeks under an idle veil
  useLayoutEffect(() => {
    document.documentElement.classList.remove('pixel-route-exit');
    document.documentElement.classList.add('pixel-route-enter');
    ensurePixelSheets();
    setVeil('hold');
    stampDesktopNav();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    try {
      (window as Window & { __lenis?: { scrollTo: (v: number, o?: object) => void } }).__lenis?.scrollTo(0, {
        immediate: true,
      });
    } catch {
      /* ignore */
    }
  }, [pathname, setVeil]);

  useEffect(() => {
    navigating.current = false;
    document.body.classList.remove('wcf-preloader-active', 'arolax-preloader-active');
    document.documentElement.classList.remove('wcf-preloader-active', 'arolax-preloader-active');

    const w = window as Window & {
      __PIXEL_STICKY_RUN?: () => void;
      __PIXEL_COUNTER_RUN?: () => void;
      __PIXEL_PROGRESS_RUN?: () => void;
      __PIXEL_ADVANCE_RUN?: () => void;
      __PIXEL_SWIPER_RUN?: () => void;
      __PIXEL_LAZY_RUN?: () => void;
      __PIXEL_ELEMENTOR_RERUN?: () => void;
      __PIXEL_LENIS_UNLOCK?: () => void;
      __lenis?: { start: () => void; scrollTo: (v: number, o?: object) => void };
    };

    const rerun = () => {
      stampDesktopNav();
      try {
        w.__lenis?.start();
      } catch {
        /* ignore */
      }
      document
        .querySelectorAll('.advance_slider_wrapper, .swiper-poster, .swiper-cube, .arolax_testimonial_slider')
        .forEach((el) => {
          el.removeAttribute('data-lenis-prevent');
        });
      w.__PIXEL_LENIS_UNLOCK?.();
      w.__PIXEL_STICKY_RUN?.();
      w.__PIXEL_COUNTER_RUN?.();
      w.__PIXEL_PROGRESS_RUN?.();
      w.__PIXEL_ADVANCE_RUN?.();
      w.__PIXEL_LAZY_RUN?.();
      w.__PIXEL_ELEMENTOR_RERUN?.();
      w.__PIXEL_SWIPER_RUN?.();
      window.setTimeout(() => {
        try {
          w.__lenis?.start();
        } catch {
          /* ignore */
        }
        w.__PIXEL_STICKY_RUN?.();
        w.__PIXEL_ADVANCE_RUN?.();
        w.__PIXEL_LENIS_UNLOCK?.();
      }, 200);
    };

    rerun();

    const softFirst = firstPaint.current;
    firstPaint.current = false;

    const onHome = pathname === '/' || pathname === '';
    const holdMs = softFirst ? FIRST_HOLD_MS : ENTER_HOLD_MS;
    const heroAt = onHome ? holdMs + HERO_AFTER_REVEAL_MS : 0;
    const cleanupMs = Math.max(
      softFirst ? FIRST_CLEANUP_MS : ENTER_CLEANUP_MS,
      heroAt ? heroAt + 80 : 0
    );

    // Ensure hold sticks even if a child re-render raced
    setVeil('hold');

    // Run stagger UNDER the curtain (content is visibility:hidden on hold).
    // Home hero titles are excluded — they play after unveil so the user sees them fully.
    const tAwaken = window.setTimeout(() => {
      choreographPageEnter();
      if (onHome) prepareHomeHeroEntrance();
    }, 32);

    const tHold = window.setTimeout(() => {
      setVeil('reveal');
    }, holdMs);

    // After curtain clears + a short settle beat → full Dynamic / Solutions on screen
    const tHero = onHome
      ? window.setTimeout(() => {
          playHomeHeroEntrance();
        }, heroAt)
      : 0;

    let unbindScroll = () => {};
    const tScroll = window.setTimeout(() => {
      unbindScroll = bindScrollAwaken();
    }, holdMs + 200);

    const t1 = window.setTimeout(rerun, 120);
    const t2 = window.setTimeout(rerun, 500);
    const t3 = window.setTimeout(rerun, 1400);
    const tIdle = window.setTimeout(() => {
      setVeil('idle');
      document.documentElement.classList.remove('pixel-route-enter');
    }, cleanupMs);

    return () => {
      window.clearTimeout(tHold);
      window.clearTimeout(tAwaken);
      window.clearTimeout(tHero);
      window.clearTimeout(tScroll);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(tIdle);
      unbindScroll();
    };
  }, [pathname, setVeil]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as Element | null)?.closest?.('a');
      if (!el) return;
      const a = el as HTMLAnchorElement;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || !isInternalHref(href)) return;
      if (href === '#' || href.startsWith('#elementor-action')) return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      <div
        id="pixel-route-veil"
        className="pixel-route-veil"
        data-mode={veilMode}
        aria-hidden={veilMode === 'idle'}
      >
        <div className="pixel-route-veil-mark">
          <span className="pixel-route-veil-halo" aria-hidden="true" />
          <img
            className="pixel-route-veil-logo"
            src="/wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png"
            alt=""
            width={768}
            height={305}
            decoding="async"
            draggable={false}
            style={{ width: 'min(52vw, 340px)', maxWidth: 'min(52vw, 340px)', height: 'auto' }}
          />
          <span className="pixel-route-veil-rule" aria-hidden="true" />
        </div>
      </div>
      {children}
    </TransitionCtx.Provider>
  );
}
