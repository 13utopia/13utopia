/*! Boot WCF advance-slider (posters sticky-scroll) + harden cube/image-box transitions.
   Re-runnable via window.__PIXEL_ADVANCE_RUN after SPA navigations. */
(function () {
  var EFFECTS_SRC = '/wp-content/plugins/wcf-addons-pro/assets/js/advance-slider-effects.js';
  var CSS_HREF = '/wp-content/plugins/wcf-addons-pro/assets/css/widgets/advance-slider.css';
  var started = false;

  function ensureCss() {
    if (document.querySelector('link[data-pixel-advance-slider-css]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_HREF;
    link.setAttribute('data-pixel-advance-slider-css', '1');
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[data-pixel-src="' + src + '"]')) {
        resolve();
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.dataset.pixelSrc = src;
      s.onload = function () {
        resolve();
      };
      s.onerror = function () {
        reject(new Error('failed ' + src));
      };
      document.head.appendChild(s);
    });
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

  function moduleForType(type) {
    if (type === 'posters' && typeof EffectPoster === 'function') return EffectPoster;
    if (type === 'material' && typeof EffectMaterial === 'function') return EffectMaterial;
    if (type === 'carousel' && typeof EffectCarousel === 'function') return EffectCarousel;
    if (type === 'fashion' && typeof EffectFashion === 'function') return EffectFashion;
    if (type === 'spring' && typeof EffectSpring === 'function') return EffectSpring;
    if (type === 'shutters' && typeof EffectShutters === 'function') return EffectShutters;
    if (type === 'slicer' && typeof EffectSlicer === 'function') return EffectSlicer;
    return null;
  }

  function currentScrollY() {
    try {
      if (window.__lenis && typeof window.__lenis.scroll === 'number') {
        return window.__lenis.scroll;
      }
    } catch (e) {}
    return window.scrollY || document.documentElement.scrollTop || 0;
  }

  function scrollPageBy(delta) {
    try {
      if (window.__lenis) {
        window.__lenis.start();
        // Always use Lenis' own scroll — native scrollY can desync after
        // scrollIntoView / Swiper updates and jump the page near the top.
        var target = currentScrollY() + delta;
        window.__lenis.scrollTo(target, { duration: 0.85, force: true });
        return;
      }
    } catch (e) {}
    window.scrollBy({ top: delta, behavior: 'smooth' });
  }

  /** Poster polish: mousewheel stack + ALWAYS unlock page scroll at edges. */
  function enhancePosters(wrapper) {
    if (!wrapper || wrapper.getAttribute('slider-type') !== 'posters') return;
    wrapper.classList.add('pixel-poster-full');

    var headerH = 110;
    var pinned = document.querySelector('.pixel-header-pinned');
    if (pinned) headerH = Math.max(pinned.getBoundingClientRect().height, 90) + 16;
    var avail = window.innerHeight - headerH;
    if (avail > 280) {
      wrapper.style.setProperty('--pixel-poster-h', Math.min(680, Math.floor(avail)) + 'px');
    }

    var bindSwiper = function () {
      var slider = wrapper.querySelector('.swiper-poster, .advance_slider');
      if (!slider) return;
      // data-lenis-prevent only while NOT at an outward edge (managed below)
      slider.setAttribute('data-lenis-prevent', '');
      wrapper.setAttribute('data-lenis-prevent', '');

      var sw = slider.swiper;
      if (!sw) return;

      if (sw.__pixelPosterWheel !== 5) {
        sw.__pixelPosterWheel = 5;
        sw.params.mousewheel = {
          releaseOnEdges: true,
          sensitivity: 1,
          eventsTarget: 'container',
        };
        sw.params.speed = Math.max(sw.params.speed || 0, 650);
        try {
          if (sw.mousewheel) {
            if (typeof sw.mousewheel.disable === 'function') sw.mousewheel.disable();
            if (typeof sw.mousewheel.enable === 'function') sw.mousewheel.enable();
          }
        } catch (e) {}
        if (typeof sw.update === 'function') sw.update();
      }

      // Edge unlock — never leave Lenis stopped / wheel trapped on last/first slide
      if (!sw.__pixelPosterEdgeUnlock) {
        sw.__pixelPosterEdgeUnlock = true;
        var edgeCooldown = 0;

        var syncPrevent = function () {
          // Keep prevent while mid-stack; drop at edges so page can continue
          if (sw.isBeginning || sw.isEnd) {
            slider.removeAttribute('data-lenis-prevent');
            wrapper.removeAttribute('data-lenis-prevent');
            try {
              if (window.__lenis) window.__lenis.start();
            } catch (e) {}
          } else {
            slider.setAttribute('data-lenis-prevent', '');
            wrapper.setAttribute('data-lenis-prevent', '');
          }
        };

        sw.on('slideChange', syncPrevent);
        sw.on('reachBeginning', syncPrevent);
        sw.on('reachEnd', syncPrevent);
        sw.on('fromEdge', function () {
          slider.setAttribute('data-lenis-prevent', '');
          wrapper.setAttribute('data-lenis-prevent', '');
        });
        syncPrevent();

        // Hard escape: if user wheels past last/first, force page scroll
        slider.addEventListener(
          'wheel',
          function (e) {
            var now = Date.now();
            if (now < edgeCooldown) return;
            var dy = e.deltaY;
            if (Math.abs(dy) < 8) return;

            if (sw.isEnd && dy > 0) {
              edgeCooldown = now + 420;
              try {
                if (window.__lenis) window.__lenis.start();
              } catch (err) {}
              slider.removeAttribute('data-lenis-prevent');
              wrapper.removeAttribute('data-lenis-prevent');
              try {
                e.preventDefault();
                e.stopPropagation();
              } catch (err2) {}
              // Nudge page so user never feels locked on step 5
              scrollPageBy(Math.min(Math.abs(dy) * 2.2, 520));
              return;
            }
            if (sw.isBeginning && dy < 0) {
              edgeCooldown = now + 420;
              try {
                if (window.__lenis) window.__lenis.start();
              } catch (err) {}
              slider.removeAttribute('data-lenis-prevent');
              wrapper.removeAttribute('data-lenis-prevent');
              try {
                e.preventDefault();
                e.stopPropagation();
              } catch (err3) {}
              scrollPageBy(-Math.min(Math.abs(dy) * 2.2, 520));
            }
          },
          { passive: false, capture: true }
        );
      }
    };

    bindSwiper();
    setTimeout(bindSwiper, 500);
    setTimeout(bindSwiper, 1400);
  }

  function bootAdvance(wrapper) {
    if (!wrapper) return false;
    var type = wrapper.getAttribute('slider-type') || '';
    if (!window.Swiper) {
      if (type === 'posters') enhancePosters(wrapper);
      return false;
    }
    var slider = wrapper.querySelector('.advance_slider, .swiper-poster, .swiper-container, .swiper');
    if (!slider) return false;

    if (slider.swiper || slider.classList.contains('swiper-initialized')) {
      wrapper.dataset.pixelAdvanceBound = '1';
      if (type === 'posters') enhancePosters(wrapper);
      return false;
    }
    if (wrapper.dataset.pixelAdvanceBound === '1') {
      if (type === 'posters') enhancePosters(wrapper);
      return false;
    }

    var settings = parseSettings(wrapper);
    settings.handleElementorBreakpoints = true;

    var mod = moduleForType(type);
    if (mod) settings.modules = [mod];

    if (type === 'posters') {
      if (!settings.effect) settings.effect = 'creative';
      if (!settings.mousewheel) settings.mousewheel = { releaseOnEdges: true };
      if (!settings.creativeEffect) {
        settings.creativeEffect = {
          limitProgress: 3,
          perspective: true,
          shadowPerProgress: true,
          prev: { shadow: true, translate: ['-15%', 0, -200] },
          next: { translate: [1500, 0, 0] },
        };
      }
      settings.grabCursor = settings.grabCursor !== false;
      settings.resistanceRatio = settings.resistanceRatio != null ? settings.resistanceRatio : 0;
      settings.parallax = settings.parallax !== false;
    }

    try {
      if (
        window.elementorFrontend &&
        window.elementorFrontend.utils &&
        window.elementorFrontend.utils.swiper
      ) {
        new window.elementorFrontend.utils.swiper(window.jQuery(slider), settings).then(function () {
          wrapper.dataset.pixelAdvanceBound = '1';
          if (type === 'posters') enhancePosters(wrapper);
        });
        wrapper.dataset.pixelAdvanceBound = '1';
        if (type === 'posters') enhancePosters(wrapper);
        return true;
      }
      slider.__pixelAdvance = new window.Swiper(slider, settings);
      wrapper.dataset.pixelAdvanceBound = '1';
      if (type === 'posters') enhancePosters(wrapper);
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

      // Tear down wrong slide-effect boots that produce the broken two-face seam
      if (sw && sw.params && sw.params.effect !== 'cube') {
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
    // Allow re-bind on SPA remounts (new wrappers lack pixelAdvanceBound)
    document.querySelectorAll('.advance_slider_wrapper').forEach(bootAdvance);
    ensureImageBoxCubes();
    hardenCubeSliders();
  }

  window.__PIXEL_ADVANCE_RUN = run;

  function start() {
    if (started) {
      run();
      return;
    }
    started = true;
    ensureCss();
    var chain = Promise.resolve();
    if (typeof EffectPoster !== 'function') {
      chain = chain.then(function () {
        return loadScript(EFFECTS_SRC);
      });
    }
    chain
      .then(function () {
        return loadScript('/wp-content/plugins/wcf-addons-pro/assets/js/advance-slider.js').catch(function () {});
      })
      .then(function () {
        run();
        runReadyHooks();
        setTimeout(run, 400);
        setTimeout(run, 1200);
        setTimeout(function () {
          run();
          hardenCubeSliders();
        }, 2500);
      })
      .catch(function (e) {
        console.warn('[pixel-advance-slider]', e);
        run();
      });
  }

  if (window.__PIXEL_LIVE_JS_READY) start();
  else window.addEventListener('pixel-live-js-ready', start);
  if (document.readyState === 'complete') setTimeout(start, 300);
  else
    window.addEventListener('load', function () {
      setTimeout(start, 300);
    });
})();
