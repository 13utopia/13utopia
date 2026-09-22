/*! Show Click-to-Chat FAB without the WP plugin JS (excluded from cascade). */
(function () {
  function isCaHost() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.hostname) {
        return window.location.hostname.toLowerCase().endsWith('.ca');
      }
    } catch (e) {}
    return false;
  }

  function waUrl() {
    var isCa = isCaHost();
    var num = isCa ? '14376039004' : '919924131397';
    return 'https://api.whatsapp.com/send?phone=' + num;
  }

  function fixLogo(chat) {
    var img = chat.querySelector('img.own-img, img#style-99, img[alt="whatsapp-logo"]');
    if (!img) return;
    var src = img.getAttribute('src') || '';
    if (src.indexOf('/img/whatsapp-logo.svg') === 0) return;
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
        e.stopImmediatePropagation();
        window.open(waUrl(), '_blank', 'noopener,noreferrer');
        return false;
      };
    });
  }

  window.__PIXEL_CTC_RUN = boot;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.setTimeout(boot, 100);
  window.setTimeout(boot, 500);
  window.setTimeout(boot, 1500);
})();
