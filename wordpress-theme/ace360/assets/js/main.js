/**
 * ace360 motion layer: Lenis smooth scroll, GSAP + ScrollTrigger reveals,
 * pinned horizontal work gallery, magnetic buttons and a cursor follower.
 * All content is readable without this file; it only adds motion.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var hasGsap = !!(gsap && ScrollTrigger);
  var lenis = null;

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  if (!reduced && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function headerOffset() {
    var h = document.querySelector('[data-header]');
    return h ? h.offsetHeight : 0;
  }

  function scrollToTarget(target) {
    var offset = target.id === 'top' ? 0 : -headerOffset() + 1;
    if (lenis) {
      lenis.scrollTo(target.id === 'top' ? 0 : target, { offset: offset, duration: 1.4 });
    } else {
      var y = target.id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }
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
    scrollToTarget(target);
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
    if (header) {
      header.classList.toggle('is-scrolled', y > 20);
      var hide = y > 400 && y > lastY && !body.classList.contains('nav-open');
      header.classList.toggle('is-hidden', hide);
    }
    lastY = y;
  }
  if (lenis) {
    lenis.on('scroll', onScroll);
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
  }
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
      if (lenis) { if (open) { lenis.stop(); } else { lenis.start(); } }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
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

  if (!hasGsap || reduced) return;

  /* ---------- Cursor follower ---------- */
  if (finePointer) {
    root.classList.add('has-cursor');
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    var dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    var dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    var rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
    var ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
    window.addEventListener('pointermove', function (e) {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      root.classList.add('cursor-moved');
    }, { passive: true });
    var hoverSel = 'a, button, label.chip, .service, .tile, input, textarea';
    document.addEventListener('pointerover', function (e) {
      if (e.target.closest(hoverSel)) root.classList.add('cursor-hover');
    });
    document.addEventListener('pointerout', function (e) {
      if (e.target.closest(hoverSel) && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(hoverSel))) {
        root.classList.remove('cursor-hover');
      }
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var inner = el.querySelector('span');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: mx * 0.3, y: my * 0.4, duration: 0.5, ease: 'power3.out' });
        if (inner) gsap.to(inner, { x: mx * 0.12, y: my * 0.12, duration: 0.5, ease: 'power3.out' });
      });
      el.addEventListener('pointerleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' });
        if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' });
      });
    });
  }

  /* ---------- Headline reveal (lines rise, accent word stretches) ---------- */
  function revealLines(el, opts) {
    var tl = gsap.timeline(opts);
    tl.from(el.querySelectorAll('.line-inner'), { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.09 });
    var stretch = el.querySelectorAll('.stretch');
    if (stretch.length) {
      tl.fromTo(stretch, { '--wdth': 62 }, { '--wdth': 125, duration: 1.5, ease: 'expo.inOut' }, 0.2);
    }
    return tl;
  }

  /* Hero intro */
  var heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    var intro = revealLines(heroTitle, { delay: 0.15 });
    intro.from('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0)
      .from('.hero-text, .hero-actions > *', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, 0.55)
      .from('.hero-facts li', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07 }, 0.75)
      .from('.header-inner', { y: -24, opacity: 0, duration: 0.9, ease: 'expo.out', clearProps: 'transform,opacity' }, 0.3);

    gsap.to('.hero-copy', {
      yPercent: -14,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* Section headlines */
  document.querySelectorAll('[data-reveal-lines]').forEach(function (el) {
    if (el === heroTitle) return;
    revealLines(el, { scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });

  /* Rows, tiles and steps */
  if (document.querySelector('[data-reveal]')) gsap.set('[data-reveal]', { y: 48, opacity: 0 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.08, overwrite: true });
    }
  });

  /* Marquee leans with scroll velocity */
  var track = document.querySelector('.marquee-track');
  if (track) {
    var skew = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power3' });
    ScrollTrigger.create({
      onUpdate: function (self) {
        skew(gsap.utils.clamp(-8, 8, self.getVelocity() / -300));
      }
    });
  }

  /* ---------- Work: pinned horizontal scroll on wide screens ---------- */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', function () {
    var section = document.querySelector('[data-work]');
    var workTrack = document.querySelector('[data-work-track]');
    if (!section || !workTrack) return;
    function distance() {
      return Math.max(0, workTrack.scrollWidth - window.innerWidth);
    }
    gsap.to(workTrack, {
      x: function () { return -distance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: function () { return '+=' + distance(); },
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
    gsap.utils.toArray('.work-card .work-visual').forEach(function (v) {
      gsap.from(v, { clipPath: 'inset(12% 12% 12% 12%)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 70%', once: true } });
    });
  });

  /* ---------- Process: line fills, steps light up ---------- */
  var fill = document.querySelector('[data-steps-fill]');
  if (fill) {
    gsap.to(fill, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.steps-wrap', start: 'top 65%', end: 'bottom 65%', scrub: true }
    });
  }
  document.querySelectorAll('.step').forEach(function (step) {
    ScrollTrigger.create({ trigger: step, start: 'top 65%', toggleClass: 'is-active' });
  });

  /* Recalculate once fonts settle, because headline sizes change. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
