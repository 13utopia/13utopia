/*! Boot Swiper for brand logos + testimonials.
   Re-runnable: window.__PIXEL_SWIPER_RUN() after SPA navigations. */
(function () {
  if (window.__PIXEL_SWIPER_BOOT_V2) return;
  window.__PIXEL_SWIPER_BOOT_V2 = true;

  function parseSettings(el) {
    if (!el || !el.getAttribute) return null;
    var raw = el.getAttribute('data-settings');
    if (!raw) return null;
    try {
      var decoded = raw
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

  function findSwiperRoot(el) {
    if (!el) return null;
    if (el.classList.contains('swiper') || el.classList.contains('swiper-container')) return el;
    return el.querySelector('.swiper, .swiper-container, .arolax_testimonial_slider');
  }

  function isBrandSlider(el) {
    return !!(
      el &&
      (el.classList.contains('wcf--brand-slider-wrapper') ||
        el.closest('.wcf--brand-slider-wrapper') ||
        el.closest('.elementor-widget-wcf--brand-slider') ||
        (el.className && String(el.className).indexOf('brand-slider') !== -1))
    );
  }

  function isTestimonial(el) {
    return !!(
      el &&
      (el.classList.contains('arolax_testimonial_wrapper') ||
        el.closest('.arolax_testimonial_wrapper') ||
        el.closest('.elementor-widget-arolax--testimonial') ||
        el.classList.contains('arolax_testimonial_slider'))
    );
  }

  function destroySwiper(root) {
    if (!root) return;
    var inst = root.swiper || root.__pixelSwiper;
    if (inst) {
      try {
        inst.destroy(true, true);
      } catch (e) {}
    }
    root.__pixelSwiper = null;
    root.classList.remove(
      'swiper-initialized',
      'swiper-horizontal',
      'swiper-vertical',
      'swiper-pointer-events',
      'swiper-backface-hidden',
      'swiper-cards',
      'swiper-3d'
    );
  }

  function ensureLinear(root) {
    if (!root) return;
    var wrap = root.querySelector('.swiper-wrapper');
    if (wrap) {
      wrap.style.transitionTimingFunction = 'linear';
      wrap.style.animation = 'none';
    }
  }

  function ensureAutoplay(root) {
    var inst = root && (root.swiper || root.__pixelSwiper);
    if (!inst || !inst.autoplay) return false;
    try {
      if (inst.params) {
        if (typeof inst.params.autoplay === 'object' && inst.params.autoplay) {
          inst.params.autoplay.disableOnInteraction = false;
          inst.params.autoplay.pauseOnMouseEnter = false;
        } else if (!inst.params.autoplay) {
          inst.params.autoplay = {
            delay: isBrandSlider(root) ? 1 : 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          };
        }
      }
      // paused===true is normal during the long linear transition (speed:5000)
      if (!inst.autoplay.running && typeof inst.autoplay.start === 'function') {
        inst.autoplay.start();
      } else if (typeof inst.autoplay.start === 'function' && !inst.animating) {
        // Nudge — recovers after disableOnInteraction stop without fighting in-flight slides
        inst.autoplay.start();
      }
      return !!inst.autoplay.running;
    } catch (e) {
      return false;
    }
  }

  var brandMotion = new WeakMap();

  function reviveBrand(root) {
    if (!root || !root.isConnected || !window.Swiper) return;
    ensureLinear(root);
    var inst = root.swiper || root.__pixelSwiper;
    var wrap = root.querySelector('.swiper-wrapper');
    var tf = wrap ? wrap.style.transform || '' : '';
    var prev = brandMotion.get(root) || { tf: '', ts: 0, misses: 0 };
    var now = Date.now();

    if (inst && Number(inst.params && inst.params.slidesPerView) >= 2) {
      ensureAutoplay(root);
      if (tf && tf === prev.tf) {
        prev.misses += 1;
      } else {
        prev.misses = 0;
        prev.tf = tf;
        prev.ts = now;
      }
      brandMotion.set(root, prev);
      // ~5s/slide; if transform unchanged ~3 intervals (~18s) while in DOM → hard reset
      if (prev.misses >= 3 && !(inst.animating)) {
        brandMotion.set(root, { tf: '', ts: now, misses: 0 });
        bootBrandSlider(root, true);
      }
      return;
    }
    bootBrandSlider(root, true);
  }

  function brandOpts() {
    return {
      slidesPerView: 5,
      spaceBetween: 80,
      loop: true,
      speed: 5000,
      allowTouchMove: false,
      grabCursor: false,
      watchSlidesProgress: true,
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        waitForTransition: true,
      },
      breakpoints: {
        0: { slidesPerView: 2, spaceBetween: 80 },
        767: { slidesPerView: 2, spaceBetween: 80 },
        880: { slidesPerView: 4, spaceBetween: 80 },
        1024: { slidesPerView: 3, spaceBetween: 80 },
        1200: { slidesPerView: 5, spaceBetween: 80 },
        1366: { slidesPerView: 5, spaceBetween: 80 },
        2400: { slidesPerView: 5, spaceBetween: 80 },
      },
      observer: true,
      observeParents: true,
    };
  }

  function bootBrandSlider(root, force) {
    if (!window.Swiper || !root || !root.isConnected) return false;
    var inst = root.swiper || root.__pixelSwiper;
    if (inst && !force) {
      var spv = Number(inst.params && inst.params.slidesPerView);
      if (spv >= 2) {
        ensureLinear(root);
        ensureAutoplay(root);
        return false;
      }
      destroySwiper(root);
    } else if (inst && force) {
      destroySwiper(root);
    }

    try {
      ensureLinear(root);
      root.__pixelSwiper = new window.Swiper(root, brandOpts());
      ensureLinear(root);
      ensureAutoplay(root);
      brandMotion.set(root, { tf: '', ts: Date.now(), misses: 0 });
      return true;
    } catch (e) {
      console.warn('[pixel-swiper] brand init failed', e);
      return false;
    }
  }

  function coerceBool(v, fallback) {
    if (v === undefined || v === null) return fallback;
    if (v === true || v === 'true' || v === 1 || v === '1') return true;
    if (v === false || v === 'false' || v === 0 || v === '0') return false;
    return fallback;
  }

  function bootTestimonial(host) {
    if (!window.Swiper || !host || !host.isConnected) return false;
    var root = findSwiperRoot(host);
    if (!root) return false;
    if (root.swiper || root.__pixelSwiper || root.classList.contains('swiper-initialized')) {
      ensureAutoplay(root);
      return false;
    }
    var settings = parseSettings(host) || parseSettings(root.closest('[data-settings]')) || {};
    var opts = {
      loop: coerceBool(settings.loop, true),
      speed: Number(settings.speed) || 500,
      slidesPerView: Number(settings.slidesPerView) || 1,
      spaceBetween: settings.spaceBetween != null ? Number(settings.spaceBetween) : 20,
      allowTouchMove: coerceBool(settings.allowTouchMove, false),
      grabCursor: false,
      observer: true,
      observeParents: true,
      effect: settings.effect || 'cards',
      cardsEffect: { perSlideOffset: 8, perSlideRotate: 2, slideShadows: false },
      autoplay: {
        delay:
          settings.autoplay && settings.autoplay.delay != null
            ? Number(settings.autoplay.delay)
            : 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },
    };
    if (settings.breakpoints) {
      opts.breakpoints = {};
      Object.keys(settings.breakpoints).forEach(function (bp) {
        var b = settings.breakpoints[bp] || {};
        opts.breakpoints[bp] = {
          slidesPerView: Number(b.slidesPerView) || 1,
          spaceBetween: b.spaceBetween != null ? Number(b.spaceBetween) : opts.spaceBetween,
        };
      });
    }
    var pagSel =
      (settings.pagination && settings.pagination.el) ||
      null;
    var pagEl = pagSel
      ? document.querySelector(pagSel)
      : root.querySelector('.swiper-pagination') ||
        (host.parentElement && host.parentElement.querySelector('.swiper-pagination'));
    if (pagEl) opts.pagination = { el: pagEl, clickable: true };

    try {
      root.__pixelSwiper = new window.Swiper(root, opts);
      ensureAutoplay(root);
      try {
        root.setAttribute('data-lenis-prevent', '');
      } catch (e2) {}
      return true;
    } catch (e) {
      console.warn('[pixel-swiper] testimonial init failed', e);
      // Retry without cards if module missing
      try {
        delete opts.effect;
        delete opts.cardsEffect;
        root.__pixelSwiper = new window.Swiper(root, opts);
        ensureAutoplay(root);
        return true;
      } catch (e3) {
        return false;
      }
    }
  }

  function bootOne(host) {
    if (!window.Swiper) return false;
    if (isBrandSlider(host)) {
      return bootBrandSlider(findSwiperRoot(host) || host.querySelector('.swiper'));
    }
    if (isTestimonial(host)) {
      return bootTestimonial(host);
    }
    var root = findSwiperRoot(host);
    if (!root || !root.isConnected) return false;
    if (root.classList.contains('swiper-initialized') || root.__pixelSwiper || root.swiper) {
      return false;
    }
    // Skip advance/poster/cube — other boots own those
    if (
      root.closest('.advance_slider_wrapper') ||
      root.classList.contains('swiper-cube') ||
      root.classList.contains('advance_slider') ||
      root.classList.contains('swiper-poster')
    ) {
      return false;
    }
    var settings = parseSettings(host) || parseSettings(root) || {};
    var opts = {
      loop: coerceBool(settings.loop, false),
      speed: Number(settings.speed) || 500,
      slidesPerView: settings.slidesPerView ? Number(settings.slidesPerView) || 1 : 1,
      spaceBetween: settings.spaceBetween != null ? Number(settings.spaceBetween) : 0,
      allowTouchMove: coerceBool(settings.allowTouchMove, true),
      grabCursor: true,
      observer: true,
      observeParents: true,
    };
    if (settings.effect) opts.effect = settings.effect;
    if (settings.autoplay) {
      opts.autoplay =
        typeof settings.autoplay === 'object'
          ? {
              delay: Number(settings.autoplay.delay) || 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }
          : { delay: 3000, disableOnInteraction: false };
    }
    var localPag = root.querySelector('.swiper-pagination') || host.querySelector('.swiper-pagination');
    if (localPag) opts.pagination = { el: localPag, clickable: true };
    if (settings.breakpoints) opts.breakpoints = settings.breakpoints;

    try {
      root.__pixelSwiper = new window.Swiper(root, opts);
      return true;
    } catch (e) {
      console.warn('[pixel-swiper] init failed', e);
      return false;
    }
  }

  function runElementorHooks() {
    if (!window.elementorFrontend || !window.elementorFrontend.hooks || !window.jQuery) return;
    try {
      window.jQuery('.elementor-widget-wcf--brand-slider').each(function () {
        window.elementorFrontend.hooks.doAction(
          'frontend/element_ready/wcf--brand-slider.default',
          window.jQuery(this),
          window.jQuery
        );
      });
      window.jQuery('.elementor-widget-arolax--testimonial').each(function () {
        window.elementorFrontend.hooks.doAction(
          'frontend/element_ready/arolax--testimonial.default',
          window.jQuery(this),
          window.jQuery
        );
      });
      window.jQuery('.elementor-widget-image-carousel').each(function () {
        window.elementorFrontend.hooks.doAction(
          'frontend/element_ready/image-carousel.default',
          window.jQuery(this),
          window.jQuery
        );
      });
    } catch (e) {}
  }

  function run() {
    if (!window.Swiper) return;

    // Prefer Elementor/WCF handlers when available (SPA remounts)
    runElementorHooks();

    document.querySelectorAll('.wcf--brand-slider-wrapper .swiper').forEach(function (root) {
      bootBrandSlider(root, false);
    });

    document
      .querySelectorAll(
        '.arolax_testimonial_wrapper, .arolax__testimonial-4, .elementor-widget-arolax--testimonial'
      )
      .forEach(function (host) {
        bootTestimonial(host);
      });

    document
      .querySelectorAll(
        '.elementor-widget-wcf--slider .swiper:not(.swiper-initialized), .elementor-image-carousel-wrapper.swiper:not(.swiper-initialized)'
      )
      .forEach(function (root) {
        if (isBrandSlider(root) || isTestimonial(root)) return;
        var host = root.closest('[data-settings]') || root.parentElement;
        if (host) bootOne(host);
      });

    // Keep brand autoplay alive (interaction / SPA can pause it)
    document.querySelectorAll('.wcf--brand-slider-wrapper .swiper').forEach(function (root) {
      reviveBrand(root);
    });
    document.querySelectorAll('.arolax_testimonial_slider.swiper').forEach(function (root) {
      if (!ensureAutoplay(root) && !(root.swiper || root.__pixelSwiper)) {
        var host = root.closest('.arolax_testimonial_wrapper') || root.parentElement;
        if (host) bootTestimonial(host);
      }
    });
  }

  window.__PIXEL_SWIPER_RUN = run;

  function patchSwiperCtor() {
    if (!window.Swiper || window.Swiper.__pixelBrandPatched) return;
    var Orig = window.Swiper;
    function PatchedSwiper(el, opts) {
      try {
        var node = el && el.jquery ? el[0] : el;
        if (node && isBrandSlider(node) && opts) {
          opts = Object.assign({}, opts);
          if (opts.autoplay && typeof opts.autoplay === 'object') {
            opts.autoplay = Object.assign({}, opts.autoplay, {
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            });
          } else if (!opts.autoplay) {
            opts.autoplay = {
              delay: 1,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              waitForTransition: true,
            };
          }
        }
        if (node && isTestimonial(node) && opts && opts.autoplay && typeof opts.autoplay === 'object') {
          opts = Object.assign({}, opts);
          opts.autoplay = Object.assign({}, opts.autoplay, {
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          });
        }
      } catch (e) {}
      return new Orig(el, opts);
    }
    PatchedSwiper.prototype = Orig.prototype;
    Object.keys(Orig).forEach(function (k) {
      try {
        PatchedSwiper[k] = Orig[k];
      } catch (e2) {}
    });
    PatchedSwiper.__pixelBrandPatched = true;
    window.Swiper = PatchedSwiper;
  }

  var started = false;
  function start() {
    patchSwiperCtor();
    run();
    if (started) return;
    started = true;
    setTimeout(run, 400);
    setTimeout(run, 1200);
    setTimeout(run, 2500);
    setTimeout(run, 4500);
  }

  if (window.__PIXEL_LIVE_JS_READY) start();
  else window.addEventListener('pixel-live-js-ready', start);
  window.addEventListener('load', function () {
    setTimeout(start, 200);
  });
  // Periodic nudge — recovers paused brand autoplay / SPA remounts
  setInterval(function () {
    if (!window.Swiper) return;
    patchSwiperCtor();
    document.querySelectorAll('.wcf--brand-slider-wrapper .swiper').forEach(reviveBrand);
    document.querySelectorAll('.arolax_testimonial_slider.swiper').forEach(function (root) {
      if (root.swiper || root.__pixelSwiper) ensureAutoplay(root);
      else {
        var host = root.closest('.arolax_testimonial_wrapper') || root.parentElement;
        if (host) bootTestimonial(host);
      }
    });
  }, 6000);
})();
