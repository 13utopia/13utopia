/*! live-js-loader — sequential Elementor/WCF stack for pixel pages */
(function () {
  if (window.__PIXEL_LIVE_JS_LOADING || window.__PIXEL_LIVE_JS_READY) return;
  window.__PIXEL_LIVE_JS_LOADING = true;

  var steps = [{"type":"inline","code":"window.wp = window.wp || {};\nwindow.wp.hooks = window.wp.hooks || {\n  addAction: function(){}, addFilter: function(){}, doAction: function(){}, applyFilters: function(n,v){return v;},\n  removeAction: function(){}, removeFilter: function(){}, hasAction: function(){return false;}, hasFilter: function(){return false;}\n};\nwindow.wp.i18n = window.wp.i18n || {\n  __: function(s){return s;}, _x: function(s){return s;}, _n: function(s){return s;},\n  setLocaleData: function(){}, sprintf: function(s){return s;}\n};\nwindow._wpUtilSettings = window._wpUtilSettings || { ajax: { url: '/api/noop-ajax' } };","id":"pixel-wp-stubs"},{"type":"src","href":"/js/live-cascade/001-jquery.min.js","id":"jquery-core-js"},{"type":"src","href":"/js/live-cascade/002-jquery-migrate.min.js","id":"jquery-migrate-js"},{"type":"inline","code":"var WCF_ADDONS_JS = {\"ajaxUrl\":\"/api/noop-ajax\",\"_wpnonce\":\"deb6ea4e1b\",\"post_id\":\"16636\",\"i18n\":{\"okay\":\"Okay\",\"cancel\":\"Cancel\",\"submit\":\"Submit\",\"success\":\"Success\",\"warning\":\"Warning\"},\"smoothScroller\":null,\"mode\":\"\",\"elementor_breakpoint\":{\"laptop\":1366,\"tablet\":1024,\"mobile\":767,\"desktop\":1400}};\n//# sourceURL=wcf--addons-js-extra","id":"wcf--addons-js-extra"},{"type":"src","href":"/js/live-cascade/004-wcf-addons.min.js","id":"wcf--addons-js"},{"type":"inline","code":"( () => {\n\t\t\t\t\tconst lazyloadRunObserver = () => {\n\t\t\t\t\t\tconst lazyloadBackgrounds = document.querySelectorAll( `.e-con.e-parent:not(.e-lazyloaded)` );\n\t\t\t\t\t\tconst lazyloadBackgroundObserver = new IntersectionObserver( ( entries ) => {\n\t\t\t\t\t\t\tentries.forEach( ( entry ) => {\n\t\t\t\t\t\t\t\tif ( entry.isIntersecting ) {\n\t\t\t\t\t\t\t\t\tlet lazyloadBackground = entry.target;\n\t\t\t\t\t\t\t\t\tif( lazyloadBackground ) {\n\t\t\t\t\t\t\t\t\t\tlazyloadBackground.classList.add( 'e-lazyloaded' );\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tlazyloadBackgroundObserver.unobserve( entry.target );\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t}, { rootMargin: '200px 0px 200px 0px' } );\n\t\t\t\t\t\tlazyloadBackgrounds.forEach( ( lazyloadBackground ) => {\n\t\t\t\t\t\t\tlazyloadBackgroundObserver.observe( lazyloadBackground );\n\t\t\t\t\t\t} );\n\t\t\t\t\t};\n\t\t\t\t\tconst events = [\n\t\t\t\t\t\t'DOMContentLoaded',\n\t\t\t\t\t\t'elementor/lazyload/observe',\n\t\t\t\t\t];\n\t\t\t\t\tevents.forEach( ( event ) => {\n\t\t\t\t\t\tdocument.addEventListener( event, lazyloadRunObserver );\n\t\t\t\t\t} );\n\t\t\t\t} )();","id":"inline-24"},{"type":"inline","code":"(function () {\n\t\t\tvar c = document.body.className;\n\t\t\tc = c.replace(/woocommerce-no-js/, 'woocommerce-js');\n\t\t\tdocument.body.className = c;\n\t\t})();","id":"inline-26"},{"type":"src","href":"/js/live-cascade/007-starter-animations.js","id":"aae-starter-animations-js"},{"type":"inline","code":"var AROLAX_ADDONS_JS = {\"ajaxUrl\":\"/api/noop-ajax\",\"_wpnonce\":\"9dffa61272\"};\n//# sourceURL=arolax-essential--global-core-js-extra","id":"arolax-essential--global-core-js-extra"},{"type":"src","href":"/js/live-cascade/009-wcf--global-core.min.js","id":"arolax-essential--global-core-js"},{"type":"src","href":"/js/live-cascade/010-webpack.runtime.min.js","id":"elementor-webpack-runtime-js"},{"type":"src","href":"/js/live-cascade/011-frontend-modules.min.js","id":"elementor-frontend-modules-js"},{"type":"inline","code":"jQuery.uiBackCompat = true;\n//# sourceURL=jquery-ui-core-js-before","id":"jquery-ui-core-js-before"},{"type":"src","href":"/js/live-cascade/013-core.min.js","id":"jquery-ui-core-js"},{"type":"inline","code":"var elementorFrontendConfig = {\"environmentMode\":{\"edit\":false,\"wpPreview\":false,\"isScriptDebug\":false},\"i18n\":{\"shareOnFacebook\":\"Share on Facebook\",\"shareOnX\":\"Share on X\",\"pinIt\":\"Pin it\",\"download\":\"Download\",\"downloadImage\":\"Download image\",\"fullscreen\":\"Fullscreen\",\"zoom\":\"Zoom\",\"share\":\"Share\",\"playVideo\":\"Play Video\",\"previous\":\"Previous\",\"next\":\"Next\",\"close\":\"Close\",\"a11yCarouselPrevSlideMessage\":\"Previous slide\",\"a11yCarouselNextSlideMessage\":\"Next slide\",\"a11yCarouselFirstSlideMessage\":\"This is the first slide\",\"a11yCarouselLastSlideMessage\":\"This is the last slide\",\"a11yCarouselPaginationBulletMessage\":\"Go to slide\"},\"is_rtl\":false,\"breakpoints\":{\"xs\":0,\"sm\":480,\"md\":768,\"lg\":1025,\"xl\":1440,\"xxl\":1600},\"responsive\":{\"breakpoints\":{\"mobile\":{\"label\":\"Mobile Portrait\",\"value\":767,\"default_value\":767,\"direction\":\"max\",\"is_enabled\":true},\"mobile_extra\":{\"label\":\"Mobile Landscape\",\"value\":880,\"default_value\":880,\"direction\":\"max\",\"is_enabled\":true},\"tablet\":{\"label\":\"Tablet Portrait\",\"value\":1024,\"default_value\":1024,\"direction\":\"max\",\"is_enabled\":true},\"tablet_extra\":{\"label\":\"Tablet Landscape\",\"value\":1200,\"default_value\":1200,\"direction\":\"max\",\"is_enabled\":true},\"laptop\":{\"label\":\"Laptop\",\"value\":1366,\"default_value\":1366,\"direction\":\"max\",\"is_enabled\":true},\"widescreen\":{\"label\":\"Widescreen\",\"value\":2400,\"default_value\":2400,\"direction\":\"min\",\"is_enabled\":true}},\"hasCustomBreakpoints\":true},\"version\":\"4.2.3\",\"is_static\":false,\"experimentalFeatures\":{\"e_font_icon_svg\":true,\"additional_custom_breakpoints\":true,\"container\":true,\"e_panel_promotions\":true,\"theme_builder_v2\":true,\"nested-elements\":true,\"global_classes_should_enforce_capabilities\":true,\"e_variables\":true,\"e_opt_in_v4_page\":true,\"e_components\":true,\"e_interactions\":true,\"e_widget_creation\":true,\"import-export-customization\":true,\"e_pro_variables\":true},\"urls\":{\"assets\":\"https:\\/\\/13utopia.com\\/wp-content\\/plugins\\/elementor\\/assets\\/\",\"ajaxUrl\":\"/api/noop-ajax\",\"uploadUrl\":\"https:\\/\\/13utopia.com\\/wp-content\\/uploads\"},\"nonces\":{\"floatingButtonsClickTracking\":\"ef2b41aa9c\",\"atomicFormsSendForm\":\"a159edfffb\"},\"swiperClass\":\"swiper\",\"settings\":{\"page\":[],\"editorPreferences\":[]},\"kit\":{\"active_breakpoints\":[\"viewport_mobile\",\"viewport_mobile_extra\",\"viewport_tablet\",\"viewport_tablet_extra\",\"viewport_laptop\",\"viewport_widescreen\"],\"wcf_enable_preloader\":\"yes\",\"global_image_lightbox\":\"yes\",\"lightbox_enable_counter\":\"yes\",\"lightbox_enable_fullscreen\":\"yes\",\"lightbox_enable_zoom\":\"yes\",\"lightbox_enable_share\":\"yes\",\"lightbox_title_src\":\"title\",\"lightbox_description_src\":\"description\",\"woocommerce_notices_elements\":[],\"wcf_enable_cursor\":\"yes\",\"wcf_cursor_breakpoint\":\"mobile\"},\"post\":{\"id\":16636,\"title\":\"13%20UTOPiA%20%E2%80%94%20Digital%20Marketing%2C%20SEO%20%26%20Web%20Development%20in%20Ahmedabad\",\"excerpt\":\"\",\"featuredImage\":false}};\n//# sourceURL=elementor-frontend-js-before","id":"elementor-frontend-js-before"},{"type":"src","href":"/js/live-cascade/015-frontend.min.js","id":"elementor-frontend-js"},{"type":"src","href":"/js/live-cascade/016-swiper.min.js","id":"swiper-js"},{"type":"src","href":"/js/live-cascade/017-wcf-addons-pro.js","id":"wcf--addons-pro-js"},{"type":"src","href":"/js/live-cascade/018-bootstrap.bundle.min.js","id":"bootstrap-js"},{"type":"src","href":"/js/live-cascade/019-jquery.meanmenu.min.js","id":"meanmenu-js"},{"type":"src","href":"/js/live-cascade/020-jquery.magnific-popup.min.js","id":"magnific-popup-js"},{"type":"inline","code":"var arolax_obj = {\"ajax_url\":\"/api/noop-ajax\",\"cart_update_qty_change\":\"\"};\n//# sourceURL=arolax-script-js-extra","id":"arolax-script-js-extra"},{"type":"src","href":"/js/live-cascade/022-script.js","id":"arolax-script-js"},{"type":"src","href":"/js/live-cascade/023-slider.min.js","id":"wcf--slider-js"},{"type":"src","href":"/js/live-cascade/024-jquery-numerator.min.js","id":"jquery-numerator-js"},{"type":"src","href":"/js/live-cascade/025-counter.min.js","id":"wcf--counter-js"},{"type":"src","href":"/js/live-cascade/026-toggle-switch.min.js","id":"aae--switcher-toggle-js"},{"type":"src","href":"/js/live-cascade/027-jquery.smartmenus.min.js","id":"smartmenus-js"},{"type":"src","href":"/js/live-cascade/028-nav-menu.min.js","id":"wcf--nav-menu-js"},{"type":"src","href":"/js/live-cascade/029-jquery.sticky.min.js","id":"e-sticky-js"},{"type":"src","href":"/js/live-cascade/030-arolax-testimonial.js","id":"arolax-testimonial-js"},{"type":"src","href":"/js/live-cascade/031-webpack-pro.runtime.min.js","id":"elementor-pro-webpack-runtime-js"},{"type":"src","href":"/js/live-cascade/032-hooks.min.js","id":"wp-hooks-js"},{"type":"src","href":"/js/live-cascade/033-i18n.min.js","id":"wp-i18n-js"},{"type":"inline","code":"wp.i18n.setLocaleData( { 'text direction\\u0004ltr': [ 'ltr' ] } );\n//# sourceURL=wp-i18n-js-after","id":"wp-i18n-js-after"},{"type":"inline","code":"var ElementorProFrontendConfig = {\"ajaxUrl\":\"/api/noop-ajax\",\"nonce\":\"a889b4f48e\",\"urls\":{\"assets\":\"https:\\/\\/13utopia.com\\/wp-content\\/plugins\\/elementor-pro\\/assets\\/\",\"rest\":\"https:\\/\\/13utopia.com\\/wp-json\\/\"},\"settings\":{\"lazy_load_background_images\":true},\"popup\":{\"hasPopUps\":false},\"shareButtonsNetworks\":{\"facebook\":{\"title\":\"Facebook\",\"has_counter\":true},\"twitter\":{\"title\":\"Twitter\"},\"linkedin\":{\"title\":\"LinkedIn\",\"has_counter\":true},\"pinterest\":{\"title\":\"Pinterest\",\"has_counter\":true},\"reddit\":{\"title\":\"Reddit\",\"has_counter\":true},\"vk\":{\"title\":\"VK\",\"has_counter\":true},\"odnoklassniki\":{\"title\":\"OK\",\"has_counter\":true},\"tumblr\":{\"title\":\"Tumblr\"},\"digg\":{\"title\":\"Digg\"},\"skype\":{\"title\":\"Skype\"},\"stumbleupon\":{\"title\":\"StumbleUpon\",\"has_counter\":true},\"mix\":{\"title\":\"Mix\"},\"telegram\":{\"title\":\"Telegram\"},\"pocket\":{\"title\":\"Pocket\",\"has_counter\":true},\"xing\":{\"title\":\"XING\",\"has_counter\":true},\"whatsapp\":{\"title\":\"WhatsApp\"},\"email\":{\"title\":\"Email\"},\"print\":{\"title\":\"Print\"},\"x-twitter\":{\"title\":\"X\"},\"threads\":{\"title\":\"Threads\"}},\"woocommerce\":{\"menu_cart\":{\"cart_page_url\":\"https:\\/\\/13utopia.com\\/cart\\/\",\"checkout_page_url\":\"https:\\/\\/13utopia.com\\/checkout\\/\",\"fragments_nonce\":\"9666364de9\"}},\"facebook_sdk\":{\"lang\":\"en_US\",\"app_id\":\"\"},\"lottie\":{\"defaultAnimationUrl\":\"https:\\/\\/13utopia.com\\/wp-content\\/plugins\\/elementor-pro\\/modules\\/lottie\\/assets\\/animations\\/default.json\"}};\n//# sourceURL=elementor-pro-frontend-js-before","id":"elementor-pro-frontend-js-before"},{"type":"src","href":"/js/live-cascade/036-frontend.min.js","id":"elementor-pro-frontend-js"},{"type":"src","href":"/js/live-cascade/037-elements-handlers.min.js","id":"pro-elements-handlers-js"},{"type":"src","href":"/js/live-cascade/038-underscore.min.js","id":"underscore-js"},{"type":"inline","code":"var _wpUtilSettings = {\"ajax\":{\"url\":\"/wp-admin/admin-ajax.php\"}};\n//# sourceURL=wp-util-js-extra","id":"wp-util-js-extra"},{"type":"src","href":"/js/live-cascade/040-wp-util.min.js","id":"wp-util-js"}];

  function runInline(code) {
    var el = document.createElement('script');
    el.type = 'text/javascript';
    el.text = code;
    document.head.appendChild(el);
  }

  function loadSrc(href) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-pixel-live-src="' + href + '"]');
      if (existing) return resolve();
      var s = document.createElement('script');
      s.src = href;
      s.async = false;
      s.dataset.pixelLiveSrc = href;
      s.onload = function () { resolve(); };
      s.onerror = function () { console.warn('[pixel-live-js] failed', href); resolve(); };
      document.head.appendChild(s);
    });
  }

  /** Kill Elementor/jQuery sticky — it fights Lenis + pixel-sticky-boot (css replace errors / scroll lock). */
  function killElementorSticky() {
    try {
      if (window.jQuery) {
        var $ = window.jQuery;
        // Header + nested sticky containers only (2 per scrape page)
        $('.elementor-element-01ec82b, .elementor-element[data-settings*="sticky"]').each(function () {
          var $el = $(this);
          try {
            if ($el.data('sticky')) $el.sticky('destroy');
          } catch (e0) {}
          try {
            $el.removeData('sticky');
            $el.off('.sticky');
          } catch (e1) {}
          // Stop Elementor Pro from re-binding sticky on this node
          var raw = this.getAttribute('data-settings');
          if (raw && raw.indexOf('sticky') !== -1) {
            try {
              var s = JSON.parse(raw.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&'));
              if (s.sticky) {
                delete s.sticky;
                delete s.sticky_on;
                delete s.sticky_offset;
                delete s.sticky_effects_offset;
                delete s.sticky_anchor_link_offset;
                this.setAttribute('data-settings', JSON.stringify(s).replace(/"/g, '&quot;'));
              }
            } catch (e2) {}
          }
        });
        // Elementor sticky clones leave invisible spacers that desync Lenis scroll height
        $('.elementor-sticky__spacer, .sticky-spacer').each(function () {
          if (!this.classList.contains('pixel-sticky-spacer')) this.remove();
        });
      }
    } catch (e) {}
    if (typeof window.__PIXEL_STICKY_RUN === 'function') {
      try {
        window.__PIXEL_STICKY_RUN();
      } catch (e3) {}
    }
  }

  function triggerElementor() {
    try {
      window.elementorDevTools = window.elementorDevTools || {
        deprecation: { deprecated: function () {} },
      };
      // Register WCF/Arolax widget hooks BEFORE runReadyTrigger — otherwise
      // image-box cube / brand / nav handlers never attach on first paint.
      if (window.jQuery) {
        window.jQuery(window).trigger('elementor/frontend/init');
      }
      if (window.elementorFrontend && typeof window.elementorFrontend.init === 'function') {
        if (!window.elementorFrontend.elements) {
          window.elementorFrontend.init();
        } else if (window.elementorFrontend.elementsHandler && window.jQuery) {
          window.jQuery('.elementor').each(function () {
            try {
              window.elementorFrontend.elementsHandler.runReadyTrigger(this);
            } catch (e) {}
          });
        }
      }
      // Do NOT re-trigger sticky handlers — pixel-sticky-boot owns the header.
      killElementorSticky();
      // Explicit WCF slider widgets (cube hero, brand reel, etc.)
      if (window.elementorFrontend && window.elementorFrontend.hooks && window.jQuery) {
        var widgetHooks = [
          ['wcf--brand-slider.default', '.elementor-widget-wcf--brand-slider'],
          ['wcf--slider.default', '.elementor-widget-wcf--slider'],
          ['image-carousel.default', '.elementor-widget-image-carousel'],
          ['arolax--testimonial.default', '.elementor-widget-arolax--testimonial'],
        ];
        widgetHooks.forEach(function (pair) {
          try {
            window.jQuery(pair[1]).each(function () {
              window.elementorFrontend.hooks.doAction(
                'frontend/element_ready/' + pair[0],
                window.jQuery(this),
                window.jQuery
              );
            });
          } catch (e2) {}
        });
      }
      // Native resize only — jQuery(window).trigger('resize') re-enters sticky and throws
      window.dispatchEvent(new Event('resize'));
      killElementorSticky();
      // Do NOT strip .elementor-invisible here — Elementor owns scroll entrance FX.
      document.querySelectorAll('.wcf__nav-menu').forEach(function (nav) {
        if (window.matchMedia('(min-width: 768px)').matches) {
          nav.classList.add('desktop-menu-active');
          nav.classList.remove('mobile-menu-active');
        }
      });
      try {
        if (window.__lenis && typeof window.__lenis.start === 'function') window.__lenis.start();
      } catch (eL) {}
    } catch (e) {
      console.warn('[pixel-live-js] trigger', e);
    }
  }

  function revealStuckInvisible() {
    document.querySelectorAll('.elementor-invisible').forEach(function (el) {
      var r = el.getBoundingClientRect();
      var inView = r.top < window.innerHeight && r.bottom > 0;
      if (!inView) return;
      el.classList.remove('elementor-invisible');
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }

  async function run() {
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      try {
        if (step.type === 'inline') runInline(step.code);
        else await loadSrc(step.href);
      } catch (e) {
        console.warn('[pixel-live-js] step failed', step.id || step.href, e);
      }
    }
    // Give Elementor a tick to bind widgets
    setTimeout(triggerElementor, 100);
    setTimeout(triggerElementor, 600);
    // Only force-reveal in-view nodes still stuck after Elementor should have animated
    setTimeout(revealStuckInvisible, 5000);
    setTimeout(revealStuckInvisible, 10000);
    window.__PIXEL_LIVE_JS_READY = true;
    window.__PIXEL_LIVE_JS_LOADING = false;
    window.__PIXEL_ELEMENTOR_RERUN = triggerElementor;
    window.dispatchEvent(new CustomEvent('pixel-live-js-ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
