/**
 * ace360 page script: Lenis smooth scroll, chapter tracking for the 3D film,
 * sticky feature/project chapters, tone switching, copy reveals and navigation.
 * All content is readable without this file.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var hasGsap = !!(gsap && ScrollTrigger);
  var lenis = null;
  var film = function () { return window.ACE360_FILM; };

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  if (!reduced && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function scrollToY(y) {
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="#"]');
    if (!link) return;
    var url = new URL(link.href, window.location.href);
    if (url.pathname !== window.location.pathname || !url.hash || url.hash.length < 2) return;
    var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    closeNav();
    var y = target.id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY;
    // land chapters in their middle, where the camera keyframe sits
    if (target.classList.contains('ch') && !target.classList.contains('tall')) {
      y += (target.offsetHeight - window.innerHeight) / 2;
    }
    scrollToY(Math.max(0, y));
    if (target.id !== 'top') {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  /* ---------- Header + progress ---------- */
  var header = document.querySelector('[data-header]');
  var bar = document.querySelector('.scroll-progress span');
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (header) header.classList.toggle('is-hidden', y > 400 && y > lastY + 2 && !body.classList.contains('nav-open'));
    lastY = y;
  }
  if (lenis) lenis.on('scroll', onScroll); else window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  function closeNav() {
    if (!body.classList.contains('nav-open')) return;
    body.classList.remove('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = !body.classList.contains('nav-open');
      body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------- Contact form in the static preview ---------- */
  var form = document.querySelector('[data-contact-form]');
  if (form && window.ACE360_PREVIEW) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('[data-form-preview]');
      if (note) {
        note.textContent = 'Preview only: in WordPress this form emails the enquiry to the address set in the Customizer.';
        note.hidden = false;
      }
    });
  }

  if (!hasGsap) return;

  /* ---------- Chapters drive the 3D screen ---------- */
  function show(screen, image, title) {
    var f = film();
    if (f && screen) f.setScreen(screen, image, title);
  }
  document.querySelectorAll('.ch[data-k]:not(.tall)').forEach(function (ch) {
    ScrollTrigger.create({
      trigger: ch,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: function (self) { if (self.isActive) show(ch.dataset.screen); }
    });
  });

  /* Tall chapters: the sticky copy cycles through its items as you scroll. */
  document.querySelectorAll('.ch.tall').forEach(function (ch) {
    var items = ch.querySelectorAll('.item');
    var dots = ch.querySelectorAll('[data-go]');
    var count = ch.querySelector('[data-count]');
    var fill = ch.querySelector('[data-bar]');
    var n = items.length;
    var idx = -1;
    var st;
    function activate(i, force) {
      if (i === idx && !force) return;
      idx = i;
      items.forEach(function (it, j) { it.classList.toggle('is-on', j === i); });
      dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
      if (count) count.textContent = (i + 1) + ' / ' + n;
      // only the chapter on screen may change the 3D window
      if (st && st.isActive) {
        var it = items[i];
        show(it.dataset.screen, it.dataset.image, it.dataset.title);
      }
    }
    function progress() {
      var top = ch.getBoundingClientRect().top + window.scrollY;
      var range = Math.max(1, ch.offsetHeight - window.innerHeight);
      return Math.min(1, Math.max(0, (window.scrollY - top) / range));
    }
    // active (allowed to drive the 3D window) while the chapter fills the middle of the screen;
    // which item shows depends on progress through the sticky range
    st = ScrollTrigger.create({
      trigger: ch,
      start: 'top 55%',
      end: 'bottom 45%',
      onUpdate: function () {
        var p = progress();
        activate(Math.min(n - 1, Math.floor(p * n * 0.999)));
        if (fill) fill.style.transform = 'scaleX(' + Math.max(0.04, p) + ')';
      },
      onToggle: function (self) {
        if (self.isActive) activate(Math.min(n - 1, Math.floor(progress() * n * 0.999)), true);
      }
    });
    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        var i = parseInt(d.dataset.go, 10);
        var top = ch.getBoundingClientRect().top + window.scrollY;
        scrollToY(top + (ch.offsetHeight - window.innerHeight) * ((i + 0.5) / n));
      });
    });
  });

  /* ---------- Tone: fade to porcelain in light chapters ---------- */
  var bgLight = document.getElementById('bg-light');
  document.querySelectorAll('[data-tone="light"]').forEach(function (ch) {
    ScrollTrigger.create({
      trigger: ch,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: function (self) {
        if (bgLight) gsap.to(bgLight, { opacity: self.isActive ? 1 : 0, duration: 0.9, ease: 'power2.out', overwrite: true });
        if (header) header.classList.toggle('is-light', self.isActive);
      }
    });
  });

  if (reduced) return;

  /* ---------- Copy reveals ---------- */
  var heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    gsap.timeline({ delay: 0.5 })
      .from(heroTitle.querySelectorAll('.line-inner'), { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.1 })
      .fromTo(heroTitle.querySelectorAll('.stretch'), { '--wdth': 62 }, { '--wdth': 125, duration: 1.6, ease: 'expo.inOut' }, 0.15)
      .from('.hero .kicker, .hero .body, .hero .actions', { y: 20, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, 0.5)
      .from('.header-inner', { y: -16, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'transform,opacity' }, 0.3);
  }

  document.querySelectorAll('.ch:not(.hero):not(.tall) .copy').forEach(function (copy) {
    var kids = copy.querySelectorAll(':scope > *, :scope > .lines > li, :scope > .rules > li, :scope > .services > li');
    gsap.from(kids, {
      y: 28, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.06,
      scrollTrigger: { trigger: copy, start: 'top 80%', once: true }
    });
  });
  document.querySelectorAll('.ch.tall .copy').forEach(function (copy) {
    gsap.from(copy, { y: 30, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: copy.closest('.ch'), start: 'top 60%', once: true } });
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
