/* ============================================================
   Pure Gardening Company — script.js
   Vanilla JS, no dependencies, 60fps target
   ============================================================ */

'use strict';

/* ── Seasonal Theme ─────────────────────────────────────────── */
(function setSeasonalTheme() {
  const month = new Date().getMonth(); // 0–11
  let season;
  if (month >= 2 && month <= 4)  season = 'spring';   // Mar–May
  else if (month >= 5 && month <= 7)  season = 'summer';   // Jun–Aug
  else if (month >= 8 && month <= 10) season = 'autumn';   // Sep–Nov
  else                                season = 'winter';   // Dec–Feb
  document.documentElement.classList.add('season-' + season);
})();

/* ── Footer Year ────────────────────────────────────────────── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Scroll Reveal (IntersectionObserver) ───────────────────── */
(function initScrollReveal() {
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* ── Sticky Nav Shrink ──────────────────────────────────────── */
(function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastScroll = 0;
  let ticking = false;

  function updateNav() {
    const scrollY = window.scrollY;
    nav.classList.toggle('nav--scrolled', scrollY > 60);
    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
})();

/* ── Mobile Nav ─────────────────────────────────────────────── */
const mobileNav    = document.getElementById('mobile-nav');
const navToggle    = document.getElementById('nav-toggle');
const mobileClose  = document.getElementById('mobile-nav-close');

function openMobileNav() {
  if (!mobileNav || !navToggle) return;
  mobileNav.classList.add('is-open');
  navToggle.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';

  // Move focus to the panel
  const firstLink = mobileNav.querySelector('a, button');
  if (firstLink) firstLink.focus();
}

function closeMobileNav() {
  if (!mobileNav || !navToggle) return;
  mobileNav.classList.remove('is-open');
  navToggle.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  navToggle.focus();
}

// Expose to inline onclick handlers
window.closeMobileNav = closeMobileNav;

if (navToggle) navToggle.addEventListener('click', openMobileNav);
if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (mobileNav && mobileNav.classList.contains('is-open')) closeMobileNav();
    if (document.getElementById('lightbox').classList.contains('is-open')) closeLightbox();
  }
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (mobileNav && mobileNav.classList.contains('is-open')) {
    if (!mobileNav.contains(e.target) && e.target !== navToggle) {
      closeMobileNav();
    }
  }
});

/* ── Smooth Scroll (anchor links) ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();

    const navHeight = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height-sm') || '56', 10
    );
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({ top, behavior: 'smooth' });
    closeMobileNav();
  });
});

/* ── Before & After Slider ──────────────────────────────────── */
(function initBaSliders() {
  const sliders = document.querySelectorAll('[data-slider]');

  sliders.forEach(slider => {
    const after  = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    if (!after || !handle) return;

    let isDragging = false;
    let pct = 50;

    function setPosition(x) {
      const rect = slider.getBoundingClientRect();
      let newPct = ((x - rect.left) / rect.width) * 100;
      newPct = Math.max(2, Math.min(98, newPct));
      pct = newPct;
      after.style.clipPath  = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left     = `${pct}%`;
    }

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      requestAnimationFrame(() => setPosition(e.clientX));
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      requestAnimationFrame(() => setPosition(e.touches[0].clientX));
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });

    // Keyboard accessibility
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { pct = Math.max(2, pct - 5);  after.style.clipPath = `inset(0 ${100-pct}% 0 0)`; handle.style.left = `${pct}%`; }
      if (e.key === 'ArrowRight') { pct = Math.min(98, pct + 5); after.style.clipPath = `inset(0 ${100-pct}% 0 0)`; handle.style.left = `${pct}%`; }
    });
  });
})();

/* ── WhatsApp FAB ───────────────────────────────────────────── */
(function initWaFab() {
  const fab     = document.getElementById('wa-fab');
  const dismiss = document.getElementById('wa-fab-dismiss');
  if (!fab) return;

  // Don't show if previously dismissed
  if (localStorage.getItem('wa-fab-dismissed') === '1') return;

  // Show after 5 seconds
  let showTimer = setTimeout(() => {
    fab.classList.add('is-visible');
  }, 5000);

  if (dismiss) {
    dismiss.addEventListener('click', () => {
      fab.classList.remove('is-visible');
      dismiss.style.display = 'none';
      localStorage.setItem('wa-fab-dismissed', '1');
      clearTimeout(showTimer);
    });
  }
})();

/* ── Lightbox ───────────────────────────────────────────────── */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Make gallery images open lightbox
document.querySelectorAll('.why-mosaic-img img, .ba-slider-wrap img').forEach(img => {
  const parent = img.closest('.why-mosaic-img');
  if (parent) {
    parent.style.cursor = 'zoom-in';
    parent.addEventListener('click', () => openLightbox(img.src, img.alt));
  }
});

/* ── Quote Form ─────────────────────────────────────────────── */
(function initQuoteForm() {
  const form    = document.getElementById('quote-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit');
  if (!form) return;

  const fields = {
    name:     { el: document.getElementById('name'),     errEl: document.getElementById('name-error'),     msg: 'Please enter your name.' },
    location: { el: document.getElementById('location'), errEl: document.getElementById('location-error'), msg: 'Please enter your location.' },
    service:  { el: document.getElementById('service'),  errEl: document.getElementById('service-error'),  msg: 'Please choose a service.' },
  };

  // Clear errors on input
  Object.values(fields).forEach(({ el, errEl }) => {
    if (!el) return;
    el.addEventListener('input', () => {
      el.classList.remove('is-error');
      if (errEl) errEl.textContent = '';
    });
  });

  function validate() {
    let valid = true;
    Object.values(fields).forEach(({ el, errEl, msg }) => {
      if (!el) return;
      const empty = !el.value.trim() || (el.tagName === 'SELECT' && !el.value);
      if (empty) {
        el.classList.add('is-error');
        if (errEl) errEl.textContent = msg;
        if (valid) el.focus();
        valid = false;
      }
    });
    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Collect form data
    const contactMethods = Array.from(
      form.querySelectorAll('input[name="contact_method"]:checked')
    ).map(cb => cb.value);

    const payload = {
      name:           fields.name.el.value.trim(),
      location:       fields.location.el.value.trim(),
      service:        fields.service.el.value,
      contact_method: contactMethods,
      message:        (form.querySelector('#message') || {}).value || '',
      source:         'puregardening.uk',
      timestamp:      new Date().toISOString(),
    };

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res = await fetch('https://api.gardenos.co/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok || res.status === 201) {
        // Success
        form.style.display = 'none';
        if (success) success.classList.add('is-visible');
      } else {
        throw new Error('Server error ' + res.status);
      }
    } catch (err) {
      // Fallback: open mailto
      const subject = encodeURIComponent('Garden Quote Request — ' + payload.name);
      const body = encodeURIComponent(
        `Name: ${payload.name}\nLocation: ${payload.location}\nService: ${payload.service}\nContact preference: ${contactMethods.join(', ') || 'Not specified'}\n\nMessage:\n${payload.message}`
      );
      window.location.href = `mailto:quotes@puregardening.uk?subject=${subject}&body=${body}`;

      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        Send My Quote Request`;
    }
  });
})();
