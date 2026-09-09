/*! Load real hCaptcha widget for visual parity (sitekey is public in scrape HTML).
   Falls back to size-matched stub if script fails / blocked.
   Never leave stub + iframe stacked (that doubles height vs live ~86px). */
(function () {
  if (window.__PIXEL_HCAPTCHA_BOOTED) return;
  window.__PIXEL_HCAPTCHA_BOOTED = true;

  var SITEKEY = 'f11a35a2-4886-4d72-b832-9ef2634232da';
  var STUB_HTML =
    '<div class="pixel-hcaptcha-stub" role="img" aria-label="hCaptcha">' +
    '<div class="pixel-hcaptcha-check" aria-hidden="true"></div>' +
    '<div class="pixel-hcaptcha-label">I am human</div>' +
    '<div class="pixel-hcaptcha-brand" aria-hidden="true">' +
    '<svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M15 2L28 9.5V22.5L15 30L2 22.5V9.5L15 2Z" stroke="#00A4DB" stroke-width="1.6"/>' +
    '<path d="M9 16.5L13 20.5L21 12" stroke="#00C7A0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>' +
    '<span>hCaptcha</span>' +
    '<span class="pixel-hcaptcha-links">Privacy - Terms</span>' +
    '</div>' +
    '</div>';

  function stripStub(host) {
    host.querySelectorAll('.pixel-hcaptcha-stub').forEach(function (s) {
      s.remove();
    });
  }

  function fillStub(el) {
    if (!el || el.querySelector('iframe') || el.querySelector('.pixel-hcaptcha-stub')) return;
    el.innerHTML = STUB_HTML;
  }

  function ensureWidget(box) {
    box.classList.add('pixel-hcaptcha-ready');
    var host = box.querySelector('.h-captcha') || box;
    if (host.querySelector('iframe')) {
      stripStub(host);
      return;
    }
    if (!host.getAttribute('data-sitekey')) host.setAttribute('data-sitekey', SITEKEY);
    if (window.hcaptcha && typeof window.hcaptcha.render === 'function') {
      try {
        if (!host.getAttribute('data-hcaptcha-widget-id')) {
          stripStub(host);
          // clear stub markup before render
          if (!host.querySelector('iframe')) {
            host.innerHTML = '';
          }
          var id = window.hcaptcha.render(host, { sitekey: SITEKEY, size: 'normal' });
          host.setAttribute('data-hcaptcha-widget-id', id);
        }
        stripStub(host);
        return;
      } catch (e) {}
    }
    fillStub(host);
  }

  function boot() {
    document.querySelectorAll('.wpforms-recaptcha-container.wpforms-is-hcaptcha').forEach(ensureWidget);
  }

  function loadApi() {
    if (document.querySelector('script[data-pixel-hcaptcha-api]')) {
      boot();
      return;
    }
    var s = document.createElement('script');
    s.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&onload=__pixelHcaptchaOnload';
    s.async = true;
    s.defer = true;
    s.dataset.pixelHcaptchaApi = '1';
    window.__pixelHcaptchaOnload = function () {
      boot();
    };
    s.onerror = function () {
      boot();
    };
    document.head.appendChild(s);
    // Reserve height with stub until API paints iframe
    boot();
    window.setTimeout(boot, 600);
    window.setTimeout(boot, 1500);
    window.setTimeout(boot, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadApi);
  } else {
    loadApi();
  }
})();
