/**
 * pixel-menu-boot.js — Elementor mobile hamburger (fullscreen overlay).
 * Dropdown stays at max-height:0 + scaleY(0) and is clipped by header ancestors.
 * We reparent the panel to <body> while open so it truly covers the viewport.
 * Exposes __PIXEL_MENU_REBIND so SiteShell can reset after client navigations.
 * Supports safe version reload via AbortController (no duplicate listeners).
 */
(function () {
  if (typeof window === 'undefined') return;

  var OPEN = 'utopia-menu-open';
  var placeholder = null;
  var homeParent = null;
  var lastTouch = 0;
  var ac = null;

  if (typeof window.__PIXEL_MENU_UNBIND === 'function') {
    try {
      window.__PIXEL_MENU_UNBIND();
    } catch (e) {
      /* ignore */
    }
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function dropdownFor(toggle) {
    if (!toggle) return null;
    var next = toggle.nextElementSibling;
    if (
      next &&
      next.matches &&
      next.matches('nav.elementor-nav-menu--dropdown.elementor-nav-menu__container')
    ) {
      return next;
    }
    var widget = toggle.closest('.elementor-widget-nav-menu');
    if (widget) {
      var drop = widget.querySelector(
        'nav.elementor-nav-menu--dropdown.elementor-nav-menu__container'
      );
      if (drop) return drop;
    }
    var header = toggle.closest(
      '.elementor-element-9e2c1c7, .elementor-location-header, header, .elementor-6033, .elementor-1386'
    );
    return header
      ? header.querySelector('nav.elementor-nav-menu--dropdown.elementor-nav-menu__container')
      : null;
  }

  function applyOpenStyles(drop, open) {
    if (!drop) return;
    if (open) {
      drop.style.cssText =
        'display:block!important;position:fixed!important;inset:0!important;' +
        'width:100vw!important;height:100dvh!important;max-height:100dvh!important;' +
        'min-height:100dvh!important;transform:none!important;opacity:1!important;' +
        'visibility:visible!important;pointer-events:auto!important;overflow-y:auto!important;' +
        'background:#000!important;z-index:200000!important;padding:96px 28px 48px!important;' +
        'margin:0!important;border:0!important;border-radius:0!important;';
    } else {
      drop.style.cssText = '';
    }
  }

  function parkInBody(drop) {
    if (!drop || drop.parentElement === document.body) return;
    homeParent = drop.parentElement;
    placeholder = document.createComment('pixel-menu-home');
    homeParent.insertBefore(placeholder, drop);
    document.body.appendChild(drop);
  }

  function restoreHome(drop) {
    if (!drop || !placeholder || !placeholder.parentNode) return;
    placeholder.parentNode.insertBefore(drop, placeholder);
    placeholder.parentNode.removeChild(placeholder);
    placeholder = null;
    homeParent = null;
  }

  function findToggles() {
    var toggles = qsa('.elementor-element-9e2c1c7 .elementor-menu-toggle');
    if (!toggles.length) toggles = qsa('.elementor-location-header .elementor-menu-toggle');
    if (!toggles.length) toggles = qsa('.elementor-6033 .elementor-menu-toggle');
    if (!toggles.length) toggles = qsa('.elementor-menu-toggle');
    return toggles.filter(function (btn) {
      var style = window.getComputedStyle(btn);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }

  function cleanupOrphans(keep) {
    qsa('body > nav.elementor-nav-menu--dropdown').forEach(function (orphan) {
      if (keep && orphan === keep) return;
      applyOpenStyles(orphan, false);
      orphan.classList.remove('elementor-active', 'utopia-nav-open');
      orphan.setAttribute('aria-hidden', 'true');
      orphan.style.cssText =
        'display:none!important;max-height:0!important;pointer-events:none!important;visibility:hidden!important;';
    });
  }

  function setOpen(open) {
    var toggles = findToggles();
    var drop = null;
    for (var i = 0; i < toggles.length; i++) {
      drop = dropdownFor(toggles[i]);
      if (drop) break;
    }
    if (!drop && open) {
      drop = document.querySelector(
        '.elementor-element-9e2c1c7 nav.elementor-nav-menu--dropdown, ' +
          '.elementor-6033 nav.elementor-nav-menu--dropdown, ' +
          'nav.elementor-nav-menu--dropdown.elementor-nav-menu__container'
      );
    }

    toggles.forEach(function (btn) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.classList.toggle('elementor-active', open);
    });

    if (drop) {
      drop.setAttribute('aria-hidden', open ? 'false' : 'true');
      drop.classList.toggle('elementor-active', open);
      drop.classList.toggle('utopia-nav-open', open);
      if (open) {
        parkInBody(drop);
        applyOpenStyles(drop, true);
      } else {
        applyOpenStyles(drop, false);
        restoreHome(drop);
      }
    }

    cleanupOrphans(open ? drop : null);

    document.body.classList.toggle(OPEN, open);
    document.documentElement.classList.toggle(OPEN, open);
  }

  function isOpen() {
    return document.body.classList.contains(OPEN);
  }

  function onToggle(e) {
    var btn = e.target.closest && e.target.closest('.elementor-menu-toggle');
    if (!btn) return;
    if (window.innerWidth > 1024) return;
    if (e.type === 'touchend') {
      lastTouch = Date.now();
    } else if (Date.now() - lastTouch < 550) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    setOpen(!isOpen());
  }

  function onNavLink(e) {
    if (!isOpen()) return;
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    if (!a.closest('nav.elementor-nav-menu--dropdown')) return;

    var parent = a.closest('.menu-item-has-children');
    if (
      parent &&
      a.parentElement === parent &&
      (a.getAttribute('href') === '#' || a.classList.contains('elementor-item-anchor'))
    ) {
      e.preventDefault();
      e.stopPropagation();
      parent.classList.toggle('utopia-dropdown-open');
      return;
    }
    if (!a.classList.contains('elementor-item-anchor') && a.getAttribute('href') !== '#') {
      setOpen(false);
    }
  }

  function onKey(e) {
    if (e.key === 'Escape' && isOpen()) setOpen(false);
  }

  function unbind() {
    if (ac) {
      ac.abort();
      ac = null;
    }
    setOpen(false);
  }

  function bind() {
    unbind();
    ac = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var opts = ac ? { capture: true, signal: ac.signal } : true;
    var touchOpts = ac
      ? { capture: true, passive: false, signal: ac.signal }
      : { capture: true, passive: false };
    document.addEventListener('click', onToggle, opts);
    document.addEventListener('touchend', onToggle, touchOpts);
    document.addEventListener('click', onNavLink, opts);
    document.addEventListener('keydown', onKey, opts);
  }

  function rebind() {
    bind();
    setOpen(false);
  }

  window.__PIXEL_MENU_BOOT__ = true;
  window.__PIXEL_MENU_UNBIND = unbind;
  window.__PIXEL_MENU_REBIND = rebind;
  window.__PIXEL_MENU_SET_OPEN = setOpen;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rebind, { once: true });
  } else {
    rebind();
  }

  window.addEventListener('popstate', function () {
    setOpen(false);
  });
})();
