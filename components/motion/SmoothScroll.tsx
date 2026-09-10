'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import 'lenis/dist/lenis.css';

type Props = { children: ReactNode };

function LenisGuards() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const clearScrollTraps = () => {
      // Never permanently trap Lenis — that caused scroll lock/jitter on home + service heroes.
      document
        .querySelectorAll(
          '.swiper-cube, .advance_slider_wrapper, .swiper-poster, .arolax_testimonial_slider, .arolax__testimonial-4 .swiper'
        )
        .forEach((el) => el.removeAttribute('data-lenis-prevent'));
      try {
        lenis.start();
      } catch {
        /* ignore */
      }
    };
    clearScrollTraps();
    const t1 = window.setTimeout(clearScrollTraps, 800);
    const t2 = window.setTimeout(clearScrollTraps, 2500);
    window.addEventListener('pixel-live-js-ready', clearScrollTraps);

    // Only trap Lenis while the user is dragging cube / testimonial cards
    const onPointerDown = (e: Event) => {
      const t = e.target as Element | null;
      const trap = t?.closest?.(
        '.swiper-cube, .arolax_testimonial_slider, .arolax__testimonial-4 .swiper'
      );
      if (trap) trap.setAttribute('data-lenis-prevent', '');
    };
    const clearPointerPrevent = () => {
      document
        .querySelectorAll(
          '.swiper-cube[data-lenis-prevent], .arolax_testimonial_slider[data-lenis-prevent], .arolax__testimonial-4 .swiper[data-lenis-prevent]'
        )
        .forEach((el) => el.removeAttribute('data-lenis-prevent'));
      try {
        lenis.start();
      } catch {
        /* ignore */
      }
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointerup', clearPointerPrevent, true);
    document.addEventListener('pointercancel', clearPointerPrevent, true);

    const stopNativeAnim = () => {
      try {
        // @ts-expect-error jquery optional
        if (window.jQuery) window.jQuery('html, body').stop(true);
      } catch {
        /* ignore */
      }
    };
    lenis.on('scroll', stopNativeAnim);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('pixel-live-js-ready', clearScrollTraps);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('pointerup', clearPointerPrevent, true);
      document.removeEventListener('pointercancel', clearPointerPrevent, true);
      lenis.off('scroll', stopNativeAnim);
    };
  }, [lenis]);

  return null;
}

/**
 * Lenis smooth scroll. Header stays in-tree (pixel-sticky-boot pins it);
 * page wrappers must not use transform so position:fixed still works.
 */
export default function SmoothScroll({ children }: Props) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    document.documentElement.classList.add('has-lenis');
    return () => document.documentElement.classList.remove('has-lenis');
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.1,
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.1,
        syncTouch: false,
        anchors: false,
        autoResize: true,
      }}
    >
      <LenisGuards />
      <LenisExpose />
      {children}
    </ReactLenis>
  );
}

function LenisExpose() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    (window as Window & { __lenis?: typeof lenis }).__lenis = lenis;
    return () => {
      delete (window as Window & { __lenis?: typeof lenis }).__lenis;
    };
  }, [lenis]);
  return null;
}
