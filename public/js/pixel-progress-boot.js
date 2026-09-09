/*! Animate Elementor progress bars on scroll. Re-runnable; never rewinds in-flight. */
(function () {
  function animateBar(bar) {
    if (!bar || bar.dataset.pixelProgressed === '1') return;
    bar.dataset.pixelProgressed = '1';
    var max = parseFloat(bar.getAttribute('data-max') || '0');
    if (!max) return;
    bar.style.transition = 'width 1.1s cubic-bezier(0.22, 1, 0.36, 1)';
    bar.style.width = '0%';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bar.style.width = max + '%';
      });
    });
  }

  var io = null;

  function boot() {
    var bars = document.querySelectorAll('.elementor-progress-bar[data-max]');
    if (!bars.length) return;

    var pending = [];
    bars.forEach(function (bar) {
      if (bar.dataset.pixelProgressed === '1') return;
      bar.style.width = '0%';
      pending.push(bar);
    });
    if (!pending.length) return;

    if (io) {
      try {
        io.disconnect();
      } catch (e) {}
      io = null;
    }

    if (!('IntersectionObserver' in window)) {
      pending.forEach(animateBar);
      return;
    }

    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateBar(entry.target);
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.15 }
    );

    pending.forEach(function (bar) {
      io.observe(bar);
      var r = bar.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 60) {
        animateBar(bar);
        try {
          io.unobserve(bar);
        } catch (e) {}
      }
    });
  }

  window.__PIXEL_PROGRESS_RUN = boot;

  function schedule() {
    boot();
    [700, 1800].forEach(function (ms) {
      window.setTimeout(boot, ms);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
  window.addEventListener('pixel-live-js-ready', function () {
    window.setTimeout(boot, 300);
  });
})();
