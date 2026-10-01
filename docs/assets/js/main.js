/**
 * ace360 page script: EN/NL switch, price estimator, Lenis smooth scroll,
 * the sticky Work chapter, reveals and navigation.
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

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  function lang() { return root.getAttribute('data-lang') === 'nl' ? 'nl' : 'en'; }

  /* ---------- Language switch ---------- */
  var langField = document.querySelector('[data-lang-field]');
  function applyLang(l, save) {
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l);
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === l));
    });
    if (langField) langField.value = l;
    if (save) { try { localStorage.setItem('ace360-lang', l); } catch (e) {} }
    document.dispatchEvent(new CustomEvent('ace360:lang', { detail: l }));
    if (hasGsap) ScrollTrigger.refresh();
  }
  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-set-lang'), true); });
  });
  applyLang(lang(), false);

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
    if (lenis) lenis.scrollTo(y, { duration: 1.5 });
    else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }
  function scrollToEl(target) {
    var y = target.id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY;
    var h = target.offsetHeight, vh = window.innerHeight;
    if (target.classList.contains('ch') && !target.classList.contains('tall') && h <= vh * 1.3) y += (h - vh) / 2;
    scrollToY(Math.max(0, y));
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
    scrollToEl(target);
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
      header.classList.toggle('is-scrolled', y > 10);
      header.classList.toggle('is-hidden', y > 500 && y > lastY + 2 && !body.classList.contains('nav-open'));
    }
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

  /* ---------- Price estimator ---------- */
  var est = document.querySelector('[data-estimator]');
  var estField = document.querySelector('[data-estimate-field]');
  var estChip = document.querySelector('[data-estimate-chip]');
  var lastEstimate = null;
  function money(n, l) {
    var s = new Intl.NumberFormat(l === 'nl' ? 'nl-NL' : 'en-GB', { maximumFractionDigits: 0 }).format(n);
    return l === 'nl' ? '€ ' + s : '€' + s;
  }
  function weeksText(w, l) {
    if (l === 'nl') return w === 1 ? '1 week' : w + ' weken';
    return w === 1 ? '1 week' : w + ' weeks';
  }
  function describe(r, l) {
    var range = r.max ? money(r.min, l) + ' – ' + money(r.max, l) : (l === 'nl' ? 'Vanaf ' : 'From ') + money(r.min, l);
    var meta = r.max
      ? (l === 'nl' ? 'Live in ongeveer ' : 'Launch in about ') + weeksText(r.weeks, l)
      : (l === 'nl' ? 'Lanceerdatum volgt in de offerte' : 'Launch date set in the quote');
    meta += l === 'nl' ? ' · excl. btw' : ' · excl. VAT';
    if (r.care) meta += l === 'nl' ? ' · + ' + money(r.care, l) + ' per maand onderhoud' : ' · + ' + money(r.care, l) + '/month care';
    return { range: range, meta: meta };
  }
  if (est) {
    var cfg;
    try { cfg = JSON.parse(est.getAttribute('data-estimator')); } catch (e) { cfg = null; }
    if (cfg && cfg.types && cfg.types.length) {
      var outRange = est.querySelector('[data-est-range]');
      var outMeta = est.querySelector('[data-est-meta]');
      var calc = function () {
        var checked = est.querySelector('input[name="est_type"]:checked');
        var type = cfg.types.filter(function (t) { return checked && t.id === checked.value; })[0] || cfg.types[0];
        var picked = Array.prototype.map.call(est.querySelectorAll('input[name="est_extra"]:checked'), function (i) { return i.value; });
        var extras = cfg.extras.filter(function (x) { return picked.indexOf(x.id) !== -1; });
        var care = est.querySelector('#est_care');
        var r = { type: type, extras: extras, min: type.min, max: type.max, weeks: type.weeks, care: care && care.checked ? cfg.care : 0 };
        extras.forEach(function (x) { r.min += x.min; if (r.max) r.max += x.max; r.weeks += x.weeks; });
        return r;
      };
      var renderChip = function () {
        if (!lastEstimate || !estChip) return;
        var l = lang();
        var names = [lastEstimate.type[l]].concat(lastEstimate.extras.map(function (x) { return x[l]; }));
        estChip.textContent = (l === 'nl' ? 'Indicatie: ' : 'Estimate: ') + names.join(', ') + ' — ' + describe(lastEstimate, l).range;
      };
      var render = function () {
        lastEstimate = calc();
        var d = describe(lastEstimate, lang());
        outRange.textContent = d.range;
        outMeta.textContent = d.meta;
        if (estChip && !estChip.hidden) renderChip();
      };
      est.addEventListener('change', render);
      document.addEventListener('ace360:lang', render);
      render();

      var send = est.querySelector('[data-est-send]');
      if (send) {
        send.addEventListener('click', function () {
          var r = lastEstimate;
          var names = [r.type.en].concat(r.extras.map(function (x) { return x.en; }));
          if (estField) estField.value = names.join(', ') + ' — ' + describe(r, 'en').range + (r.care ? ' + care plan' : '');
          if (estChip) { estChip.hidden = false; renderChip(); }
          var need = document.querySelector('input[name="ace360_need"][value="' + (r.type.id === 'store' ? 'Online store' : 'Website') + '"]');
          if (need) need.checked = true;
          var contact = document.getElementById('contact');
          if (contact) scrollToEl(contact);
          setTimeout(function () { var m = document.getElementById('ace360_message'); if (m) m.focus({ preventScroll: true }); }, 1300);
        });
      }
    }
  }

  /* ---------- Contact form in the static preview ---------- */
  var form = document.querySelector('[data-contact-form]');
  if (form && window.ACE360_PREVIEW) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('[data-form-preview]');
      if (note) {
        note.textContent = lang() === 'nl'
          ? 'Alleen voorbeeld: in WordPress mailt dit formulier de aanvraag naar het e-mailadres uit de Customizer.'
          : 'Preview only: in WordPress this form emails the enquiry to the address set in the Customizer.';
        note.hidden = false;
      }
    });
  }

  if (!hasGsap) return;

  /* ---------- Work: sticky chapter cycles its projects ---------- */
  document.querySelectorAll('.ch.tall').forEach(function (ch) {
    var items = ch.querySelectorAll('.item');
    var dots = ch.querySelectorAll('[data-go]');
    var count = ch.querySelector('[data-count]');
    var n = items.length;
    var idx = -1;
    function progress() {
      var top = ch.getBoundingClientRect().top + window.scrollY;
      var range = Math.max(1, ch.offsetHeight - window.innerHeight);
      return Math.min(1, Math.max(0, (window.scrollY - top) / range));
    }
    function activate(i) {
      if (i === idx) return;
      idx = i;
      items.forEach(function (it, j) { it.classList.toggle('is-on', j === i); });
      dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
      if (count) count.textContent = (i + 1) + ' / ' + n;
    }
    ScrollTrigger.create({
      trigger: ch, start: 'top bottom', end: 'bottom top',
      onUpdate: function () { activate(Math.min(n - 1, Math.floor(progress() * n * 0.999))); }
    });
    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        var i = parseInt(d.dataset.go, 10);
        var top = ch.getBoundingClientRect().top + window.scrollY;
        scrollToY(top + (ch.offsetHeight - window.innerHeight) * ((i + 0.5) / n));
      });
    });
  });

  if (reduced) return;

  /* ---------- Reveals ---------- */
  gsap.timeline({ delay: 0.35 })
    .from('.hero .kicker, .hero-title, .hero .body, .hero .actions, .hero .checks li', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.07 })
    .from('.header-inner', { y: -14, opacity: 0, duration: 0.9, ease: 'power3.out', clearProps: 'transform,opacity' }, 0.1);

  document.querySelectorAll('.ch:not(.hero):not(.tall):not(.contact) .copy, .band-head, .contact .copy').forEach(function (copy) {
    var kids = copy.querySelectorAll(':scope > *');
    gsap.from(kids, {
      y: 26, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.05,
      scrollTrigger: { trigger: copy, start: 'top 82%', once: true }
    });
  });
  document.querySelectorAll('.faq details, .contact-form, .ch.tall .copy').forEach(function (el) {
    gsap.from(el, { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
