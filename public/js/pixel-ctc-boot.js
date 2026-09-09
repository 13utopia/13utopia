/*! Show Click-to-Chat FAB without the WP plugin JS (excluded from cascade). */
(function () {
  if (window.__PIXEL_CTC_BOOTED) return;
  window.__PIXEL_CTC_BOOTED = true;

  function settings() {
    var data = document.querySelector('.ht_ctc_chat_data');
    var out = { number: '919924131397', pre_filled: '' };
    if (!data) return out;
    try {
      var s = JSON.parse(data.getAttribute('data-settings') || '{}');
      if (s.number) out.number = String(s.number);
      if (s.pre_filled) out.pre_filled = String(s.pre_filled);
    } catch (e) {}
    return out;
  }

  function waUrl() {
    var s = settings();
    var url = 'https://api.whatsapp.com/send?phone=' + encodeURIComponent(s.number);
    if (s.pre_filled) url += '&text=' + encodeURIComponent(s.pre_filled);
    return url;
  }

  function boot() {
    var chat = document.getElementById('ht-ctc-chat');
    if (!chat) return;

    chat.style.setProperty('display', 'block', 'important');
    chat.style.setProperty('position', 'fixed', 'important');
    chat.style.setProperty('bottom', '50px', 'important');
    chat.style.setProperty('right', '20px', 'important');
    chat.style.setProperty('z-index', '99999999', 'important');
    chat.style.setProperty('cursor', 'pointer', 'important');
    chat.style.setProperty('opacity', '1', 'important');
    chat.style.setProperty('visibility', 'visible', 'important');
    chat.style.setProperty('transform', 'none', 'important');
    chat.setAttribute('role', 'link');
    chat.setAttribute('aria-label', 'WhatsApp us');
    chat.setAttribute('title', 'WhatsApp us');

    if (chat.dataset.pixelCtcBound === '1') return;
    chat.dataset.pixelCtcBound = '1';
    chat.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.open(waUrl(), '_blank', 'noopener,noreferrer');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.setTimeout(boot, 400);
  window.setTimeout(boot, 1500);
})();
