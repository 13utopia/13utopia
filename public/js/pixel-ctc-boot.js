/*! Show Click-to-Chat FAB without the WP plugin JS (excluded from cascade). */
(function () {
  if (window.__PIXEL_CTC_BOOTED) return;
  window.__PIXEL_CTC_BOOTED = true;

  function isCaHost() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.hostname) {
        return window.location.hostname.toLowerCase().endsWith('.ca');
      }
    } catch (e) {}
    return false;
  }

  function settings() {
    var isCa = isCaHost();
    var defaultNum = isCa ? '14376039004' : '919924131397';
    var out = { number: defaultNum, pre_filled: '' };
    var data = document.querySelector('.ht_ctc_chat_data');
    if (!data) return out;
    try {
      var s = JSON.parse(
        (data.getAttribute('data-settings') || '{}')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&amp;/g, '&')
      );
      if (s.number) {
        // Enforce region domain rules over stale markup numbers
        if (isCa && String(s.number).includes('9924131397')) {
          out.number = '14376039004';
        } else if (!isCa && String(s.number).includes('4376039004')) {
          out.number = '919924131397';
        } else {
          out.number = String(s.number);
        }
      }
      if (s.pre_filled) out.pre_filled = String(s.pre_filled);
    } catch (e) {}
    return out;
  }

  function waUrl() {
    var isCa = typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname.toLowerCase().endsWith('.ca');
    var num = isCa ? '14376039004' : '919924131397';
    return 'https://api.whatsapp.com/send?phone=' + num;
  }

  function fixLogo(chat) {
    var img = chat.querySelector('img.own-img, img#style-99, img[alt="whatsapp-logo"]');
    if (!img) return;
    var src = img.getAttribute('src') || '';
    if (src.indexOf('/img/whatsapp-logo.svg') === 0) return;
    // Plugin path was removed from public/ — use local asset for visual parity
    img.setAttribute('src', '/img/whatsapp-logo.svg');
    img.removeAttribute('srcset');
    img.removeAttribute('data-src');
    img.removeAttribute('data-lazy-src');
  }

  function boot() {
    var chats = document.querySelectorAll('#ht-ctc-chat, .ht-ctc-chat');
    if (!chats.length) return;

    chats.forEach(function (chat, index) {
      if (index > 0) {
        chat.remove();
        return;
      }
      chat.style.setProperty('display', 'block', 'important');
      chat.style.setProperty('position', 'fixed', 'important');
      if (window.matchMedia && window.matchMedia('(max-width: 1024px)').matches) {
        chat.style.setProperty('left', '14px', 'important');
        chat.style.setProperty('right', 'auto', 'important');
        chat.style.setProperty('bottom', '18px', 'important');
        chat.style.setProperty('transform', 'none', 'important');
        chat.style.setProperty('transform-origin', 'bottom left', 'important');
      } else {
        chat.style.removeProperty('left');
        chat.style.setProperty('bottom', '50px', 'important');
        chat.style.setProperty('right', '20px', 'important');
      }
      chat.style.setProperty('z-index', '99999999', 'important');
      chat.style.setProperty('cursor', 'pointer', 'important');
      chat.style.setProperty('opacity', '1', 'important');
      chat.style.setProperty('visibility', 'visible', 'important');
      chat.style.setProperty('transform', 'none', 'important');
      chat.setAttribute('role', 'link');
      chat.setAttribute('aria-label', 'WhatsApp us');
      chat.setAttribute('title', 'WhatsApp us');
      fixLogo(chat);

      chat.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.open(waUrl(), '_blank', 'noopener,noreferrer');
      };
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.setTimeout(boot, 200);
  window.setTimeout(boot, 800);
  window.setTimeout(boot, 2000);
})();
