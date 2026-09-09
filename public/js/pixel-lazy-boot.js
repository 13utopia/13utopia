/*! Mark Elementor containers lazy-loaded so bg images aren't stripped
   (live Elementor JS adds .e-lazyloaded on scroll).
   Also promote lazy imgs so offscreen brand logos don't stay unloaded. */
(function () {
  if (window.__PIXEL_LAZY_BOOTED) return;
  window.__PIXEL_LAZY_BOOTED = true;

  function mark() {
    document.querySelectorAll('.e-con.e-parent:not(.e-lazyloaded)').forEach(function (el) {
      el.classList.add('e-lazyloaded');
    });
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      img.loading = 'eager';
      img.removeAttribute('loading');
      if (!img.complete) {
        var s = img.getAttribute('src');
        if (s) img.src = s;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mark);
  } else {
    mark();
  }
  window.setTimeout(mark, 300);
  window.setTimeout(mark, 1500);
  window.addEventListener('load', mark);
})();
