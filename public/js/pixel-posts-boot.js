/**
 * Elementor Posts widget adds .elementor-has-item-ratio via frontend JS.
 * Without it, thumbnail padding-bottom ratio CSS doesn't absolute-position images.
 */
(function () {
  function apply() {
    document.querySelectorAll('.elementor-posts-container.elementor-grid').forEach((el) => {
      el.classList.add('elementor-has-item-ratio');
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
  window.addEventListener('load', apply);
  setTimeout(apply, 400);
  setTimeout(apply, 1200);
})();
