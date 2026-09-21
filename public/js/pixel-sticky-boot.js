/*! Pixel sticky header — own the behavior.
   Do NOT run Elementor's sticky handler (inset/--effects fight fixed + Lenis).
   Do NOT portal the header out of .elementor-17959 — that kills descendant CSS
   (nav links go bootstrap-dark). Keep header in-tree; page wrappers must not use
   transform/will-change:transform (see PageEnter / globals.css).
   v8: publish --pixel-header-h from the visible mobile bar so heroes clear it. */
(function () {
  if (window.__PIXEL_STICKY_BOOT_V15) return;
  window.__PIXEL_STICKY_BOOT_V15 = true;

  function parseSettings(el) {
    try {
      return JSON.parse((el.getAttribute('data-settings') || '{}').replace(/&quot;/g, '"'));
    } catch (e) {
      return {};
    }
  }

  function isDesktop() {
    return !(window.matchMedia && window.matchMedia('(max-width: 1024px)').matches);
  }

  function clearStickyFight(el) {
    if (!el) return;
    el.classList.remove('elementor-sticky__spacer', 'elementor-sticky--effects');
    el.style.removeProperty('inset');
    el.style.removeProperty('bottom');
    el.style.removeProperty('margin-top');
    el.style.removeProperty('margin-bottom');
    el.style.removeProperty('transform');
    el.style.removeProperty('transition');
    el.style.removeProperty('animation');
  }

  function pinHeader(el) {
    clearStickyFight(el);
    el.classList.add('elementor-sticky', 'elementor-sticky--active', 'pixel-header-pinned');
    el.classList.remove('elementor-sticky__spacer', 'pixel-header-ported');
    el.style.setProperty('position', 'fixed', 'important');
    el.style.setProperty('top', '0px', 'important');
    el.style.setProperty('left', '0px', 'important');
    el.style.setProperty('right', '0px', 'important');
    el.style.setProperty('bottom', 'auto', 'important');
    el.style.setProperty('inset', '0 auto auto 0', 'important');
    el.style.setProperty('width', '100%', 'important');
    el.style.setProperty('max-width', '100%', 'important');
    el.style.setProperty('z-index', '10000', 'important');
    el.style.setProperty('visibility', 'visible', 'important');
    el.style.setProperty('pointer-events', 'auto', 'important');
    // Kill transparent gradient so service text can't bleed through the nav
    el.style.setProperty('background-color', '#000000', 'important');
    el.style.setProperty('background-image', 'none', 'important');
  }

  function ensureSpacer(anchorParent, beforeNode, height) {
    var h = Math.max(Math.round(height) || 100, 80);
    var existing = document.querySelector('.pixel-sticky-spacer');
    if (!existing) {
      existing = document.createElement('div');
      existing.className = 'pixel-sticky-spacer';
      existing.setAttribute('aria-hidden', 'true');
    }
    existing.style.cssText =
      'display:block;width:100%;height:' +
      h +
      'px;visibility:hidden;pointer-events:none;margin:0;padding:0;border:0;flex-shrink:0;';
    if (anchorParent && existing.parentNode !== anchorParent) {
      if (beforeNode && beforeNode.parentNode === anchorParent) {
        anchorParent.insertBefore(existing, beforeNode);
      } else {
        anchorParent.insertBefore(existing, beforeNode || anchorParent.firstChild);
      }
    } else if (existing && height) {
      existing.style.height = h + 'px';
    }
    return existing;
  }

  function collectHeaders() {
    var headers = [...document.querySelectorAll('.elementor-element-01ec82b')];
    if (!headers.length) {
      document.querySelectorAll('.elementor-element[data-settings*="sticky"]').forEach(function (el) {
        var s = parseSettings(el);
        if (s.sticky === 'top') headers.push(el);
      });
    }
    return headers;
  }

  function ensureDesktopNav() {
    if (!(window.matchMedia && window.matchMedia('(min-width: 768px)').matches)) return;
    document.querySelectorAll('.wcf__nav-menu').forEach(function (nav) {
      nav.classList.add('desktop-menu-active');
      nav.classList.remove('mobile-menu-active');
    });
  }

  function centerServiceHeroes() {
    document
      .querySelectorAll(
        '.hero-section .elementor-image-carousel-wrapper.swiper, .hero-section .elementor-widget-image-carousel .swiper, .elementor-element-2fda67d .swiper'
      )
      .forEach(function (root) {
        var widget = root.closest('.elementor-widget, .elementor-element-2fda67d');
        if (widget) {
          widget.style.setProperty('display', 'flex', 'important');
          widget.style.setProperty('justify-content', 'center', 'important');
          widget.style.setProperty('width', '100%', 'important');
          widget.style.setProperty('margin-left', 'auto', 'important');
          widget.style.setProperty('margin-right', 'auto', 'important');
        }
        root.style.setProperty('margin-left', 'auto', 'important');
        root.style.setProperty('margin-right', 'auto', 'important');
        root.style.setProperty('float', 'none', 'important');
        if (root.swiper) {
          try {
            root.swiper.update();
          } catch (e) {}
        } else {
          var wrap = root.querySelector('.swiper-wrapper');
          if (wrap) wrap.style.transform = 'translate3d(0px, 0px, 0px)';
        }
      });
  }

  function publishMobileHeaderHeight() {
    var mobileBar = document.querySelector('.elementor-element-9e2c1c7');
    var hh = 64;
    if (mobileBar) {
      var rect = mobileBar.getBoundingClientRect();
      hh = Math.max(Math.round(rect.height) || 0, 52);
    }
    document.documentElement.style.setProperty('--pixel-header-h', hh + 'px');
  }

  function syncFooterAddress() {
    var isCa = false;
    try {
      if (typeof window !== 'undefined' && window.location && window.location.hostname) {
        isCa = window.location.hostname.toLowerCase().endsWith('.ca');
      }
    } catch (e) {}

    var caHtml = '<p><span class="LrzXr">30 Kimbercroft Ct, Scarborough, ON M1S 4K9, Canada (Markham Corners)</span></p>';
    var inHtml = '<p><span class="LrzXr">1123, Iconic Shyamal, Shyamal Cross Roads, 132 Feet Ring Rd, Ahmedabad, Gujarat 380015</span></p>';
    var targetAddressHtml = isCa ? caHtml : inHtml;

    var desktop = document.querySelector('.elementor-element-ef3e567 .wcf--text');
    var mobile = document.querySelector('.elementor-element-53ba325 .wcf--text');
    if (desktop) desktop.innerHTML = targetAddressHtml;
    if (mobile) mobile.innerHTML = targetAddressHtml;

    // Contact page specific widgets
    var contactCaHtml = '<p>30 Kimbercroft Ct, Markham Corners,</p><p>Scarborough, ON M1S 4K9, Canada</p>';
    var contactInHtml = '<p>1123, Iconic Shyamal, Shyamal Cross Roads,</p><p>132 Feet Ring Rd, Ahmedabad, Gujarat 380015</p>';
    var contactTargetHtml = isCa ? contactCaHtml : contactInHtml;

    document.querySelectorAll('.elementor-element-cac6b4e .desc, .elementor-element-dd475ba .desc').forEach(function (el) {
      el.innerHTML = contactTargetHtml;
    });

    var phoneText = isCa ? '+1 437-603-9004' : '+91 9924131397';
    var phoneRaw = isCa ? '+14376039004' : '+919924131397';
    var emailText = 'info@13utopia.com';

    document.querySelectorAll('.elementor-element-4f0c2c9e .elementor-icon-list-text, .elementor-element-687b393 .elementor-icon-list-text').forEach(function (el) {
      el.textContent = phoneText;
    });
    document.querySelectorAll('.elementor-element-4f0c2c9e a, .elementor-element-687b393 a').forEach(function (a) {
      a.setAttribute('href', 'tel:' + phoneRaw);
    });

    document.querySelectorAll('.elementor-element-4858f99f .elementor-icon-list-text, .elementor-element-0bea3e6 .elementor-icon-list-text').forEach(function (el) {
      el.textContent = emailText;
    });
    document.querySelectorAll('.elementor-element-4858f99f a, .elementor-element-0bea3e6 a').forEach(function (a) {
      a.setAttribute('href', 'mailto:' + emailText);
    });

    // Also update contact page contact info box
    var contactBoxDesc = document.querySelector('.elementor-element-c78e401 .desc');
    if (contactBoxDesc) {
      contactBoxDesc.innerHTML =
        '<p>Phone : <span style="color: #ffffff;"><a style="color: #ffffff;" href="tel:' +
        phoneRaw +
        '">' +
        phoneText +
        '</a></span></p><p>Mail : <span style="color: #ffffff;"><a style="color: #ffffff;" href="mailto:' +
        emailText +
        '">' +
        emailText +
        '</a></span></p>';
    }

    // Preloader veil failsafe: never let veil stay in hold mode
    var veil = document.getElementById('pixel-route-veil');
    if (veil && veil.getAttribute('data-mode') === 'hold') {
      veil.setAttribute('data-mode', 'reveal');
      window.setTimeout(function () {
        if (veil.getAttribute('data-mode') === 'reveal') {
          veil.setAttribute('data-mode', 'idle');
        }
      }, 700);
    }
    document.body.classList.remove('wcf-preloader-active', 'arolax-preloader-active');
    document.documentElement.classList.remove('wcf-preloader-active', 'arolax-preloader-active');
  }

  function fitHomeFirstViewport() {
    if (isDesktop()) return;
    var clients = document.querySelector('.elementor-element-8b1fffb');
    if (clients) clients.style.removeProperty('margin-top');
  }

  function killClientsGrey() {
    document
      .querySelectorAll('.elementor-element-99ab04e, .elementor-element-371f1f5, .elementor-element-49f74ea, .elementor-element-8b1fffb')
      .forEach(function (el) {
        el.style.setProperty('background', '#000000', 'important');
        el.style.setProperty('background-color', '#000000', 'important');
        el.style.setProperty('background-image', 'none', 'important');
      });
    document
      .querySelectorAll(
        '.elementor-element-8b1fffb > .elementor-motion-effects-container > .elementor-motion-effects-layer, .elementor-element-81f7890 > .elementor-motion-effects-container > .elementor-motion-effects-layer, .elementor-element-861127f > .elementor-motion-effects-container > .elementor-motion-effects-layer'
      )
      .forEach(function (layer) {
        layer.style.setProperty('background', 'transparent', 'important');
        layer.style.setProperty('background-color', 'transparent', 'important');
        layer.style.setProperty('background-image', 'none', 'important');
      });
    if (!isDesktop()) {
      document.querySelectorAll('.elementor-element-b913b7f, .elementor-element-2171108').forEach(function (el) {
        el.style.setProperty('display', 'none', 'important');
      });
    }
  }

  function run() {
    ensureDesktopNav();
    // Clean legacy portal leftovers from older sticky-boot versions
    document.querySelectorAll('.elementor-element-01ec82b.pixel-header-ported').forEach(function (el) {
      if (el.parentElement === document.body) el.remove();
    });
    document.querySelectorAll('.pixel-sticky-spacer').forEach(function (sp, i) {
      if (i > 0) sp.remove();
    });

    var headers = collectHeaders().filter(function (el) {
      return el.parentElement !== document.body;
    });
    if (!headers.length) {
      if (!isDesktop()) {
        publishMobileHeaderHeight();
        killClientsGrey();
        syncFooterAddress();
        centerServiceHeroes();
        fitHomeFirstViewport();
      }
      return;
    }

    if (!isDesktop()) {
      headers.forEach(function (el) {
        clearStickyFight(el);
        el.classList.remove('elementor-sticky--active', 'elementor-sticky', 'pixel-header-pinned');
        ['position', 'top', 'left', 'right', 'bottom', 'inset', 'width', 'z-index', 'visibility'].forEach(
          function (p) {
            el.style.removeProperty(p);
          }
        );
      });
      document.querySelectorAll('.pixel-sticky-spacer').forEach(function (sp) {
        sp.remove();
      });
      // Measure the compact mobile bar so hero padding clears logo + burger.
      publishMobileHeaderHeight();
      killClientsGrey();
      syncFooterAddress();
      centerServiceHeroes();
      fitHomeFirstViewport();
      return;
    }
    document.documentElement.style.removeProperty('--pixel-header-h');
    killClientsGrey();
    syncFooterAddress();

    var primary = headers[0];
    var h = Math.max(primary.getBoundingClientRect().height || 0, 100);
    ensureSpacer(primary.parentElement, primary, h);
    pinHeader(primary);

    headers.forEach(function (el, i) {
      if (i === 0) return;
      clearStickyFight(el);
      el.style.setProperty('display', 'none', 'important');
      el.setAttribute('aria-hidden', 'true');
    });

    var spacer = document.querySelector('.pixel-sticky-spacer');
    if (spacer) {
      var hh = Math.max(primary.getBoundingClientRect().height || 0, 100);
      spacer.style.height = hh + 'px';
    }
  }

  window.__PIXEL_STICKY_RUN = run;

  function schedule() {
    run();
    [120, 400, 900, 1800].forEach(function (ms) {
      window.setTimeout(run, ms);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
  window.addEventListener('pixel-live-js-ready', function () {
    window.setTimeout(run, 50);
    window.setTimeout(run, 500);
  });
  window.addEventListener('resize', function () {
    window.clearTimeout(window.__PIXEL_STICKY_RESIZE);
    window.__PIXEL_STICKY_RESIZE = window.setTimeout(run, 120);
  });

  var pending = false;
  window.addEventListener(
    'scroll',
    function () {
      if (pending || !isDesktop()) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        var el = document.querySelector('.elementor-element-01ec82b.pixel-header-pinned');
        if (!el) return;
        clearStickyFight(el);
        var top = el.getBoundingClientRect().top;
        if (Math.abs(top) > 1 || getComputedStyle(el).position !== 'fixed') pinHeader(el);
      });
    },
    { passive: true }
  );
})();
