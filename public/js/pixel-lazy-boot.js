/*! Permanent image hydration for Elementor scrapes under Lenis.
   v4: above-fold / critical = eager; below-fold = lazy + IO (no blank Lenis imgs).
   Re-runnable: window.__PIXEL_LAZY_RUN() after SPA navigations. */
(function () {
  window.__PIXEL_LAZY_BOOT_V4 = true;

  function localizeUpload(url) {
    if (!url || url.indexOf('data:') === 0) return url;
    var u = String(url).replace(/^https?:\/\/(www\.)?13utopia\.com/i, '');
    var al = u.match(
      /\/wp-content\/uploads\/al_opt_content\/IMAGE\/[^/]+\/wp-content\/uploads\/(.+?)(?:\?.*)?$/i
    );
    if (al) u = '/wp-content/uploads/' + al[1];
    return u.replace(/\.bv\.webp$/i, '.webp').split('?')[0];
  }

  function forceVisible(el) {
    if (!el || !el.style) return;
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('visibility', 'visible', 'important');
  }

  function unstickImageWidget(host) {
    if (!host) return;
    host.classList.add('wcf-animate', 'wcf-played', 'e-lazyloaded');
    forceVisible(host);
    var box = host.querySelector('.elementor-widget-container');
    if (box) forceVisible(box);
    host.querySelectorAll('.wcf--image, img, figure').forEach(forceVisible);
  }

  function isCritical(img) {
    if (!img) return false;
    if (img.getAttribute('fetchpriority') === 'high') return true;
    if (img.classList.contains('wp-image-8655')) return true; // site logo
    if (img.classList.contains('pixel-route-veil-logo')) return true;
    if (img.closest('.elementor-element-01ec82b, .elementor-element-9e2c1c7, .elementor-element-481a75a'))
      return true;
    // Home hero titles stage + first Zeus/god blocks
    if (
      img.closest(
        '.elementor-element-479c805, .elementor-element-4b3ef8a, .elementor-element-b23dc44, .elementor-element-f61769e, .elementor-element-e5f1a6a'
      )
    )
      return true;
    var r = img.getBoundingClientRect();
    var vh = window.innerHeight || 800;
    return r.top < vh * 1.35 && r.bottom > -80;
  }

  var io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          function (entries) {
            entries.forEach(function (en) {
              if (!en.isIntersecting) return;
              var img = en.target;
              io.unobserve(img);
              promoteImg(img, true);
            });
          },
          { rootMargin: '320px 0px', threshold: 0.01 }
        )
      : null;

  function promoteImg(img, forceEager) {
    if (!img || img.tagName !== 'IMG') return;

    var real =
      img.getAttribute('bv-data-large-src') ||
      img.getAttribute('bv-data-src') ||
      img.getAttribute('data-src') ||
      img.getAttribute('data-lazy-src') ||
      img.getAttribute('data-original') ||
      img.getAttribute('data-srcset');

    var cur = img.getAttribute('src') || '';

    if (real && real.indexOf('data:') !== 0) {
      var candidate = real.split(',')[0].trim().split(/\s+/)[0];
      img.src = localizeUpload(candidate);
      img.removeAttribute('bv-data-src');
      img.removeAttribute('bv-data-large-src');
      img.removeAttribute('data-src');
      img.removeAttribute('data-lazy-src');
      img.removeAttribute('data-original');
    } else if (cur.indexOf('al_opt_content') !== -1 || /^https?:\/\/(www\.)?13utopia\.com/i.test(cur)) {
      img.src = localizeUpload(cur);
    }

    var critical = forceEager || isCritical(img);
    if (critical) {
      img.loading = 'eager';
      img.removeAttribute('loading');
      if (!img.getAttribute('fetchpriority') && img.classList.contains('wp-image-8655')) {
        img.setAttribute('fetchpriority', 'high');
      }
    } else {
      img.loading = 'lazy';
      if (io && img.dataset.pixelIo !== '1') {
        img.dataset.pixelIo = '1';
        io.observe(img);
      }
    }

    img.decoding = 'async';

    var ss = img.getAttribute('srcset');
    if (ss && (ss.indexOf('al_opt_content') !== -1 || ss.indexOf('13utopia.com') !== -1)) {
      img.setAttribute(
        'srcset',
        ss
          .split(',')
          .map(function (part) {
            var bits = part.trim().split(/\s+/);
            bits[0] = localizeUpload(bits[0]);
            return bits.join(' ');
          })
          .join(', ')
      );
    }

    // Logo: never request 1536w for a ~200px header mark
    if (img.classList.contains('wp-image-8655')) {
      var logo = '/wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png';
      if ((img.getAttribute('src') || '').indexOf('1536x609') !== -1 || (img.getAttribute('src') || '').indexOf('13-utopia-logo-012.png') !== -1) {
        img.src = logo;
      }
      img.setAttribute('sizes', '(max-width: 768px) 48vw, 220px');
      img.width = 768;
      img.height = 305;
    }

    forceVisible(img);
    var wrap = img.closest('.wcf--image, .elementor-widget-wcf--image, .elementor-widget-image');
    if (wrap) unstickImageWidget(wrap.closest('.elementor-element') || wrap);

    if (img.dataset.pixelImgBound === '1') return;
    img.dataset.pixelImgBound = '1';

    function retry() {
      if (img.dataset.pixelImgRetried === '1') return;
      img.dataset.pixelImgRetried = '1';
      var s = localizeUpload(img.currentSrc || img.getAttribute('src') || '');
      if (!s || s.indexOf('data:') === 0) return;
      img.src = s + (s.indexOf('?') >= 0 ? '&' : '?') + 'pixel-retry=1';
      if (typeof img.decode === 'function') img.decode().catch(function () {});
    }

    img.addEventListener('error', retry);
    if (img.complete && img.naturalWidth === 0 && (img.currentSrc || img.src)) {
      retry();
    } else if (!img.complete && img.src && critical) {
      window.setTimeout(function () {
        if (img.naturalWidth === 0 && img.isConnected) retry();
      }, 1200);
    }
  }

  function mark() {
    document.querySelectorAll('.e-con:not(.e-lazyloaded)').forEach(function (el) {
      el.classList.add('e-lazyloaded');
    });
    document
      .querySelectorAll(
        '.elementor-widget-wcf--image, .elementor-widget-image, .elementor-widget-wcf--image-box-slider'
      )
      .forEach(unstickImageWidget);
    document.querySelectorAll('img').forEach(function (img) {
      promoteImg(img, false);
    });
  }

  window.__PIXEL_LAZY_RUN = mark;

  function start() {
    mark();
    window.setTimeout(mark, 200);
    window.setTimeout(mark, 800);
    window.setTimeout(mark, 2000);
  }

  if (!window.__PIXEL_LAZY_OBSERVER) {
    try {
      var mo = new MutationObserver(function (mutations) {
        var need = false;
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].addedNodes && mutations[i].addedNodes.length) {
            need = true;
            break;
          }
        }
        if (need) {
          window.clearTimeout(window.__PIXEL_LAZY_MO_T);
          window.__PIXEL_LAZY_MO_T = window.setTimeout(mark, 50);
        }
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      window.__PIXEL_LAZY_OBSERVER = mo;
    } catch (eMo) {}
  }

  if (!window.__PIXEL_LAZY_SCROLL_BOUND) {
    window.__PIXEL_LAZY_SCROLL_BOUND = true;
    var scrollMark = function () {
      window.clearTimeout(window.__PIXEL_LAZY_SCROLL_T);
      window.__PIXEL_LAZY_SCROLL_T = window.setTimeout(mark, 120);
    };
    window.addEventListener('scroll', scrollMark, { passive: true });
    window.addEventListener('pixel-live-js-ready', mark);
    window.addEventListener('lenis-ready', mark);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') mark();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  window.addEventListener('load', mark);
})();
