/*! Pixel sticky header — own the behavior.
   Do NOT run Elementor's sticky handler (inset/--effects fight fixed + Lenis).
   Do NOT portal the header out of .elementor-17959 — that kills descendant CSS
   (nav links go bootstrap-dark). Keep header in-tree; page wrappers must not use
   transform/will-change:transform (see PageEnter / globals.css). */
(function () {
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
    if (!headers.length) return;

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
      return;
    }

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
