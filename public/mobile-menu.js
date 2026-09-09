// 13 UTOPiA — Fullscreen Mobile Menu & Accordion Dropdown JS
document.addEventListener('DOMContentLoaded', () => {
  const toggleButtons = document.querySelectorAll('.elementor-menu-toggle');

  function toggleMobileMenu(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const isCurrentlyOpen = document.body.classList.contains('utopia-menu-open');

    toggleButtons.forEach(btn => {
      const container = btn.closest('.elementor-widget-nav-menu')?.querySelector('.elementor-nav-menu--dropdown');

      if (!isCurrentlyOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('elementor-active');
        container?.setAttribute('aria-hidden', 'false');
        container?.classList.add('elementor-active');
      } else {
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('elementor-active');
        container?.setAttribute('aria-hidden', 'true');
        container?.classList.remove('elementor-active');
      }
    });

    if (!isCurrentlyOpen) {
      document.body.classList.add('utopia-menu-open');
    } else {
      document.body.classList.remove('utopia-menu-open');
    }
  }

  // Mobile overlay toggle — listen on click & touchstart with 1st click priority
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', toggleMobileMenu, true);
  });

  // Services Accordion Dropdown toggle (Mobile & Tablet)
  const parentItems = document.querySelectorAll('.menu-item-has-children > a');
  parentItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        e.stopPropagation();
        const parentLi = item.closest('.menu-item-has-children');
        parentLi?.classList.toggle('utopia-dropdown-open');
      }
    });
  });

  // Close overlay when clicking on sub-item links (actual page navigation)
  const subLinks = document.querySelectorAll('.sub-menu a, .elementor-nav-menu--dropdown .menu-item:not(.menu-item-has-children) > a');
  subLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleButtons.forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('elementor-active');
        const container = btn.closest('.elementor-widget-nav-menu')?.querySelector('.elementor-nav-menu--dropdown');
        container?.setAttribute('aria-hidden', 'true');
        container?.classList.remove('elementor-active');
      });
      document.body.classList.remove('utopia-menu-open');
    });
  });
});
