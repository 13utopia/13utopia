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

    const markPrevent = () => {
      // Posters manage data-lenis-prevent themselves (must drop it at first/last
      // slide or step-5 scroll locks). Don't re-stamp them here.
      document
        .querySelectorAll(
          '.swiper-cube, .arolax_testimonial_slider, .arolax__testimonial-4 .swiper'
        )
        .forEach((el) => el.setAttribute('data-lenis-prevent', ''));
    };
    markPrevent();
    const t1 = window.setTimeout(markPrevent, 800);
    const t2 = window.setTimeout(markPrevent, 2500);
    window.addEventListener('pixel-live-js-ready', markPrevent);

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
      window.removeEventListener('pixel-live-js-ready', markPrevent);
      lenis.off('scroll', stopNativeAnim);
    };
  }, [lenis]);

  return null;
}

/**
 * Lenis smooth scroll. Fixed header is portaled by pixel-sticky-boot so Lenis
 * never wraps it in a transform containing block.
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
