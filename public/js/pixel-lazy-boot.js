/*! Mark Elementor containers lazy-loaded so bg images aren't stripped
   (live Elementor JS adds .e-lazyloaded on scroll).
   Promote data-src / lazy attrs so images don't stay blank.
   Re-runnable: window.__PIXEL_LAZY_RUN() after SPA navigations. */
(function () {
  if (window.__PIXEL_LAZY_BOOT_V2) return;
  window.__PIXEL_LAZY_BOOT_V2 = true;

  function localizeUpload(url) {
    if (!url || url.indexOf('data:') === 0) return url;
    var u = String(url).replace(/^https?:\/\/(www\.)?13utopia\.com/i, '');
    var al = u.match(
      /\/wp-content\/uploads\/al_opt_content\/IMAGE\/[^/]+\/wp-content\/uploads\/(.+?)(?:\?.*)?$/i
    );
    if (al) u = '/wp-content/uploads/' + al[1];
    return u.replace(/\.bv\.webp$/i, '.webp').split('?')[0];
  }

  function promoteImg(img) {
    if (!img || img.tagName !== 'IMG') return;
    var real =
      img.getAttribute('bv-data-large-src') ||
      img.getAttribute('bv-data-src') ||
      img.getAttribute('data-src') ||
      img.getAttribute('data-lazy-src') ||
      img.getAttribute('data-original');
    var cur = img.getAttribute('src') || '';
    if (real && real.indexOf('data:') !== 0) {
      img.src = localizeUpload(real);
      img.removeAttribute('bv-data-src');
      img.removeAttribute('bv-data-large-src');
      img.removeAttribute('data-src');
      img.removeAttribute('data-lazy-src');
      img.removeAttribute('data-original');
    } else if (cur.indexOf('al_opt_content') !== -1) {
      img.src = localizeUpload(cur);
    }
    if (img.getAttribute('loading') === 'lazy') {
      img.loading = 'eager';
      img.removeAttribute('loading');
    }
    // Force decode retry for failed/zero-size images once
    if (img.dataset.pixelImgRetry !== '1' && img.complete && img.naturalWidth === 0 && img.src) {
      img.dataset.pixelImgRetry = '1';
      var s = img.src;
      img.addEventListener(
        'error',
        function () {
          if (img.dataset.pixelImgRetried === '1') return;
          img.dataset.pixelImgRetried = '1';
          var bust = s + (s.indexOf('?') >= 0 ? '&' : '?') + 'pixel-retry=1';
          img.src = bust;
        },
        { once: true }
      );
      // Soft nudge: re-assign src to retrigger load if browser aborted
      if (!img.currentSrc) img.src = s;
    }
  }

  function mark() {
    document.querySelectorAll('.e-con.e-parent:not(.e-lazyloaded)').forEach(function (el) {
      el.classList.add('e-lazyloaded');
    });
    // Also mark nested containers that Elementor treats as lazy bg hosts
    document.querySelectorAll('.e-con:not(.e-lazyloaded)').forEach(function (el) {
      el.classList.add('e-lazyloaded');
    });
    document.querySelectorAll('img').forEach(promoteImg);

    // Background images stored as inline CSS vars / Elementor bg
    document.querySelectorAll('[data-settings*="background_image"], .elementor-background-overlay').forEach(
      function () {}
    );
  }

  window.__PIXEL_LAZY_RUN = mark;

  function start() {
    mark();
    window.setTimeout(mark, 300);
    window.setTimeout(mark, 1500);
    window.setTimeout(mark, 3500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  window.addEventListener('load', mark);
  window.addEventListener('pixel-live-js-ready', mark);
})();
