/** Homepage hero “Dynamic / Solutions” — plays only after the curtain is clear. */

export const HOME_HERO_IDS = ['479c805', '4b3ef8a', 'b23dc44', 'f61769e'] as const;

const HERO_SEL = HOME_HERO_IDS.map((id) => `.elementor-element-${id}`).join(', ');

/** Full veil reveal duration in veil-motion.css (clip-path 0.88s) */
export const VEIL_REVEAL_MS = 880;
/**
 * Sweet spot: start hero after reveal begins — not after the full 880ms.
 * Ease-out clears the mid/upper title band ~halfway; logo is already gone (~320ms).
 * 480ms = curtain off the words, eyes on the page, then motion with no dead pause.
 */
export const HERO_AFTER_REVEAL_MS = 480;

export function isHomeHeroEl(el: Element) {
  const id = el.getAttribute('data-id');
  return Boolean(id && (HOME_HERO_IDS as readonly string[]).includes(id));
}

/**
 * Arm hero titles as invisible (no motion yet). Call under curtain / before unveil.
 */
export function prepareHomeHeroEntrance() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll<HTMLElement>(HERO_SEL).forEach((el) => {
    el.classList.remove('pixel-hero-play', 'pixel-awaken', 'pixel-awaken-done');
    el.classList.add('pixel-hero-wait');
    el.style.removeProperty('--pixel-awaken-delay');
  });

  // Parent uses --overflow:hidden which clips slide-ins — open during the beat
  document
    .querySelectorAll<HTMLElement>(
      '.elementor-element-e5f1a6a, .elementor-element-4526561, .elementor-element-7662e5a, .elementor-element-1f9dea5, .elementor-element-6c4a6cf, .elementor-element-446c3ae'
    )
    .forEach((el) => {
      el.classList.add('pixel-hero-stage');
    });
}

/**
 * Play the full Dynamic → Solutions entrance once the curtain is gone.
 */
export function playHomeHeroEntrance() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll<HTMLElement>(HERO_SEL).forEach((el) => {
      el.classList.remove('pixel-hero-wait');
      el.classList.add('pixel-hero-play');
    });
    return;
  }

  prepareHomeHeroEntrance();

  // Force reflow so wait → play always restarts the keyframes
  document.querySelectorAll<HTMLElement>(HERO_SEL).forEach((el) => {
    void el.offsetWidth;
    el.classList.remove('pixel-hero-wait');
    el.classList.add('pixel-hero-play');
  });

  window.setTimeout(() => {
    document.querySelectorAll('.pixel-hero-stage').forEach((el) => {
      el.classList.remove('pixel-hero-stage');
    });
  }, 2200);
}
