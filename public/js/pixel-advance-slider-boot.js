/*! Boot poster fade carousel + harden cube/image-box transitions.
   Re-runnable via window.__PIXEL_ADVANCE_RUN after SPA navigations.
   Does NOT load deleted wcf-addons-pro plugin assets — Swiper-only. */
(function () {
  var started = false;

  function ensureCss() {
    /* Poster/cube styles live in master-pixel.css — no plugin CSS required. */
  }

  function parseSettings(el) {
    if (!el || !el.getAttribute) return {};
    var raw = el.getAttribute('data-settings');
    if (!raw) return {};
    try {
      return JSON.parse(
        raw
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&amp;/g, '&')
      );
    } catch (e) {
      return {};
    }
  }

  function moduleForType() {
    return null;
  }

  function unlockLenisScroll() {
    document
      .querySelectorAll(
        '.advance_slider_wrapper[data-lenis-prevent], .swiper-poster[data-lenis-prevent], .swiper-cube[data-lenis-prevent]'
      )
      .forEach(function (el) {
        // Cubes may briefly hold prevent during drag — only strip posters here
        if (el.classList.contains('swiper-cube')) return;
        el.removeAttribute('data-lenis-prevent');
      });
    document.querySelectorAll('.advance_slider_wrapper, .swiper-poster').forEach(function (el) {
      el.removeAttribute('data-lenis-prevent');
    });
    try {
      if (window.__lenis && typeof window.__lenis.start === 'function') window.__lenis.start();
    } catch (e) {}
  }

  function ensurePosterPagination(wrapper, slider) {
    var pag = wrapper.querySelector('.swiper-pagination') || slider.querySelector('.swiper-pagination');
    if (pag) return pag;
    pag = document.createElement('div');
    pag.className = 'swiper-pagination pixel-poster-pagination';
    wrapper.appendChild(pag);
    return pag;
  }

  /** Posters → fade/slide autoplay carousel (no mousewheel / no lenis-prevent). */
  function enhancePosters(wrapper) {
    if (!wrapper || wrapper.getAttribute('slider-type') !== 'posters') return;
    wrapper.classList.add('pixel-poster-carousel');
    wrapper.classList.remove('pixel-poster-full');
    wrapper.removeAttribute('data-lenis-prevent');

    var slider = wrapper.querySelector('.swiper-poster, .advance_slider');
    if (!slider) return;
    slider.removeAttribute('data-lenis-prevent');

    var sw = slider.swiper || slider.__pixelAdvance;
    if (!sw) return;

    try {
      if (sw.mousewheel && typeof sw.mousewheel.disable === 'function') sw.mousewheel.disable();
      sw.params.mousewheel = false;
      if (typeof sw.params.autoplay === 'object' && sw.params.autoplay) {
        sw.params.autoplay.disableOnInteraction = false;
        sw.params.autoplay.pauseOnMouseEnter = false;
        if (!sw.params.autoplay.delay) sw.params.autoplay.delay = 4500;
      } else {
        sw.params.autoplay = { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: false };
      }
      if (sw.autoplay && typeof sw.autoplay.start === 'function') sw.autoplay.start();
    } catch (e) {}
    unlockLenisScroll();
  }

  function posterCarouselOpts(wrapper, slider) {
    var pag = ensurePosterPagination(wrapper, slider);
    var nextEl = wrapper.querySelector('.wcf-arrow-next, .swiper-button-next');
    var prevEl = wrapper.querySelector('.wcf-arrow-prev, .swiper-button-prev');
    var opts = {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: true,
      speed: 800,
      slidesPerView: 1,
      spaceBetween: 0,
      grabCursor: true,
      allowTouchMove: true,
      mousewheel: false,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },
      pagination: {
        el: pag,
        clickable: true,
      },
      observer: true,
      observeParents: true,
    };
    if (nextEl && prevEl) {
      opts.navigation = { nextEl: nextEl, prevEl: prevEl };
    }
    return opts;
  }

  function destroyPosterSwiper(slider) {
    if (!slider) return;
    var sw = slider.swiper || slider.__pixelAdvance;
    if (sw) {
      try {
        sw.destroy(true, true);
      } catch (e) {}
    }
    slider.__pixelAdvance = null;
    slider.classList.remove(
      'swiper-initialized',
      'swiper-horizontal',
      'swiper-fade',
      'swiper-pointer-events',
      'swiper-watch-progress',
      'swiper-backface-hidden',
      'swiper-3d',
      'swiper-cube'
    );
  }

  function bootAdvance(wrapper) {
    if (!wrapper) return false;
    var type = wrapper.getAttribute('slider-type') || '';
    if (!window.Swiper) {
      if (type === 'posters') unlockLenisScroll();
      return false;
    }
    var slider = wrapper.querySelector('.advance_slider, .swiper-poster, .swiper-container, .swiper');
    if (!slider) return false;

    if (type === 'posters') {
      wrapper.classList.add('pixel-poster-carousel');
      wrapper.classList.remove('pixel-poster-full');
      var existing = slider.swiper || slider.__pixelAdvance;
      var needsCarousel =
        !existing ||
        !existing.params ||
        existing.params.effect === 'creative' ||
        existing.params.mousewheel ||
        wrapper.dataset.pixelPosterMode !== 'carousel';

      if (needsCarousel) {
        destroyPosterSwiper(slider);
        try {
          var opts = posterCarouselOpts(wrapper, slider);
          slider.__pixelAdvance = new window.Swiper(slider, opts);
          wrapper.dataset.pixelAdvanceBound = '1';
          wrapper.dataset.pixelPosterMode = 'carousel';
          enhancePosters(wrapper);
          return true;
        } catch (eFade) {
          console.warn('[pixel-advance-slider] poster carousel failed', eFade);
          // Fallback without fade module
          try {
            var opts2 = posterCarouselOpts(wrapper, slider);
            delete opts2.effect;
            delete opts2.fadeEffect;
            slider.__pixelAdvance = new window.Swiper(slider, opts2);
            wrapper.dataset.pixelAdvanceBound = '1';
            wrapper.dataset.pixelPosterMode = 'carousel';
            enhancePosters(wrapper);
            return true;
          } catch (e2) {
            return false;
          }
        }
      }
      enhancePosters(wrapper);
      return false;
    }

    if (slider.swiper || slider.classList.contains('swiper-initialized')) {
      wrapper.dataset.pixelAdvanceBound = '1';
      return false;
    }
    if (wrapper.dataset.pixelAdvanceBound === '1') {
      return false;
    }

    var settings = parseSettings(wrapper);
    settings.handleElementorBreakpoints = true;

    var mod = moduleForType(type);
    if (mod) settings.modules = [mod];

    try {
      if (
        window.elementorFrontend &&
        window.elementorFrontend.utils &&
        window.elementorFrontend.utils.swiper
      ) {
        new window.elementorFrontend.utils.swiper(window.jQuery(slider), settings).then(function () {
          wrapper.dataset.pixelAdvanceBound = '1';
        });
        wrapper.dataset.pixelAdvanceBound = '1';
        return true;
      }
      slider.__pixelAdvance = new window.Swiper(slider, settings);
      wrapper.dataset.pixelAdvanceBound = '1';
      return true;
    } catch (e) {
      console.warn('[pixel-advance-slider] init failed', type, e);
      return false;
    }
  }

  function parseCubeSettings(host) {
    var wrap = host.querySelector('.wcf__slider-wrapper, .wcf__image-box-slider') || host;
    var raw = wrap.getAttribute('data-settings');
    if (!raw) return {};
    try {
      return JSON.parse(
        raw
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&amp;/g, '&')
      );
    } catch (e) {
      return {};
    }
  }

  function bootImageBoxCube(host) {
    if (!window.Swiper || !host || !host.isConnected) return false;
    var root = host.querySelector('.wcf__slider.swiper, .swiper');
    if (!root) return false;
    if (root.swiper || root.__pixelCube || root.classList.contains('swiper-initialized')) {
      return false;
    }
    var settings = parseCubeSettings(host);
    var opts = {
      effect: 'cube',
      grabCursor: true,
      loop: settings.loop !== false,
      speed: Number(settings.speed) || 3000,
      slidesPerView: 1,
      spaceBetween: 0,
      centeredSlides: false,
      allowTouchMove: settings.allowTouchMove !== false && settings.allowTouchMove !== 'false',
      cubeEffect: Object.assign(
        { shadow: false, slideShadows: false, shadowOffset: 20, shadowScale: 0.94 },
        settings.cubeEffect || {}
      ),
      autoplay: {
        delay:
          settings.autoplay && settings.autoplay.delay != null
            ? Number(settings.autoplay.delay)
            : 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        waitForTransition: true,
      },
      observer: true,
      observeParents: true,
    };
    try {
      root.__pixelCube = new window.Swiper(root, opts);
      try {
        wrapRemoveSettings(host);
      } catch (e0) {}
      return true;
    } catch (e) {
      console.warn('[pixel-advance-slider] cube boot failed', e);
      return false;
    }
  }

  function wrapRemoveSettings(host) {
    var wrap = host.querySelector('.wcf__slider-wrapper[data-settings], .wcf__image-box-slider[data-settings]');
    if (wrap) wrap.removeAttribute('data-settings');
  }

  function ensureImageBoxCubes() {
    document.querySelectorAll('.elementor-widget-wcf--image-box-slider').forEach(function (host) {
      var root = host.querySelector('.swiper');
      if (!root) return;
      var sw = root.swiper || root.__pixelCube;
      var hasSettings = !!host.querySelector('[data-settings]');

      // Tear down wrong boots (slide effect OR spaceBetween>0 → shard/seam look)
      if (
        sw &&
        sw.params &&
        (sw.params.effect !== 'cube' || Number(sw.params.spaceBetween) > 0)
      ) {
        try {
          sw.destroy(true, true);
        } catch (eD) {}
        root.__pixelCube = null;
        root.classList.remove(
          'swiper-initialized',
          'swiper-cube',
          'swiper-3d',
          'swiper-horizontal',
          'swiper-pointer-events',
          'swiper-backface-hidden',
          'swiper-watch-progress'
        );
        sw = null;
      }

      if (sw && sw.params && sw.params.effect === 'cube') {
        hardenOneCube(root);
        return;
      }

      // WCF removes data-settings on first hook — only call it when settings remain
      if (
        hasSettings &&
        window.elementorFrontend &&
        window.elementorFrontend.hooks &&
        window.jQuery
      ) {
        try {
          window.elementorFrontend.hooks.doAction(
            'frontend/element_ready/wcf--image-box-slider.default',
            window.jQuery(host),
            window.jQuery
          );
        } catch (e) {}
      }
    });

    // After WCF async swiper resolves (or if settings were already stripped), force cube
    setTimeout(function () {
      document.querySelectorAll('.elementor-widget-wcf--image-box-slider').forEach(function (host) {
        var root = host.querySelector('.swiper');
        if (!root) return;
        var sw = root.swiper || root.__pixelCube;
        if (sw && sw.params && sw.params.effect === 'cube') {
          hardenOneCube(root);
          return;
        }
        if (sw) {
          try {
            sw.destroy(true, true);
          } catch (e2) {}
          root.__pixelCube = null;
          root.classList.remove('swiper-initialized', 'swiper-cube', 'swiper-3d');
        }
        bootImageBoxCube(host);
        hardenOneCube(host.querySelector('.swiper'));
      });
    }, 900);
  }

  function hardenOneCube(el) {
    if (!el) return;
    if (!el.classList.contains('swiper-cube') && !(el.swiper && el.swiper.params && el.swiper.params.effect === 'cube')) {
      return;
    }
    try {
      el.querySelectorAll('.swiper-slide').forEach(function (slide) {
        if (slide.style && (slide.style.visibility || slide.style.opacity)) {
          slide.style.removeProperty('visibility');
          slide.style.removeProperty('opacity');
        }
      });
      var sw = el.swiper || el.__pixelCube;
      if (!sw || !sw.params) return;
      // Cube faces break if spaceBetween > 0 (shows two panels meeting at a seam)
      sw.params.spaceBetween = 0;
      sw.params.slidesPerView = 1;
      if (sw.params.effect !== 'cube') {
        // Can't safely hot-swap effect — destroy+reboot handled by ensureImageBoxCubes
        return;
      }
      if (sw.params.breakpoints) {
        Object.keys(sw.params.breakpoints).forEach(function (bp) {
          if (sw.params.breakpoints[bp]) {
            sw.params.breakpoints[bp].spaceBetween = 0;
            sw.params.breakpoints[bp].slidesPerView = 1;
          }
        });
      }
      el.querySelectorAll('.swiper-slide').forEach(function (slide) {
        slide.style.marginRight = '0px';
      });
      if (sw.params.cubeEffect) {
        sw.params.cubeEffect.shadow = false;
        sw.params.cubeEffect.slideShadows = false;
      }
      if (typeof sw.params.autoplay === 'object' && sw.params.autoplay) {
        sw.params.autoplay.disableOnInteraction = false;
        sw.params.autoplay.pauseOnMouseEnter = false;
      }
      var host = el.closest('.elementor-widget-wcf--image-box-slider') || el.parentElement;
      if (host) {
        host.style.setProperty('overflow', 'visible', 'important');
      }
      el.style.setProperty('overflow', 'visible', 'important');

      el.querySelectorAll(
        '.swiper-slide-duplicate, .swiper-slide-duplicate-active, .swiper-slide-duplicate-next, .swiper-slide-duplicate-prev'
      ).forEach(function (slide) {
        slide.style.setProperty('visibility', 'hidden', 'important');
        slide.style.setProperty('pointer-events', 'none', 'important');
      });

      if (typeof sw.update === 'function') sw.update();
      if (sw.autoplay && typeof sw.autoplay.start === 'function') {
        try {
          sw.autoplay.start();
        } catch (eA) {}
      }

      if (!sw.__pixelCubeDupGuard) {
        sw.__pixelCubeDupGuard = true;
        var hideDups = function () {
          el.querySelectorAll(
            '.swiper-slide-duplicate, .swiper-slide-duplicate-active, .swiper-slide-duplicate-next, .swiper-slide-duplicate-prev'
          ).forEach(function (slide) {
            slide.style.setProperty('visibility', 'hidden', 'important');
          });
        };
        sw.on('slideChange', hideDups);
        sw.on('slideChangeTransitionStart', hideDups);
        sw.on('slideChangeTransitionEnd', hideDups);
      }
    } catch (e) {}
  }

  function hardenCubeSliders() {
    document.querySelectorAll('.elementor-widget-wcf--image-box-slider .swiper, .swiper-cube').forEach(hardenOneCube);
  }

  function runReadyHooks() {
    if (!window.elementorFrontend || !window.elementorFrontend.hooks || !window.jQuery) return;
    try {
      window.jQuery('.elementor-widget-wcf--advance-slider').each(function () {
        // We own posters as fade carousel — don't let WCF re-attach mousewheel sticky
        if (this.querySelector('[slider-type="posters"]')) return;
        window.elementorFrontend.hooks.doAction(
          'frontend/element_ready/wcf--advance-slider.default',
          window.jQuery(this),
          window.jQuery
        );
      });
      window.jQuery('.elementor-widget-wcf--image-box-slider').each(function () {
        window.elementorFrontend.hooks.doAction(
          'frontend/element_ready/wcf--image-box-slider.default',
          window.jQuery(this),
          window.jQuery
        );
      });
    } catch (e) {}
  }

  function run() {
    ensureCss();
    unlockLenisScroll();
    // Allow re-bind on SPA remounts (new wrappers lack pixelAdvanceBound)
    document.querySelectorAll('.advance_slider_wrapper').forEach(bootAdvance);
    ensureImageBoxCubes();
    hardenCubeSliders();
    unlockLenisScroll();
  }

  window.__PIXEL_ADVANCE_RUN = run;
  window.__PIXEL_LENIS_UNLOCK = unlockLenisScroll;

  function start() {
    if (started) {
      run();
      return;
    }
    started = true;
    run();
    runReadyHooks();
    document.querySelectorAll('.advance_slider_wrapper[slider-type="posters"]').forEach(bootAdvance);
    unlockLenisScroll();
    setTimeout(run, 400);
    setTimeout(run, 1200);
    setTimeout(function () {
      run();
      hardenCubeSliders();
      unlockLenisScroll();
    }, 2500);
  }

  if (window.__PIXEL_LIVE_JS_READY) start();
  else window.addEventListener('pixel-live-js-ready', start);
  if (document.readyState === 'complete') setTimeout(start, 300);
  else
    window.addEventListener('load', function () {
      setTimeout(start, 300);
    });
  // Safety: posters must never permanently trap Lenis
  setInterval(unlockLenisScroll, 5000);
})();
