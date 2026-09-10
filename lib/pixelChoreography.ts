/** Cinematic enter/scroll motion for Elementor scrapes — never touch the sticky header. */

// NOTE: Do NOT use `.ehf-header` here — Header Footer Elementor puts that class on <body>,
// which would mark every element as "header scoped" and kill all choreography.
const ENTER_SEL = [
  '.elementor-top-section',
  '.e-con.e-parent',
  '.elementor-section.elementor-top-section',
  '.elementor-widget-heading',
  '.elementor-widget-wcf--title',
  '.elementor-widget-text-editor',
  '.elementor-widget-wcf--text',
  '.elementor-widget-button',
  '.elementor-widget-wcf--button',
  '.elementor-widget-image',
  '.elementor-widget-wcf--image',
  '.elementor-widget-image-box',
  '.elementor-widget-wcf--image-box',
  '.elementor-widget-icon-box',
  '.wcf--counter',
  '.advance_slider_wrapper',
  '.swiper-poster',
].join(', ');

import { isHomeHeroEl } from '@/lib/pixelHeroEntrance';

function isHeaderScoped(el: Element) {
  const sticky = document.querySelector('.elementor-element-01ec82b');
  if (sticky && (sticky === el || sticky.contains(el))) return true;
  const loc = el.closest('.elementor-location-header');
  // location-header can be a real header wrapper; never treat body/html as header
  if (loc && loc !== document.body && loc !== document.documentElement) {
    // If location-header wraps more than the sticky bar, only skip sticky descendants
    if (sticky && loc.contains(sticky)) {
      return sticky === el || sticky.contains(el);
    }
    return true;
  }
  return false;
}

function clearAwaken(root: ParentNode = document) {
  root.querySelectorAll('.pixel-awaken, .pixel-awaken-scroll, .pixel-await-scroll').forEach((el) => {
    el.classList.remove('pixel-awaken', 'pixel-awaken-scroll', 'pixel-awaken-done', 'pixel-await-scroll');
    (el as HTMLElement).style.removeProperty('--pixel-awaken-delay');
  });
}

/**
 * Stagger first-viewport blocks on route enter.
 * Uses transform/filter on content blocks only (never the page wrapper / sticky header).
 */
export function choreographPageEnter() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.querySelector('.pixel-main') || document.body;
  clearAwaken(root);

  const seen = new Set<Element>();
  const picks: HTMLElement[] = [];
  const vh = window.innerHeight;

  root.querySelectorAll(ENTER_SEL).forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    if (isHeaderScoped(el)) return;
    if (isHomeHeroEl(el)) return;
    if (seen.has(el)) return;
    const r = el.getBoundingClientRect();
    if (r.height < 8 || r.width < 8) return;
    if (r.top > vh * 1.05) return;
    if (r.bottom < 40) return;
    // Skip tiny nested bits inside an already-queued large section only when
    // the parent already covers most of the viewport (avoid empty stagger).
    const nestedInLarge = picks.some((p) => {
      if (!p.contains(el)) return false;
      const pr = p.getBoundingClientRect();
      return pr.height > vh * 0.55;
    });
    if (nestedInLarge && (el.className.includes('e-parent') || el.className.includes('e-con'))) return;
    seen.add(el);
    picks.push(el);
  });

  // Prefer a mix: headings/images denser soul, then sections
  picks.sort((a, b) => {
    const score = (el: HTMLElement) => {
      const c = el.className;
      if (c.includes('heading') || c.includes('wcf--title')) return 0;
      if (c.includes('image') || c.includes('button')) return 1;
      if (c.includes('e-parent') || c.includes('top-section')) return 2;
      return 3;
    };
    const d = score(a) - score(b);
    if (d !== 0) return d;
    return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
  });

  picks.slice(0, 16).forEach((el, i) => {
    el.classList.add('pixel-awaken');
    el.style.setProperty('--pixel-awaken-delay', `${30 + i * 55}ms`);
    window.setTimeout(() => {
      el.classList.add('pixel-awaken-done');
    }, 30 + i * 55 + 950);
  });
}

/** Soft rise as sections enter the viewport while scrolling. */
export function bindScrollAwaken(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const root = document.querySelector('.pixel-main') || document.body;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (!entry.isIntersecting) return;
        if (el.classList.contains('pixel-awaken') || el.classList.contains('pixel-awaken-done')) {
          io.unobserve(el);
          return;
        }
        el.classList.remove('pixel-await-scroll');
        el.classList.add('pixel-awaken-scroll', 'pixel-awaken-done');
        io.unobserve(el);
      });
    },
    { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );

  const candidates = root.querySelectorAll(
    '.elementor-top-section, .e-con.e-parent, .elementor-widget-heading, .elementor-widget-image, .elementor-widget-wcf--image, .elementor-widget-wcf--title, .advance_slider_wrapper, .swiper-poster'
  );

  candidates.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    if (isHeaderScoped(el)) return;
    if (isHomeHeroEl(el)) return;
    const r = el.getBoundingClientRect();
    // Skip already-on-screen (handled by enter choreography)
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) return;
    el.classList.add('pixel-await-scroll');
    io.observe(el);
  });

  return () => {
    io.disconnect();
    root.querySelectorAll('.pixel-await-scroll').forEach((el) => {
      el.classList.remove('pixel-await-scroll');
    });
  };
}
