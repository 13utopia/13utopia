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
      // Never stamp cubes or posters — those stole page wheel over the hero/STEPs.
      // Testimonials keep prevent so horizontal swipe doesn't fight Lenis.
      document.querySelectorAll('.swiper-cube, .advance_slider_wrapper, .swiper-poster').forEach((el) => {
        el.removeAttribute('data-lenis-prevent');
      });
      document
        .querySelectorAll('.arolax_testimonial_slider, .arolax__testimonial-4 .swiper')
        .forEach((el) => el.setAttribute('data-lenis-prevent', ''));
    };
    markPrevent();
    const t1 = window.setTimeout(markPrevent, 800);
    const t2 = window.setTimeout(markPrevent, 2500);
    window.addEventListener('pixel-live-js-ready', markPrevent);

    // Cube: only trap Lenis while the user is dragging the cube
    const onCubePointerDown = (e: Event) => {
      const t = e.target as Element | null;
      const cube = t?.closest?.('.swiper-cube');
      if (cube) cube.setAttribute('data-lenis-prevent', '');
    };
    const clearCubePrevent = () => {
      document.querySelectorAll('.swiper-cube[data-lenis-prevent]').forEach((el) => {
        el.removeAttribute('data-lenis-prevent');
      });
      try {
        lenis.start();
      } catch {
        /* ignore */
      }
    };
    document.addEventListener('pointerdown', onCubePointerDown, true);
    document.addEventListener('pointerup', clearCubePrevent, true);
    document.addEventListener('pointercancel', clearCubePrevent, true);

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
      document.removeEventListener('pointerdown', onCubePointerDown, true);
      document.removeEventListener('pointerup', clearCubePrevent, true);
      document.removeEventListener('pointercancel', clearCubePrevent, true);
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
