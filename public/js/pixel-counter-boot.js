/*! Animate WCF counters when Elementor hooks fail / SPA remounts.
   Re-runnable: window.__PIXEL_COUNTER_RUN() — never resets in-flight counters. */
(function () {
  function toNum(v) {
    var n = parseFloat(String(v).replace(/,/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function animate(el, to, duration) {
    var from = toNum(el.getAttribute('data-from-value') || 0);
    var start = performance.now();
    var dur = Math.max(400, toNum(duration) || 2000);
    function frame(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = String(to);
    }
    requestAnimationFrame(frame);
  }

  function runOne(el) {
    if (!el || el.dataset.pixelCounted === '1') return;
    // Skip zero-size / display:none counters (duplicate Elementor responsive clones)
    var box = el.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;
    el.dataset.pixelCounted = '1';
    var to = toNum(el.getAttribute('data-to-value'));
    var from = toNum(el.getAttribute('data-from-value') || 0);
    var duration = el.getAttribute('data-duration') || 2000;
    el.textContent = String(from);
    // Skip jQuery.numerator — live WP plugin is often present but a no-op in SPA,
    // which left homepage counters stuck at 0. Our rAF animate is reliable.
    animate(el, to, duration);
  }

  var io = null;

  function boot() {
    var nodes = document.querySelectorAll('.wcf--counter-number[data-to-value]');
    if (!nodes.length) return;

    // Only touch NEW nodes — never rewind an in-flight / finished counter
    var pending = [];
    nodes.forEach(function (el) {
      if (el.dataset.pixelCounted === '1') return;
      var from = toNum(el.getAttribute('data-from-value') || 0);
      el.textContent = String(from);
      pending.push(el);
    });
    if (!pending.length) return;

    if (io) {
      try {
        io.disconnect();
      } catch (e) {}
      io = null;
    }

    if (!('IntersectionObserver' in window)) {
      pending.forEach(runOne);
      return;
    }

    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runOne(entry.target);
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: '0px 0px -5% 0px', threshold: 0.12 }
    );

    pending.forEach(function (el) {
      io.observe(el);
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 60) {
        runOne(el);
        try {
          io.unobserve(el);
        } catch (e) {}
      }
    });
  }

  window.__PIXEL_COUNTER_RUN = boot;

  function schedule() {
    boot();
    [600, 1600].forEach(function (ms) {
      window.setTimeout(boot, ms);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
  window.addEventListener('pixel-live-js-ready', function () {
    window.setTimeout(boot, 250);
    window.setTimeout(boot, 1000);
  });
})();
