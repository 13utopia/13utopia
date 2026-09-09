'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ensurePixelSheets } from '@/lib/ensurePixelSheets';

type TransitionApi = {
  navigate: (href: string) => void;
};

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

/**
 * Soft client-side nav — keep shared CSS mounted so routes never FOUC.
 */
export default function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const navigating = useRef(false);

  useEffect(() => {
    ensurePixelSheets();
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

      // Prefetch destination CSS before swap
      ensurePixelSheets();
      document.documentElement.classList.add('pixel-route-exit');
      // Stamp desktop nav immediately so the next page never flashes hamburger
      document.querySelectorAll('.wcf__nav-menu').forEach((nav) => {
        if (window.matchMedia('(min-width: 768px)').matches) {
          nav.classList.add('desktop-menu-active');
          nav.classList.remove('mobile-menu-active');
        }
      });

      window.setTimeout(() => {
        router.push(targetPath);
      }, 360);
    },
    [pathname, router]
  );

  useEffect(() => {
    navigating.current = false;
    document.documentElement.classList.remove('pixel-route-exit');
    document.documentElement.classList.add('pixel-route-enter');
    ensurePixelSheets();
    // Kill WP preloaders that flash on every page body remount
    document.body.classList.remove('wcf-preloader-active', 'arolax-preloader-active');
    document.documentElement.classList.remove('wcf-preloader-active', 'arolax-preloader-active');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    try {
      (window as Window & { __lenis?: { scrollTo: (v: number, o?: object) => void } }).__lenis?.scrollTo(0, {
        immediate: true,
      });
    } catch {
      /* ignore */
    }
    // Desktop nav before paint settles — prevents empty hamburger square flash
    document.querySelectorAll('.wcf__nav-menu').forEach((nav) => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        nav.classList.add('desktop-menu-active');
        nav.classList.remove('mobile-menu-active');
      }
    });
    // Re-pin sticky + re-bind counters/progress/posters for the new page HTML
    const w = window as Window & {
      __PIXEL_STICKY_RUN?: () => void;
      __PIXEL_COUNTER_RUN?: () => void;
      __PIXEL_PROGRESS_RUN?: () => void;
      __PIXEL_ADVANCE_RUN?: () => void;
    };
    const rerun = () => {
      document.querySelectorAll('.wcf__nav-menu').forEach((nav) => {
        if (window.matchMedia('(min-width: 768px)').matches) {
          nav.classList.add('desktop-menu-active');
          nav.classList.remove('mobile-menu-active');
        }
      });
      w.__PIXEL_STICKY_RUN?.();
      w.__PIXEL_COUNTER_RUN?.();
      w.__PIXEL_PROGRESS_RUN?.();
      w.__PIXEL_ADVANCE_RUN?.();
    };
    rerun();
    const t1 = window.setTimeout(rerun, 120);
    const t2 = window.setTimeout(rerun, 500);
    const t3 = window.setTimeout(rerun, 1400);
    const t = window.setTimeout(() => {
      document.documentElement.classList.remove('pixel-route-enter');
    }, 680);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [pathname]);

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

  return <TransitionCtx.Provider value={{ navigate }}>{children}</TransitionCtx.Provider>;
}
