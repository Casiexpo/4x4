/* ============================================================
   4x4 CATALUNYA – MAIN.JS
   ============================================================ */

'use strict';

/* ---- HEADER: scroll border effect -------------------------- */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ---- MOBILE NAV TOGGLE ------------------------------------- */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ---- COUNTER ANIMATION ------------------------------------- */
(function () {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1400;
    let start      = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOut(progress) * target);
      el.textContent = target >= 1000 ? value.toLocaleString('ca-ES') : value;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  } else {
    counters.forEach(animateCounter);
  }
})();

/* ---- DATE SORTING ------------------------------------------ */
/*
  Llegeix l'atribut data-date (YYYY-MM-DD) de cada .event-card i:
  1. Compara amb la data d'avui
  2. Events futurs o d'avui → primera posició, ordenats del més pròxim al més llunyà
  3. Events passats → al final, ordenats del més recent al més antic
  4. Afegeix badge "Passat" i estil atenuat als events ja celebrats
*/
(function () {
  const grid = document.getElementById('events-grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.event-card[data-date]'));
  if (!cards.length) return;

  // Normalize today to midnight for clean comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = [];
  const past     = [];

  cards.forEach(card => {
    const dateStr = card.getAttribute('data-date'); // YYYY-MM-DD
    const eventDate = new Date(dateStr + 'T00:00:00');

    if (eventDate >= today) {
      upcoming.push({ card, date: eventDate });
    } else {
      past.push({ card, date: eventDate });
      markAsPast(card);
    }
  });

  // Sort upcoming: soonest first
  upcoming.sort((a, b) => a.date - b.date);

  // Sort past: most recent first
  past.sort((a, b) => b.date - a.date);

  // Reorder DOM
  const ordered = [...upcoming, ...past];
  ordered.forEach(({ card }) => grid.appendChild(card));
})();

function markAsPast(card) {
  // Visual style: desaturated + opacity
  card.style.opacity = '0.55';
  card.style.filter  = 'grayscale(60%)';

  // Add "Passat" badge to the image wrap
  const imgWrap = card.querySelector('.card-img-wrap');
  if (imgWrap && !imgWrap.querySelector('.card-badge-past')) {
    const badge = document.createElement('span');
    badge.className   = 'card-badge-past';
    badge.textContent = 'Passat';
    badge.setAttribute('aria-label', 'Event ja celebrat');
    imgWrap.appendChild(badge);
  }

  // Add aria note
  const link = card.querySelector('.card-link');
  if (link) {
    const currentLabel = link.getAttribute('aria-label') || '';
    if (!currentLabel.includes('(passat)')) {
      link.setAttribute('aria-label', currentLabel + ' (event ja celebrat)');
    }
  }
}

/* ---- CARD HOVER: subtle tilt effect ----------------------- */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.event-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX = (-y * 6).toFixed(2);
      const tiltY = ( x * 6).toFixed(2);
      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ---- SCROLL REVEAL ----------------------------------------- */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const revealEls = document.querySelectorAll('.info-grid, .info-text, .info-visual');
  const observer  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
})();