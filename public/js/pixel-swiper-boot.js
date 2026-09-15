/*! Boot Swiper for brand logos + testimonials.
   Re-runnable: window.__PIXEL_SWIPER_RUN() after SPA navigations.
   Brand logos use one canonical continuous reel so every page matches. */
(function () {
  // Allow versioned reloads to replace older boots
  if (window.__PIXEL_SWIPER_UNBIND) {
    try {
      window.__PIXEL_SWIPER_UNBIND();
    } catch (e) {}
  }

  var reviveTimer = null;

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
    root.removeAttribute('data-pixel-brand-ok');
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
          inst.params.autoplay.delay = 1;
        } else if (!inst.params.autoplay) {
          inst.params.autoplay = {
            delay: isBrandSlider(root) ? 1 : 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          };
        }
      }
      if (!inst.autoplay.running && typeof inst.autoplay.start === 'function') {
        inst.autoplay.start();
      } else if (typeof inst.autoplay.start === 'function' && !inst.animating) {
        inst.autoplay.start();
      }
      return !!inst.autoplay.running;
    } catch (e) {
      return false;
    }
  }

  var brandMotion = new WeakMap();

  function brandOpts() {
    // One reel for every page — dense, linear, continuous
    return {
      slidesPerView: 5,
      spaceBetween: 40,
      loop: true,
      loopAdditionalSlides: 6,
      speed: 4500,
      allowTouchMove: false,
      grabCursor: false,
      watchSlidesProgress: true,
      resistanceRatio: 0,
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        waitForTransition: true,
      },
      breakpoints: {
        0: { slidesPerView: 2.4, spaceBetween: 24 },
        400: { slidesPerView: 2.6, spaceBetween: 28 },
        640: { slidesPerView: 3.2, spaceBetween: 32 },
        880: { slidesPerView: 4, spaceBetween: 36 },
        1024: { slidesPerView: 4.5, spaceBetween: 40 },
        1200: { slidesPerView: 5, spaceBetween: 44 },
        1366: { slidesPerView: 5.5, spaceBetween: 48 },
      },
      observer: true,
      observeParents: true,
    };
  }

  function brandLooksWrong(inst, root) {
    if (!inst || !inst.params) return true;
    var spv = Number(inst.params.slidesPerView);
    if (!(spv >= 2)) return true;
    var space = Number(inst.params.spaceBetween);
    if (window.innerWidth < 768 && space > 45) return true;
    if (Number(inst.params.speed) < 3000) return true;
    return !root || root.getAttribute('data-pixel-brand-ok') !== '5';
  }

  function reviveBrand(root) {
    if (!root || !root.isConnected || !window.Swiper) return;
    ensureLinear(root);
    var inst = root.swiper || root.__pixelSwiper;
    if (!inst || brandLooksWrong(inst, root)) {
      bootBrandSlider(root, true);
      return;
    }
    var wrap = root.querySelector('.swiper-wrapper');
    var tf = wrap ? wrap.style.transform || '' : '';
    var prev = brandMotion.get(root) || { tf: '', misses: 0 };
    if (tf && tf === prev.tf) prev.misses += 1;
    else {
      prev.misses = 0;
      prev.tf = tf;
    }
    brandMotion.set(root, prev);
    ensureAutoplay(root);
    if (prev.misses >= 3 && !inst.animating) {
      brandMotion.set(root, { tf: '', misses: 0 });
      bootBrandSlider(root, true);
    }
  }

  function bootBrandSlider(root, force) {
    if (!window.Swiper || !root || !root.isConnected) return false;
    var inst = root.swiper || root.__pixelSwiper;
    if (inst && !force && !brandLooksWrong(inst, root)) {
      ensureLinear(root);
      ensureAutoplay(root);
      return false;
    }
    if (inst) destroySwiper(root);

    try {
      var target = root.classList.contains('swiper')
        ? root
        : root.querySelector('.swiper') || root;
      ensureLinear(target);
      target.__pixelSwiper = new window.Swiper(target, brandOpts());
      ensureLinear(target);
      ensureAutoplay(target);
      target.setAttribute('data-pixel-brand-ok', '5');
      brandMotion.set(target, { tf: '', misses: 0 });
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
    var pagSel = (settings.pagination && settings.pagination.el) || null;
    var pagEl = pagSel
      ? document.querySelector(pagSel)
      : root.querySelector('.swiper-pagination') ||
        (host.parentElement && host.parentElement.querySelector('.swiper-pagination'));
    if (pagEl) opts.pagination = { el: pagEl, clickable: true };

    try {
      root.__pixelSwiper = new window.Swiper(root, opts);
      ensureAutoplay(root);
      try {
        root.removeAttribute('data-lenis-prevent');
      } catch (e2) {}
      return true;
    } catch (e) {
      console.warn('[pixel-swiper] testimonial init failed', e);
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
      return bootBrandSlider(findSwiperRoot(host) || host.querySelector('.swiper') || host);
    }
    if (isTestimonial(host)) {
      return bootTestimonial(host);
    }
    var root = findSwiperRoot(host);
    if (!root || !root.isConnected) return false;
    if (root.classList.contains('swiper-initialized') || root.__pixelSwiper || root.swiper) {
      return false;
    }
    if (
      root.closest('.advance_slider_wrapper') ||
      root.closest('.wcf__image-box-slider') ||
      root.closest('.elementor-widget-wcf--image-box-slider') ||
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

    runElementorHooks();

    document.querySelectorAll('.wcf--brand-slider-wrapper').forEach(function (wrap) {
      var root = wrap.classList.contains('swiper') ? wrap : wrap.querySelector('.swiper') || wrap;
      bootBrandSlider(root, brandLooksWrong(root.swiper || root.__pixelSwiper, root));
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

    document
      .querySelectorAll('.wcf--brand-slider-wrapper .swiper, .wcf--brand-slider-wrapper.swiper')
      .forEach(function (root) {
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
    if (!window.Swiper || window.Swiper.__pixelBrandPatched5) return;
    var Orig = window.Swiper;
    function PatchedSwiper(el, opts) {
      try {
        var node = el && el.jquery ? el[0] : el;
        if (node && isBrandSlider(node)) {
          opts = brandOpts();
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
    PatchedSwiper.__pixelBrandPatched5 = true;
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

  window.__PIXEL_SWIPER_UNBIND = function () {
    if (reviveTimer) {
      clearInterval(reviveTimer);
      reviveTimer = null;
    }
    started = false;
  };

  if (window.__PIXEL_LIVE_JS_READY) start();
  else window.addEventListener('pixel-live-js-ready', start);
  window.addEventListener('load', function () {
    setTimeout(start, 200);
  });
  reviveTimer = setInterval(function () {
    if (!window.Swiper) return;
    patchSwiperCtor();
    document
      .querySelectorAll('.wcf--brand-slider-wrapper .swiper, .wcf--brand-slider-wrapper.swiper')
      .forEach(reviveBrand);
    document.querySelectorAll('.arolax_testimonial_slider.swiper').forEach(function (root) {
      if (root.swiper || root.__pixelSwiper) ensureAutoplay(root);
      else {
        var host = root.closest('.arolax_testimonial_wrapper') || root.parentElement;
        if (host) bootTestimonial(host);
      }
    });
  }, 5000);
})();
