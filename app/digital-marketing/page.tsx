'use client';

import React, { useEffect } from 'react';
import '@/app/pixel.css';
import { ensurePixelSheets } from '@/lib/ensurePixelSheets';

export default function Page() {

  useEffect(() => {
    const classes = "wp-singular page-template page-template-elementor_header_footer page page-id-13403 wp-theme-arolax wp-child-theme-arolax-child theme-arolax woocommerce-no-js ehf-header ehf-template-arolax ehf-stylesheet-arolax-child joya-gl-blog arolax-base elementor-default elementor-template-full-width elementor-kit-3 elementor-page elementor-page-13403".split(' ').filter(Boolean);
    classes.forEach((c) => document.body.classList.add(c));
    document.documentElement.classList.add('pixel-exact');

    ensurePixelSheets();


    return () => {
      classes.forEach((c) => document.body.classList.remove(c));
      // Keep shared pixel CSS + html.pixel-exact across client navigations (avoids FOUC).
    };
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => { 
    // Unlock scroll — WP WCF leaves wcf-preloader-active which sets overflow:hidden
    document.body.classList.remove('wcf-preloader-active');
    document.documentElement.classList.remove('wcf-preloader-active');
    document.body.style.overflow = '';
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowY = 'auto';

    // Runtime safety: hydrate any leftover lazy images + localize airlift paths
    document.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
      const real =
        img.getAttribute('bv-data-large-src') ||
        img.getAttribute('bv-data-src') ||
        img.getAttribute('data-src') ||
        img.getAttribute('data-lazy-src');
      const cur = img.getAttribute('src') || '';
      if (real && !real.startsWith('data:')) {
        let u = real.replace(/^https?:\/\/(www\.)?13utopia\.com/i, '');
        const al = u.match(/\/wp-content\/uploads\/al_opt_content\/IMAGE\/[^/]+\/wp-content\/uploads\/(.+?)(?:\?.*)?$/i);
        if (al) u = '/wp-content/uploads/' + al[1];
        u = u.replace(/\.bv\.webp$/i, '.webp').split('?')[0];
        img.src = u;
        img.removeAttribute('bv-data-src');
        img.removeAttribute('bv-data-large-src');
        img.removeAttribute('data-src');
        img.removeAttribute('data-lazy-src');
      } else if (cur.startsWith('data:') || !cur) {
        // leave alone
      } else if (cur.includes('al_opt_content')) {
        const al = cur.match(/\/wp-content\/uploads\/al_opt_content\/IMAGE\/[^/]+\/wp-content\/uploads\/(.+?)(?:\?.*)?$/i);
        if (al) img.src = '/wp-content/uploads/' + al[1].split('?')[0];
      }
    });

    // Force brand slider slides visible if Swiper never inits (don't touch transform — Swiper owns it)
    document.querySelectorAll<HTMLElement>('.wcf--brand-slider-wrapper .swiper-slide').forEach((el) => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });

    // Ensure Who We Are Zeus matches live on desktop (object-fit:fill @ ~505×729)
    if (window.matchMedia('(min-width: 1025px)').matches) {
      document.querySelectorAll<HTMLImageElement>('[data-id="da7f073"] img').forEach((img) => {
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
        img.loading = 'eager';
        img.src = '/wp-content/uploads/2024/09/zEUS-1-1.webp';
        img.style.objectFit = 'fill';
        img.style.width = '100%';
        img.style.height = '729px';
        img.style.maxWidth = '100%';
      });
    } else {
      document.querySelectorAll<HTMLImageElement>('[data-id="da7f073"] img').forEach((img) => {
        img.style.height = '';
        img.style.objectFit = '';
      });
    }
    // Ensure site logo
    document.querySelectorAll<HTMLImageElement>('img.wp-image-8655').forEach((img) => {
      img.src = '/wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png';
      img.setAttribute('sizes', '(max-width: 768px) 48vw, 220px');
    });

    // Let Elementor animate; late safety only for stuck in-view nodes
    const revealStuck = () => {
      document.querySelectorAll<HTMLElement>('.elementor-invisible').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top >= window.innerHeight || r.bottom <= 0) return;
        el.classList.remove('elementor-invisible');
        el.style.opacity = '1';
        el.style.visibility = 'visible';
      });
    };
    window.setTimeout(revealStuck, 6000);
    window.setTimeout(revealStuck, 12000);

    const serviceLabel = (v: string) => {
      const map: Record<string, string> = {
        '1': 'SEO',
        '2': 'Digital Marketing',
        '3': 'Web Development',
        '4': 'CGI Videos',
        '6': 'Online Reputation Management',
        '7': 'Email Marketing',
      };
      return map[String(v)] || String(v || '');
    };

    // Contact WPForms (id 16813) → secure Next API (capture before any wpforms handlers)
    document.querySelectorAll<HTMLFormElement>('form#wpforms-form-16813, form[data-formid="16813"]').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const val = (id: string) => {
          const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('#' + id);
          return el && 'value' in el ? String(el.value).trim() : '';
        };
        const name = val('wpforms-16813-field_1');
        const email = val('wpforms-16813-field_2');
        const phone = val('wpforms-16813-field_5');
        const honeypot = val('wpforms-16813-field_8');
        const company = val('wpforms-16813-field_4');
        const websiteUrl = val('wpforms-16813-field_6');
        const serviceRaw = val('wpforms-16813-field_7');
        const message = val('wpforms-16813-field_3');
        const btn = form.querySelector<HTMLElement>('[type="submit"]');
        const prev = btn ? btn.textContent : '';
        if (btn) btn.textContent = 'Sending…';
        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              email,
              phone,
              company,
              websiteUrl,
              service: serviceLabel(serviceRaw),
              message: message || 'Contact form submission',
              website: honeypot,
            }),
          });
          if (btn) btn.textContent = res.ok ? 'Sent' : 'Try again';
          if (res.ok) form.reset();
          setTimeout(() => { if (btn) btn.textContent = prev || 'Submit'; }, 2500);
        } catch (_) {
          if (btn) btn.textContent = 'Try again';
        }
      }, true);
    });

    // Newsletter WPForms (non-contact) → /api/newsletter
    document.querySelectorAll<HTMLFormElement>('form.wpforms-form, form[id^="wpforms-form"]').forEach((form) => {
      const fid = form.getAttribute('data-formid') || '';
      const id = form.id || '';
      if (fid === '16813' || id.includes('16813')) return;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const emailInput = form.querySelector<HTMLInputElement>('input[type="email"], input.wpforms-field-required');
        const email = emailInput && emailInput.value ? emailInput.value.trim() : '';
        const honey = form.querySelector<HTMLInputElement>('input[name="wpforms[fields][1]"]');
        if (!email) return;
        try {
          const res = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              website: honey && honey.value ? honey.value : '',
            }),
          });
          const btn = form.querySelector<HTMLElement>('[type="submit"]');
          if (btn) btn.textContent = res.ok ? 'Subscribed' : 'Try again';
        } catch (_) {}
      }, true);
    });

    // Fallback nav until / if WCF nav JS does not attach
    const syncWcfNav = () => {
      const desktop = window.matchMedia('(min-width: 768px)').matches;
      document.querySelectorAll<HTMLElement>('.wcf__nav-menu').forEach((nav) => {
        if (desktop) {
          nav.classList.add('desktop-menu-active');
          nav.classList.remove('mobile-menu-active', 'wcf-nav-is-toggled');
        } else {
          nav.classList.add('mobile-menu-active');
          nav.classList.remove('desktop-menu-active');
        }
      });
    };
    syncWcfNav();
    window.addEventListener('resize', syncWcfNav);
    document.querySelectorAll<HTMLElement>('.wcf__nav-menu').forEach((nav) => {
      if (nav.dataset.pixelNavBound === '1') return;
      nav.dataset.pixelNavBound = '1';
      const burger = nav.querySelector('.wcf-menu-hamburger');
      const closeBtn = nav.querySelector('.wcf-menu-close');
      if (burger) {
        burger.addEventListener('click', (e) => {
          e.preventDefault();
          nav.classList.toggle('wcf-nav-is-toggled');
        });
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          nav.classList.remove('wcf-nav-is-toggled');
        });
      }
      const overlay = nav.querySelector('.wcf-menu-overlay');
      if (overlay) overlay.addEventListener('click', () => nav.classList.remove('wcf-nav-is-toggled'));
    });

    // Load live Elementor / WCF / Swiper stack for 1:1 interactions
    const loadLiveJs = () => {
      if (!document.querySelector('script[data-pixel-live-loader]')) {
        const s = document.createElement('script');
        s.src = '/js/live-js-loader.js?v=live-js-12';
        s.async = true;
        s.dataset.pixelLiveLoader = '1';
        document.head.appendChild(s);
      }
    };
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(loadLiveJs, { timeout: 2000 });
    } else {
      window.setTimeout(loadLiveJs, 1200);
    }
    if (!document.querySelector('script[data-pixel-swiper-boot]')) {
      const s2 = document.createElement('script');
      s2.src = '/js/pixel-swiper-boot.js?v=swiper-4';
      s2.async = false;
      s2.dataset.pixelSwiperBoot = '1';
      document.head.appendChild(s2);
    }
    if (!document.querySelector('script[src*="pixel-counter-boot"]')) {
      const s3 = document.createElement('script');
      s3.src = '/js/pixel-counter-boot.js?v=counter-4';
      s3.async = false;
      s3.dataset.pixelCounterBoot = '1';
      document.head.appendChild(s3);
    }
    if (!document.querySelector('script[data-pixel-ctc-boot]')) {
      const s4 = document.createElement('script');
      s4.src = '/js/pixel-ctc-boot.js?v=ctc-2';
      s4.async = false;
      s4.dataset.pixelCtcBoot = '1';
      document.head.appendChild(s4);
    }
    if (!document.querySelector('script[data-pixel-lazy-boot]')) {
      const s5 = document.createElement('script');
      s5.src = '/js/pixel-lazy-boot.js?v=lazy-4';
      s5.async = false;
      s5.dataset.pixelLazyBoot = '1';
      document.head.appendChild(s5);
    }
    if (!document.querySelector('script[data-pixel-hcaptcha-boot]')) {
      const s6 = document.createElement('script');
      s6.src = '/js/pixel-hcaptcha-boot.js';
      s6.async = false;
      s6.dataset.pixelHcaptchaBoot = '1';
      document.head.appendChild(s6);
    }
    if (!document.querySelector('script[data-pixel-sticky-boot]')) {
      const s7 = document.createElement('script');
      s7.src = '/js/pixel-sticky-boot.js?v=sticky-pin-7';
      s7.async = false;
      s7.dataset.pixelStickyBoot = '1';
      document.head.appendChild(s7);
    }
    if (!document.querySelector('script[data-pixel-progress-boot]')) {
      const s8 = document.createElement('script');
      s8.src = '/js/pixel-progress-boot.js';
      s8.async = false;
      s8.dataset.pixelProgressBoot = '1';
      document.head.appendChild(s8);
    }
    if (!document.querySelector('script[src*="pixel-advance-slider-boot"]')) {
      const sAdv = document.createElement('script');
      sAdv.src = '/js/pixel-advance-slider-boot.js?v=poster-orch-25';
      sAdv.async = false;
      sAdv.dataset.pixelAdvanceSliderBoot = '1';
      document.head.appendChild(sAdv);
    }
