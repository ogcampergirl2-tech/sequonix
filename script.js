/* ============================================================
   Sequonix — interactions
   IntersectionObserver reveals, count-up KPIs, sticky nav,
   subtle orb parallax, mobile menu, and accessible newsletter
   form validation (skill: inline-validation, error-clarity,
   focus-management, aria-live errors).
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------- Count-up KPIs ---------- */
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const dur = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll('.kpi__num').forEach((el) => countObserver.observe(el));

  /* ---------- Sticky nav + scroll progress + orb parallax ---------- */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const orbs = Array.from(document.querySelectorAll('.orb'));
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${docH > 0 ? y / docH : 0})`;
    nav.classList.toggle('nav--scrolled', y > 24);
    ticking = false;
  }
  window.addEventListener(
    'scroll',
    () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } },
    { passive: true }
  );
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav__links');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );

  /* ---------- Selected-work carousel (ported OfferCarousel scroll) ---------- */
  const track = document.getElementById('workTrack');
  if (track) {
    const scrollByAmount = (dir) => {
      const amount = track.clientWidth * 0.8;
      track.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    };
    document.getElementById('workPrev').addEventListener('click', () => scrollByAmount('left'));
    document.getElementById('workNext').addEventListener('click', () => scrollByAmount('right'));
  }

  /* ---------- Newsletter form ---------- */
  const form = document.getElementById('subscribeForm');
  const email = document.getElementById('email');
  const error = document.getElementById('emailError');
  const success = document.getElementById('subscribeSuccess');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    const val = email.value.trim();
    if (!val) { setError('Please enter your email address.'); return false; }
    if (!emailRe.test(val)) { setError('That doesn’t look like a valid email — check for typos.'); return false; }
    clearError();
    return true;
  }
  function setError(msg) {
    error.textContent = msg;
    email.classList.add('invalid');
    email.setAttribute('aria-invalid', 'true');
  }
  function clearError() {
    error.textContent = '';
    email.classList.remove('invalid');
    email.removeAttribute('aria-invalid');
  }

  // Validate on blur (not on every keystroke) per UX guidance
  email.addEventListener('blur', () => { if (email.value.trim()) validate(); });
  email.addEventListener('input', () => { if (email.classList.contains('invalid')) clearError(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) { email.focus(); return; }
    // Front-end only demo: no backend wired yet.
    success.hidden = false;
    form.querySelector('.subscribe__btn').textContent = 'Subscribed ✓';
    email.value = '';
  });

  /* ---------- Sequenced reveals (journey choreography) ---------- */
  ['.services', '.industries', '.about__pillars', '.partners', '.news__issues'].forEach((sel) => {
    const parent = document.querySelector(sel);
    if (!parent) return;
    Array.from(parent.querySelectorAll('.reveal')).forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08).toFixed(2) + 's';
    });
  });

  /* ---------- Waypoint dot-nav active state ---------- */
  const waypoints = document.querySelectorAll('.waypoints a');
  if (waypoints.length) {
    const map = {};
    waypoints.forEach((a) => { map[a.getAttribute('href').slice(1)] = a; });
    const targets = Object.keys(map).map((id) => document.getElementById(id)).filter(Boolean);
    const wpObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            waypoints.forEach((a) => a.classList.remove('active'));
            if (map[e.target.id]) map[e.target.id].classList.add('active');
          }
        });
      },
      { threshold: 0.25, rootMargin: '-25% 0px -45% 0px' }
    );
    targets.forEach((t) => wpObserver.observe(t));
  }
})();

/* ============================================================
   Kinetic experience layer
   - Lenis momentum smooth-scroll (via CDN)
   - Headline rise-into-view mask reveal
   The background is a soft animated gradient mesh (pure CSS).
   ============================================================ */
(function () {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Momentum smooth scroll */
  if (window.Lenis && !reduced) {
    const lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.5 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    // Route in-page anchor links through Lenis for smooth travel
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        a.addEventListener('click', (e) => {
          const el = document.querySelector(href);
          if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -8 }); }
        });
      }
    });
  }

  /* Headline mask reveal: text rises into view from a clipped line */
  function applyMask(selector) {
    document.querySelectorAll(selector).forEach((h) => {
      if (h.dataset.masked) return;
      h.dataset.masked = '1';
      const inner = document.createElement('span');
      inner.className = 'mask__i';
      inner.innerHTML = h.innerHTML;
      h.innerHTML = '';
      h.classList.add('mask');
      h.appendChild(inner);
    });
  }
  applyMask('.hero__title');
  applyMask('.section-head h2');

  const masks = document.querySelectorAll('.mask');
  if (reduced) {
    masks.forEach((m) => m.classList.add('in'));
  } else {
    const maskObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in'); maskObserver.unobserve(e.target); }
        });
      },
      { threshold: 0.3 }
    );
    masks.forEach((m) => maskObserver.observe(m));
  }
})();
