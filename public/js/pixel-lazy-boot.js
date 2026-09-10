/*! Permanent image hydration for Elementor scrapes under Lenis.
   - Force eager load (native lazy + transform scroll = blank imgs)
   - Localize AirLift / bv paths
   - Retry zero-size / error loads
   - Mark .e-lazyloaded so Elementor stops stripping bg images
   - Unstick WCF starter-animation opacity:0 on image widgets
   Re-runnable: window.__PIXEL_LAZY_RUN() after SPA navigations. */
(function () {
  // Allow re-bind of runners across soft nav / HMR; only one observer set
  if (window.__PIXEL_LAZY_BOOT_V3) {
    // Still refresh runners in case an older mark() was left behind
  }
  window.__PIXEL_LAZY_BOOT_V3 = true;

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

  function promoteImg(img) {
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
      // data-srcset may be a full srcset string — take first URL if so
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

    // Lenis + loading=lazy leaves icons blank until a "real" scroll IO fires
    img.loading = 'eager';
    img.removeAttribute('loading');
    img.decoding = 'async';
    img.setAttribute('fetchpriority', img.getAttribute('fetchpriority') || 'auto');

    // Localize srcset entries too
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

    forceVisible(img);
    var wrap = img.closest('.wcf--image, .elementor-widget-wcf--image, .elementor-widget-image');
    if (wrap) unstickImageWidget(wrap.closest('.elementor-element') || wrap);

    // Retry blank / broken loads (race with SPA swap or aborted fetch)
    if (img.dataset.pixelImgBound === '1') return;
    img.dataset.pixelImgBound = '1';

    function retry(reason) {
      if (img.dataset.pixelImgRetried === '1') return;
      img.dataset.pixelImgRetried = '1';
      var s = localizeUpload(img.currentSrc || img.getAttribute('src') || '');
      if (!s || s.indexOf('data:') === 0) return;
      var bust = s + (s.indexOf('?') >= 0 ? '&' : '?') + 'pixel-retry=1';
      img.src = bust;
      if (typeof img.decode === 'function') {
        img.decode().catch(function () {});
      }
    }

    img.addEventListener('error', function () {
      retry('error');
    });

    if (img.complete && img.naturalWidth === 0 && (img.currentSrc || img.src)) {
      retry('zero');
    } else if (!img.complete && img.src) {
      // Soft nudge after settle — covers Lenis first-paint races
      window.setTimeout(function () {
        if (img.naturalWidth === 0 && img.isConnected) retry('timeout');
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

    document.querySelectorAll('img').forEach(promoteImg);

    // Background images that Elementor deferred via lazy class
    document.querySelectorAll('[style*="background"], .elementor-background-overlay').forEach(function (el) {
      // no-op placeholder — e-lazyloaded above restores Elementor bg rules
    });
  }

  window.__PIXEL_LAZY_RUN = mark;

  function start() {
    mark();
    window.setTimeout(mark, 200);
    window.setTimeout(mark, 800);
    window.setTimeout(mark, 2000);
    window.setTimeout(mark, 4500);
  }

  if (!window.__PIXEL_LAZY_OBSERVER) {
    try {
      var mo = new MutationObserver(function (mutations) {
        var need = false;
        for (var i = 0; i < mutations.length; i++) {
          var m = mutations[i];
          if (m.addedNodes && m.addedNodes.length) {
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
