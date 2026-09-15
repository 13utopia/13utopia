/**
 * pixel-menu-boot.js — Elementor mobile hamburger (fullscreen overlay).
 * Dropdown stays at max-height:0 + scaleY(0) and is clipped by header ancestors.
 * We reparent the panel to <body> while open so it truly covers the viewport.
 */
(function () {
  if (typeof window === 'undefined' || window.__PIXEL_MENU_BOOT__) return;
  window.__PIXEL_MENU_BOOT__ = true;

  var OPEN = 'utopia-menu-open';
  var placeholder = null;
  var homeParent = null;

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
    return widget
      ? widget.querySelector('nav.elementor-nav-menu--dropdown.elementor-nav-menu__container')
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
        'background:#000!important;z-index:200000!important;padding:96px 24px 48px!important;' +
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

  function setOpen(open) {
    var toggles = qsa('.elementor-element-9e2c1c7 .elementor-menu-toggle');
    if (!toggles.length) toggles = qsa('.ehf-header .elementor-menu-toggle');

    toggles.forEach(function (btn) {
      var drop = dropdownFor(btn);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.classList.toggle('elementor-active', open);
      if (!drop) return;
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
    });

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

  function bind() {
    document.addEventListener('click', onToggle, true);
    document.addEventListener('click', onNavLink, true);
    document.addEventListener('keydown', onKey, true);
    setOpen(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  window.addEventListener('popstate', function () {
    setOpen(false);
  });
})();
