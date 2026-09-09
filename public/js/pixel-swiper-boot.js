/*! Boot Swiper instances from Elementor/Arolax data-settings when widget JS fails to attach. */
(function () {
  if (window.__PIXEL_SWIPER_BOOTED) return;
  window.__PIXEL_SWIPER_BOOTED = true;

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
    return el.querySelector('.swiper, .swiper-container');
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

  function destroyIfWrong(root) {
    if (!root) return;
    var inst = root.swiper || root.__pixelSwiper;
    if (!inst) return;
    var spv = inst.params && inst.params.slidesPerView;
    // Brand slider must be multi-slide; kill wrong 1-slide boots
    if (isBrandSlider(root) && (spv === 1 || spv === '1')) {
      try {
        inst.destroy(true, true);
      } catch (e) {}
      root.__pixelSwiper = null;
      root.classList.remove('swiper-initialized', 'swiper-horizontal', 'swiper-pointer-events');
    }
  }

  function bootBrandSlider(root) {
    if (!window.Swiper || !root) return false;
    destroyIfWrong(root);
    if (root.classList.contains('swiper-initialized') && root.swiper) {
      var ok = root.swiper.params && Number(root.swiper.params.slidesPerView) >= 2;
      if (ok) return false;
      destroyIfWrong(root);
    }
    try {
      root.__pixelSwiper = new window.Swiper(root, {
        slidesPerView: 5,
        spaceBetween: 80,
        loop: true,
        speed: 5000,
        allowTouchMove: false,
        grabCursor: false,
        autoplay: {
          delay: 1,
          disableOnInteraction: true,
          waitForTransition: true,
        },
        breakpoints: {
          0: { slidesPerView: 2, spaceBetween: 80 },
          767: { slidesPerView: 4, spaceBetween: 80 },
          880: { slidesPerView: 3, spaceBetween: 80 },
          1024: { slidesPerView: 5, spaceBetween: 80 },
          1200: { slidesPerView: 5, spaceBetween: 80 },
          1366: { slidesPerGroup: 1, slidesPerView: 5 },
          2400: { slidesPerGroup: 1, slidesPerView: 5 },
        },
        observer: true,
        observeParents: true,
      });
      return true;
    } catch (e) {
      console.warn('[pixel-swiper] brand init failed', e);
      return false;
    }
  }

  function bootOne(host) {
    if (!window.Swiper) return false;
    if (isBrandSlider(host)) {
      var brandRoot = findSwiperRoot(host) || host.querySelector('.swiper');
      return bootBrandSlider(brandRoot);
    }
    var root = findSwiperRoot(host);
    if (!root || root.classList.contains('swiper-initialized') || root.__pixelSwiper) return false;
    var settings = parseSettings(host) || parseSettings(root) || {};
    var opts = {
      loop: !!settings.loop,
      speed: settings.speed || 500,
      slidesPerView: settings.slidesPerView ? Number(settings.slidesPerView) || 1 : 1,
      spaceBetween: settings.spaceBetween != null ? Number(settings.spaceBetween) : 0,
      allowTouchMove: settings.allowTouchMove !== 'false' && settings.allowTouchMove !== false,
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
              disableOnInteraction: settings.autoplay.disableOnInteraction !== 'false',
            }
          : { delay: 3000 };
    }
    if (settings.pagination && settings.pagination.el) {
      var pagEl = document.querySelector(settings.pagination.el);
      if (pagEl) {
        opts.pagination = {
          el: pagEl,
          clickable: settings.pagination.clickable !== false,
        };
      }
    } else {
      var localPag = root.querySelector('.swiper-pagination') || host.querySelector('.swiper-pagination');
      if (localPag) opts.pagination = { el: localPag, clickable: true };
    }
    if (settings.navigation) {
      opts.navigation = {};
      if (settings.navigation.nextEl) opts.navigation.nextEl = settings.navigation.nextEl;
      if (settings.navigation.prevEl) opts.navigation.prevEl = settings.navigation.prevEl;
    }
    if (settings.breakpoints) opts.breakpoints = settings.breakpoints;

    try {
      root.__pixelSwiper = new window.Swiper(root, opts);
      return true;
    } catch (e) {
      console.warn('[pixel-swiper] init failed', e);
      return false;
    }
  }

  function run() {
    if (!window.Swiper) return;
    // Brand slider first with live-matched params
    document.querySelectorAll('.wcf--brand-slider-wrapper .swiper').forEach(function (root) {
      bootBrandSlider(root);
    });

    var hosts = document.querySelectorAll(
      '.arolax_testimonial_wrapper[data-settings], .arolax__testimonial-4[data-settings], .elementor-widget-wcf--slider, [data-settings*="pagination"]'
    );
    var n = 0;
    hosts.forEach(function (host) {
      if (isBrandSlider(host)) return;
      if (bootOne(host)) n++;
    });
    document.querySelectorAll('.swiper:not(.swiper-initialized)').forEach(function (root) {
      if (isBrandSlider(root)) return;
      var host = root.closest('[data-settings]') || root.parentElement;
      if (host && bootOne(host)) n++;
    });
    window.__PIXEL_SWIPER_COUNT = n;
  }

  function start() {
    run();
    setTimeout(run, 400);
    setTimeout(run, 1200);
    setTimeout(run, 2500);
  }

  if (window.__PIXEL_LIVE_JS_READY) start();
  else window.addEventListener('pixel-live-js-ready', start);
  window.addEventListener('load', function () {
    setTimeout(start, 200);
  });
})();
