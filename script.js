/* ══════════════════════════════════════════════════════════
   Pure Gardening Company — script.js
   Minimal, dependency-free vanilla JS
══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────
     1. Scroll Reveal (IntersectionObserver)
  ────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ──────────────────────────────────────
     2. Nav: transparent → solid on scroll
  ────────────────────────────────────── */
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ──────────────────────────────────────
     3. Smooth scroll for all anchor links
  ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // allow logo link to page-top natively
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const stickyBar = document.getElementById('sticky-bar');
      const stickyH   = stickyBar ? stickyBar.offsetHeight : 0;
      const navH      = nav ? nav.offsetHeight : 0;
      const isMobile  = window.innerWidth < 900;
      const offset    = isMobile ? stickyH + 12 : navH + 24;

      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────────────
     4. Floating WhatsApp FAB
     Appears after user scrolls past hero
  ────────────────────────────────────── */
  const fab  = document.getElementById('whatsapp-fab');
  const hero = document.getElementById('hero');

  if (fab && hero) {
    function handleFab() {
      const heroBottom = hero.getBoundingClientRect().bottom;
      if (heroBottom < 0) {
        fab.classList.add('fab-visible');
      } else {
        fab.classList.remove('fab-visible');
      }
    }
    window.addEventListener('scroll', handleFab, { passive: true });
    handleFab(); // check on load
  }

  /* ──────────────────────────────────────
     5. Quote Form — validation + mailto
  ────────────────────────────────────── */
  const form    = document.getElementById('quote-form');
  const success = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate required fields
      let valid = true;
      const required = form.querySelectorAll('[required]');

      required.forEach((field) => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#E53E3E';
          valid = false;
        }
      });

      if (!valid) {
        const firstBad = form.querySelector('[style*="E53E3E"]');
        if (firstBad) firstBad.focus();
        return;
      }

      // Build mailto with form data
      const name     = form.querySelector('#f-name').value.trim();
      const location = form.querySelector('#f-location').value.trim();
      const work     = form.querySelector('#f-work').value;
      const prefEl   = form.querySelector('[name="contact-pref"]:checked');
      const pref     = prefEl ? prefEl.value : 'Not specified';

      const body = [
        'Name: '              + name,
        'Location: '          + location,
        'Type of Work: '      + work,
        'Preferred Contact: ' + pref,
      ].join('\n');

      const mailto = 'mailto:quotes@puregardening.uk'
        + '?subject=' + encodeURIComponent('Garden Quote Request')
        + '&body='    + encodeURIComponent(body);

      window.location.href = mailto;

      // Show success
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Request Sent';

      setTimeout(() => {
        success.hidden = false;
        submitBtn.style.display = 'none';
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 600);
    });

    // Clear error borders on input
    form.querySelectorAll('input, select').forEach((field) => {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

  /* ──────────────────────────────────────
     6. Gallery — parallax-lite on desktop
     Works on <img> elements via translateY
  ────────────────────────────────────── */
  const galleryImgs = document.querySelectorAll('.gallery-item img');

  if (galleryImgs.length && window.matchMedia('(min-width: 900px)').matches) {
    window.addEventListener('scroll', () => {
      galleryImgs.forEach((img) => {
        const rect = img.parentElement.getBoundingClientRect();
        if (rect.top >= window.innerHeight || rect.bottom <= 0) return;
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        img.style.transform = `scale(1) translateY(${center * 0.05}px)`;
      });
    }, { passive: true });
  }

})();
