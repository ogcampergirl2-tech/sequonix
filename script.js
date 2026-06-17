/* ============================================================
   Sequonix : interactions
   IntersectionObserver reveals, count-up KPIs, sticky nav,
   mobile menu, work carousel, accessible newsletter validation.
   No scroll-jacking, no decorative animation libraries.
   ============================================================ */
(function () {
  'use strict';

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
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------- Count-up KPIs ---------- */
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const dur = 1300;
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

  /* ---------- Sticky nav state ---------- */
  const nav = document.getElementById('nav');
  let ticking = false;
  function onScroll() {
    nav.classList.toggle('nav--scrolled', window.scrollY > 24);
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

  /* ---------- Selected-work carousel ---------- */
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
  function validate() {
    const val = email.value.trim();
    if (!val) { setError('Please enter your email address.'); return false; }
    if (!emailRe.test(val)) { setError('That does not look like a valid email. Check for typos.'); return false; }
    clearError();
    return true;
  }

  // Validate on blur, clear the error as the user fixes it.
  email.addEventListener('blur', () => { if (email.value.trim()) validate(); });
  email.addEventListener('input', () => { if (email.classList.contains('invalid')) clearError(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) { email.focus(); return; }
    // Front-end demo: no mailer connected yet.
    success.hidden = false;
    form.querySelector('.subscribe__btn').textContent = 'Subscribed';
    email.value = '';
  });

  /* ---------- Sequenced reveal delays ---------- */
  ['.services', '.industries', '.about__pillars', '.partners', '.news__issues'].forEach((sel) => {
    const parent = document.querySelector(sel);
    if (!parent) return;
    Array.from(parent.querySelectorAll('.reveal')).forEach((el, i) => {
      el.style.transitionDelay = (i * 0.07).toFixed(2) + 's';
    });
  });
})();