// After live JS: disable CSS marquee if Swiper initialized; keep brand logos visible
    const afterLive = () => {
      document.querySelectorAll<HTMLElement>('.wcf--brand-slider-wrapper .swiper-initialized .swiper-wrapper, .swiper.swiper-initialized .swiper-wrapper').forEach((el) => {
        el.style.animation = 'none';
      });
      document.querySelectorAll<HTMLElement>('.wcf--brand-slider-wrapper .swiper-slide').forEach((el) => {
        // Brand logos only — never force cube/cards/poster slides (breaks Swiper visibility).
        el.style.opacity = '1';
        el.style.visibility = 'visible';
      });
      syncWcfNav();
    };
    window.addEventListener('pixel-live-js-ready', afterLive);
    window.setTimeout(afterLive, 2500);
 }, 0);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/css/page-digital-marketing-inline.css?v=page-css-1" data-pixel-page-css="digital-marketing" />
      <div
        className={"wp-singular page-template page-template-elementor_header_footer page page-id-13403 wp-theme-arolax wp-child-theme-arolax-child theme-arolax woocommerce-no-js ehf-header ehf-template-arolax ehf-stylesheet-arolax-child joya-gl-blog arolax-base elementor-default elementor-template-full-width elementor-kit-3 elementor-page elementor-page-13403"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `

	<div class="cssload-inner cssload-two"></div>
	<div class="cssload-inner cssload-three"></div>
</div></div><!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PV7NKT5X"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->



<div id="wcf--top--scroll" hidden></div>
<!-- GTM Container placement set to automatic -->
<!-- Google Tag Manager (noscript) -->
				<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T9PRWKZZ" height="0" width="0" style="display:none;visibility:hidden" aria-hidden="true"></iframe></noscript>
<!-- End Google Tag Manager (noscript) --><div id="page" class="hfeed site">
 <style id="elementor-post-6033">.elementor-6033 .elementor-element.elementor-element-9e2c1c7{--display:flex;--flex-direction:column;--container-widget-width:100%;--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;}.elementor-6033 .elementor-element.elementor-element-9e2c1c7:not(.elementor-motion-effects-element-type-background), .elementor-6033 .elementor-element.elementor-element-9e2c1c7 > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:#000000;}.elementor-6033 .elementor-element.elementor-element-9e2c1c7 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-6033 .elementor-element.elementor-element-7b46e1c{--display:flex;}.elementor-6033 .elementor-element.elementor-element-7b46e1c .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-widget-nav-menu .elementor-nav-menu .elementor-item{font-family:var( --e-global-typography-primary-font-family ), Sans-serif;font-weight:var( --e-global-typography-primary-font-weight );}.elementor-widget-nav-menu .elementor-nav-menu--main .elementor-item{color:var( --e-global-color-text );fill:var( --e-global-color-text );}.elementor-widget-nav-menu .elementor-nav-menu--main .elementor-item:hover,
					.elementor-widget-nav-menu .elementor-nav-menu--main .elementor-item.elementor-item-active,
					.elementor-widget-nav-menu .elementor-nav-menu--main .elementor-item.highlighted,
					.elementor-widget-nav-menu .elementor-nav-menu--main .elementor-item:focus{color:var( --e-global-color-accent );fill:var( --e-global-color-accent );}.elementor-widget-nav-menu .elementor-nav-menu--main:not(.e--pointer-framed) .elementor-item:before,
					.elementor-widget-nav-menu .elementor-nav-menu--main:not(.e--pointer-framed) .elementor-item:after{background-color:var( --e-global-color-accent );}.elementor-widget-nav-menu .e--pointer-framed .elementor-item:before,
					.elementor-widget-nav-menu .e--pointer-framed .elementor-item:after{border-color:var( --e-global-color-accent );}.elementor-widget-nav-menu{--e-nav-menu-divider-color:var( --e-global-color-text );}.elementor-widget-nav-menu .elementor-nav-menu--dropdown .elementor-item, .elementor-widget-nav-menu .elementor-nav-menu--dropdown  .elementor-sub-item{font-family:var( --e-global-typography-accent-font-family ), Sans-serif;font-weight:var( --e-global-typography-accent-font-weight );}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-menu-toggle{margin-right:auto;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu .elementor-item{font-family:"Roboto", Sans-serif;font-weight:600;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown a:hover,
					.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown a:focus,
					.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown a.elementor-item-active,
					.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown a.highlighted{background-color:#000000;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown a.elementor-item-active{background-color:#000000;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown .elementor-item, .elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown  .elementor-sub-item{font-family:"Roboto", Sans-serif;font-weight:500;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown li:not(:last-child){border-style:solid;border-color:#979797;border-bottom-width:0.5px;}.elementor-6033 .elementor-element.elementor-element-481a75a div.elementor-menu-toggle{color:#FFFFFF;}.elementor-6033 .elementor-element.elementor-element-481a75a div.elementor-menu-toggle svg{fill:#FFFFFF;}.elementor-widget-image .widget-image-caption{color:var( --e-global-color-text );font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-6033 .elementor-element.elementor-element-c0803bd{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-6033 .elementor-element.elementor-element-ba91d1b{--display:flex;}.elementor-6033 .elementor-element.elementor-element-ba91d1b .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-6033 .elementor-element.elementor-element-d592489{--display:flex;--flex-direction:column;--container-widget-width:100%;--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;}.elementor-6033 .elementor-element.elementor-element-d592489:not(.elementor-motion-effects-element-type-background), .elementor-6033 .elementor-element.elementor-element-d592489 > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:#000000;}.elementor-6033 .elementor-element.elementor-element-d592489 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-6033 .elementor-element.elementor-element-be6d2cc{--display:flex;}.elementor-6033 .elementor-element.elementor-element-be6d2cc .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-menu-toggle{margin-right:auto;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu .elementor-item{font-family:"Roboto", Sans-serif;font-weight:600;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown a:hover,
					.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown a:focus,
					.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown a.elementor-item-active,
					.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown a.highlighted{background-color:#000000;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown a.elementor-item-active{background-color:#000000;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown .elementor-item, .elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown  .elementor-sub-item{font-family:"Roboto", Sans-serif;font-weight:500;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown li:not(:last-child){border-style:solid;border-color:#979797;border-bottom-width:0.5px;}.elementor-6033 .elementor-element.elementor-element-a587e79 div.elementor-menu-toggle{color:#FFFFFF;}.elementor-6033 .elementor-element.elementor-element-a587e79 div.elementor-menu-toggle svg{fill:#FFFFFF;}.elementor-6033 .elementor-element.elementor-element-003b0ba{--display:flex;}.elementor-6033 .elementor-element.elementor-element-003b0ba .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-6033 .elementor-element.elementor-element-4428926{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}@media(max-width:1024px) and (min-width:768px){.elementor-6033 .elementor-element.elementor-element-9e2c1c7{--width:100%;}.elementor-6033 .elementor-element.elementor-element-7b46e1c{--width:9%;}.elementor-6033 .elementor-element.elementor-element-ba91d1b{--width:55%;}.elementor-6033 .elementor-element.elementor-element-d592489{--width:100%;}.elementor-6033 .elementor-element.elementor-element-be6d2cc{--width:9%;}.elementor-6033 .elementor-element.elementor-element-003b0ba{--width:55%;}}@media(max-width:880px) and (min-width:768px){.elementor-6033 .elementor-element.elementor-element-7b46e1c{--width:42%;}.elementor-6033 .elementor-element.elementor-element-be6d2cc{--width:42%;}.elementor-6033 .elementor-element.elementor-element-003b0ba{--width:49%;}}@media(max-width:1024px){.elementor-6033 .elementor-element.elementor-element-9e2c1c7{--flex-direction:row;--container-widget-width:initial;--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-7b46e1c{--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-481a75a.elementor-element{--align-self:center;}.elementor-6033 .elementor-element.elementor-element-481a75a{--nav-menu-icon-size:1.5em;}.elementor-6033 .elementor-element.elementor-element-c0803bd img{width:40%;}.elementor-6033 .elementor-element.elementor-element-ba91d1b{--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-d592489{--flex-direction:row;--container-widget-width:initial;--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-be6d2cc{--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-a587e79.elementor-element{--align-self:center;}.elementor-6033 .elementor-element.elementor-element-a587e79{--nav-menu-icon-size:1.5em;}.elementor-6033 .elementor-element.elementor-element-003b0ba{--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-4428926 img{width:40%;}}@media(max-width:880px){.elementor-6033 .elementor-element.elementor-element-7b46e1c{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-d592489{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:2vw;--padding-bottom:2vw;--padding-left:0vw;--padding-right:0vw;}.elementor-6033 .elementor-element.elementor-element-be6d2cc{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-a587e79{width:var( --container-widget-width, 92% );max-width:92%;--container-widget-width:92%;--container-widget-flex-grow:0;}.elementor-6033 .elementor-element.elementor-element-a587e79 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 0vw 8vw;}.elementor-6033 .elementor-element.elementor-element-a587e79.elementor-element{--align-self:flex-start;}.elementor-6033 .elementor-element.elementor-element-003b0ba{--align-items:flex-end;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );}.elementor-6033 .elementor-element.elementor-element-4428926 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-6033 .elementor-element.elementor-element-4428926.elementor-element{--align-self:flex-end;}.elementor-6033 .elementor-element.elementor-element-4428926{text-align:end;}.elementor-6033 .elementor-element.elementor-element-4428926 img{width:32%;}}@media(max-width:767px){.elementor-6033 .elementor-element.elementor-element-9e2c1c7{--margin-top:0vw;--margin-bottom:0vw;--margin-left:0vw;--margin-right:0vw;--padding-top:5.2vw;--padding-bottom:0vw;--padding-left:0vw;--padding-right:0vw;}.elementor-6033 .elementor-element.elementor-element-7b46e1c{--width:100%;--flex-direction:row;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--justify-content:flex-start;--align-items:flex-start;--gap:0px 0px;--row-gap:0px;--column-gap:0px;--margin-top:0vw;--margin-bottom:0vw;--margin-left:0vw;--margin-right:0vw;--padding-top:0vw;--padding-bottom:0vw;--padding-left:0vw;--padding-right:0vw;}.elementor-6033 .elementor-element.elementor-element-7b46e1c.e-con{--align-self:flex-start;}.elementor-6033 .elementor-element.elementor-element-481a75a{width:var( --container-widget-width, 66% );max-width:66%;--container-widget-width:66%;--container-widget-flex-grow:0;z-index:1000;}.elementor-6033 .elementor-element.elementor-element-481a75a > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 0vw 3vw;}.elementor-6033 .elementor-element.elementor-element-481a75a.elementor-element{--align-self:flex-start;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu .elementor-item{font-size:1.3vw;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--main .elementor-item{padding-left:0px;padding-right:0px;padding-top:0px;padding-bottom:0px;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown .elementor-item, .elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown  .elementor-sub-item{font-size:4.2vw;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown a{padding-left:3vw;padding-right:3vw;padding-top:1vh;padding-bottom:1vh;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--main > .elementor-nav-menu > li > .elementor-nav-menu--dropdown, .elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu__container.elementor-nav-menu--dropdown{margin-top:5px !important;}.elementor-6033 .elementor-element.elementor-element-c0803bd{width:var( --container-widget-width, 30% );max-width:30%;--container-widget-width:30%;--container-widget-flex-grow:0;}.elementor-6033 .elementor-element.elementor-element-c0803bd > .elementor-widget-container{margin:1vw 0vw 0vw 0vw;padding:0vw 0vw 0vw 0vw;}.elementor-6033 .elementor-element.elementor-element-c0803bd img{width:83%;}.elementor-6033 .elementor-element.elementor-element-ba91d1b{--width:100%;--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:-23vw;--margin-bottom:-5vw;--margin-left:0vw;--margin-right:0vw;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-d592489{--margin-top:0vw;--margin-bottom:0vw;--margin-left:0vw;--margin-right:0vw;--padding-top:5.2vw;--padding-bottom:0vw;--padding-left:0vw;--padding-right:0vw;}.elementor-6033 .elementor-element.elementor-element-be6d2cc{--width:100%;--flex-direction:row;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--justify-content:flex-start;--align-items:flex-start;--margin-top:0vw;--margin-bottom:0vw;--margin-left:0vw;--margin-right:0vw;--padding-top:0vw;--padding-bottom:0vw;--padding-left:0vw;--padding-right:0vw;}.elementor-6033 .elementor-element.elementor-element-be6d2cc.e-con{--align-self:flex-start;}.elementor-6033 .elementor-element.elementor-element-a587e79{width:var( --container-widget-width, 63% );max-width:63%;--container-widget-width:63%;--container-widget-flex-grow:0;z-index:1000;}.elementor-6033 .elementor-element.elementor-element-a587e79 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 0vw 3vw;}.elementor-6033 .elementor-element.elementor-element-a587e79.elementor-element{--align-self:flex-start;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu .elementor-item{font-size:1.3vw;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--main .elementor-item{padding-left:0px;padding-right:0px;padding-top:0px;padding-bottom:0px;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown .elementor-item, .elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown  .elementor-sub-item{font-size:4.2vw;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown a{padding-left:3vw;padding-right:3vw;padding-top:1vh;padding-bottom:1vh;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--main > .elementor-nav-menu > li > .elementor-nav-menu--dropdown, .elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu__container.elementor-nav-menu--dropdown{margin-top:5px !important;}.elementor-6033 .elementor-element.elementor-element-003b0ba{--width:100%;--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:-23vw;--margin-bottom:-5vw;--margin-left:0vw;--margin-right:0vw;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-4428926{width:var( --container-widget-width, 30% );max-width:30%;--container-widget-width:30%;--container-widget-flex-grow:0;}.elementor-6033 .elementor-element.elementor-element-4428926 > .elementor-widget-container{margin:1vw 34vw 0vw -30vw;padding:0vw 0vw 0vw 0vw;}.elementor-6033 .elementor-element.elementor-element-4428926 img{width:97%;}}</style><style>.elementor-6033 .elementor-element.elementor-element-9e2c1c7{--display:flex;--flex-direction:column;--container-widget-width:100%;--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;}.elementor-6033 .elementor-element.elementor-element-9e2c1c7:not(.elementor-motion-effects-element-type-background), .elementor-6033 .elementor-element.elementor-element-9e2c1c7 > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:#000000;}.elementor-6033 .elementor-element.elementor-element-9e2c1c7 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-6033 .elementor-element.elementor-element-7b46e1c{--display:flex;}.elementor-6033 .elementor-element.elementor-element-7b46e1c .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-widget-nav-menu .elementor-nav-menu .elementor-item{font-family:var( --e-global-typography-primary-font-family ), Sans-serif;font-weight:var( --e-global-typography-primary-font-weight );}.elementor-widget-nav-menu .elementor-nav-menu--main .elementor-item{color:var( --e-global-color-text );fill:var( --e-global-color-text );}.elementor-widget-nav-menu .elementor-nav-menu--main .elementor-item:hover,
					.elementor-widget-nav-menu .elementor-nav-menu--main .elementor-item.elementor-item-active,
					.elementor-widget-nav-menu .elementor-nav-menu--main .elementor-item.highlighted,
					.elementor-widget-nav-menu .elementor-nav-menu--main .elementor-item:focus{color:var( --e-global-color-accent );fill:var( --e-global-color-accent );}.elementor-widget-nav-menu .elementor-nav-menu--main:not(.e--pointer-framed) .elementor-item:before,
					.elementor-widget-nav-menu .elementor-nav-menu--main:not(.e--pointer-framed) .elementor-item:after{background-color:var( --e-global-color-accent );}.elementor-widget-nav-menu .e--pointer-framed .elementor-item:before,
					.elementor-widget-nav-menu .e--pointer-framed .elementor-item:after{border-color:var( --e-global-color-accent );}.elementor-widget-nav-menu{--e-nav-menu-divider-color:var( --e-global-color-text );}.elementor-widget-nav-menu .elementor-nav-menu--dropdown .elementor-item, .elementor-widget-nav-menu .elementor-nav-menu--dropdown  .elementor-sub-item{font-family:var( --e-global-typography-accent-font-family ), Sans-serif;font-weight:var( --e-global-typography-accent-font-weight );}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-menu-toggle{margin-right:auto;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu .elementor-item{font-family:"Roboto", Sans-serif;font-weight:600;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown a:hover,
					.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown a:focus,
					.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown a.elementor-item-active,
					.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown a.highlighted{background-color:#000000;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown a.elementor-item-active{background-color:#000000;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown .elementor-item, .elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown  .elementor-sub-item{font-family:"Roboto", Sans-serif;font-weight:500;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown li:not(:last-child){border-style:solid;border-color:#979797;border-bottom-width:0.5px;}.elementor-6033 .elementor-element.elementor-element-481a75a div.elementor-menu-toggle{color:#FFFFFF;}.elementor-6033 .elementor-element.elementor-element-481a75a div.elementor-menu-toggle svg{fill:#FFFFFF;}.elementor-widget-image .widget-image-caption{color:var( --e-global-color-text );font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-6033 .elementor-element.elementor-element-c0803bd{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-6033 .elementor-element.elementor-element-ba91d1b{--display:flex;}.elementor-6033 .elementor-element.elementor-element-ba91d1b .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-6033 .elementor-element.elementor-element-d592489{--display:flex;--flex-direction:column;--container-widget-width:100%;--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;}.elementor-6033 .elementor-element.elementor-element-d592489:not(.elementor-motion-effects-element-type-background), .elementor-6033 .elementor-element.elementor-element-d592489 > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:#000000;}.elementor-6033 .elementor-element.elementor-element-d592489 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-6033 .elementor-element.elementor-element-be6d2cc{--display:flex;}.elementor-6033 .elementor-element.elementor-element-be6d2cc .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-menu-toggle{margin-right:auto;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu .elementor-item{font-family:"Roboto", Sans-serif;font-weight:600;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown a:hover,
					.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown a:focus,
					.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown a.elementor-item-active,
					.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown a.highlighted{background-color:#000000;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown a.elementor-item-active{background-color:#000000;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown .elementor-item, .elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown  .elementor-sub-item{font-family:"Roboto", Sans-serif;font-weight:500;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown li:not(:last-child){border-style:solid;border-color:#979797;border-bottom-width:0.5px;}.elementor-6033 .elementor-element.elementor-element-a587e79 div.elementor-menu-toggle{color:#FFFFFF;}.elementor-6033 .elementor-element.elementor-element-a587e79 div.elementor-menu-toggle svg{fill:#FFFFFF;}.elementor-6033 .elementor-element.elementor-element-003b0ba{--display:flex;}.elementor-6033 .elementor-element.elementor-element-003b0ba .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-6033 .elementor-element.elementor-element-4428926{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}@media(max-width:1024px) and (min-width:768px){.elementor-6033 .elementor-element.elementor-element-9e2c1c7{--width:100%;}.elementor-6033 .elementor-element.elementor-element-7b46e1c{--width:9%;}.elementor-6033 .elementor-element.elementor-element-ba91d1b{--width:55%;}.elementor-6033 .elementor-element.elementor-element-d592489{--width:100%;}.elementor-6033 .elementor-element.elementor-element-be6d2cc{--width:9%;}.elementor-6033 .elementor-element.elementor-element-003b0ba{--width:55%;}}@media(max-width:880px) and (min-width:768px){.elementor-6033 .elementor-element.elementor-element-7b46e1c{--width:42%;}.elementor-6033 .elementor-element.elementor-element-be6d2cc{--width:42%;}.elementor-6033 .elementor-element.elementor-element-003b0ba{--width:49%;}}@media(max-width:1024px){.elementor-6033 .elementor-element.elementor-element-9e2c1c7{--flex-direction:row;--container-widget-width:initial;--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-7b46e1c{--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-481a75a.elementor-element{--align-self:center;}.elementor-6033 .elementor-element.elementor-element-481a75a{--nav-menu-icon-size:1.5em;}.elementor-6033 .elementor-element.elementor-element-c0803bd img{width:40%;}.elementor-6033 .elementor-element.elementor-element-ba91d1b{--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-d592489{--flex-direction:row;--container-widget-width:initial;--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-be6d2cc{--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-a587e79.elementor-element{--align-self:center;}.elementor-6033 .elementor-element.elementor-element-a587e79{--nav-menu-icon-size:1.5em;}.elementor-6033 .elementor-element.elementor-element-003b0ba{--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-4428926 img{width:40%;}}@media(max-width:880px){.elementor-6033 .elementor-element.elementor-element-7b46e1c{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-d592489{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:2vw;--padding-bottom:2vw;--padding-left:0vw;--padding-right:0vw;}.elementor-6033 .elementor-element.elementor-element-be6d2cc{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-a587e79{width:var( --container-widget-width, 92% );max-width:92%;--container-widget-width:92%;--container-widget-flex-grow:0;}.elementor-6033 .elementor-element.elementor-element-a587e79 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 0vw 8vw;}.elementor-6033 .elementor-element.elementor-element-a587e79.elementor-element{--align-self:flex-start;}.elementor-6033 .elementor-element.elementor-element-003b0ba{--align-items:flex-end;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );}.elementor-6033 .elementor-element.elementor-element-4428926 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-6033 .elementor-element.elementor-element-4428926.elementor-element{--align-self:flex-end;}.elementor-6033 .elementor-element.elementor-element-4428926{text-align:end;}.elementor-6033 .elementor-element.elementor-element-4428926 img{width:32%;}}@media(max-width:767px){.elementor-6033 .elementor-element.elementor-element-9e2c1c7{--margin-top:0vw;--margin-bottom:0vw;--margin-left:0vw;--margin-right:0vw;--padding-top:5.2vw;--padding-bottom:0vw;--padding-left:0vw;--padding-right:0vw;}.elementor-6033 .elementor-element.elementor-element-7b46e1c{--width:100%;--flex-direction:row;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--justify-content:flex-start;--align-items:flex-start;--gap:0px 0px;--row-gap:0px;--column-gap:0px;--margin-top:0vw;--margin-bottom:0vw;--margin-left:0vw;--margin-right:0vw;--padding-top:0vw;--padding-bottom:0vw;--padding-left:0vw;--padding-right:0vw;}.elementor-6033 .elementor-element.elementor-element-7b46e1c.e-con{--align-self:flex-start;}.elementor-6033 .elementor-element.elementor-element-481a75a{width:var( --container-widget-width, 66% );max-width:66%;--container-widget-width:66%;--container-widget-flex-grow:0;z-index:1000;}.elementor-6033 .elementor-element.elementor-element-481a75a > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 0vw 3vw;}.elementor-6033 .elementor-element.elementor-element-481a75a.elementor-element{--align-self:flex-start;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu .elementor-item{font-size:1.3vw;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--main .elementor-item{padding-left:0px;padding-right:0px;padding-top:0px;padding-bottom:0px;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown .elementor-item, .elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown  .elementor-sub-item{font-size:4.2vw;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--dropdown a{padding-left:3vw;padding-right:3vw;padding-top:1vh;padding-bottom:1vh;}.elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu--main > .elementor-nav-menu > li > .elementor-nav-menu--dropdown, .elementor-6033 .elementor-element.elementor-element-481a75a .elementor-nav-menu__container.elementor-nav-menu--dropdown{margin-top:5px !important;}.elementor-6033 .elementor-element.elementor-element-c0803bd{width:var( --container-widget-width, 30% );max-width:30%;--container-widget-width:30%;--container-widget-flex-grow:0;}.elementor-6033 .elementor-element.elementor-element-c0803bd > .elementor-widget-container{margin:1vw 0vw 0vw 0vw;padding:0vw 0vw 0vw 0vw;}.elementor-6033 .elementor-element.elementor-element-c0803bd img{width:83%;}.elementor-6033 .elementor-element.elementor-element-ba91d1b{--width:100%;--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:-23vw;--margin-bottom:-5vw;--margin-left:0vw;--margin-right:0vw;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-d592489{--margin-top:0vw;--margin-bottom:0vw;--margin-left:0vw;--margin-right:0vw;--padding-top:5.2vw;--padding-bottom:0vw;--padding-left:0vw;--padding-right:0vw;}.elementor-6033 .elementor-element.elementor-element-be6d2cc{--width:100%;--flex-direction:row;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--justify-content:flex-start;--align-items:flex-start;--margin-top:0vw;--margin-bottom:0vw;--margin-left:0vw;--margin-right:0vw;--padding-top:0vw;--padding-bottom:0vw;--padding-left:0vw;--padding-right:0vw;}.elementor-6033 .elementor-element.elementor-element-be6d2cc.e-con{--align-self:flex-start;}.elementor-6033 .elementor-element.elementor-element-a587e79{width:var( --container-widget-width, 63% );max-width:63%;--container-widget-width:63%;--container-widget-flex-grow:0;z-index:1000;}.elementor-6033 .elementor-element.elementor-element-a587e79 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 0vw 3vw;}.elementor-6033 .elementor-element.elementor-element-a587e79.elementor-element{--align-self:flex-start;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu .elementor-item{font-size:1.3vw;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--main .elementor-item{padding-left:0px;padding-right:0px;padding-top:0px;padding-bottom:0px;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown .elementor-item, .elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown  .elementor-sub-item{font-size:4.2vw;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--dropdown a{padding-left:3vw;padding-right:3vw;padding-top:1vh;padding-bottom:1vh;}.elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu--main > .elementor-nav-menu > li > .elementor-nav-menu--dropdown, .elementor-6033 .elementor-element.elementor-element-a587e79 .elementor-nav-menu__container.elementor-nav-menu--dropdown{margin-top:5px !important;}.elementor-6033 .elementor-element.elementor-element-003b0ba{--width:100%;--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:-23vw;--margin-bottom:-5vw;--margin-left:0vw;--margin-right:0vw;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-6033 .elementor-element.elementor-element-4428926{width:var( --container-widget-width, 30% );max-width:30%;--container-widget-width:30%;--container-widget-flex-grow:0;}.elementor-6033 .elementor-element.elementor-element-4428926 > .elementor-widget-container{margin:1vw 34vw 0vw -30vw;padding:0vw 0vw 0vw 0vw;}.elementor-6033 .elementor-element.elementor-element-4428926 img{width:97%;}}</style>		<div data-elementor-type="wp-post" data-elementor-id="6033" class="elementor elementor-6033" data-elementor-post-type="wcf-addons-template">
				<div class="elementor-element elementor-element-9e2c1c7 e-con-full elementor-hidden-widescreen elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet_extra elementor-hidden-tablet e-flex wcf-starter-animations-none e-con e-parent" data-id="9e2c1c7" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-7b46e1c e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="7b46e1c" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-481a75a elementor-widget-mobile__width-initial elementor-nav-menu__align-start elementor-nav-menu--dropdown-tablet elementor-nav-menu__text-align-aside elementor-nav-menu--toggle elementor-nav-menu--burger elementor-widget elementor-widget-nav-menu" data-id="481a75a" data-element_type="widget" data-e-type="widget" data-settings="{&quot;layout&quot;:&quot;horizontal&quot;,&quot;submenu_icon&quot;:{&quot;value&quot;:&quot;&lt;svg aria-hidden=\\&quot;true\\&quot; class=\\&quot;e-font-icon-svg e-fas-caret-down\\&quot; viewBox=\\&quot;0 0 320 512\\&quot; xmlns=\\&quot;http:\\/\\/www.w3.org\\/2000\\/svg\\&quot;&gt;&lt;path d=\\&quot;M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z\\&quot;&gt;&lt;\\/path&gt;&lt;\\/svg&gt;&quot;,&quot;library&quot;:&quot;fa-solid&quot;},&quot;toggle&quot;:&quot;burger&quot;}" data-widget_type="nav-menu.default">
				<div class="elementor-widget-container">
								<nav aria-label="Menu" class="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-underline e--animation-fade">
				<ul id="menu-1-481a75a" class="elementor-nav-menu"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-16842"><a href="/" class="elementor-item">Home</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13381"><a href="/about-us/" class="elementor-item">About Us</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom current-menu-ancestor current-menu-parent menu-item-has-children menu-item-8644"><a href="#" class="elementor-item elementor-item-anchor">Services</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13382"><a href="/search-engine-optimization/" class="elementor-sub-item">Search Engine Optimization</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item page-item-13403 current_page_item menu-item-13763"><a href="/digital-marketing/" aria-current="page" class="elementor-sub-item elementor-item-active">Digital Marketing</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13770"><a href="/web-development/" class="elementor-sub-item">Web Development</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13762"><a href="/cgi-videos/" class="elementor-sub-item">CGI Videos</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13765"><a href="/online-reputation-management/" class="elementor-sub-item">Online Reputation Management</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13764"><a href="/email-marketing/" class="elementor-sub-item">Email Marketing</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-19924"><a href="/blog/" class="elementor-item">Blog</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13383"><a href="/contact-us/" class="elementor-item">Contact Us</a></li>
</ul>			</nav>
					<div class="elementor-menu-toggle" role="button" tabindex="0" aria-label="Menu Toggle" aria-expanded="false">
			<svg aria-hidden="true" role="presentation" class="elementor-menu-toggle__icon--open e-font-icon-svg e-eicon-menu-bar" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z"></path></svg><svg aria-hidden="true" role="presentation" class="elementor-menu-toggle__icon--close e-font-icon-svg e-eicon-close" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z"></path></svg>		</div>
					<nav class="elementor-nav-menu--dropdown elementor-nav-menu__container" aria-hidden="true">
				<ul id="menu-2-481a75a" class="elementor-nav-menu"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-16842"><a href="/" class="elementor-item" tabindex="-1">Home</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13381"><a href="/about-us/" class="elementor-item" tabindex="-1">About Us</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom current-menu-ancestor current-menu-parent menu-item-has-children menu-item-8644"><a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">Services</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13382"><a href="/search-engine-optimization/" class="elementor-sub-item" tabindex="-1">Search Engine Optimization</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item page-item-13403 current_page_item menu-item-13763"><a href="/digital-marketing/" aria-current="page" class="elementor-sub-item elementor-item-active" tabindex="-1">Digital Marketing</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13770"><a href="/web-development/" class="elementor-sub-item" tabindex="-1">Web Development</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13762"><a href="/cgi-videos/" class="elementor-sub-item" tabindex="-1">CGI Videos</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13765"><a href="/online-reputation-management/" class="elementor-sub-item" tabindex="-1">Online Reputation Management</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13764"><a href="/email-marketing/" class="elementor-sub-item" tabindex="-1">Email Marketing</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-19924"><a href="/blog/" class="elementor-item" tabindex="-1">Blog</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13383"><a href="/contact-us/" class="elementor-item" tabindex="-1">Contact Us</a></li>
</ul>			</nav>
						</div>
				</div>
				<div class="elementor-element elementor-element-c0803bd elementor-widget-mobile__width-initial elementor-hidden-mobile_extra wcf-starter-animations-none elementor-widget elementor-widget-image" data-id="c0803bd" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="image.default">
				<div class="elementor-widget-container">
																<a href="/">
							<img width="768" height="305" class="attachment-large size-large wp-image-8655" alt="" srcset="/wp-content/uploads/2024/06/13-utopia-logo-012.png 1691w, /wp-content/uploads/2024/06/13-utopia-logo-012-350x139.png 350w, /wp-content/uploads/2024/06/13-utopia-logo-012-300x119.png 300w, /wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png 768w, /wp-content/uploads/2024/06/13-utopia-logo-012-1024x406.png 1024w, /wp-content/uploads/2024/06/13-utopia-logo-012-1536x609.png 1536w" sizes="(max-width: 768px) 48vw, 220px" src="/wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png">								</a>
															</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-ba91d1b e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="ba91d1b" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				</div>
				</div>
		<div class="elementor-element elementor-element-d592489 e-con-full elementor-hidden-widescreen elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet_extra elementor-hidden-tablet elementor-hidden-mobile e-flex wcf-starter-animations-none e-con e-parent" data-id="d592489" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-be6d2cc e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="be6d2cc" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-a587e79 elementor-widget-mobile__width-initial elementor-nav-menu__align-start elementor-widget-mobile_extra__width-initial elementor-nav-menu--dropdown-tablet elementor-nav-menu__text-align-aside elementor-nav-menu--toggle elementor-nav-menu--burger elementor-widget elementor-widget-nav-menu" data-id="a587e79" data-element_type="widget" data-e-type="widget" data-settings="{&quot;layout&quot;:&quot;horizontal&quot;,&quot;submenu_icon&quot;:{&quot;value&quot;:&quot;&lt;svg aria-hidden=\\&quot;true\\&quot; class=\\&quot;e-font-icon-svg e-fas-caret-down\\&quot; viewBox=\\&quot;0 0 320 512\\&quot; xmlns=\\&quot;http:\\/\\/www.w3.org\\/2000\\/svg\\&quot;&gt;&lt;path d=\\&quot;M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z\\&quot;&gt;&lt;\\/path&gt;&lt;\\/svg&gt;&quot;,&quot;library&quot;:&quot;fa-solid&quot;},&quot;toggle&quot;:&quot;burger&quot;}" data-widget_type="nav-menu.default">
				<div class="elementor-widget-container">
								<nav aria-label="Menu" class="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-underline e--animation-fade">
				<ul id="menu-1-a587e79" class="elementor-nav-menu"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-16842"><a href="/" class="elementor-item">Home</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13381"><a href="/about-us/" class="elementor-item">About Us</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom current-menu-ancestor current-menu-parent menu-item-has-children menu-item-8644"><a href="#" class="elementor-item elementor-item-anchor">Services</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13382"><a href="/search-engine-optimization/" class="elementor-sub-item">Search Engine Optimization</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item page-item-13403 current_page_item menu-item-13763"><a href="/digital-marketing/" aria-current="page" class="elementor-sub-item elementor-item-active">Digital Marketing</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13770"><a href="/web-development/" class="elementor-sub-item">Web Development</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13762"><a href="/cgi-videos/" class="elementor-sub-item">CGI Videos</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13765"><a href="/online-reputation-management/" class="elementor-sub-item">Online Reputation Management</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13764"><a href="/email-marketing/" class="elementor-sub-item">Email Marketing</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-19924"><a href="/blog/" class="elementor-item">Blog</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13383"><a href="/contact-us/" class="elementor-item">Contact Us</a></li>
</ul>			</nav>
					<div class="elementor-menu-toggle" role="button" tabindex="0" aria-label="Menu Toggle" aria-expanded="false">
			<svg aria-hidden="true" role="presentation" class="elementor-menu-toggle__icon--open e-font-icon-svg e-eicon-menu-bar" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z"></path></svg><svg aria-hidden="true" role="presentation" class="elementor-menu-toggle__icon--close e-font-icon-svg e-eicon-close" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z"></path></svg>		</div>
					<nav class="elementor-nav-menu--dropdown elementor-nav-menu__container" aria-hidden="true">
				<ul id="menu-2-a587e79" class="elementor-nav-menu"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-16842"><a href="/" class="elementor-item" tabindex="-1">Home</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13381"><a href="/about-us/" class="elementor-item" tabindex="-1">About Us</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom current-menu-ancestor current-menu-parent menu-item-has-children menu-item-8644"><a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">Services</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13382"><a href="/search-engine-optimization/" class="elementor-sub-item" tabindex="-1">Search Engine Optimization</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item page-item-13403 current_page_item menu-item-13763"><a href="/digital-marketing/" aria-current="page" class="elementor-sub-item elementor-item-active" tabindex="-1">Digital Marketing</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13770"><a href="/web-development/" class="elementor-sub-item" tabindex="-1">Web Development</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13762"><a href="/cgi-videos/" class="elementor-sub-item" tabindex="-1">CGI Videos</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13765"><a href="/online-reputation-management/" class="elementor-sub-item" tabindex="-1">Online Reputation Management</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13764"><a href="/email-marketing/" class="elementor-sub-item" tabindex="-1">Email Marketing</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-19924"><a href="/blog/" class="elementor-item" tabindex="-1">Blog</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13383"><a href="/contact-us/" class="elementor-item" tabindex="-1">Contact Us</a></li>
</ul>			</nav>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-003b0ba e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="003b0ba" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-4428926 elementor-widget-mobile__width-initial elementor-hidden-widescreen elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet_extra elementor-hidden-tablet elementor-hidden-mobile wcf-starter-animations-none elementor-widget elementor-widget-image" data-id="4428926" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="image.default">
				<div class="elementor-widget-container">
															<img width="768" height="305" class="attachment-large size-large wp-image-8655" alt="" srcset="/wp-content/uploads/2024/06/13-utopia-logo-012.png 1691w, /wp-content/uploads/2024/06/13-utopia-logo-012-350x139.png 350w, /wp-content/uploads/2024/06/13-utopia-logo-012-300x119.png 300w, /wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png 768w, /wp-content/uploads/2024/06/13-utopia-logo-012-1024x406.png 1024w, /wp-content/uploads/2024/06/13-utopia-logo-012-1536x609.png 1536w" sizes="(max-width: 768px) 48vw, 220px" src="/wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png">															</div>
				</div>
				</div>
				</div>
				</div>
			<!DOCTYPE html>
<html lang="en-US" prefix="og: https://ogp.me/ns#">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="pingback" href="/xmlrpc.php" />
	</head>

<body class="wp-singular page-template page-template-elementor_header_footer page page-id-13403 wp-theme-arolax wp-child-theme-arolax-child theme-arolax woocommerce-no-js ehf-header ehf-template-arolax ehf-stylesheet-arolax-child wcf-preloader-active joya-gl-blog arolax-base elementor-default elementor-template-full-width elementor-kit-3 elementor-page elementor-page-13403">

	<div class="cssload-inner cssload-two"></div>
	<div class="cssload-inner cssload-three"></div>
</div></div><!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PV7NKT5X"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->



<div id="wcf--top--scroll" hidden></div>
<!-- GTM Container placement set to automatic -->
<!-- Google Tag Manager (noscript) -->	<style id="hfe-skip-link-style">
		.hfe-skip-link{position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap;}
		.hfe-skip-link:focus{position:fixed;top:0;inset-inline-start:0;width:auto;height:auto;margin:0;padding:0.75em 1.5em;overflow:visible;clip:auto;clip-path:none;white-space:normal;z-index:100000;background:#fff;color:#0073aa;font-size:14px;text-decoration:underline;border-radius:0 0 3px 0;outline:2px solid #0073aa;outline-offset:-2px;}
	</style>
	<a class="hfe-skip-link" href="#content">Skip to main content</a><div id="page" class="hfeed site">

		<header id="masthead" itemscope="itemscope" itemtype="https://schema.org/WPHeader">
			<p class="main-title bhf-hidden" itemprop="headline"><a href="/" title="13 UTOPIA" rel="home">13 UTOPIA</a></p>
			<style>.elementor-17959 .elementor-element.elementor-element-01ec82b{--display:flex;--flex-direction:row;--container-widget-width:initial;--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--gap:0px 0px;--row-gap:0px;--column-gap:0px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:1.5vw;--padding-bottom:1.5vw;--padding-left:0vw;--padding-right:0vw;--z-index:10000;}.elementor-17959 .elementor-element.elementor-element-01ec82b:not(.elementor-motion-effects-element-type-background), .elementor-17959 .elementor-element.elementor-element-01ec82b > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:transparent;background-image:linear-gradient(180deg, #00000099 48%, #00000000 100%);}.elementor-17959 .elementor-element.elementor-element-01ec82b .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-17959 .elementor-element.elementor-element-11563fa{--display:flex;--flex-direction:column;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--justify-content:center;--align-items:flex-end;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-17959 .elementor-element.elementor-element-11563fa .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-widget-wcf--site-logo .widget-image-caption{color:var( --e-global-color-text );font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-17959 .elementor-element.elementor-element-6b5a46f > .elementor-widget-container{margin:0vw -3vw 0vw 4vw;padding:0vw 0vw 0vw 0vw;}.elementor-17959 .elementor-element.elementor-element-6b5a46f{text-align:right;}.elementor-17959 .elementor-element.elementor-element-6b5a46f img{width:73%;}.elementor-17959 .elementor-element.elementor-element-143806d{--display:flex;--flex-direction:column;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--justify-content:center;--align-items:center;}.elementor-17959 .elementor-element.elementor-element-143806d.e-con{--flex-grow:0;--flex-shrink:0;}.elementor-17959 .elementor-element.elementor-element-143806d .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-17959 .elementor-element.elementor-element-df73bd8 .desktop-menu-active .sub-menu{background-color:#000000;padding:10px 0px 10px 0px;}.elementor-17959 .elementor-element.elementor-element-df73bd8 .desktop-menu-active .sub-menu .menu-item a{background-color:#000000;font-size:1.1vw;border-style:none;padding:10px 10px 10px 15px;fill:#FFFFFF;color:#FFFFFF;}.elementor-17959 .elementor-element.elementor-element-df73bd8 .desktop-menu-active .sub-menu .menu-item a:hover, .elementor-17959 .elementor-element.elementor-element-df73bd8 .desktop-menu-active .sub-menu .menu-item a:focus{background-color:#FFFFFF;color:#000000;fill:#000000;}.elementor-17959 .elementor-element.elementor-element-df73bd8 .desktop-menu-active .menu-item a{font-family:"Roboto", Sans-serif;font-size:1.1vw;font-weight:600;text-transform:uppercase;fill:#FFFFFF;color:#FFFFFF;}.elementor-17959 .elementor-element.elementor-element-df73bd8 .nav-back-link{gap:50px;}.elementor-17959 .elementor-element.elementor-element-c54568d{--display:flex;--flex-direction:column;--container-widget-width:100%;--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-17959 .elementor-element.elementor-element-c54568d.e-con{--flex-grow:0;--flex-shrink:0;}.elementor-17959 .elementor-element.elementor-element-c54568d .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-17959 .elementor-element.elementor-element-3c09be8{--grid-template-columns:repeat(0, auto);width:var( --container-widget-width, 100% );max-width:100%;--container-widget-width:100%;--container-widget-flex-grow:0;--icon-size:1.5vw;--grid-column-gap:5px;--grid-row-gap:0px;}.elementor-17959 .elementor-element.elementor-element-3c09be8 .elementor-widget-container{text-align:right;}.elementor-17959 .elementor-element.elementor-element-3c09be8 .elementor-social-icon{background-color:#000000;--icon-padding:0.5em;}.elementor-17959 .elementor-element.elementor-element-3c09be8 .elementor-social-icon i{color:#FFFFFF;}.elementor-17959 .elementor-element.elementor-element-3c09be8 .elementor-social-icon svg{fill:#FFFFFF;}.elementor-17959 .elementor-element.elementor-element-3c09be8 .elementor-social-icon:hover{background-color:#1F1F1F;}@media(max-width:1366px){.elementor-17959 .elementor-element.elementor-element-3c09be8 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}}@media(max-width:1200px){.elementor-17959 .elementor-element.elementor-element-01ec82b{--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );}.elementor-17959 .elementor-element.elementor-element-11563fa{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-17959 .elementor-element.elementor-element-6b5a46f > .elementor-widget-container{margin:0vw 0vw 0vw 0vw;padding:0vw 0vw 0vw 0vw;}.elementor-17959 .elementor-element.elementor-element-6b5a46f{text-align:right;}.elementor-17959 .elementor-element.elementor-element-143806d{--justify-content:center;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-17959 .elementor-element.elementor-element-df73bd8 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-17959 .elementor-element.elementor-element-c54568d{--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );}}@media(max-width:1024px){.elementor-17959 .elementor-element.elementor-element-11563fa{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-17959 .elementor-element.elementor-element-6b5a46f > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-17959 .elementor-element.elementor-element-6b5a46f img{width:82%;}.elementor-17959 .elementor-element.elementor-element-143806d{--justify-content:center;--align-items:flex-end;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0vw;--padding-bottom:0vw;--padding-left:0vw;--padding-right:0vw;}.elementor-17959 .elementor-element.elementor-element-143806d.e-con{--align-self:flex-end;}.elementor-17959 .elementor-element.elementor-element-df73bd8{width:var( --container-widget-width, 3.5% );max-width:3.5%;--container-widget-width:3.5%;--container-widget-flex-grow:0;z-index:4;}.elementor-17959 .elementor-element.elementor-element-df73bd8 > .elementor-widget-container{margin:0.5vw 0vw 0vw 0vw;padding:0vw 0vw 0vw 0vw;}}@media(max-width:767px){.elementor-17959 .elementor-element.elementor-element-143806d{--width:67.2%;}.elementor-17959 .elementor-element.elementor-element-df73bd8{z-index:999;}.elementor-17959 .elementor-element.elementor-element-c54568d{--width:179.2%;}.elementor-17959 .elementor-element.elementor-element-3c09be8{--grid-template-columns:repeat(0, auto);--icon-size:6px;--grid-column-gap:5px;}.elementor-17959 .elementor-element.elementor-element-3c09be8 .elementor-widget-container{text-align:right;}.elementor-17959 .elementor-element.elementor-element-3c09be8 .elementor-social-icon{--icon-padding:0em;}}@media(min-width:768px){.elementor-17959 .elementor-element.elementor-element-11563fa{--width:14%;}.elementor-17959 .elementor-element.elementor-element-143806d{--width:70%;}.elementor-17959 .elementor-element.elementor-element-c54568d{--width:15%;}}@media(max-width:1366px) and (min-width:768px){.elementor-17959 .elementor-element.elementor-element-01ec82b{--width:100%;}}@media(max-width:1200px) and (min-width:768px){.elementor-17959 .elementor-element.elementor-element-143806d{--width:67%;}}@media(max-width:1024px) and (min-width:768px){.elementor-17959 .elementor-element.elementor-element-11563fa{--width:24%;}.elementor-17959 .elementor-element.elementor-element-143806d{--width:70%;}}/* Start custom CSS for wcf--nav-menu, class: .elementor-element-df73bd8 */.elementor-17959 .elementor-element.elementor-element-df73bd8{
    position: static;
}
.wcf__nav-menu.desktop-menu-active .menu-item-has-children .sub-menu{
    box-shadow: none;
}


.wcf__nav-menu.desktop-menu-active .menu-item-has-children .sub-menu .sub-menu{
    left: 110% !important;
}

.nav-back-link {
    gap: 10px;
}/* End custom CSS */</style>		<div data-elementor-type="wp-post" data-elementor-id="17959" class="elementor elementor-17959" data-elementor-post-type="elementor-hf">
				<div class="elementor-element elementor-element-01ec82b e-con-full elementor-hidden-mobile_extra elementor-hidden-mobile e-flex wcf-starter-animations-none e-con e-parent" data-id="01ec82b" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;gradient&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;,&quot;sticky&quot;:&quot;top&quot;,&quot;sticky_on&quot;:[&quot;widescreen&quot;,&quot;desktop&quot;,&quot;laptop&quot;,&quot;tablet_extra&quot;,&quot;tablet&quot;,&quot;mobile_extra&quot;,&quot;mobile&quot;],&quot;sticky_offset&quot;:0,&quot;sticky_effects_offset&quot;:0,&quot;sticky_anchor_link_offset&quot;:0}">
		<div class="elementor-element elementor-element-11563fa e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="11563fa" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-6b5a46f elementor-widget elementor-widget-wcf--site-logo" data-id="6b5a46f" data-element_type="widget" data-e-type="widget" data-widget_type="wcf--site-logo.default">
				<div class="elementor-widget-container">
										<div class="elementor-image">
															<a href="/"						aria-label="Site Logo">
										<img fetchpriority="high" width="768" height="305" class="attachment-full size-full wp-image-8655" alt="" srcset="/wp-content/uploads/2024/06/13-utopia-logo-012.png 1691w, /wp-content/uploads/2024/06/13-utopia-logo-012-350x139.png 350w, /wp-content/uploads/2024/06/13-utopia-logo-012-300x119.png 300w, /wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png 768w, /wp-content/uploads/2024/06/13-utopia-logo-012-1024x406.png 1024w, /wp-content/uploads/2024/06/13-utopia-logo-012-1536x609.png 1536w" sizes="(max-width: 768px) 48vw, 220px" src="/wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png">										</a>
																		</div>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-143806d e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="143806d" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;,&quot;sticky&quot;:&quot;top&quot;,&quot;sticky_on&quot;:[&quot;widescreen&quot;,&quot;desktop&quot;,&quot;laptop&quot;,&quot;tablet_extra&quot;,&quot;tablet&quot;,&quot;mobile_extra&quot;,&quot;mobile&quot;],&quot;sticky_offset&quot;:0,&quot;sticky_effects_offset&quot;:0,&quot;sticky_anchor_link_offset&quot;:0}">
				<div class="elementor-element elementor-element-df73bd8 elementor-widget-tablet__width-initial elementor-widget elementor-widget-wcf--nav-menu" data-id="df73bd8" data-element_type="widget" data-e-type="widget" data-settings="{&quot;mobile_menu_breakpoint&quot;:&quot;mobile&quot;}" data-widget_type="wcf--nav-menu.default">
				<div class="elementor-widget-container">
								<style>
				.wcf__nav-menu {
					display: none;
				}
				.wcf__nav-menu svg {
					width: 1em;
					height: 1em;
				}
				.wcf__nav-menu .wcf-submenu-indicator {
					display: inline-flex;
					justify-content: center;
					align-items: center;
					margin-left: auto;
					padding-left: 5px;
				}
				.wcf__nav-menu .wcf-menu-badge {
					display: none;
					font-size: 12px;
					font-weight: 500;
					line-height: 1;
					position: absolute;
					right: 15px;
					padding: 5px 10px;
					border-radius: 5px;
					background-color: var(--badge-bg);
					box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.1);
					margin-top: -22px;
				}
				.wcf__nav-menu .wcf-menu-badge:after {
					content: "";
					position: absolute;
					top: 100%;
					left: 50%;
					transform: translateX(-50%);
					border: 5px solid var(--badge-bg);
					border-bottom-color: transparent !important;
					border-inline-end-color: transparent !important;
					border-inline-end-width: 7px;
					border-inline-start-width: 0;
				}
				.wcf__nav-menu .wcf-menu-hamburger {
					margin-left: auto;
					cursor: pointer;
					font-size: 25px;
					padding: 4px 8px;
					border: 1px solid #dee1e7;
					outline: 0;
					background: 0 0;
					line-height: 1;
					display: inline-flex;
					align-items: center;
					justify-content: center;
				}
				.wcf__nav-menu.mobile-menu-active {
					display: block;
				}
				.wcf__nav-menu.mobile-menu-active .wcf-submenu-indicator {
					padding: 8px 10px;
					margin: -8px -10px -8px auto;
				}
				.wcf__nav-menu.mobile-menu-active .wcf-menu-hamburger {
					display: inline-block;
				}
				.wcf__nav-menu.mobile-menu-active .wcf-menu-close {
					align-self: flex-end;
					margin: 10px 10px 10px auto;
					padding: 8px 10px;
					border: 1px solid #555;
					outline: 0;
					background: 0 0;
					font-size: 15px;
					line-height: 1;
					cursor: pointer;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					min-width: 40px;
					min-height: 40px;
				}
				.wcf__nav-menu.mobile-menu-active .wcf-menu-overlay {
					position: fixed;
					top: 0;
					left: 0;
					z-index: 1000;
					background-color: rgba(0, 0, 0, 0.5);
					height: 100%;
					width: 100%;
					transition: 0.4s;
					opacity: 0;
					visibility: hidden;
					pointer-events: none; 
				}
				.wcf__nav-menu.mobile-menu-active.wcf-nav-is-toggled .wcf-nav-menu-container {
					transform: translateX(0);
					opacity: 1;            
					visibility: visible;   
					pointer-events: auto;  
				}
				.wcf__nav-menu.mobile-menu-active.wcf-nav-is-toggled .wcf-menu-overlay {
					opacity: 1;
					visibility: visible;
					pointer-events: auto;  
				}
				.wcf__nav-menu.mobile-menu-active .wcf-nav-menu-container {
					display: flex;
					flex-direction: column;
					position: fixed;
					z-index: 1001;
					top: 0;
					bottom: 0;
					width: 250px;
					background-color: #fff;
					overflow-y: auto;
					overflow-x: hidden;
					-webkit-overflow-scrolling: touch;
					transition: 0.45s;              
					height: 100dvh;             
					max-height: 100dvh;          
					opacity: 0;                  
					visibility: hidden;          
					pointer-events: none;
					transform: translateX(-100%);
					left: 0;       
				}
				.wcf__nav-menu.mobile-menu-active .wcf-nav-menu-container .wcf-nav-menu-nav {
					flex: 0 0 100%;
					padding: 0;
					margin: 0;
					order: 1;
				}
				.wcf__nav-menu.mobile-menu-active .menu-item {
					list-style: none;
				}
				.wcf__nav-menu.mobile-menu-active .menu-item:not(:last-child) a {
					border-bottom: solid 1px #dee1e7;
				}
				.wcf__nav-menu.mobile-menu-active .menu-item a {
					text-decoration: none;
					display: flex;
					padding: 0.5em 1em;
					font-size: 1rem;
					line-height: 1.5em;
					transition: 0.4s;
				}
				.wcf__nav-menu.mobile-menu-active .menu-item-has-children .sub-menu {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: #fff;
					transform: translateX(100%);
					transition: 0.3s;
					visibility: hidden;
					padding: 0;
					margin: 0;
					flex: 0 0 100%;
				}
				.wcf__nav-menu.mobile-menu-active .menu-item-has-children .sub-menu .nav-back-link {
					display: flex;
					align-items: center;
					background-color: #064af3;
					color: #fff;
					border: none !important;
				}
				.wcf__nav-menu.mobile-menu-active .menu-item-has-children.active > .sub-menu {
					transform: translateX(0);
					visibility: visible;
				}
				.wcf__nav-menu.mobile-menu-active .wcf-mega-menu .sub-menu {
					display: none;
				}
				.wcf__nav-menu.mobile-menu-active .wcf-mega-menu .wcf-mega-menu-panel {
					display: none;
					max-width: 100% !important;
					transition: 0.3s;
					opacity: 0;
					visibility: hidden;
				}
				.wcf__nav-menu.mobile-menu-active .wcf-mega-menu.active > .wcf-mega-menu-panel {
					display: block;
					opacity: 1;
					visibility: visible;
				}
				.wcf__nav-menu.mobile-menu-active .wcf-mega-menu.mobile-wp-submenu .wcf-mega-menu-panel {
					display: none !important;
				}
				.wcf__nav-menu.mobile-menu-active .wcf-mega-menu.mobile-wp-submenu .sub-menu {
					display: block;
				}
				.wcf__nav-menu.mobile-menu-active.mobile-menu-right .wcf-nav-menu-container {
					// transform: translateX(100%);
					right: 0;
					left: auto; 
					transform: translateX(0);
				}
				.wcf__nav-menu.mobile-menu-active.mobile-menu-left .wcf-nav-menu-container {
					// transform: translateX(-100%);
					left: 0; 
					transform: translateX(0);
				}
				.wcf__nav-menu.desktop-menu-active {
					display: block;
				}
				.wcf__nav-menu.desktop-menu-active .wcf-menu-close,
				.wcf__nav-menu.desktop-menu-active .wcf-menu-hamburger {
					display: none;
				}
				.wcf__nav-menu.desktop-menu-active .wcf-menu-badge {
					display: block;
				}
				.wcf__nav-menu.desktop-menu-active .wcf-nav-menu-nav {
					display: flex;
					flex-wrap: wrap;
					margin: 0;
					padding: 0;
				}
				.wcf__nav-menu.desktop-menu-active .wcf-nav-menu-nav.menu-layout-vertical {
					flex-direction: column;
				}
				.wcf__nav-menu.desktop-menu-active .wcf-nav-menu-nav.menu-layout-vertical .menu-item-has-children .sub-menu,
				.wcf__nav-menu.desktop-menu-active .wcf-nav-menu-nav.menu-layout-vertical .wcf-mega-menu .wcf-mega-menu-panel {
					left: 100%;
					top: auto;
				}
				.wcf__nav-menu.desktop-menu-active .menu-item {
					list-style: none;
					position: relative;
					white-space: nowrap;
				}
				.wcf__nav-menu.desktop-menu-active .menu-item a {
					position: relative;
					text-decoration: none;
					display: flex;
					padding: 0.5em 1em;
					transition: 0.4s;
					color: #1c1d20;
					fill: #1c1d20;
				}
				.wcf__nav-menu.desktop-menu-active .menu-item a:after {
					content: "";
					position: absolute;
					left: 0;
					transition: transform 0.25s ease-out;
					transform: scaleX(0);
					transform-origin: bottom right;
					height: 2px;
					width: 100%;
					background-color: #3f444b;
					z-index: 2;
				}
				.wcf__nav-menu.desktop-menu-active .menu-item-has-children .sub-menu {
					position: absolute;
					top: 100%;
					left: 0;
					transform: translateY(-10px);
					background: #fff;
					transition: 0.3s;
					padding: 0;
					margin: 0;
					box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
					min-width: 12em;
					z-index: 99;
					opacity: 0;
					visibility: hidden;
				}
				.wcf__nav-menu.desktop-menu-active .menu-item-has-children .sub-menu a {
					border-top: solid 1px #dee1e7;
				}
				.wcf__nav-menu.desktop-menu-active .menu-item-has-children .sub-menu .sub-menu {
					top: 0;
					left: 100%;
				}
				.wcf__nav-menu.desktop-menu-active .menu-item-has-children:not(.wcf-mega-menu):hover > .sub-menu {
					transform: translateY(0);
					opacity: 1;
					visibility: visible;
				}
				.wcf__nav-menu.desktop-menu-active .wcf-mega-menu.mega-position-static {
					position: static !important;
				}
				.wcf__nav-menu.desktop-menu-active .wcf-mega-menu .wcf-mega-menu-panel {
					position: absolute;
					top: 100%;
					left: 0;
					transform: translateY(-10px);
					transition: 0.3s;
					padding: 0;
					margin: 0;
					min-width: 12em;
					z-index: 99;
					opacity: 0;
					visibility: hidden;
				}
				.wcf__nav-menu.desktop-menu-active .wcf-mega-menu:hover > .wcf-mega-menu-panel {
					transform: translateY(0);
					opacity: 1;
					visibility: visible;
				}
				.wcf__nav-menu.desktop-menu-active.hover-pointer-dot a:after {
					width: 6px;
					height: 6px;
					border-radius: 100px;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%) scale(0);
					transform-origin: center;
				}
				.wcf__nav-menu.desktop-menu-active.hover-pointer-dot a:hover:after {
					transform: translateX(-50%) scale(1);
				}
				.wcf__nav-menu.desktop-menu-active.hover-pointer-underline a:after {
					bottom: 0;
				}
				.wcf__nav-menu.desktop-menu-active.hover-pointer-underline a:hover:after {
					transform: scaleX(1);
					transform-origin: bottom left;
				}
				.wcf__nav-menu.desktop-menu-active.hover-pointer-overline a:after {
					top: 0;
				}
				.wcf__nav-menu.desktop-menu-active.hover-pointer-overline a:hover:after {
					transform: scaleX(1);
					transform-origin: bottom left;
				}
				.wcf__nav-menu.desktop-menu-active.hover-pointer-line-through a:after {
					top: 50%;
					transform: translateY(-50%) scaleX(0);
				}
				.wcf__nav-menu.desktop-menu-active.hover-pointer-line-through a:hover:after {
					transform: translateY(-50%) scaleX(1);
					transform-origin: bottom left;
				}
				.wcf__nav-menu.desktop-menu-active.hover-pointer-flip a .menu-text {
					position: relative;
					transition: transform 0.3s;
					transform-origin: 50% 0;
					transform-style: preserve-3d;
				}
				.wcf__nav-menu.desktop-menu-active.hover-pointer-flip a .menu-text:before {
					position: absolute;
					top: 100%;
					left: 0;
					width: 100%;
					height: 100%;
					content: attr(data-text);
					transform: rotateX(-90deg);
					transform-origin: 50% 0;
					text-align: center;
				}
				.wcf__nav-menu.desktop-menu-active.hover-pointer-flip a:hover .menu-text {
					transform: rotateX(90deg) translateY(-12px);
				}

			</style>
		        <div class="mobile-sub-back" style="display: none">
			<svg aria-hidden="true" class="e-font-icon-svg e-fas-arrow-left" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path></svg>			Back        </div>
        <div class="wcf__nav-menu mobile-menu-active mobile-menu-right hover-pointer-">
            <button class="wcf-menu-hamburger" type="button" aria-label="hamburger-icon">
	            <svg aria-hidden="true" class="e-font-icon-svg e-fas-bars" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path></svg>            </button>
			<div class="wcf-nav-menu-container"><ul id="menu-home" class="wcf-nav-menu-nav menu-layout-horizontal"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-16842"><a href="/" class="wcf-nav-item">Home</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13381"><a href="/about-us/" class="wcf-nav-item">About Us</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom current-menu-ancestor current-menu-parent menu-item-has-children menu-item-8644"><a href="#" class="wcf-nav-item">Services<span class="wcf-submenu-indicator"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg></span></a>
<ul class="sub-menu">
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13382"><a href="/search-engine-optimization/">Search Engine Optimization</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item page-item-13403 current_page_item menu-item-13763"><a href="/digital-marketing/" aria-current="page">Digital Marketing</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13770"><a href="/web-development/">Web Development</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13762"><a href="/cgi-videos/">CGI Videos</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13765"><a href="/online-reputation-management/">Online Reputation Management</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13764"><a href="/email-marketing/">Email Marketing</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-19924"><a href="/blog/" class="wcf-nav-item">Blog</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13383"><a href="/contact-us/" class="wcf-nav-item">Contact Us</a></li>
</ul><button class="wcf-menu-close" type="button"><svg aria-hidden="true" class="e-font-icon-svg e-fas-times" viewBox="0 0 352 512" xmlns="http://www.w3.org/2000/svg"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg></button></div>            <div class="wcf-menu-overlay"></div>
		</div>
	
		            
		
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-c54568d e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="c54568d" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-3c09be8 e-grid-align-right elementor-grid-mobile-0 e-grid-align-mobile-right elementor-widget__width-initial elementor-shape-rounded elementor-grid-0 elementor-widget elementor-widget-social-icons" data-id="3c09be8" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_animation&quot;:&quot;none&quot;}" data-widget_type="social-icons.default">
				<div class="elementor-widget-container">
							<div class="elementor-social-icons-wrapper elementor-grid" role="list">
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-behance elementor-animation-grow elementor-repeater-item-4ce5a87" href="https://www.behance.net/13utopia" target="_blank">
						<span class="elementor-screen-only">Behance</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-behance" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-87.8-113.3-87.8H0v354.4h171.8c64.4 0 124.9-30.9 124.9-102.9 0-44.5-21.1-77.4-64.7-89.7zM77.9 135.9H151c28.1 0 53.4 7.9 53.4 40.5 0 30.1-19.7 42.2-47.5 42.2h-79v-82.7zm83.3 233.7H77.9V272h84.9c34.3 0 56 14.3 56 50.6 0 35.8-25.9 47-57.6 47zm358.5-240.7H376V94h143.7v34.9zM576 305.2c0-75.9-44.4-139.2-124.9-139.2-78.2 0-131.3 58.8-131.3 135.8 0 79.9 50.3 134.7 131.3 134.7 61.3 0 101-27.6 120.1-86.3H509c-6.7 21.9-34.3 33.5-55.7 33.5-41.3 0-63-24.2-63-65.3h185.1c.3-4.2.6-8.7.6-13.2zM390.4 274c2.3-33.7 24.7-54.8 58.5-54.8 35.4 0 53.2 20.8 56.2 54.8H390.4z"></path></svg>					</a>
				</span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-linkedin elementor-animation-grow elementor-repeater-item-b84bde8" href="https://www.linkedin.com/company/13utopia" target="_blank">
						<span class="elementor-screen-only">Linkedin</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-linkedin" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path></svg>					</a>
				</span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-animation-grow elementor-repeater-item-5e588bf" href="https://www.instagram.com/13_utopia_/" target="_blank">
						<span class="elementor-screen-only">Instagram</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-instagram" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>					</a>
				</span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-whatsapp elementor-animation-grow elementor-repeater-item-9799ce0" href="tel:9924131397" target="_blank">
						<span class="elementor-screen-only">Whatsapp</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-whatsapp" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>					</a>
				</span>
					</div>
						</div>
				</div>
				</div>
				</div>
				</div>
				</header>

			<div data-elementor-type="wp-page" data-elementor-id="13403" class="elementor elementor-13403" data-elementor-post-type="page">
				<div class="elementor-element elementor-element-12416249 hero-section e-con-full elementor-hidden-widescreen elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet_extra elementor-hidden-tablet elementor-hidden-mobile_extra e-flex wcf-starter-animations-none e-con e-parent" data-id="12416249" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
		<div class="elementor-element elementor-element-25d4ada3 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="25d4ada3" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-4ba6f0b8 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="4ba6f0b8" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-56984282 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="56984282" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				</div>
		<div class="elementor-element elementor-element-70e252a2 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="70e252a2" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-2fda67d elementor-hidden-widescreen elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet_extra elementor-hidden-tablet elementor-widget-mobile__width-initial elementor-widget elementor-widget-image-carousel" data-id="2fda67d" data-element_type="widget" data-e-type="widget" data-settings="{&quot;navigation&quot;:&quot;none&quot;,&quot;slides_to_show_mobile&quot;:&quot;1&quot;,&quot;autoplay&quot;:&quot;yes&quot;,&quot;pause_on_hover&quot;:&quot;yes&quot;,&quot;pause_on_interaction&quot;:&quot;yes&quot;,&quot;autoplay_speed&quot;:5000,&quot;infinite&quot;:&quot;yes&quot;,&quot;speed&quot;:500}" data-widget_type="image-carousel.default">
				<div class="elementor-widget-container">
							<div class="elementor-image-carousel-wrapper swiper" role="region" aria-roledescription="carousel" aria-label="Image Carousel" dir="ltr">
			<div class="elementor-image-carousel swiper-wrapper" aria-live="off">
								<div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="1 of 3"><figure class="swiper-slide-inner"><img decoding="async" class="swiper-slide-image" alt="DIGITAL MARKETING GREEK GOD 1" src="/wp-content/uploads/2024/10/P5-1.webp"></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="2 of 3"><figure class="swiper-slide-inner"><img decoding="async" class="swiper-slide-image" alt="DIGITAL MARKETING GREEK GOD 2" src="/wp-content/uploads/2024/10/P3-1.webp"></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="3 of 3"><figure class="swiper-slide-inner"><img decoding="async" class="swiper-slide-image" alt="DIGITAL MARKETING GREEK GOD 3" src="/wp-content/uploads/2024/10/P4-1.webp"></figure></div>			</div>
							
									</div>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-64ce3981 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="64ce3981" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-3b72e4c elementor-widget-mobile__width-initial wcf-starter-animations-none elementor-widget elementor-widget-heading" data-id="3b72e4c" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h1 class="elementor-heading-title elementor-size-default"> Poseidon Commanding The Waves, Representing Digital Traffic Flow.</h1>				</div>
				</div>
				<div class="elementor-element elementor-element-0de7a29 wcf-starter-animations-none elementor-widget elementor-widget-text-editor" data-id="0de7a29" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>From social media to paid ads, we create digital marketing strategies that engage and convert.</p>								</div>
				</div>
				<div class="elementor-element elementor-element-1751c30 elementor-widget elementor-widget-button" data-id="1751c30" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
									<div class="elementor-button-wrapper">
					<a class="elementor-button elementor-button-link elementor-size-sm" href="/contact-us/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Get a Custom Digital Marketing Plan</span>
					</span>
					</a>
				</div>
								</div>
				</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-4c45c0e9 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="4c45c0e9" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-7883d429 img-box-wrap-center elementor-hidden-mobile_extra elementor-hidden-mobile elementor-widget elementor-widget-wcf--image-box-slider" data-id="7883d429" data-element_type="widget" data-e-type="widget" data-widget_type="wcf--image-box-slider.default">
				<div class="elementor-widget-container">
							<div class="wcf__slider-wrapper wcf__image-box-slider" data-settings="{&quot;loop&quot;:true,&quot;speed&quot;:3000,&quot;allowTouchMove&quot;:true,&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20,&quot;autoplay&quot;:{&quot;delay&quot;:3000,&quot;disableOnInteraction&quot;:true,&quot;pauseOnMouseEnter&quot;:false},&quot;grid&quot;:{&quot;rows&quot;:null,&quot;fill&quot;:&quot;row&quot;},&quot;breakpoints&quot;:{&quot;767&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20},&quot;880&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20},&quot;1024&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20},&quot;1200&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20},&quot;1366&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20},&quot;2400&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20}},&quot;centeredSlides&quot;:&quot;&quot;,&quot;effect&quot;:&quot;cube&quot;,&quot;direction&quot;:&quot;horizontal&quot;,&quot;cubeEffect&quot;:{&quot;shadow&quot;:false,&quot;slideShadows&quot;:false,&quot;shadowOffset&quot;:20,&quot;shadowScale&quot;:0.94}}">

            <div class="wcf__slider swiper" dir="ltr" style="position: static">
                <div class="swiper-wrapper">
	                        <div class="swiper-slide">
			
            <div class="wcf--image-box style-1" >
            <div class="thumb">
	            <img decoding="async" class="swiper-slide-image" alt="Poseidon the God Of Digital Marketing" src="/wp-content/uploads/2024/10/P5.webp">				            </div>

            <div class="content">
                <div class="wrap">
					
					
                                        <div class="title-wrap">
                        
                        <h4 class="title">
	                                            </h4>
                    </div>
                     
                    
                                    </div>
            </div>
        </div>

        </div>
		        <div class="swiper-slide">
			
            <div class="wcf--image-box style-1 wcf--image-box style-1" >
            <div class="thumb">
	            <img decoding="async" class="swiper-slide-image" alt="Poseidon the God Of Digital Marketing 2" src="/wp-content/uploads/2024/10/P3.webp">				            </div>

            <div class="content">
                <div class="wrap">
					
					
                                        <div class="title-wrap">
                        
                        <h4 class="title">
	                                            </h4>
                    </div>
                     
                    
                                    </div>
            </div>
        </div>

        </div>
		        <div class="swiper-slide">
			
            <div class="wcf--image-box style-1 wcf--image-box style-1 wcf--image-box style-1" >
            <div class="thumb">
	            <img decoding="async" class="swiper-slide-image" alt="Poseidon the God Of Digital Marketing 3" src="/wp-content/uploads/2024/10/P4.webp">				            </div>

            <div class="content">
                <div class="wrap">
					
					
                                        <div class="title-wrap">
                        
                        <h4 class="title">
	                                            </h4>
                    </div>
                     
                    
                                    </div>
            </div>
        </div>

        </div>
		                </div>
            </div>

            <!-- navigation and pagination -->
														        </div>
        				</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-d316b59 e-con-full elementor-hidden-mobile e-flex wcf-starter-animations-none e-con e-parent" data-id="d316b59" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-bb59fe8 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="bb59fe8" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-5f02806 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="5f02806" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-73c58b2 wcf-starter-animations-none elementor-widget elementor-widget-heading" data-id="73c58b2" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h1 class="elementor-heading-title elementor-size-default"> Poseidon Commanding The Waves, Representing Digital Traffic Flow.</h1>				</div>
				</div>
				<div class="elementor-element elementor-element-9be21b6 elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-text-editor" data-id="9be21b6" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>From social media to paid ads, we create digital marketing strategies that engage and convert.</p>								</div>
				</div>
				<div class="elementor-element elementor-element-3cb33ba elementor-widget elementor-widget-button" data-id="3cb33ba" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
									<div class="elementor-button-wrapper">
					<a class="elementor-button elementor-button-link elementor-size-sm" href="/contact-us/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Get a Custom Digital Marketing Plan</span>
					</span>
					</a>
				</div>
								</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-758295a e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="758295a" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-fe8ec36 img-box-wrap-center elementor-hidden-mobile elementor-widget elementor-widget-wcf--image-box-slider" data-id="fe8ec36" data-element_type="widget" data-e-type="widget" data-widget_type="wcf--image-box-slider.default">
				<div class="elementor-widget-container">
							<div class="wcf__slider-wrapper wcf__image-box-slider" data-settings="{&quot;loop&quot;:true,&quot;speed&quot;:3000,&quot;allowTouchMove&quot;:true,&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20,&quot;autoplay&quot;:{&quot;delay&quot;:3000,&quot;disableOnInteraction&quot;:true,&quot;pauseOnMouseEnter&quot;:false},&quot;grid&quot;:{&quot;rows&quot;:null,&quot;fill&quot;:&quot;row&quot;},&quot;breakpoints&quot;:{&quot;767&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20},&quot;880&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20},&quot;1024&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20},&quot;1200&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20},&quot;1366&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20},&quot;2400&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;,&quot;spaceBetween&quot;:20}},&quot;centeredSlides&quot;:&quot;&quot;,&quot;effect&quot;:&quot;cube&quot;,&quot;direction&quot;:&quot;horizontal&quot;,&quot;cubeEffect&quot;:{&quot;shadow&quot;:false,&quot;slideShadows&quot;:false,&quot;shadowOffset&quot;:20,&quot;shadowScale&quot;:0.94}}">

            <div class="wcf__slider swiper" dir="ltr" style="position: static">
                <div class="swiper-wrapper">
	                        <div class="swiper-slide">
			
            <div class="wcf--image-box style-1" >
            <div class="thumb">
	            <img decoding="async" class="swiper-slide-image" alt="DIGITAL MARKETING GREEK GOD 1" src="/wp-content/uploads/2024/10/P5-1.webp">				            </div>

            <div class="content">
                <div class="wrap">
					
					
                                        <div class="title-wrap">
                        
                        <h4 class="title">
	                                            </h4>
                    </div>
                     
                    
                                    </div>
            </div>
        </div>

        </div>
		        <div class="swiper-slide">
			
            <div class="wcf--image-box style-1 wcf--image-box style-1" >
            <div class="thumb">
	            <img decoding="async" class="swiper-slide-image" alt="DIGITAL MARKETING GREEK GOD 2" src="/wp-content/uploads/2024/10/P3-1.webp">				            </div>

            <div class="content">
                <div class="wrap">
					
					
                                        <div class="title-wrap">
                        
                        <h4 class="title">
	                                            </h4>
                    </div>
                     
                    
                                    </div>
            </div>
        </div>

        </div>
		        <div class="swiper-slide">
			
            <div class="wcf--image-box style-1 wcf--image-box style-1 wcf--image-box style-1" >
            <div class="thumb">
	            <img decoding="async" class="swiper-slide-image" alt="DIGITAL MARKETING GREEK GOD 3" src="/wp-content/uploads/2024/10/P4-1.webp">				            </div>

            <div class="content">
                <div class="wrap">
					
					
                                        <div class="title-wrap">
                        
                        <h4 class="title">
	                                            </h4>
                    </div>
                     
                    
                                    </div>
            </div>
        </div>

        </div>
		                </div>
            </div>

            <!-- navigation and pagination -->
														        </div>
        				</div>
				</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-81f7890 elementor-hidden-widescreen elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet_extra elementor-hidden-tablet e-con-full e-flex wcf-starter-animations-none e-con e-parent" data-id="81f7890" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-e3a6bcf elementor-hidden-widescreen elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet_extra elementor-hidden-tablet wcf-starter-animations-none elementor-widget elementor-widget-heading" data-id="e3a6bcf" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">OUR CLIENTS</h2>				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-861127f e-con-full e-flex wcf-starter-animations-none e-con e-parent" data-id="861127f" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-602bd32 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="602bd32" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-e92ba81 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="e92ba81" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-b105fe7 elementor-hidden-mobile_extra elementor-hidden-mobile wcf-starter-animations-none elementor-widget elementor-widget-heading" data-id="b105fe7" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">OUR CLIENTS</h2>				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-2140bef e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="2140bef" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-85c6b02 elementor-widget elementor-widget-wcf--brand-slider" data-id="85c6b02" data-element_type="widget" data-e-type="widget" data-widget_type="wcf--brand-slider.default">
				<div class="elementor-widget-container">
							<div class="wcf__slider-wrapper wcf--brand-slider-wrapper " data-settings="{&quot;loop&quot;:true,&quot;speed&quot;:5000,&quot;allowTouchMove&quot;:false,&quot;slidesPerView&quot;:&quot;5&quot;,&quot;spaceBetween&quot;:80,&quot;autoplay&quot;:{&quot;delay&quot;:1,&quot;disableOnInteraction&quot;:true,&quot;pauseOnMouseEnter&quot;:false},&quot;grid&quot;:{&quot;rows&quot;:null,&quot;fill&quot;:&quot;row&quot;},&quot;breakpoints&quot;:{&quot;767&quot;:{&quot;slidesPerView&quot;:&quot;2&quot;,&quot;spaceBetween&quot;:80},&quot;880&quot;:{&quot;slidesPerView&quot;:&quot;4&quot;,&quot;spaceBetween&quot;:80},&quot;1024&quot;:{&quot;slidesPerView&quot;:&quot;3&quot;,&quot;spaceBetween&quot;:80},&quot;1200&quot;:{&quot;slidesPerView&quot;:&quot;5&quot;,&quot;spaceBetween&quot;:80},&quot;1366&quot;:{&quot;slidesPerView&quot;:&quot;5&quot;,&quot;spaceBetween&quot;:80},&quot;2400&quot;:{&quot;slidesPerView&quot;:&quot;5&quot;,&quot;spaceBetween&quot;:80}}}">
			<!-- Slider main container -->
			<div class="wcf__slider swiper" dir="ltr" style="position: static">
				<!-- Additional required wrapper -->
				<div class="swiper-wrapper">
					<!-- Slides -->
					<div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="chintamani post (17)" src="/wp-content/uploads/2026/05/chintamani-post-17.png"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="OOKO LOGO" src="/wp-content/uploads/2024/09/7.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Fujitec Expresss Logo" src="/wp-content/uploads/2026/05/Fujitec-Expresss-Logo-1.png"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Tanya&apos;s Dental House LOGO" src="/wp-content/uploads/2024/09/1.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="BAS Logp" src="/wp-content/uploads/2026/05/BAS-Logp-1.png"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="left-logo" src="/wp-content/uploads/2026/05/left-logo.png"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Odhani Concept LOGO" src="/wp-content/uploads/2024/09/2.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="VHNM LOGO" src="/wp-content/uploads/2024/09/4.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="ZuuZuu (2)" src="/wp-content/uploads/2026/05/ZuuZuu-2.png"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Navkar Tubes & Tools Logo" src="/wp-content/uploads/2024/09/6.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Pehnaava" src="/wp-content/uploads/2024/09/5-1.png"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Rayon Lab Tech LOGO" src="/wp-content/uploads/2025/01/Untitled-design-30-2.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Kripal Homes LOGO" src="/wp-content/uploads/2025/01/Untitled-design-30-3.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Gajjar LOGO" src="/wp-content/uploads/2025/01/Untitled-design-30-4.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="ZFL LOGO" src="/wp-content/uploads/2025/02/ZFL.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Shivangi Pancholi Logo" src="/wp-content/uploads/2025/02/Shivangi-.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Arteve" src="/wp-content/uploads/2025/02/Arteve.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Diet Diary LOGO" src="/wp-content/uploads/2025/02/Diet-Diary.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Zaab LOGO" src="/wp-content/uploads/2025/02/Zaab.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="SFW THE GYM" src="/wp-content/uploads/2025/09/2-3.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="RAJBHOG LOGO" src="/wp-content/uploads/2025/09/1-2.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="AXION LOGO" src="/wp-content/uploads/2025/09/4-1.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="TAKSONZ LOGO" src="/wp-content/uploads/2025/09/3-2.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="ZENITHIVE LOGO" src="/wp-content/uploads/2025/09/5-1.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="6 (1)" src="/wp-content/uploads/2025/09/6-1-e1756722299614.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="swaadus" src="/wp-content/uploads/2025/11/swaadus.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="zaign" src="/wp-content/uploads/2025/11/zaign.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Untitled design (51)" src="/wp-content/uploads/2025/11/Untitled-design-51.webp"></div><div class="swiper-slide"><img decoding="async" class="swiper-slide-image" alt="Untitled design (52)" src="/wp-content/uploads/2025/11/Untitled-design-52.webp"></div>				</div>
				<!-- navigation and pagination -->
									
									
			</div>
		</div>
						</div>
				</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-0cbe7c5 e-con-full e-flex wcf-starter-animations-none e-con e-parent" data-id="0cbe7c5" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-fd1dfe4 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="fd1dfe4" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-c9c599b wcf-starter-animations-none elementor-widget elementor-widget-wcf--image" data-id="c9c599b" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--image.default">
				<div class="elementor-widget-container">
							<div class="wcf--image">
							<img decoding="async" width="673" height="1200" class="attachment-full size-full wp-image-13472" alt="Increase Online Visibility with Digital Marketing" srcset="/wp-content/uploads/2024/09/Poseidon.webp 673w, /wp-content/uploads/2024/09/Poseidon-350x624.webp 350w, /wp-content/uploads/2024/09/Poseidon-168x300.webp 168w, /wp-content/uploads/2024/09/Poseidon-574x1024.webp 574w" sizes="(max-width: 673px) 100vw, 673px" src="/wp-content/uploads/2024/09/Poseidon.webp">						</div>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-a1f14ea e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="a1f14ea" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-8423b27 elementor-widget-laptop__width-initial wcf-starter-animations-none elementor-widget elementor-widget-wcf--title" data-id="8423b27" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--title.default">
				<div class="elementor-widget-container">
					<h2 class="wcf--title">What is Digital Marketing &amp; How Does It Impact Your Business?</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-8832a9d elementor-widget__width-initial elementor-widget-tablet__width-initial elementor-widget-mobile__width-initial elementor-widget-laptop__width-initial wcf-starter-animations-none elementor-widget elementor-widget-wcf--title" data-id="8832a9d" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--title.default">
				<div class="elementor-widget-container">
					<h2 class="wcf--title">Digital marketing</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-accccf6 elementor-widget__width-initial elementor-widget-laptop__width-initial elementor-widget-mobile__width-initial wcf-starter-animations-none elementor-widget elementor-widget-text-editor" data-id="accccf6" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Digital Marketing includes various forms of marketing such as SEO, Social Media Marketing, and Email Marketing wherein the aim is to drive targeted traffic to the company’s website and boost consumer interaction.</p>								</div>
				</div>
				<div class="elementor-element elementor-element-bb3411e elementor-align-center elementor-widget elementor-widget-button" data-id="bb3411e" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
									<div class="elementor-button-wrapper">
					<a class="elementor-button elementor-button-link elementor-size-sm" href="/contact-us/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Let's Connect</span>
					</span>
					</a>
				</div>
								</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-2d3ceb70 e-con-full e-flex wcf-starter-animations-none e-con e-parent" data-id="2d3ceb70" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
				<div class="elementor-element elementor-element-29396e9c title-position-before elementor-widget__width-initial elementor-widget elementor-widget-wcf--advance-slider" data-id="29396e9c" data-element_type="widget" data-e-type="widget" data-widget_type="wcf--advance-slider.default">
				<div class="elementor-widget-container">
					        <div class="advance_slider_wrapper" slider-type="posters" data-settings="{&quot;effect&quot;:&quot;fade&quot;,&quot;speed&quot;:600,&quot;resistanceRatio&quot;:0,&quot;grabCursor&quot;:true}">
            <div class="swiper-poster advance_slider swiper-container">
                <div class="swiper-wrapper">
					        <div class="swiper-slide">
            <img decoding="async" data-swiper-parallax-scale="1.1" alt="" src="/wp-content/uploads/2024/09/13.webp">

            <div class="swiper-slide-content">
												            </div>
        </div>
		        <div class="swiper-slide">
            <img decoding="async" data-swiper-parallax-scale="1.1" alt="" src="/wp-content/uploads/2024/09/14.webp">

            <div class="swiper-slide-content">
												            </div>
        </div>
		        <div class="swiper-slide">
            <img decoding="async" data-swiper-parallax-scale="1.1" alt="" src="/wp-content/uploads/2024/09/15.webp">

            <div class="swiper-slide-content">
												            </div>
        </div>
		        <div class="swiper-slide">
            <img decoding="async" data-swiper-parallax-scale="1.1" alt="" src="/wp-content/uploads/2024/09/Colorful-Playful-SEO-Informational-Presentation-3.webp">

            <div class="swiper-slide-content">
												            </div>
        </div>
		        <div class="swiper-slide">
            <img decoding="async" data-swiper-parallax-scale="1.1" alt="" src="/wp-content/uploads/2024/09/17.webp">

            <div class="swiper-slide-content">
												            </div>
        </div>
		                </div>
            </div>

														        </div>
						</div>
				</div>
				<div class="elementor-element elementor-element-d9ce375 wcf-starter-animations-none elementor-widget elementor-widget-wcf--title" data-id="d9ce375" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--title.default">
				<div class="elementor-widget-container">
					<h2 class="wcf--title">Essential SEO Steps for Success</h2>				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-82f016b e-con-full e-flex wcf-starter-animations-none e-con e-parent" data-id="82f016b" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
		<div class="elementor-element elementor-element-917b6f3 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="917b6f3" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
		<div class="elementor-element elementor-element-49290e2 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="49290e2" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-8ec139a e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="8ec139a" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-c60b5e4 elementor-widget-mobile__width-initial wcf-starter-animations-none elementor-widget elementor-widget-wcf--title" data-id="c60b5e4" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--title.default">
				<div class="elementor-widget-container">
					<h2 class="wcf--title">Benefits of Digital Marketing</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-8f6779a wcf-starter-animations-none elementor-widget elementor-widget-text-editor" data-id="8f6779a" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Why Choose Our Digital Marketing Services?</p>								</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-e3b7306 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="e3b7306" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-90362b5 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="90362b5" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-c2429f5 elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-wcf--image" data-id="c2429f5" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--image.default">
				<div class="elementor-widget-container">
							<div class="wcf--image">
							<img decoding="async" width="150" height="150" class="attachment-full size-full wp-image-13820" alt="Increase Traffic" srcset="/wp-content/uploads/2024/10/digitalicon2.webp 150w, /wp-content/uploads/2024/10/digitalicon2-100x100.webp 100w" sizes="(max-width: 150px) 100vw, 150px" src="/wp-content/uploads/2024/10/digitalicon2.webp">						</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-1b45b38 elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-heading" data-id="1b45b38" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Increase Traffic</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-be712bb elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-text-editor" data-id="be712bb" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<div class="flex-shrink-0 flex flex-col relative items-end"><div class="pt-0"><div class="gizmo-bot-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full"><div class="relative p-1 rounded-sm flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8"><p>Take advantage of niche SEO techniques, content marketing, and social media promotion. Get more visitors to improve your website engagement and reach more people.</p></div></div></div></div>								</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-c997c84 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="c997c84" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-6b3f0c9 elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-wcf--image" data-id="6b3f0c9" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--image.default">
				<div class="elementor-widget-container">
							<div class="wcf--image">
							<img loading="lazy" decoding="async" width="150" height="150" class="attachment-full size-full wp-image-13817" alt="Engage Target Audience" srcset="/wp-content/uploads/2024/10/digitalicon3.webp 150w, /wp-content/uploads/2024/10/digitalicon3-100x100.webp 100w" sizes="(max-width: 150px) 100vw, 150px" src="/wp-content/uploads/2024/10/digitalicon3.webp">						</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-f67684a elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-heading" data-id="f67684a" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Engage Target Audience</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-df674f4 elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-text-editor" data-id="df674f4" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<div class="flex-shrink-0 flex flex-col relative items-end"><div class="pt-0"><div class="gizmo-bot-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full"><div class="relative p-1 rounded-sm flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8"><p>You can reach out to your specific audience by offering them relevant information, improving interactions, and applying content analytics. Establish impact connections and boost audience participation.</p></div></div></div></div>								</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-af193c4 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="af193c4" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-58a1205 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="58a1205" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-a9523b5 elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-wcf--image" data-id="a9523b5" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--image.default">
				<div class="elementor-widget-container">
							<div class="wcf--image">
							<img loading="lazy" decoding="async" width="150" height="150" class="attachment-full size-full wp-image-13818" alt="Generate Qualified Leads" srcset="/wp-content/uploads/2024/10/digitalicon4.webp 150w, /wp-content/uploads/2024/10/digitalicon4-100x100.webp 100w" sizes="(max-width: 150px) 100vw, 150px" src="/wp-content/uploads/2024/10/digitalicon4.webp">						</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-e9080fd elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-heading" data-id="e9080fd" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Generate Qualified Leads</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-777d474 elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-text-editor" data-id="777d474" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<div class="flex-shrink-0 flex flex-col relative items-end"><div class="pt-0"><div class="gizmo-bot-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full"><div class="relative p-1 rounded-sm flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8"><p>Increase your chances of landing qualified prospects by using useful content, optimizing the web pages, and running targeted advertisements. Get leads who are more likely to become loyal customers.</p></div></div></div></div>								</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-054a2a0 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="054a2a0" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-ffedd42 elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-wcf--image" data-id="ffedd42" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--image.default">
				<div class="elementor-widget-container">
							<div class="wcf--image">
							<img loading="lazy" decoding="async" width="150" height="150" class="attachment-full size-full wp-image-13819" alt="Maximize ROI" srcset="/wp-content/uploads/2024/10/digitalicon1.webp 150w, /wp-content/uploads/2024/10/digitalicon1-100x100.webp 100w" sizes="(max-width: 150px) 100vw, 150px" src="/wp-content/uploads/2024/10/digitalicon1.webp">						</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-d58c845 elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-heading" data-id="d58c845" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Get the Best Returns on Investment</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-dcfeb56 elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-text-editor" data-id="dcfeb56" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<div class="flex-shrink-0 flex flex-col relative items-end"><div class="pt-0"><div class="gizmo-bot-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full"><div class="relative p-1 rounded-sm flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8"><p>To increase ROI, refine your marketing processes, double down on channels that drive the most value, and analyze results periodically. Obtain greater outcomes with less expenditure and get finances back easily.</p></div></div></div></div>								</div>
				</div>
				</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-7f60ac7 e-con-full e-flex wcf-starter-animations-none e-con e-parent" data-id="7f60ac7" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
		<div class="elementor-element elementor-element-a7d1887 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="a7d1887" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-aab7457 elementor-widget-laptop__width-initial wcf-starter-animations-none elementor-widget elementor-widget-heading" data-id="aab7457" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">What Our Clients Say</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-5e4b8a4 elementor-widget__width-initial elementor-widget-laptop__width-initial wcf-starter-animations-none elementor-widget elementor-widget-text-editor" data-id="5e4b8a4" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Our clients have seen the divine impact of our work. Hear their stories of digital success.</p>								</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-ab5596e e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="ab5596e" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-67a5a09 elementor-widget__width-initial elementor-widget elementor-widget-arolax--testimonial" data-id="67a5a09" data-element_type="widget" data-e-type="widget" data-widget_type="arolax--testimonial.default">
				<div class="elementor-widget-container">
					        <div class="arolax_testimonial_wrapper arolax__testimonial-4" data-settings="{&quot;loop&quot;:true,&quot;speed&quot;:500,&quot;allowTouchMove&quot;:&quot;false&quot;,&quot;slidesPerView&quot;:&quot;1&quot;,&quot;spaceBetween&quot;:20,&quot;effect&quot;:&quot;cards&quot;,&quot;autoplay&quot;:{&quot;delay&quot;:3000,&quot;disableOnInteraction&quot;:&quot;true&quot;},&quot;pagination&quot;:{&quot;el&quot;:&quot;.elementor-element-67a5a09 .swiper-pagination&quot;,&quot;clickable&quot;:true},&quot;breakpoints&quot;:{&quot;767&quot;:{&quot;slidesPerView&quot;:&quot;1&quot;},&quot;880&quot;:{&quot;slidesPerView&quot;:&quot;1&quot;},&quot;1024&quot;:{&quot;slidesPerView&quot;:&quot;1&quot;},&quot;1200&quot;:{&quot;slidesPerView&quot;:&quot;1&quot;},&quot;1366&quot;:{&quot;slidesPerView&quot;:&quot;1&quot;},&quot;2400&quot;:{&quot;slidesPerView&quot;:&quot;1&quot;}}}">

            <div class="arolax_testimonial_slider swiper" style="position: static" dir="ltr">
                <div class="swiper-wrapper">
					                        <div class="swiper-slide">
	                                <div class="slide elementor-repeater-item-6af42b7">
            <div class="content">
				                    <div class="logo">
                        <img decoding="async" alt="Quote" src="/wp-content/uploads/2024/07/rating.png">
                    </div>
				                <div class="top_text">Default Text </div>
                <div class="feedback">
					Working with 13 Utopia has been a game changer for our business. Their digital marketing expertise helped us revamp our online presence and increase our customer engagement. The team is incredibly professional, creative, and results-driven. Within just a few months, we saw a significant boost in our website traffic and social media engagement. Highly recommend them for anyone looking to grow their brand online!                </div>
				                    <div class="quote">
                        <img decoding="async" alt="Quote" src="/wp-content/uploads/2024/07/quote-style-1.svg">
                    </div>
				            </div>
            <div class="wrap">
				                <div class="info">
                    <div class="name">Anjali Mehra</div>
                    <div class="designation">Marketing Head, Trendify Fashion</div>
                </div>
            </div>
        </div>
		                        </div>
					                        <div class="swiper-slide">
	                                <div class="slide elementor-repeater-item-f22b06c">
            <div class="content">
				                    <div class="logo">
                        <img decoding="async" alt="Quote" src="/wp-content/uploads/2024/07/rating.png">
                    </div>
				                <div class="top_text">Default Text </div>
                <div class="feedback">
					The team at 13 Utopia took time to understand our business goals and tailored a digital marketing plan that perfectly aligned with our needs. They handled everything from our website redesign to our social media strategy. The growth in our online presence has been remarkable, with a noticeable uptick in both traffic and conversions. They are truly experts in their field.                </div>
				                    <div class="quote">
                        <img decoding="async" alt="Quote" src="/wp-content/uploads/2024/07/quote-style-1.svg">
                    </div>
				            </div>
            <div class="wrap">
				                <div class="info">
                    <div class="name">Sonal Agarwal</div>
                    <div class="designation">Operations Head, UrbanEats Café</div>
                </div>
            </div>
        </div>
		                        </div>
					                        <div class="swiper-slide">
	                                <div class="slide elementor-repeater-item-152eb57">
            <div class="content">
				                    <div class="logo">
                        <img decoding="async" alt="Quote" src="/wp-content/uploads/2024/07/rating.png">
                    </div>
				                <div class="top_text">Default Text </div>
                <div class="feedback">
					13 Utopia completely transformed our digital presence. We were struggling with low website traffic and poor online visibility, but their SEO and PPC campaigns turned things around. In just a few months, we saw a 40% increase in online inquiries and an incredible improvement in search engine rankings. Their professionalism and expertise are unmatched!                </div>
				                    <div class="quote">
                        <img decoding="async" alt="Quote" src="/wp-content/uploads/2024/07/quote-style-1.svg">
                    </div>
				            </div>
            <div class="wrap">
				                <div class="info">
                    <div class="name">Aditya Deshmukh</div>
                    <div class="designation">Managing Director, Apex Industrial Solutions</div>
                </div>
            </div>
        </div>
		                        </div>
					                </div>
            </div>

            <!-- navigation and pagination -->
							
				                    <div class="ts-pagination">
                        <div class="swiper-pagination"></div>
                    </div>
							        </div>
						</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-1cac352 e-con-full e-flex wcf-starter-animations-none e-con e-parent" data-id="1cac352" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-c04afbe e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="c04afbe" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-0055a4b elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget-tablet__width-initial wcf-starter-animations-none elementor-widget elementor-widget-wcf--text" data-id="0055a4b" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--text.default">
				<div class="elementor-widget-container">
					<div class="wcf--text"><p>Boost your online presence with 13utopia’s innovative digital marketing solutions.</p></div>				</div>
				</div>
				<div class="elementor-element elementor-element-74bebff elementor-widget elementor-widget-wcf--button" data-id="74bebff" data-element_type="widget" data-e-type="widget" data-widget_type="wcf--button.default">
				<div class="elementor-widget-container">
							<div class="wcf__btn icon-position-after">
							<a href="/contact-us/" class="wcf-btn-underline">
					<svg xmlns="http://www.w3.org/2000/svg" width="21" height="7" viewBox="0 0 21 7" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.726 0.366792C12.0758 -0.0606525 12.7058 -0.123655 13.1332 0.226073L20.8014 6.50003H1C0.447715 6.50003 0 6.05231 0 5.50003C0 4.94775 0.447715 4.50003 1 4.50003H15.1986L11.8668 1.77399C11.4393 1.42426 11.3763 0.794237 11.726 0.366792Z" fill="white"></path></svg>					Let’s get in touch				</a>
						</div>
						</div>
				</div>
				</div>
				</div>
				</div>
		<style id="elementor-post-1386">.elementor-1386 .elementor-element.elementor-element-13729f5{--display:flex;--flex-direction:column;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--justify-content:center;--align-items:center;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-13729f5:not(.elementor-motion-effects-element-type-background), .elementor-1386 .elementor-element.elementor-element-13729f5 > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:#121212;}.elementor-1386 .elementor-element.elementor-element-13729f5 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-708a3cc{--display:flex;--flex-direction:row;--container-widget-width:initial;--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-708a3cc .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-7addd77d{--display:flex;--gap:2vw 2vw;--row-gap:2vw;--column-gap:2vw;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-7addd77d .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-widget-wcf--site-logo .widget-image-caption{color:var( --e-global-color-text );font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-1386 .elementor-element.elementor-element-1d8cd9d5 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-1d8cd9d5 img{width:42%;}.elementor-1386 .elementor-element.elementor-element-6c579561 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-6c579561 .wcf--social-icons ul{display:flex;flex-direction:row;gap:15px;}.elementor-1386 .elementor-element.elementor-element-6c579561 .wcf-social-icon{color:#9A9A9A;fill:#9A9A9A;--icon-size:18px;}.elementor-1386 .elementor-element.elementor-element-6c579561 .wcf-social-icon:hover, .elementor-1386 .elementor-element.elementor-element-6c579561 .wcf-social-icon:focus{color:#FFFFFF;fill:#FFFFFF;}.elementor-widget-icon-list .elementor-icon-list-item:not(:last-child):after{border-color:var( --e-global-color-text );}.elementor-widget-icon-list .elementor-icon-list-icon i{color:var( --e-global-color-primary );}.elementor-widget-icon-list .elementor-icon-list-icon svg{fill:var( --e-global-color-primary );}.elementor-widget-icon-list .elementor-icon-list-item > .elementor-icon-list-text, .elementor-widget-icon-list .elementor-icon-list-item > a{font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-widget-icon-list .elementor-icon-list-text{color:var( --e-global-color-secondary );}.elementor-1386 .elementor-element.elementor-element-45808f0 > .elementor-widget-container{margin:0px 0px 0px 1px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-45808f0{z-index:999;--e-icon-list-icon-size:14px;--icon-vertical-offset:-2px;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-icon{padding-inline-end:0px;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.3vw;font-weight:400;line-height:1.4em;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-text{color:#BBBBBB;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-3d0bc2db{--display:flex;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-3d0bc2db .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-2b63802b{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-1386 .elementor-element.elementor-element-2b63802b .wcf--title{color:#FFFFFF;font-family:"Teko", Sans-serif;font-size:1.9vw;font-weight:600;text-transform:uppercase;line-height:28.5px;}.elementor-1386 .elementor-element.elementor-element-2b63802b .wcf--title .highlight{color:#f00000;}.elementor-1386 .elementor-element.elementor-element-8a68bcc{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;width:var( --container-widget-width, 94% );max-width:94%;--container-widget-width:94%;--container-widget-flex-grow:0;}.elementor-1386 .elementor-element.elementor-element-8a68bcc .wcf--text{color:#999999;}.elementor-1386 .elementor-element.elementor-element-8a68bcc .wcf--text, .elementor-1386 .elementor-element.elementor-element-8a68bcc .wcf--text *{font-family:"Kanit", Sans-serif;font-size:1.2vw;font-weight:500;line-height:1.5em;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--display:flex;--flex-direction:column;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--align-items:flex-start;--padding-top:0vw;--padding-bottom:0vw;--padding-left:3vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-13ef23df .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-234e1291{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-1386 .elementor-element.elementor-element-234e1291 .wcf--title{color:#FFFFFF;font-family:"Teko", Sans-serif;font-size:1.9vw;font-weight:600;line-height:28.5px;}.elementor-1386 .elementor-element.elementor-element-234e1291 .wcf--title .highlight{color:#f00000;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:last-child){padding-block-end:calc(0.5em/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:first-child){margin-block-start:calc(0.5em/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item{margin-inline:calc(0.5em/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items.elementor-inline-items{margin-inline:calc(-0.5em/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item:after{inset-inline-end:calc(-0.5em/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-17fab581{--icon-vertical-offset:0px;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.2vw;text-transform:capitalize;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-text{color:#666666;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-20d1018e{--display:flex;--gap:0px 0px;--row-gap:0px;--column-gap:0px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-20d1018e .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-5ff57893{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-1386 .elementor-element.elementor-element-5ff57893 .wcf--title{color:#FFFFFF;font-family:"Teko", Sans-serif;font-size:1.9vw;font-weight:600;text-transform:uppercase;line-height:28.5px;}.elementor-1386 .elementor-element.elementor-element-5ff57893 .wcf--title .highlight{color:#f00000;}.elementor-1386 .elementor-element.elementor-element-ef3e567{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;width:var( --container-widget-width, 97% );max-width:97%;--container-widget-width:97%;--container-widget-flex-grow:0;}.elementor-1386 .elementor-element.elementor-element-ef3e567 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:1vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text{color:#666666;text-shadow:0px 0px 10px rgba(0,0,0,0.3);}.elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text, .elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text *{font-family:"Kanit", Sans-serif;font-size:1.2vw;font-weight:400;line-height:1.6em;}.elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text a:hover,.elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text a:focus{color:#FFFFFF !important;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 0.7vw 0vw;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e{--e-icon-list-icon-size:14px;--icon-vertical-offset:0px;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.3vw;font-weight:400;line-height:23.5px;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-text{color:#666666;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-4858f99f > .elementor-widget-container{margin:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-4858f99f{--e-icon-list-icon-size:14px;--icon-vertical-offset:0px;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.3vw;font-weight:400;line-height:23.5px;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-text{color:#666666;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-49f74ea{--display:flex;--flex-direction:column;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--justify-content:center;--align-items:center;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-49f74ea:not(.elementor-motion-effects-element-type-background), .elementor-1386 .elementor-element.elementor-element-49f74ea > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:#121212;}.elementor-1386 .elementor-element.elementor-element-49f74ea .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-be5d338{--display:flex;--flex-direction:row;--container-widget-width:initial;--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-be5d338 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--display:flex;--gap:2vw 2vw;--row-gap:2vw;--column-gap:2vw;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-7b03cf1 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-117b99a > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-117b99a img{width:42%;}.elementor-1386 .elementor-element.elementor-element-e34a3a5{--display:flex;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-e34a3a5 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-9adfccc{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;width:var( --container-widget-width, 310px );max-width:310px;--container-widget-width:310px;--container-widget-flex-grow:0;}.elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text{color:#999999;}.elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text, .elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text *{font-family:"Kanit", Sans-serif;font-size:1.2vw;font-weight:500;line-height:23.5px;}.elementor-widget-form .elementor-field-group > label, .elementor-widget-form .elementor-field-subgroup label{color:var( --e-global-color-text );}.elementor-widget-form .elementor-field-group > label{font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-widget-form .elementor-field-type-html{color:var( --e-global-color-text );font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-widget-form .elementor-field-group .elementor-field{color:var( --e-global-color-text );}.elementor-widget-form .elementor-field-group .elementor-field, .elementor-widget-form .elementor-field-subgroup label{font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-widget-form .elementor-button{font-family:var( --e-global-typography-accent-font-family ), Sans-serif;font-weight:var( --e-global-typography-accent-font-weight );}.elementor-widget-form .e-form__buttons__wrapper__button-next{background-color:var( --e-global-color-accent );}.elementor-widget-form .elementor-button[type="submit"]{background-color:var( --e-global-color-accent );}.elementor-widget-form .e-form__buttons__wrapper__button-previous{background-color:var( --e-global-color-accent );}.elementor-widget-form .elementor-message{font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-widget-form .e-form__indicators__indicator, .elementor-widget-form .e-form__indicators__indicator__label{font-family:var( --e-global-typography-accent-font-family ), Sans-serif;font-weight:var( --e-global-typography-accent-font-weight );}.elementor-widget-form{--e-form-steps-indicator-inactive-primary-color:var( --e-global-color-text );--e-form-steps-indicator-active-primary-color:var( --e-global-color-accent );--e-form-steps-indicator-completed-primary-color:var( --e-global-color-accent );--e-form-steps-indicator-progress-color:var( --e-global-color-accent );--e-form-steps-indicator-progress-background-color:var( --e-global-color-text );--e-form-steps-indicator-progress-meter-color:var( --e-global-color-text );}.elementor-widget-form .e-form__indicators__indicator__progress__meter{font-family:var( --e-global-typography-accent-font-family ), Sans-serif;font-weight:var( --e-global-typography-accent-font-weight );}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group{padding-right:calc( 0.6em/2 );padding-left:calc( 0.6em/2 );margin-bottom:0.2em;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-form-fields-wrapper{margin-left:calc( -0.6em/2 );margin-right:calc( -0.6em/2 );margin-bottom:-0.2em;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group.recaptcha_v3-bottomleft, .elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group.recaptcha_v3-bottomright{margin-bottom:0;}body.rtl .elementor-1386 .elementor-element.elementor-element-449b258 .elementor-labels-inline .elementor-field-group > label{padding-left:0px;}body:not(.rtl) .elementor-1386 .elementor-element.elementor-element-449b258 .elementor-labels-inline .elementor-field-group > label{padding-right:0px;}body .elementor-1386 .elementor-element.elementor-element-449b258 .elementor-labels-above .elementor-field-group > label{padding-bottom:0px;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group > label{font-family:"Roboto", Sans-serif;font-weight:400;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-type-html{padding-bottom:0px;font-family:"Roboto", Sans-serif;font-weight:400;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group .elementor-field, .elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-subgroup label{font-family:"Roboto", Sans-serif;font-size:1.1vw;font-weight:400;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group .elementor-field:not(.elementor-select-wrapper){background-color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group .elementor-select-wrapper select{background-color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-button{font-family:"Roboto", Sans-serif;font-size:1.3vw;font-weight:500;}.elementor-1386 .elementor-element.elementor-element-449b258 .e-form__buttons__wrapper__button-next{color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-button[type="submit"]{color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-button[type="submit"] svg *{fill:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .e-form__buttons__wrapper__button-previous{color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .e-form__buttons__wrapper__button-next:hover{background-color:#393939;color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-button[type="submit"]:hover{background-color:#393939;color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-button[type="submit"]:hover svg *{fill:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .e-form__buttons__wrapper__button-previous:hover{color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-message{font-family:"Roboto", Sans-serif;font-size:1.1vw;font-weight:400;}.elementor-1386 .elementor-element.elementor-element-449b258 .e-form__indicators__indicator, .elementor-1386 .elementor-element.elementor-element-449b258 .e-form__indicators__indicator__label{font-family:"Roboto", Sans-serif;font-size:1.1vw;font-weight:500;}.elementor-1386 .elementor-element.elementor-element-449b258{--e-form-steps-indicators-spacing:20px;--e-form-steps-indicator-padding:30px;--e-form-steps-indicator-inactive-secondary-color:#ffffff;--e-form-steps-indicator-active-secondary-color:#ffffff;--e-form-steps-indicator-completed-secondary-color:#ffffff;--e-form-steps-divider-width:1px;--e-form-steps-divider-gap:10px;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--display:flex;--flex-direction:column;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--align-items:flex-start;--padding-top:0vw;--padding-bottom:0vw;--padding-left:3vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-bb475ec .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-cbbe166{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-1386 .elementor-element.elementor-element-cbbe166 .wcf--title{color:#FFFFFF;font-family:"Teko", Sans-serif;font-size:1.9vw;font-weight:600;line-height:28.5px;}.elementor-1386 .elementor-element.elementor-element-cbbe166 .wcf--title .highlight{color:#f00000;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:last-child){padding-block-end:calc(0.5em/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:first-child){margin-block-start:calc(0.5em/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item{margin-inline:calc(0.5em/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items.elementor-inline-items{margin-inline:calc(-0.5em/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item:after{inset-inline-end:calc(-0.5em/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-de20c35{--icon-vertical-offset:0px;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.2vw;text-transform:capitalize;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-text{color:#8D8D8D;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-dbff959{--display:flex;--gap:0px 0px;--row-gap:0px;--column-gap:0px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-dbff959 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-a4b8994{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-1386 .elementor-element.elementor-element-a4b8994 .wcf--title{color:#FFFFFF;font-family:"Teko", Sans-serif;font-size:1.9vw;font-weight:600;text-transform:uppercase;line-height:28.5px;}.elementor-1386 .elementor-element.elementor-element-a4b8994 .wcf--title .highlight{color:#f00000;}.elementor-1386 .elementor-element.elementor-element-53ba325{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;width:var( --container-widget-width, 72% );max-width:72%;--container-widget-width:72%;--container-widget-flex-grow:0;}.elementor-1386 .elementor-element.elementor-element-53ba325 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:1vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text{color:#9B9B9B;}.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text, .elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text *{font-family:"Kanit", Sans-serif;font-size:1.2vw;font-weight:400;line-height:23.5px;}.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text a:hover,.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text a:focus{color:#FFFFFF !important;}.elementor-1386 .elementor-element.elementor-element-687b393 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 0.7vw 0vw;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-687b393{--e-icon-list-icon-size:14px;--icon-vertical-offset:0px;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.3vw;font-weight:400;line-height:23.5px;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-text{color:#9B9B9B;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 > .elementor-widget-container{margin:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-0bea3e6{--e-icon-list-icon-size:14px;--icon-vertical-offset:0px;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:16px;font-weight:400;line-height:23.5px;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-text{color:#9B9B9B;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-827339d{--display:flex;}.elementor-1386 .elementor-element.elementor-element-827339d .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-18bfa81{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-1386 .elementor-element.elementor-element-18bfa81 .wcf--title{color:#FFFFFF;font-family:"Teko", Sans-serif;font-size:1.9vw;font-weight:600;text-transform:uppercase;line-height:28.5px;}.elementor-1386 .elementor-element.elementor-element-18bfa81 .wcf--title .highlight{color:#f00000;}.elementor-1386 .elementor-element.elementor-element-f301f1b > .elementor-widget-container{margin:0px 0px 0px 1px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-f301f1b{z-index:999;--e-icon-list-icon-size:14px;--icon-vertical-offset:-2px;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-icon{padding-inline-end:0px;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.3vw;font-weight:400;line-height:1.4em;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-text{color:#BBBBBB;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-38c77ca > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-38c77ca .wcf--social-icons ul{display:flex;flex-direction:row;gap:15px;}.elementor-1386 .elementor-element.elementor-element-38c77ca .wcf-social-icon{color:#9A9A9A;fill:#9A9A9A;--icon-size:18px;}.elementor-1386 .elementor-element.elementor-element-38c77ca .wcf-social-icon:hover, .elementor-1386 .elementor-element.elementor-element-38c77ca .wcf-social-icon:focus{color:#FFFFFF;fill:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-23b11d2{--display:flex;--flex-direction:column;--container-widget-width:100%;--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-23b11d2:not(.elementor-motion-effects-element-type-background), .elementor-1386 .elementor-element.elementor-element-23b11d2 > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:#000000;}.elementor-1386 .elementor-element.elementor-element-23b11d2 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-44fb7d3{--display:flex;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:2vw;--padding-bottom:1vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-44fb7d3 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-widget-text-editor{font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );color:var( --e-global-color-text );}.elementor-widget-text-editor.elementor-drop-cap-view-stacked .elementor-drop-cap{background-color:var( --e-global-color-primary );}.elementor-widget-text-editor.elementor-drop-cap-view-framed .elementor-drop-cap, .elementor-widget-text-editor.elementor-drop-cap-view-default .elementor-drop-cap{color:var( --e-global-color-primary );border-color:var( --e-global-color-primary );}.elementor-1386 .elementor-element.elementor-element-a4cd6b5{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;text-align:center;font-family:"Roboto", Sans-serif;font-size:1.3vw;font-weight:400;color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-a4cd6b5 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}@media(max-width:1366px){.elementor-1386 .elementor-element.elementor-element-13729f5{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-7addd77d{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-45808f0 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item > a{font-size:1.1vw;line-height:1.7em;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--padding-top:0vw;--padding-bottom:0vw;--padding-left:1.5vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-17fab581 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e > .elementor-widget-container{padding:0vw 0vw 1vw 0vw;}.elementor-1386 .elementor-element.elementor-element-4858f99f > .elementor-widget-container{padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-49f74ea{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--padding-top:0vw;--padding-bottom:0vw;--padding-left:1.5vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-de20c35 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-f301f1b > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > a{font-size:1.1vw;line-height:1.7em;}}@media(max-width:1200px){.elementor-1386 .elementor-element.elementor-element-45808f0 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item > a{line-height:1.9em;}.elementor-1386 .elementor-element.elementor-element-2b63802b .wcf--title{font-size:2vw;}.elementor-1386 .elementor-element.elementor-element-8a68bcc .wcf--text, .elementor-1386 .elementor-element.elementor-element-8a68bcc .wcf--text *{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--align-items:flex-start;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--padding-top:0px;--padding-bottom:0px;--padding-left:20px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-234e1291 .wcf--title{font-size:2vw;}.elementor-1386 .elementor-element.elementor-element-17fab581 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-5ff57893 .wcf--title{font-size:2vw;}.elementor-1386 .elementor-element.elementor-element-ef3e567 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:2vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text, .elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text *{font-size:1.3vw;line-height:1.3em;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text, .elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text *{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--align-items:flex-start;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--padding-top:0px;--padding-bottom:0px;--padding-left:20px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-cbbe166 .wcf--title{font-size:2vw;}.elementor-1386 .elementor-element.elementor-element-de20c35 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-a4b8994 .wcf--title{font-size:2vw;}.elementor-1386 .elementor-element.elementor-element-53ba325 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:2vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text, .elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text *{font-size:1.3vw;line-height:1.3em;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-18bfa81 .wcf--title{font-size:2vw;}.elementor-1386 .elementor-element.elementor-element-f301f1b > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > a{line-height:1.9em;}}@media(max-width:1024px){.elementor-1386 .elementor-element.elementor-element-13729f5{--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-708a3cc{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-7addd77d{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-1d8cd9d5 img{width:46%;}.elementor-1386 .elementor-element.elementor-element-2b63802b .wcf--title{font-size:2.4vw;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--padding-top:0px;--padding-bottom:0px;--padding-left:10px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-234e1291 .wcf--title{font-size:2.4vw;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item > a{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-5ff57893 .wcf--title{font-size:2.4vw;}.elementor-1386 .elementor-element.elementor-element-ef3e567 > .elementor-widget-container{padding:2vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-ef3e567{--container-widget-width:85%;--container-widget-flex-grow:0;width:var( --container-widget-width, 85% );max-width:85%;}.elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text, .elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text *{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item > a{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > a{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-49f74ea{--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-be5d338{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-117b99a img{width:46%;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--padding-top:0px;--padding-bottom:0px;--padding-left:10px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-cbbe166 .wcf--title{font-size:2.4vw;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > a{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-a4b8994 .wcf--title{font-size:2.4vw;}.elementor-1386 .elementor-element.elementor-element-53ba325 > .elementor-widget-container{padding:2vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-53ba325{--container-widget-width:85%;--container-widget-flex-grow:0;width:var( --container-widget-width, 85% );max-width:85%;}.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text, .elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text *{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > a{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > a{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-18bfa81 .wcf--title{font-size:2.4vw;}}@media(max-width:880px){.elementor-1386 .elementor-element.elementor-element-13ef23df{--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}}@media(max-width:767px){.elementor-1386 .elementor-element.elementor-element-7addd77d{--padding-top:0px;--padding-bottom:15px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--gap:10px 10px;--row-gap:10px;--column-gap:10px;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:last-child){padding-block-end:calc(8px/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:first-child){margin-block-start:calc(8px/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item{margin-inline:calc(8px/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items.elementor-inline-items{margin-inline:calc(-8px/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item:after{inset-inline-end:calc(-8px/2);}.elementor-1386 .elementor-element.elementor-element-20d1018e{--gap:10px 10px;--row-gap:10px;--column-gap:10px;--padding-top:0px;--padding-bottom:10px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-49f74ea{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:3vw;--padding-bottom:3vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-be5d338{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--gap:6vw 6vw;--row-gap:6vw;--column-gap:6vw;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-117b99a > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-117b99a{text-align:center;}.elementor-1386 .elementor-element.elementor-element-117b99a img{width:41%;}.elementor-1386 .elementor-element.elementor-element-e34a3a5{--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--gap:0px 0px;--row-gap:0px;--column-gap:0px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-e34a3a5.e-con{--align-self:center;}.elementor-1386 .elementor-element.elementor-element-9adfccc > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 2vw 0vw;}.elementor-1386 .elementor-element.elementor-element-9adfccc{--container-widget-width:88%;--container-widget-flex-grow:0;width:var( --container-widget-width, 88% );max-width:88%;}.elementor-1386 .elementor-element.elementor-element-9adfccc.elementor-element{--align-self:center;}.elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text, .elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text *{font-size:3.2vw;}.elementor-1386 .elementor-element.elementor-element-449b258{width:var( --container-widget-width, 75% );max-width:75%;--container-widget-width:75%;--container-widget-flex-grow:0;}.elementor-1386 .elementor-element.elementor-element-449b258 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group > label{font-size:2.1vw;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-type-html{font-size:2.2vw;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group .elementor-field, .elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-subgroup label{font-size:3.5vw;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-button{font-size:3.8vw;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-message{font-size:1.9vw;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--width:45%;--gap:10px 10px;--row-gap:10px;--column-gap:10px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0vw;--padding-bottom:5vw;--padding-left:7vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-cbbe166 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-cbbe166 .wcf--title{font-size:4.8vw;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:last-child){padding-block-end:calc(8px/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:first-child){margin-block-start:calc(8px/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item{margin-inline:calc(8px/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items.elementor-inline-items{margin-inline:calc(-8px/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item:after{inset-inline-end:calc(-8px/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > a{font-size:3.7vw;}.elementor-1386 .elementor-element.elementor-element-dbff959{--width:46%;--gap:10px 10px;--row-gap:10px;--column-gap:10px;--padding-top:2vw;--padding-bottom:0vw;--padding-left:6vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-a4b8994 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-a4b8994 .wcf--title{font-size:4.7vw;}.elementor-1386 .elementor-element.elementor-element-53ba325 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text, .elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text *{font-size:3vw;}.elementor-1386 .elementor-element.elementor-element-687b393 > .elementor-widget-container{margin:-3vw 0vw 0vw 0vw;padding:0vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > a{font-size:2.8vw;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > a{font-size:3.3vw;}.elementor-1386 .elementor-element.elementor-element-827339d{--width:100%;--align-items:flex-start;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--gap:10px 10px;--row-gap:10px;--column-gap:10px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:4vw;--padding-bottom:2vw;--padding-left:8vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-18bfa81 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-18bfa81.elementor-element{--align-self:flex-start;}.elementor-1386 .elementor-element.elementor-element-18bfa81 .wcf--title{font-size:5vw;}.elementor-1386 .elementor-element.elementor-element-f301f1b > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-f301f1b.elementor-element{--align-self:flex-start;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > a{font-size:3.2vw;}.elementor-1386 .elementor-element.elementor-element-38c77ca > .elementor-widget-container{margin:2vw 0vw 0vw 0vw;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-38c77ca.elementor-element{--align-self:flex-start;}.elementor-1386 .elementor-element.elementor-element-38c77ca .wcf-social-icon{--icon-size:14px;}.elementor-1386 .elementor-element.elementor-element-23b11d2{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:3vw;--padding-bottom:3vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-44fb7d3{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:1vw;--padding-bottom:1vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-a4cd6b5 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-a4cd6b5{font-size:3.1vw;}}@media(min-width:768px){.elementor-1386 .elementor-element.elementor-element-708a3cc{--width:88%;}.elementor-1386 .elementor-element.elementor-element-7addd77d{--width:22%;}.elementor-1386 .elementor-element.elementor-element-3d0bc2db{--width:29%;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--width:25%;}.elementor-1386 .elementor-element.elementor-element-20d1018e{--width:24%;}.elementor-1386 .elementor-element.elementor-element-be5d338{--width:88%;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--width:22%;}.elementor-1386 .elementor-element.elementor-element-e34a3a5{--width:29%;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--width:25%;}.elementor-1386 .elementor-element.elementor-element-dbff959{--width:24%;}.elementor-1386 .elementor-element.elementor-element-44fb7d3{--width:100%;}}@media(max-width:1366px) and (min-width:768px){.elementor-1386 .elementor-element.elementor-element-7addd77d{--width:30%;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--width:20%;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--width:30%;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--width:20%;}}@media(max-width:1200px) and (min-width:768px){.elementor-1386 .elementor-element.elementor-element-7addd77d{--width:32%;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--width:18%;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--width:32%;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--width:18%;}}@media(max-width:1024px) and (min-width:768px){.elementor-1386 .elementor-element.elementor-element-7addd77d{--width:30%;}.elementor-1386 .elementor-element.elementor-element-3d0bc2db{--width:28%;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--width:30%;}.elementor-1386 .elementor-element.elementor-element-e34a3a5{--width:28%;}}@media(max-width:880px) and (min-width:768px){.elementor-1386 .elementor-element.elementor-element-7addd77d{--width:50%;}.elementor-1386 .elementor-element.elementor-element-3d0bc2db{--width:50%;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--width:50%;}.elementor-1386 .elementor-element.elementor-element-20d1018e{--width:50%;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--width:50%;}.elementor-1386 .elementor-element.elementor-element-e34a3a5{--width:50%;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--width:50%;}.elementor-1386 .elementor-element.elementor-element-dbff959{--width:50%;}}/* Start custom CSS for wcf--social-icons, class: .elementor-element-6c579561 */.elementor-1386 .elementor-element.elementor-element-6c579561 .wcf-social-icon {
    color: #9A9A9A;
    fill: #9A9A9A;
    --icon-size: 1.3vw !important;
}/* End custom CSS */</style><style>.elementor-1386 .elementor-element.elementor-element-13729f5{--display:flex;--flex-direction:column;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--justify-content:center;--align-items:center;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-13729f5:not(.elementor-motion-effects-element-type-background), .elementor-1386 .elementor-element.elementor-element-13729f5 > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:#121212;}.elementor-1386 .elementor-element.elementor-element-13729f5 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-708a3cc{--display:flex;--flex-direction:row;--container-widget-width:initial;--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-708a3cc .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-7addd77d{--display:flex;--gap:2vw 2vw;--row-gap:2vw;--column-gap:2vw;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-7addd77d .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-widget-wcf--site-logo .widget-image-caption{color:var( --e-global-color-text );font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-1386 .elementor-element.elementor-element-1d8cd9d5 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-1d8cd9d5 img{width:42%;}.elementor-1386 .elementor-element.elementor-element-6c579561 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-6c579561 .wcf--social-icons ul{display:flex;flex-direction:row;gap:15px;}.elementor-1386 .elementor-element.elementor-element-6c579561 .wcf-social-icon{color:#9A9A9A;fill:#9A9A9A;--icon-size:18px;}.elementor-1386 .elementor-element.elementor-element-6c579561 .wcf-social-icon:hover, .elementor-1386 .elementor-element.elementor-element-6c579561 .wcf-social-icon:focus{color:#FFFFFF;fill:#FFFFFF;}.elementor-widget-icon-list .elementor-icon-list-item:not(:last-child):after{border-color:var( --e-global-color-text );}.elementor-widget-icon-list .elementor-icon-list-icon i{color:var( --e-global-color-primary );}.elementor-widget-icon-list .elementor-icon-list-icon svg{fill:var( --e-global-color-primary );}.elementor-widget-icon-list .elementor-icon-list-item > .elementor-icon-list-text, .elementor-widget-icon-list .elementor-icon-list-item > a{font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-widget-icon-list .elementor-icon-list-text{color:var( --e-global-color-secondary );}.elementor-1386 .elementor-element.elementor-element-45808f0 > .elementor-widget-container{margin:0px 0px 0px 1px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-45808f0{z-index:999;--e-icon-list-icon-size:14px;--icon-vertical-offset:-2px;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-icon{padding-inline-end:0px;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.3vw;font-weight:400;line-height:1.4em;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-text{color:#BBBBBB;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-3d0bc2db{--display:flex;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-3d0bc2db .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-2b63802b{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-1386 .elementor-element.elementor-element-2b63802b .wcf--title{color:#FFFFFF;font-family:"Teko", Sans-serif;font-size:1.9vw;font-weight:600;text-transform:uppercase;line-height:28.5px;}.elementor-1386 .elementor-element.elementor-element-2b63802b .wcf--title .highlight{color:#f00000;}.elementor-1386 .elementor-element.elementor-element-8a68bcc{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;width:var( --container-widget-width, 94% );max-width:94%;--container-widget-width:94%;--container-widget-flex-grow:0;}.elementor-1386 .elementor-element.elementor-element-8a68bcc .wcf--text{color:#999999;}.elementor-1386 .elementor-element.elementor-element-8a68bcc .wcf--text, .elementor-1386 .elementor-element.elementor-element-8a68bcc .wcf--text *{font-family:"Kanit", Sans-serif;font-size:1.2vw;font-weight:500;line-height:1.5em;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--display:flex;--flex-direction:column;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--align-items:flex-start;--padding-top:0vw;--padding-bottom:0vw;--padding-left:3vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-13ef23df .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-234e1291{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-1386 .elementor-element.elementor-element-234e1291 .wcf--title{color:#FFFFFF;font-family:"Teko", Sans-serif;font-size:1.9vw;font-weight:600;line-height:28.5px;}.elementor-1386 .elementor-element.elementor-element-234e1291 .wcf--title .highlight{color:#f00000;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:last-child){padding-block-end:calc(0.5em/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:first-child){margin-block-start:calc(0.5em/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item{margin-inline:calc(0.5em/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items.elementor-inline-items{margin-inline:calc(-0.5em/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item:after{inset-inline-end:calc(-0.5em/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-17fab581{--icon-vertical-offset:0px;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.2vw;text-transform:capitalize;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-text{color:#666666;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-20d1018e{--display:flex;--gap:0px 0px;--row-gap:0px;--column-gap:0px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-20d1018e .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-5ff57893{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-1386 .elementor-element.elementor-element-5ff57893 .wcf--title{color:#FFFFFF;font-family:"Teko", Sans-serif;font-size:1.9vw;font-weight:600;text-transform:uppercase;line-height:28.5px;}.elementor-1386 .elementor-element.elementor-element-5ff57893 .wcf--title .highlight{color:#f00000;}.elementor-1386 .elementor-element.elementor-element-ef3e567{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;width:var( --container-widget-width, 97% );max-width:97%;--container-widget-width:97%;--container-widget-flex-grow:0;}.elementor-1386 .elementor-element.elementor-element-ef3e567 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:1vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text{color:#666666;text-shadow:0px 0px 10px rgba(0,0,0,0.3);}.elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text, .elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text *{font-family:"Kanit", Sans-serif;font-size:1.2vw;font-weight:400;line-height:1.6em;}.elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text a:hover,.elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text a:focus{color:#FFFFFF !important;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 0.7vw 0vw;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e{--e-icon-list-icon-size:14px;--icon-vertical-offset:0px;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.3vw;font-weight:400;line-height:23.5px;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-text{color:#666666;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-4858f99f > .elementor-widget-container{margin:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-4858f99f{--e-icon-list-icon-size:14px;--icon-vertical-offset:0px;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.3vw;font-weight:400;line-height:23.5px;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-text{color:#666666;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-49f74ea{--display:flex;--flex-direction:column;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--justify-content:center;--align-items:center;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-49f74ea:not(.elementor-motion-effects-element-type-background), .elementor-1386 .elementor-element.elementor-element-49f74ea > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:#121212;}.elementor-1386 .elementor-element.elementor-element-49f74ea .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-be5d338{--display:flex;--flex-direction:row;--container-widget-width:initial;--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-be5d338 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--display:flex;--gap:2vw 2vw;--row-gap:2vw;--column-gap:2vw;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-7b03cf1 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-117b99a > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-117b99a img{width:42%;}.elementor-1386 .elementor-element.elementor-element-e34a3a5{--display:flex;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-e34a3a5 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-9adfccc{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;width:var( --container-widget-width, 310px );max-width:310px;--container-widget-width:310px;--container-widget-flex-grow:0;}.elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text{color:#999999;}.elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text, .elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text *{font-family:"Kanit", Sans-serif;font-size:1.2vw;font-weight:500;line-height:23.5px;}.elementor-widget-form .elementor-field-group > label, .elementor-widget-form .elementor-field-subgroup label{color:var( --e-global-color-text );}.elementor-widget-form .elementor-field-group > label{font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-widget-form .elementor-field-type-html{color:var( --e-global-color-text );font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-widget-form .elementor-field-group .elementor-field{color:var( --e-global-color-text );}.elementor-widget-form .elementor-field-group .elementor-field, .elementor-widget-form .elementor-field-subgroup label{font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-widget-form .elementor-button{font-family:var( --e-global-typography-accent-font-family ), Sans-serif;font-weight:var( --e-global-typography-accent-font-weight );}.elementor-widget-form .e-form__buttons__wrapper__button-next{background-color:var( --e-global-color-accent );}.elementor-widget-form .elementor-button[type="submit"]{background-color:var( --e-global-color-accent );}.elementor-widget-form .e-form__buttons__wrapper__button-previous{background-color:var( --e-global-color-accent );}.elementor-widget-form .elementor-message{font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );}.elementor-widget-form .e-form__indicators__indicator, .elementor-widget-form .e-form__indicators__indicator__label{font-family:var( --e-global-typography-accent-font-family ), Sans-serif;font-weight:var( --e-global-typography-accent-font-weight );}.elementor-widget-form{--e-form-steps-indicator-inactive-primary-color:var( --e-global-color-text );--e-form-steps-indicator-active-primary-color:var( --e-global-color-accent );--e-form-steps-indicator-completed-primary-color:var( --e-global-color-accent );--e-form-steps-indicator-progress-color:var( --e-global-color-accent );--e-form-steps-indicator-progress-background-color:var( --e-global-color-text );--e-form-steps-indicator-progress-meter-color:var( --e-global-color-text );}.elementor-widget-form .e-form__indicators__indicator__progress__meter{font-family:var( --e-global-typography-accent-font-family ), Sans-serif;font-weight:var( --e-global-typography-accent-font-weight );}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group{padding-right:calc( 0.6em/2 );padding-left:calc( 0.6em/2 );margin-bottom:0.2em;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-form-fields-wrapper{margin-left:calc( -0.6em/2 );margin-right:calc( -0.6em/2 );margin-bottom:-0.2em;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group.recaptcha_v3-bottomleft, .elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group.recaptcha_v3-bottomright{margin-bottom:0;}body.rtl .elementor-1386 .elementor-element.elementor-element-449b258 .elementor-labels-inline .elementor-field-group > label{padding-left:0px;}body:not(.rtl) .elementor-1386 .elementor-element.elementor-element-449b258 .elementor-labels-inline .elementor-field-group > label{padding-right:0px;}body .elementor-1386 .elementor-element.elementor-element-449b258 .elementor-labels-above .elementor-field-group > label{padding-bottom:0px;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group > label{font-family:"Roboto", Sans-serif;font-weight:400;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-type-html{padding-bottom:0px;font-family:"Roboto", Sans-serif;font-weight:400;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group .elementor-field, .elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-subgroup label{font-family:"Roboto", Sans-serif;font-size:1.1vw;font-weight:400;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group .elementor-field:not(.elementor-select-wrapper){background-color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group .elementor-select-wrapper select{background-color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-button{font-family:"Roboto", Sans-serif;font-size:1.3vw;font-weight:500;}.elementor-1386 .elementor-element.elementor-element-449b258 .e-form__buttons__wrapper__button-next{color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-button[type="submit"]{color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-button[type="submit"] svg *{fill:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .e-form__buttons__wrapper__button-previous{color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .e-form__buttons__wrapper__button-next:hover{background-color:#393939;color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-button[type="submit"]:hover{background-color:#393939;color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-button[type="submit"]:hover svg *{fill:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .e-form__buttons__wrapper__button-previous:hover{color:#ffffff;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-message{font-family:"Roboto", Sans-serif;font-size:1.1vw;font-weight:400;}.elementor-1386 .elementor-element.elementor-element-449b258 .e-form__indicators__indicator, .elementor-1386 .elementor-element.elementor-element-449b258 .e-form__indicators__indicator__label{font-family:"Roboto", Sans-serif;font-size:1.1vw;font-weight:500;}.elementor-1386 .elementor-element.elementor-element-449b258{--e-form-steps-indicators-spacing:20px;--e-form-steps-indicator-padding:30px;--e-form-steps-indicator-inactive-secondary-color:#ffffff;--e-form-steps-indicator-active-secondary-color:#ffffff;--e-form-steps-indicator-completed-secondary-color:#ffffff;--e-form-steps-divider-width:1px;--e-form-steps-divider-gap:10px;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--display:flex;--flex-direction:column;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--align-items:flex-start;--padding-top:0vw;--padding-bottom:0vw;--padding-left:3vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-bb475ec .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-cbbe166{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-1386 .elementor-element.elementor-element-cbbe166 .wcf--title{color:#FFFFFF;font-family:"Teko", Sans-serif;font-size:1.9vw;font-weight:600;line-height:28.5px;}.elementor-1386 .elementor-element.elementor-element-cbbe166 .wcf--title .highlight{color:#f00000;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:last-child){padding-block-end:calc(0.5em/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:first-child){margin-block-start:calc(0.5em/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item{margin-inline:calc(0.5em/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items.elementor-inline-items{margin-inline:calc(-0.5em/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item:after{inset-inline-end:calc(-0.5em/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-de20c35{--icon-vertical-offset:0px;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.2vw;text-transform:capitalize;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-text{color:#8D8D8D;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-dbff959{--display:flex;--gap:0px 0px;--row-gap:0px;--column-gap:0px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-dbff959 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-a4b8994{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-1386 .elementor-element.elementor-element-a4b8994 .wcf--title{color:#FFFFFF;font-family:"Teko", Sans-serif;font-size:1.9vw;font-weight:600;text-transform:uppercase;line-height:28.5px;}.elementor-1386 .elementor-element.elementor-element-a4b8994 .wcf--title .highlight{color:#f00000;}.elementor-1386 .elementor-element.elementor-element-53ba325{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;width:var( --container-widget-width, 72% );max-width:72%;--container-widget-width:72%;--container-widget-flex-grow:0;}.elementor-1386 .elementor-element.elementor-element-53ba325 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:1vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text{color:#9B9B9B;}.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text, .elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text *{font-family:"Kanit", Sans-serif;font-size:1.2vw;font-weight:400;line-height:23.5px;}.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text a:hover,.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text a:focus{color:#FFFFFF !important;}.elementor-1386 .elementor-element.elementor-element-687b393 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 0.7vw 0vw;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-687b393{--e-icon-list-icon-size:14px;--icon-vertical-offset:0px;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.3vw;font-weight:400;line-height:23.5px;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-text{color:#9B9B9B;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 > .elementor-widget-container{margin:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-0bea3e6{--e-icon-list-icon-size:14px;--icon-vertical-offset:0px;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:16px;font-weight:400;line-height:23.5px;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-text{color:#9B9B9B;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-827339d{--display:flex;}.elementor-1386 .elementor-element.elementor-element-827339d .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-18bfa81{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;}.elementor-1386 .elementor-element.elementor-element-18bfa81 .wcf--title{color:#FFFFFF;font-family:"Teko", Sans-serif;font-size:1.9vw;font-weight:600;text-transform:uppercase;line-height:28.5px;}.elementor-1386 .elementor-element.elementor-element-18bfa81 .wcf--title .highlight{color:#f00000;}.elementor-1386 .elementor-element.elementor-element-f301f1b > .elementor-widget-container{margin:0px 0px 0px 1px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-f301f1b{z-index:999;--e-icon-list-icon-size:14px;--icon-vertical-offset:-2px;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-icon i{transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-icon svg{transition:fill 0.3s;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-icon{padding-inline-end:0px;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > a{font-family:"Kanit", Sans-serif;font-size:1.3vw;font-weight:400;line-height:1.4em;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-text{color:#BBBBBB;transition:color 0.3s;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item:hover .elementor-icon-list-text{color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-38c77ca > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-38c77ca .wcf--social-icons ul{display:flex;flex-direction:row;gap:15px;}.elementor-1386 .elementor-element.elementor-element-38c77ca .wcf-social-icon{color:#9A9A9A;fill:#9A9A9A;--icon-size:18px;}.elementor-1386 .elementor-element.elementor-element-38c77ca .wcf-social-icon:hover, .elementor-1386 .elementor-element.elementor-element-38c77ca .wcf-social-icon:focus{color:#FFFFFF;fill:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-23b11d2{--display:flex;--flex-direction:column;--container-widget-width:100%;--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-23b11d2:not(.elementor-motion-effects-element-type-background), .elementor-1386 .elementor-element.elementor-element-23b11d2 > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:#000000;}.elementor-1386 .elementor-element.elementor-element-23b11d2 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-1386 .elementor-element.elementor-element-44fb7d3{--display:flex;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:2vw;--padding-bottom:1vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-44fb7d3 .wcf-image-hover{background-image:url( /wp-content/plugins/elementor/assets/images/placeholder.png );}.elementor-widget-text-editor{font-family:var( --e-global-typography-text-font-family ), Sans-serif;font-weight:var( --e-global-typography-text-font-weight );color:var( --e-global-color-text );}.elementor-widget-text-editor.elementor-drop-cap-view-stacked .elementor-drop-cap{background-color:var( --e-global-color-primary );}.elementor-widget-text-editor.elementor-drop-cap-view-framed .elementor-drop-cap, .elementor-widget-text-editor.elementor-drop-cap-view-default .elementor-drop-cap{color:var( --e-global-color-primary );border-color:var( --e-global-color-primary );}.elementor-1386 .elementor-element.elementor-element-a4cd6b5{--wcf-duration:1000ms;--wcf-delay:0ms;--wcf-ease:ease;text-align:center;font-family:"Roboto", Sans-serif;font-size:1.3vw;font-weight:400;color:#FFFFFF;}.elementor-1386 .elementor-element.elementor-element-a4cd6b5 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}@media(max-width:1366px){.elementor-1386 .elementor-element.elementor-element-13729f5{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-7addd77d{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-45808f0 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item > a{font-size:1.1vw;line-height:1.7em;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--padding-top:0vw;--padding-bottom:0vw;--padding-left:1.5vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-17fab581 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e > .elementor-widget-container{padding:0vw 0vw 1vw 0vw;}.elementor-1386 .elementor-element.elementor-element-4858f99f > .elementor-widget-container{padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-49f74ea{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--padding-top:0vw;--padding-bottom:0vw;--padding-left:1.5vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-de20c35 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-f301f1b > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > a{font-size:1.1vw;line-height:1.7em;}}@media(max-width:1200px){.elementor-1386 .elementor-element.elementor-element-45808f0 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-45808f0 .elementor-icon-list-item > a{line-height:1.9em;}.elementor-1386 .elementor-element.elementor-element-2b63802b .wcf--title{font-size:2vw;}.elementor-1386 .elementor-element.elementor-element-8a68bcc .wcf--text, .elementor-1386 .elementor-element.elementor-element-8a68bcc .wcf--text *{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--align-items:flex-start;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--padding-top:0px;--padding-bottom:0px;--padding-left:20px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-234e1291 .wcf--title{font-size:2vw;}.elementor-1386 .elementor-element.elementor-element-17fab581 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-5ff57893 .wcf--title{font-size:2vw;}.elementor-1386 .elementor-element.elementor-element-ef3e567 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:2vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text, .elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text *{font-size:1.3vw;line-height:1.3em;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text, .elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text *{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--align-items:flex-start;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--padding-top:0px;--padding-bottom:0px;--padding-left:20px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-cbbe166 .wcf--title{font-size:2vw;}.elementor-1386 .elementor-element.elementor-element-de20c35 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-a4b8994 .wcf--title{font-size:2vw;}.elementor-1386 .elementor-element.elementor-element-53ba325 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:2vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text, .elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text *{font-size:1.3vw;line-height:1.3em;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > a{font-size:1.3vw;}.elementor-1386 .elementor-element.elementor-element-18bfa81 .wcf--title{font-size:2vw;}.elementor-1386 .elementor-element.elementor-element-f301f1b > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > a{line-height:1.9em;}}@media(max-width:1024px){.elementor-1386 .elementor-element.elementor-element-13729f5{--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-708a3cc{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-7addd77d{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-1d8cd9d5 img{width:46%;}.elementor-1386 .elementor-element.elementor-element-2b63802b .wcf--title{font-size:2.4vw;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--padding-top:0px;--padding-bottom:0px;--padding-left:10px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-234e1291 .wcf--title{font-size:2.4vw;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-item > a{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-5ff57893 .wcf--title{font-size:2.4vw;}.elementor-1386 .elementor-element.elementor-element-ef3e567 > .elementor-widget-container{padding:2vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-ef3e567{--container-widget-width:85%;--container-widget-flex-grow:0;width:var( --container-widget-width, 85% );max-width:85%;}.elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text, .elementor-1386 .elementor-element.elementor-element-ef3e567 .wcf--text *{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4f0c2c9e .elementor-icon-list-item > a{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-4858f99f .elementor-icon-list-item > a{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-49f74ea{--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-be5d338{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-117b99a img{width:46%;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--padding-top:0px;--padding-bottom:0px;--padding-left:10px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-cbbe166 .wcf--title{font-size:2.4vw;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > a{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-a4b8994 .wcf--title{font-size:2.4vw;}.elementor-1386 .elementor-element.elementor-element-53ba325 > .elementor-widget-container{padding:2vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-53ba325{--container-widget-width:85%;--container-widget-flex-grow:0;width:var( --container-widget-width, 85% );max-width:85%;}.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text, .elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text *{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > a{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > a{font-size:1.5vw;}.elementor-1386 .elementor-element.elementor-element-18bfa81 .wcf--title{font-size:2.4vw;}}@media(max-width:880px){.elementor-1386 .elementor-element.elementor-element-13ef23df{--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}}@media(max-width:767px){.elementor-1386 .elementor-element.elementor-element-7addd77d{--padding-top:0px;--padding-bottom:15px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--gap:10px 10px;--row-gap:10px;--column-gap:10px;}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:last-child){padding-block-end:calc(8px/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:first-child){margin-block-start:calc(8px/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item{margin-inline:calc(8px/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items.elementor-inline-items{margin-inline:calc(-8px/2);}.elementor-1386 .elementor-element.elementor-element-17fab581 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item:after{inset-inline-end:calc(-8px/2);}.elementor-1386 .elementor-element.elementor-element-20d1018e{--gap:10px 10px;--row-gap:10px;--column-gap:10px;--padding-top:0px;--padding-bottom:10px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-49f74ea{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:3vw;--padding-bottom:3vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-be5d338{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--gap:6vw 6vw;--row-gap:6vw;--column-gap:6vw;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-1386 .elementor-element.elementor-element-117b99a > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-117b99a{text-align:center;}.elementor-1386 .elementor-element.elementor-element-117b99a img{width:41%;}.elementor-1386 .elementor-element.elementor-element-e34a3a5{--justify-content:center;--align-items:center;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--gap:0px 0px;--row-gap:0px;--column-gap:0px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:5vw;--padding-bottom:5vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-e34a3a5.e-con{--align-self:center;}.elementor-1386 .elementor-element.elementor-element-9adfccc > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 2vw 0vw;}.elementor-1386 .elementor-element.elementor-element-9adfccc{--container-widget-width:88%;--container-widget-flex-grow:0;width:var( --container-widget-width, 88% );max-width:88%;}.elementor-1386 .elementor-element.elementor-element-9adfccc.elementor-element{--align-self:center;}.elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text, .elementor-1386 .elementor-element.elementor-element-9adfccc .wcf--text *{font-size:3.2vw;}.elementor-1386 .elementor-element.elementor-element-449b258{width:var( --container-widget-width, 75% );max-width:75%;--container-widget-width:75%;--container-widget-flex-grow:0;}.elementor-1386 .elementor-element.elementor-element-449b258 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group > label{font-size:2.1vw;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-type-html{font-size:2.2vw;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-group .elementor-field, .elementor-1386 .elementor-element.elementor-element-449b258 .elementor-field-subgroup label{font-size:3.5vw;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-button{font-size:3.8vw;}.elementor-1386 .elementor-element.elementor-element-449b258 .elementor-message{font-size:1.9vw;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--width:45%;--gap:10px 10px;--row-gap:10px;--column-gap:10px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0vw;--padding-bottom:5vw;--padding-left:7vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-cbbe166 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-cbbe166 .wcf--title{font-size:4.8vw;}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:last-child){padding-block-end:calc(8px/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items:not(.elementor-inline-items) .elementor-icon-list-item:not(:first-child){margin-block-start:calc(8px/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item{margin-inline:calc(8px/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items.elementor-inline-items{margin-inline:calc(-8px/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-items.elementor-inline-items .elementor-icon-list-item:after{inset-inline-end:calc(-8px/2);}.elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-de20c35 .elementor-icon-list-item > a{font-size:3.7vw;}.elementor-1386 .elementor-element.elementor-element-dbff959{--width:46%;--gap:10px 10px;--row-gap:10px;--column-gap:10px;--padding-top:2vw;--padding-bottom:0vw;--padding-left:6vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-a4b8994 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-a4b8994 .wcf--title{font-size:4.7vw;}.elementor-1386 .elementor-element.elementor-element-53ba325 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text, .elementor-1386 .elementor-element.elementor-element-53ba325 .wcf--text *{font-size:3vw;}.elementor-1386 .elementor-element.elementor-element-687b393 > .elementor-widget-container{margin:-3vw 0vw 0vw 0vw;padding:0vw 0vw 0vw 0vw;}.elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-687b393 .elementor-icon-list-item > a{font-size:2.8vw;}.elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-0bea3e6 .elementor-icon-list-item > a{font-size:3.3vw;}.elementor-1386 .elementor-element.elementor-element-827339d{--width:100%;--align-items:flex-start;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--gap:10px 10px;--row-gap:10px;--column-gap:10px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:4vw;--padding-bottom:2vw;--padding-left:8vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-18bfa81 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-18bfa81.elementor-element{--align-self:flex-start;}.elementor-1386 .elementor-element.elementor-element-18bfa81 .wcf--title{font-size:5vw;}.elementor-1386 .elementor-element.elementor-element-f301f1b > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-f301f1b.elementor-element{--align-self:flex-start;}.elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > .elementor-icon-list-text, .elementor-1386 .elementor-element.elementor-element-f301f1b .elementor-icon-list-item > a{font-size:3.2vw;}.elementor-1386 .elementor-element.elementor-element-38c77ca > .elementor-widget-container{margin:2vw 0vw 0vw 0vw;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-38c77ca.elementor-element{--align-self:flex-start;}.elementor-1386 .elementor-element.elementor-element-38c77ca .wcf-social-icon{--icon-size:14px;}.elementor-1386 .elementor-element.elementor-element-23b11d2{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:3vw;--padding-bottom:3vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-44fb7d3{--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:1vw;--padding-bottom:1vw;--padding-left:0vw;--padding-right:0vw;}.elementor-1386 .elementor-element.elementor-element-a4cd6b5 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-1386 .elementor-element.elementor-element-a4cd6b5{font-size:3.1vw;}}@media(min-width:768px){.elementor-1386 .elementor-element.elementor-element-708a3cc{--width:88%;}.elementor-1386 .elementor-element.elementor-element-7addd77d{--width:22%;}.elementor-1386 .elementor-element.elementor-element-3d0bc2db{--width:29%;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--width:25%;}.elementor-1386 .elementor-element.elementor-element-20d1018e{--width:24%;}.elementor-1386 .elementor-element.elementor-element-be5d338{--width:88%;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--width:22%;}.elementor-1386 .elementor-element.elementor-element-e34a3a5{--width:29%;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--width:25%;}.elementor-1386 .elementor-element.elementor-element-dbff959{--width:24%;}.elementor-1386 .elementor-element.elementor-element-44fb7d3{--width:100%;}}@media(max-width:1366px) and (min-width:768px){.elementor-1386 .elementor-element.elementor-element-7addd77d{--width:30%;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--width:20%;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--width:30%;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--width:20%;}}@media(max-width:1200px) and (min-width:768px){.elementor-1386 .elementor-element.elementor-element-7addd77d{--width:32%;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--width:18%;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--width:32%;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--width:18%;}}@media(max-width:1024px) and (min-width:768px){.elementor-1386 .elementor-element.elementor-element-7addd77d{--width:30%;}.elementor-1386 .elementor-element.elementor-element-3d0bc2db{--width:28%;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--width:30%;}.elementor-1386 .elementor-element.elementor-element-e34a3a5{--width:28%;}}@media(max-width:880px) and (min-width:768px){.elementor-1386 .elementor-element.elementor-element-7addd77d{--width:50%;}.elementor-1386 .elementor-element.elementor-element-3d0bc2db{--width:50%;}.elementor-1386 .elementor-element.elementor-element-13ef23df{--width:50%;}.elementor-1386 .elementor-element.elementor-element-20d1018e{--width:50%;}.elementor-1386 .elementor-element.elementor-element-7b03cf1{--width:50%;}.elementor-1386 .elementor-element.elementor-element-e34a3a5{--width:50%;}.elementor-1386 .elementor-element.elementor-element-bb475ec{--width:50%;}.elementor-1386 .elementor-element.elementor-element-dbff959{--width:50%;}}/* Start custom CSS for wcf--social-icons, class: .elementor-element-6c579561 */.elementor-1386 .elementor-element.elementor-element-6c579561 .wcf-social-icon {
    color: #9A9A9A;
    fill: #9A9A9A;
    --icon-size: 1.3vw !important;
}/* End custom CSS */</style>		<div data-elementor-type="wp-post" data-elementor-id="1386" class="elementor elementor-1386" data-elementor-post-type="wcf-addons-template">
				<div class="elementor-element elementor-element-13729f5 e-con-full elementor-hidden-mobile e-flex wcf-starter-animations-none e-con e-parent" data-id="13729f5" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-708a3cc e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="708a3cc" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-7addd77d e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="7addd77d" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-1d8cd9d5 elementor-widget elementor-widget-wcf--site-logo" data-id="1d8cd9d5" data-element_type="widget" data-e-type="widget" data-widget_type="wcf--site-logo.default">
				<div class="elementor-widget-container">
										<div class="elementor-image">
															<a href="/"						aria-label="Site Logo">
										<img width="768" height="305" class="attachment-full size-full wp-image-8655" alt="" srcset="/wp-content/uploads/2024/06/13-utopia-logo-012.png 1691w, /wp-content/uploads/2024/06/13-utopia-logo-012-350x139.png 350w, /wp-content/uploads/2024/06/13-utopia-logo-012-300x119.png 300w, /wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png 768w, /wp-content/uploads/2024/06/13-utopia-logo-012-1024x406.png 1024w, /wp-content/uploads/2024/06/13-utopia-logo-012-1536x609.png 1536w" sizes="(max-width: 768px) 48vw, 220px" src="/wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png">										</a>
																		</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-6c579561 elementor-widget elementor-widget-wcf--social-icons" data-id="6c579561" data-element_type="widget" data-e-type="widget" data-widget_type="wcf--social-icons.default">
				<div class="elementor-widget-container">
							<div class="wcf--social-icons">
			<ul>
									<li>
						<a class="elementor-icon wcf-social-icon social-icon- elementor-repeater-item-77237ae" href="https://www.facebook.com/13UTOPIA/" target="_blank">
							<span class="elementor-screen-only">Facebook-f</span>
							<svg class="e-font-icon-svg e-fab-facebook-f" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>						</a>
					</li>
										<li>
						<a class="elementor-icon wcf-social-icon social-icon- elementor-repeater-item-7fe7168" href="https://www.instagram.com/13_utopia_/" target="_blank">
							<span class="elementor-screen-only">Instagram</span>
							<svg class="e-font-icon-svg e-fab-instagram" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>						</a>
					</li>
										<li>
						<a class="elementor-icon wcf-social-icon social-icon- elementor-repeater-item-02b619e" href="https://www.linkedin.com/company/13utopia/" target="_blank">
							<span class="elementor-screen-only">Linkedin</span>
							<svg class="e-font-icon-svg e-fab-linkedin" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path></svg>						</a>
					</li>
										<li>
						<a class="elementor-icon wcf-social-icon social-icon- elementor-repeater-item-9cf7620" href="tel:9924131397" target="_blank">
							<span class="elementor-screen-only">Whatsapp</span>
							<svg class="e-font-icon-svg e-fab-whatsapp" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>						</a>
					</li>
								</ul>
		</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-45808f0 elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="45808f0" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="/privacy-policy/">

											<span class="elementor-icon-list-text">  Privacy Policy</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/terms-and-condition/">

											<span class="elementor-icon-list-text">Terms and Condition</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/refund-and-return/">

											<span class="elementor-icon-list-text">Refund and Return</span>
											</a>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-3d0bc2db e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="3d0bc2db" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-2b63802b wcf-starter-animations-none elementor-widget elementor-widget-wcf--title" data-id="2b63802b" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--title.default">
				<div class="elementor-widget-container">
					<h4 class="wcf--title">Newsletter</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-8a68bcc elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-wcf--text" data-id="8a68bcc" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--text.default">
				<div class="elementor-widget-container">
					<div class="wcf--text">Digital moves that matter <br>— join the journey.</div>				</div>
				</div>
				<div class="elementor-element elementor-element-13afc7b elementor-widget elementor-widget-wpforms" data-id="13afc7b" data-element_type="widget" data-e-type="widget" data-widget_type="wpforms.default">
				<div class="elementor-widget-container">
					<style id="wpforms-css-vars-elementor-widget-13afc7b">
				.elementor-widget-wpforms.elementor-element-13afc7b {
				--wpforms-label-color: #FFFFFF;
--wpforms-button-border-radius: 5px;
--wpforms-button-background-color: #292929;
--wpforms-button-size-font-size: 14px;
--wpforms-button-size-height: 37px;
--wpforms-button-size-padding-h: 15px;
--wpforms-button-size-margin-top: 5px;
			}
			</style><div class="wpforms-container wpforms-container-full wpforms-render-modern" id="wpforms-23882"><form id="wpforms-form-23882" class="wpforms-validate wpforms-form wpforms-ajax-form" data-formid="23882" method="post" enctype="multipart/form-data" action="/digital-marketing/" data-token="e847f649913d92d2497bef7f6b57e0a2" data-token-time="1788866802"><noscript class="wpforms-error-noscript">Please enable JavaScript in your browser to complete this form.</noscript><div id="wpforms-error-noscript" style="display: none;">Please enable JavaScript in your browser to complete this form.</div><div class="wpforms-field-container">		<div id="wpforms-23882-field_1-container"
			class="wpforms-field wpforms-field-text"
			data-field-type="text"
			data-field-id="1"
			>
			<label class="wpforms-field-label" for="wpforms-23882-field_1" >Email</label>
			<input type="text" id="wpforms-23882-field_1" class="wpforms-field-medium" name="wpforms[fields][1]" >
		</div>
		<div id="wpforms-23882-field_2-container" class="wpforms-field wpforms-field-email" data-field-id="2"><label class="wpforms-field-label" for="wpforms-23882-field_2">Email <span class="wpforms-required-label" aria-hidden="true">*</span></label><input type="email" id="wpforms-23882-field_2" class="wpforms-field-large wpforms-field-required" name="wpforms[fields][2]" placeholder="Email" spellcheck="false" aria-errormessage="wpforms-23882-field_2-error" required></div></div><!-- .wpforms-field-container --><div class="wpforms-recaptcha-container wpforms-is-hcaptcha" ><div class="h-captcha" data-sitekey="f11a35a2-4886-4d72-b832-9ef2634232da"></div><input type="text" name="g-recaptcha-hidden" class="wpforms-recaptcha-hidden" style="position:absolute!important;clip:rect(0,0,0,0)!important;height:1px!important;width:1px!important;border:0!important;overflow:hidden!important;padding:0!important;margin:0!important;" data-rule-hcaptcha="1"></div><div class="wpforms-submit-container" ><input type="hidden" name="wpforms[id]" value="23882"><input type="hidden" name="page_title" value="Digital Marketing"><input type="hidden" name="page_url" value="/digital-marketing/"><input type="hidden" name="url_referer" value=""><input type="hidden" name="page_id" value="13403"><input type="hidden" name="wpforms[post_id]" value="13403"><button type="submit" name="wpforms[submit]" id="wpforms-submit-23882" class="wpforms-submit" data-alt-text="Sending..." data-submit-text="Submit" aria-live="assertive" value="wpforms-submit">Submit</button><img class="wpforms-submit-spinner" style="display: none;" width="26" height="26" alt="Loading" src="/wp-content/plugins/wpforms-lite/assets/images/submit-spin.svg"></div></form></div>  <!-- .wpforms-container -->				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-13ef23df e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="13ef23df" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-234e1291 wcf-starter-animations-none elementor-widget elementor-widget-wcf--title" data-id="234e1291" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--title.default">
				<div class="elementor-widget-container">
					<h4 class="wcf--title">SERVICES</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-17fab581 elementor-align-start elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="17fab581" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="/search-engine-optimization/">

											<span class="elementor-icon-list-text">SEO</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/digital-marketing/">

											<span class="elementor-icon-list-text">Digital Marketing</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/web-development/">

											<span class="elementor-icon-list-text">Web Development</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/cgi-videos/">

											<span class="elementor-icon-list-text">CGI Videos</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/online-reputation-management/">

											<span class="elementor-icon-list-text">ORM</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/email-marketing/">

											<span class="elementor-icon-list-text">Email Marketing</span>
											</a>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-20d1018e e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="20d1018e" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-5ff57893 wcf-starter-animations-none elementor-widget elementor-widget-wcf--title" data-id="5ff57893" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--title.default">
				<div class="elementor-widget-container">
					<h4 class="wcf--title">Contact Us</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-ef3e567 elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-wcf--text" data-id="ef3e567" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--text.default">
				<div class="elementor-widget-container">
					<div class="wcf--text"><p><span class="LrzXr">1123, iconic Shyamal Shyamal Cross Roads, 132 Feet Ring Rd, Swinagar Society, Nehru Nagar, Shyamal, Ahmedabad, Gujarat 380015</span></p></div>				</div>
				</div>
				<div class="elementor-element elementor-element-4f0c2c9e elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="4f0c2c9e" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="tel:+919924131305">

											<span class="elementor-icon-list-text">+91 9924131397</span>
											</a>
									</li>
						</ul>
						</div>
				</div>
				<div class="elementor-element elementor-element-4858f99f elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="4858f99f" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="mailto:info@13utopia.Com">

											<span class="elementor-icon-list-text">info@13utopia.com</span>
											</a>
									</li>
						</ul>
						</div>
				</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-49f74ea e-con-full elementor-hidden-widescreen elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet_extra elementor-hidden-tablet elementor-hidden-mobile_extra e-flex wcf-starter-animations-none e-con e-parent" data-id="49f74ea" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-be5d338 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="be5d338" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-7b03cf1 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="7b03cf1" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-117b99a elementor-widget elementor-widget-wcf--site-logo" data-id="117b99a" data-element_type="widget" data-e-type="widget" data-widget_type="wcf--site-logo.default">
				<div class="elementor-widget-container">
										<div class="elementor-image">
															<a href="/"						aria-label="Site Logo">
										<img width="768" height="305" class="attachment-full size-full wp-image-8655" alt="" srcset="/wp-content/uploads/2024/06/13-utopia-logo-012.png 1691w, /wp-content/uploads/2024/06/13-utopia-logo-012-350x139.png 350w, /wp-content/uploads/2024/06/13-utopia-logo-012-300x119.png 300w, /wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png 768w, /wp-content/uploads/2024/06/13-utopia-logo-012-1024x406.png 1024w, /wp-content/uploads/2024/06/13-utopia-logo-012-1536x609.png 1536w" sizes="(max-width: 768px) 48vw, 220px" src="/wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png">										</a>
																		</div>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-e34a3a5 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="e34a3a5" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-9adfccc elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-wcf--text" data-id="9adfccc" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--text.default">
				<div class="elementor-widget-container">
					<div class="wcf--text"><p style="text-align: center">Digital moves that matter — join the journey.</p></div>				</div>
				</div>
				<div class="elementor-element elementor-element-449b258 elementor-widget-mobile__width-initial elementor-button-align-stretch elementor-widget elementor-widget-form" data-id="449b258" data-element_type="widget" data-e-type="widget" data-settings="{&quot;step_next_label&quot;:&quot;Next&quot;,&quot;step_previous_label&quot;:&quot;Previous&quot;,&quot;button_width&quot;:&quot;100&quot;,&quot;step_type&quot;:&quot;number_text&quot;,&quot;step_icon_shape&quot;:&quot;circle&quot;}" data-widget_type="form.default">
				<div class="elementor-widget-container">
							<form class="elementor-form" method="post" name="New Form" aria-label="New Form">
			<input type="hidden" name="post_id" value="1386"/>
			<input type="hidden" name="form_id" value="449b258"/>
			<input type="hidden" name="referer_title" value="Page Not Found - 13 UTOPIA" />

			
			<div class="elementor-form-fields-wrapper elementor-labels-above">
								<div class="elementor-field-type-email elementor-field-group elementor-column elementor-field-group-email elementor-col-100 elementor-field-required">
													<input size="1" type="email" name="form_fields[email]" id="form-field-email" class="elementor-field elementor-size-sm  elementor-field-textual" placeholder="Email" required="required">
											</div>
								<div class="elementor-field-group elementor-column elementor-field-type-submit elementor-col-100 e-form__buttons">
					<button class="elementor-button elementor-size-sm" type="submit">
						<span class="elementor-button-content-wrapper">
																						<span class="elementor-button-text">Send</span>
													</span>
					</button>
				</div>
			</div>
		</form>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-bb475ec e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="bb475ec" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-cbbe166 wcf-starter-animations-none elementor-widget elementor-widget-wcf--title" data-id="cbbe166" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--title.default">
				<div class="elementor-widget-container">
					<h4 class="wcf--title">SERVICES</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-de20c35 elementor-align-start elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="de20c35" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="/search-engine-optimization/">

											<span class="elementor-icon-list-text">SEO</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/digital-marketing/">

											<span class="elementor-icon-list-text">Digital Marketing</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/web-development/">

											<span class="elementor-icon-list-text">Web Development</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/cgi-videos/">

											<span class="elementor-icon-list-text">CGI Videos</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/online-reputation-management/">

											<span class="elementor-icon-list-text">ORM</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/email-marketing/">

											<span class="elementor-icon-list-text">Email Marketing</span>
											</a>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-dbff959 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="dbff959" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-a4b8994 wcf-starter-animations-none elementor-widget elementor-widget-wcf--title" data-id="a4b8994" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--title.default">
				<div class="elementor-widget-container">
					<h4 class="wcf--title">Contact Us</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-53ba325 elementor-widget__width-initial wcf-starter-animations-none elementor-widget elementor-widget-wcf--text" data-id="53ba325" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--text.default">
				<div class="elementor-widget-container">
					<div class="wcf--text"><p>405- Ashram Avenue,</p><p>Paldi Cross Road, Paldi,</p><p>Ahmedabad &#8211; 380007</p></div>				</div>
				</div>
				<div class="elementor-element elementor-element-687b393 elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="687b393" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="tel:+919924131305">

											<span class="elementor-icon-list-text">+91 9924131397</span>
											</a>
									</li>
						</ul>
						</div>
				</div>
				<div class="elementor-element elementor-element-0bea3e6 elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="0bea3e6" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="mailto:info@13utopia.Com">

											<span class="elementor-icon-list-text">info@13utopia.com</span>
											</a>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-827339d e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="827339d" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-18bfa81 wcf-starter-animations-none elementor-widget elementor-widget-wcf--title" data-id="18bfa81" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="wcf--title.default">
				<div class="elementor-widget-container">
					<h4 class="wcf--title">Newsletter</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-f301f1b elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="f301f1b" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="/privacy-policy/">

											<span class="elementor-icon-list-text">  Privacy Policy</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/terms-and-condition/">

											<span class="elementor-icon-list-text">Terms and Condition</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/refund-and-return/">

											<span class="elementor-icon-list-text">Refund and Return</span>
											</a>
									</li>
						</ul>
						</div>
				</div>
				<div class="elementor-element elementor-element-38c77ca elementor-widget elementor-widget-wcf--social-icons" data-id="38c77ca" data-element_type="widget" data-e-type="widget" data-widget_type="wcf--social-icons.default">
				<div class="elementor-widget-container">
							<div class="wcf--social-icons">
			<ul>
									<li>
						<a class="elementor-icon wcf-social-icon social-icon- elementor-repeater-item-77237ae" href="https://www.facebook.com/13UTOPIA/" target="_blank">
							<span class="elementor-screen-only">Facebook-f</span>
							<svg class="e-font-icon-svg e-fab-facebook-f" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>						</a>
					</li>
										<li>
						<a class="elementor-icon wcf-social-icon social-icon- elementor-repeater-item-7fe7168" href="https://www.instagram.com/13_utopia_/" target="_blank">
							<span class="elementor-screen-only">Instagram</span>
							<svg class="e-font-icon-svg e-fab-instagram" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>						</a>
					</li>
										<li>
						<a class="elementor-icon wcf-social-icon social-icon- elementor-repeater-item-02b619e" href="https://www.linkedin.com/company/13utopia/" target="_blank">
							<span class="elementor-screen-only">Linkedin</span>
							<svg class="e-font-icon-svg e-fab-linkedin" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path></svg>						</a>
					</li>
										<li>
						<a class="elementor-icon wcf-social-icon social-icon- elementor-repeater-item-9cf7620" href="tel:9924131397" target="_blank">
							<span class="elementor-screen-only">Whatsapp</span>
							<svg class="e-font-icon-svg e-fab-whatsapp" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>						</a>
					</li>
								</ul>
		</div>
						</div>
				</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-23b11d2 e-con-full e-flex wcf-starter-animations-none e-con e-parent" data-id="23b11d2" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
		<div class="elementor-element elementor-element-44fb7d3 e-con-full e-flex wcf-starter-animations-none e-con e-child" data-id="44fb7d3" data-element_type="container" data-e-type="container" data-settings="{&quot;wcf_enable_cursor_hover_effect_text&quot;:&quot;View&quot;}">
				<div class="elementor-element elementor-element-a4cd6b5 wcf-starter-animations-none elementor-widget elementor-widget-text-editor" data-id="a4cd6b5" data-element_type="widget" data-e-type="widget" data-settings="{&quot;wcf_starter_animations&quot;:&quot;none&quot;,&quot;wcf_anim_duration&quot;:1000,&quot;wcf_anim_delay&quot;:0,&quot;wcf_anim_ease&quot;:&quot;ease&quot;}" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p><span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start">﻿</span>© 2026 <span style="color: #ffffff;"><a style="color: #ffffff;" href="/"><strong>13UTOPiA</strong> </a>.</span> All Rights Reserved</p>								</div>
				</div>
				</div>
				</div>
				</div>
		</div><!-- #page -->

<div class='wcf-scroll-to-top scroll-to-circle'><svg class="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102"><path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" /></svg><svg aria-hidden="true" class="e-font-icon-svg e-fas-arrow-up" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg></div><div class="wcf-cursor"></div><div class="wcf-cursor-follower"></div>		<!-- Click to Chat - https://holithemes.com/plugins/click-to-chat/  v4.43 -->
			<style id="ht-ctc-entry-animations">.ht_ctc_entry_animation{animation-duration:0.4s;animation-fill-mode:both;animation-delay:0s;animation-iteration-count:1;}			@keyframes ht_ctc_anim_corner {0% {opacity: 0;transform: scale(0);}100% {opacity: 1;transform: scale(1);}}.ht_ctc_an_entry_corner {animation-name: ht_ctc_anim_corner;animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);transform-origin: bottom var(--side, right);}
			</style><style id="ht-ctc-animations">.ht_ctc_animation{animation-duration:1s;animation-fill-mode:both;animation-delay:0s;animation-iteration-count:1;}		@keyframes bounce{from,20%,53%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1);transform:translate3d(0,0,0)}40%,43%{animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);transform:translate3d(0,-30px,0) scaleY(1.1)}70%{animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);transform:translate3d(0,-15px,0) scaleY(1.05)}80%{transition-timing-function:cubic-bezier(0.215,0.61,0.355,1);transform:translate3d(0,0,0) scaleY(0.95)}90%{transform:translate3d(0,-4px,0) scaleY(1.02)}}.ht_ctc_an_bounce{animation-name:bounce;transform-origin:center bottom}
			</style>						<div class="ht-ctc ht-ctc-chat ctc-analytics ctc_wp_desktop style-99  ht_ctc_entry_animation ht_ctc_an_entry_corner " id="ht-ctc-chat"  
				style="display: none;  position: fixed; bottom: 50px; right: 20px;"   >
												<div class="ht_ctc_style ht_ctc_chat_style">
								
<img class="own-img ctc-analytics ctc_s_99 ctc_cta" title="WhatsApp us" id="style-99" style="height: 50px; " alt="whatsapp-logo" src="/wp-content/plugins/click-to-chat-for-whatsapp/./new/inc/assets/img/whatsapp-logo.svg">
								</div>
							</div>
							<span class="ht_ctc_chat_data" data-settings="{&quot;number&quot;:&quot;919924131397&quot;,&quot;pre_filled&quot;:&quot;&quot;,&quot;dis_m&quot;:&quot;show&quot;,&quot;dis_d&quot;:&quot;show&quot;,&quot;css&quot;:&quot;cursor: pointer; z-index: 99999999;&quot;,&quot;pos_d&quot;:&quot;position: fixed; bottom: 50px; right: 20px;&quot;,&quot;pos_m&quot;:&quot;position: fixed; bottom: 50px; right: 20px;&quot;,&quot;side_d&quot;:&quot;right&quot;,&quot;side_m&quot;:&quot;right&quot;,&quot;schedule&quot;:&quot;no&quot;,&quot;se&quot;:150,&quot;ani&quot;:&quot;ht_ctc_an_bounce&quot;,&quot;page_id&quot;:13403,&quot;url_target_d&quot;:&quot;popup&quot;,&quot;ga&quot;:&quot;yes&quot;,&quot;gtm&quot;:&quot;1&quot;,&quot;fb&quot;:&quot;yes&quot;,&quot;g_init&quot;:&quot;default&quot;,&quot;g_an_event_name&quot;:&quot;click to chat&quot;,&quot;gtm_event_name&quot;:&quot;Click to Chat&quot;,&quot;pixel_event_name&quot;:&quot;Click to Chat by HoliThemes&quot;}" data-rest="93f936c613"></span>
				        <div class="wcf-image-generator-popup">
            <div class="wcf-image-generator-popup-wrapper">
                <div class="image-generator-post-wrapper">

                </div>
            </div>
        </div>
					
				
	<link rel='stylesheet' id='wc-blocks-style-css' href='https://c0.wp.com/p/woocommerce/11.0.1/assets/client/blocks/wc-blocks.css' media='all' />
<style id="wcf-preloader-inline-css">
.wcf-preloader { }
.wcf-preloader { }
.wcf-preloader { }
/*# sourceURL=wcf-preloader-inline-css */
</style>
<link rel='stylesheet' id='widget-nav-menu-css' href='/wp-content/uploads/elementor/css/custom-pro-widget-nav-menu.min.css?ver=1788497237' media='all' />
<link rel='stylesheet' id='wcf--nav-menu-css' href='/wp-content/plugins/animation-addons-for-elementor/assets/css/widgets/nav-menu.min.css?ver=7.1' media='all' />
<link rel='stylesheet' id='e-sticky-css' href='/wp-content/plugins/elementor-pro/assets/css/modules/sticky.min.css?ver=3.35.1' media='all' />
<link rel='stylesheet' id='e-animation-grow-css' href='/wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-grow.min.css?ver=4.2.3' media='all' />
<link rel='stylesheet' id='widget-social-icons-css' href='/wp-content/plugins/elementor/assets/css/widget-social-icons.min.css?ver=4.2.3' media='all' />
<link rel='stylesheet' id='e-apple-webkit-css' href='/wp-content/uploads/elementor/css/custom-apple-webkit.min.css?ver=1788497236' media='all' />
<link rel='stylesheet' id='arolax-testimonial-css' href='/wp-content/plugins/arolax-essential/assets/css/arolax-testimonial.css?ver=7.1' media='all' />
<link rel='stylesheet' id='wcf--social-icons-css' href='/wp-content/plugins/animation-addons-for-elementor/assets/css/widgets/social-icons.min.css?ver=7.1' media='all' />
<link rel='stylesheet' id='widget-icon-list-css' href='/wp-content/uploads/elementor/css/custom-widget-icon-list.min.css?ver=1788497236' media='all' />
<link rel='stylesheet' id='widget-form-css' href='/wp-content/plugins/elementor-pro/assets/css/widget-form.min.css?ver=3.35.1' media='all' />
<style id="wcf-scroll-to-top-inline-css">

            .wcf-scroll-to-top {
                bottom: 30px;
                right: 15px;
                width: 50px;
                height: 50px;
                z-index: 9999;
                background-color: #121212;
                border-radius: 5px;
                font-size: 16px;
                color: #FFFFFF;
                fill: #FFFFFF;
                mix-blend-mode: normal;
            }
            .wcf-scroll-to-top.scroll-to-circle {
                width: 50px;
                height: 50px;
            }
        
/*# sourceURL=wcf-scroll-to-top-inline-css */
</style>
<style id="wcf-cursor-inline-css">
.wcf-cursor {width: px;height: px;border-color: #FFFFFF;mix-blend-mode: difference;}.wcf-cursor-follower {width: px;height: px;background-color: #FFFFFF;mix-blend-mode: difference;}
/*# sourceURL=wcf-cursor-inline-css */
</style>
<link rel='stylesheet' id='wpforms-modern-full-css' href='/wp-content/plugins/wpforms-lite/assets/css/frontend/modern/wpforms-full.min.css?ver=2.0.1.1' media='all' />
<style id="wpforms-modern-full-inline-css">
:root {
				--wpforms-field-border-radius: 3px;
--wpforms-field-border-style: solid;
--wpforms-field-border-size: 1px;
--wpforms-field-background-color: #ffffff;
--wpforms-field-border-color: rgba( 0, 0, 0, 0.25 );
--wpforms-field-border-color-spare: rgba( 0, 0, 0, 0.25 );
--wpforms-field-text-color: rgba( 0, 0, 0, 0.7 );
--wpforms-field-menu-color: #ffffff;
--wpforms-label-color: rgba( 0, 0, 0, 0.85 );
--wpforms-label-sublabel-color: rgba( 0, 0, 0, 0.55 );
--wpforms-label-error-color: #d63637;
--wpforms-button-border-radius: 3px;
--wpforms-button-border-style: none;
--wpforms-button-border-size: 1px;
--wpforms-button-background-color: #066aab;
--wpforms-button-border-color: #066aab;
--wpforms-button-text-color: #ffffff;
--wpforms-page-break-color: #066aab;
--wpforms-background-image: none;
--wpforms-background-position: center center;
--wpforms-background-repeat: no-repeat;
--wpforms-background-size: cover;
--wpforms-background-width: 100px;
--wpforms-background-height: 100px;
--wpforms-background-color: rgba( 0, 0, 0, 0 );
--wpforms-background-url: none;
--wpforms-container-padding: 0px;
--wpforms-container-border-style: none;
--wpforms-container-border-width: 1px;
--wpforms-container-border-color: #000000;
--wpforms-container-border-radius: 3px;
--wpforms-field-size-input-height: 43px;
--wpforms-field-size-input-spacing: 15px;
--wpforms-field-size-font-size: 16px;
--wpforms-field-size-line-height: 19px;
--wpforms-field-size-padding-h: 14px;
--wpforms-field-size-checkbox-size: 16px;
--wpforms-field-size-sublabel-spacing: 5px;
--wpforms-field-size-icon-size: 1;
--wpforms-label-size-font-size: 16px;
--wpforms-label-size-line-height: 19px;
--wpforms-label-size-sublabel-font-size: 14px;
--wpforms-label-size-sublabel-line-height: 17px;
--wpforms-button-size-font-size: 17px;
--wpforms-button-size-height: 41px;
--wpforms-button-size-padding-h: 15px;
--wpforms-button-size-margin-top: 10px;
--wpforms-container-shadow-size-box-shadow: none;
			}
/*# sourceURL=wpforms-modern-full-inline-css */
</style>





























































<!-- scc90561-89f12b -->
		
		`,
        }}
      />
    </>
  );
}
