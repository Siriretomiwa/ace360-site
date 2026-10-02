/**
 * Ace 360 page script: EN/NL switch, self-quote calculator, 3D hero tilt,
 * Lenis smooth scroll, reveals and navigation. All content works without it.
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
  function lang() { return root.getAttribute('data-lang') === 'nl' ? 'nl' : 'en'; }

  /* ---------- Language ---------- */
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
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  function headerH() { var h = document.querySelector('[data-header]'); return h ? h.offsetHeight : 0; }
  function scrollToEl(target) {
    var y = target.id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY - headerH() + 1;
    if (lenis) lenis.scrollTo(Math.max(0, y), { duration: 1.4 });
    else window.scrollTo({ top: Math.max(0, y), behavior: reduced ? 'auto' : 'smooth' });
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
      header.classList.toggle('is-scrolled', y > 8);
      header.classList.toggle('is-hidden', y > 600 && y > lastY + 2 && !body.classList.contains('nav-open'));
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

  /* ---------- Self-quote ---------- */
  var quote = document.querySelector('[data-quote]');
  var estField = document.querySelector('[data-estimate-field]');
  var estChip = document.querySelector('[data-estimate-chip]');
  var estChipText = document.querySelector('[data-estimate-chip-text]');
  var last = null;

  function money(n, l) {
    var s = new Intl.NumberFormat(l === 'nl' ? 'nl-NL' : 'en-GB', { maximumFractionDigits: 0 }).format(Math.round(n));
    return l === 'nl' ? '€ ' + s : '€' + s;
  }
  function round10(n) { return Math.round(n / 10) * 10; }
  function weeksText(a, b, l) {
    if (b <= 0) return l === 'nl' ? 'Direct' : 'Right away';
    var r = a === b ? String(a) : a + '–' + b;
    return r + (l === 'nl' ? (b === 1 ? ' week' : ' weken') : (b === 1 ? ' week' : ' weeks'));
  }

  if (quote) {
    var cfg = null;
    try { cfg = JSON.parse(quote.getAttribute('data-quote')); } catch (e) {}
    if (cfg && cfg.types) {
      var out = {
        range: quote.querySelector('[data-q-range]'),
        weeks: quote.querySelector('[data-q-weeks]'),
        care: quote.querySelector('[data-q-care]'),
        lines: quote.querySelector('[data-q-lines]'),
        pagesOut: quote.querySelector('[data-q-pages-out]')
      };
      var pagesStep = quote.querySelector('[data-q-pages]');
      var designStep = quote.querySelector('[data-q-design]');
      var range = quote.querySelector('#q_pages');
      var shown = { lo: 0, hi: 0 };

      var find = function (list, id) { return list.filter(function (x) { return x.id === id; })[0]; };
      var calc = function () {
        var type = find(cfg.types, (quote.querySelector('input[name="q_type"]:checked') || {}).value) || cfg.types[0];
        var design = find(cfg.design, (quote.querySelector('input[name="q_design"]:checked') || {}).value) || cfg.design[0];
        var pages = type.pages ? parseInt(range.value, 10) : type.incl;
        var lines = [];
        var lo = type.base[0], hi = type.base[1];
        lines.push({ label: type['label_' + lang()] + (type.pages ? ' · ' + pages + (lang() === 'nl' ? ' pagina’s' : ' pages') : ''), lo: type.base[0], hi: type.base[1] });
        if (type.pages && pages > type.incl) {
          var extra = pages - type.incl;
          lo += extra * type.perPage[0]; hi += extra * type.perPage[1];
          lines.push({ label: (lang() === 'nl' ? 'Extra pagina’s × ' : 'Extra pages × ') + extra, lo: extra * type.perPage[0], hi: extra * type.perPage[1] });
        }
        var siteType = type.id !== 'care';
        if (siteType && design.pct) {
          var dlo = type.base[0] * design.pct / 100, dhi = type.base[1] * design.pct / 100;
          lo += dlo; hi += dhi;
          lines.push({ label: design['label_' + lang()], lo: dlo, hi: dhi });
        }
        var extrasOn = Array.prototype.map.call(quote.querySelectorAll('input[name="q_extra"]:checked'), function (i) { return i.value; });
        cfg.extras.forEach(function (x) {
          if (extrasOn.indexOf(x.id) === -1) return;
          if (x.only && x.only.indexOf(type.id) === -1) return;
          lo += x.price[0]; hi += x.price[1];
          lines.push({ label: x['label_' + lang()], lo: x.price[0], hi: x.price[1] });
        });
        var w0 = type.weeks[0], w1 = type.weeks[1];
        if (type.pages && pages > 12) { w0 += 1; w1 += 1; }
        if (extrasOn.indexOf('brand') !== -1 && siteType) { w0 += 1; w1 += 1; }
        if (extrasOn.indexOf('motion') !== -1 && siteType) { w1 += 1; }
        var rush = quote.querySelector('#q_rush').checked && siteType;
        if (rush) {
          var rlo = lo * (cfg.rush.factor - 1), rhi = hi * (cfg.rush.factor - 1);
          lo += rlo; hi += rhi;
          w0 = Math.max(1, w0 - cfg.rush.weeks); w1 = Math.max(1, w1 - cfg.rush.weeks);
          lines.push({ label: lang() === 'nl' ? 'Spoed' : 'Rush', lo: rlo, hi: rhi });
        }
        var care = quote.querySelector('#q_care').checked || type.id === 'care';
        var vat = quote.querySelector('#q_vat').checked ? 1 + cfg.vat / 100 : 1;
        return { type: type, pages: pages, lo: round10(lo * vat), hi: round10(hi * vat), w0: w0, w1: w1, care: care, vat: vat > 1, lines: lines, mult: vat };
      };

      var render = function (animate) {
        var r = calc();
        last = r;
        var l = lang();
        // dependent controls
        pagesStep.disabled = !r.type.pages;
        designStep.disabled = r.type.id === 'care';
        quote.querySelectorAll('[data-only]').forEach(function (el) {
          var ok = el.getAttribute('data-only').split(' ').indexOf(r.type.id) !== -1;
          el.hidden = !ok;
        });
        if (out.pagesOut) out.pagesOut.textContent = r.type.pages ? r.pages : r.type.incl || '—';
        range.style.setProperty('--p', ((range.value - range.min) / (range.max - range.min) * 100) + '%');
        // numbers
        var set = function () {
          out.range.textContent = money(shown.lo, l) + ' – ' + money(shown.hi, l);
        };
        if (animate && hasGsap && !reduced) {
          gsap.to(shown, { lo: r.lo, hi: r.hi, duration: 0.6, ease: 'power3.out', onUpdate: set, overwrite: true });
        } else {
          shown.lo = r.lo; shown.hi = r.hi; set();
        }
        out.weeks.textContent = weeksText(r.w0, r.w1, l);
        out.care.textContent = r.care ? money(cfg.care * (r.vat ? 1 + cfg.vat / 100 : 1), l) + (l === 'nl' ? ' /mnd' : ' /mo') : (l === 'nl' ? 'Geen' : 'None');
        out.lines.innerHTML = '';
        r.lines.forEach(function (line) {
          var li = document.createElement('li');
          var a = document.createElement('span'); a.textContent = line.label;
          var b = document.createElement('span'); b.textContent = '+' + money(round10(line.lo * r.mult), l);
          li.appendChild(a); li.appendChild(b);
          out.lines.appendChild(li);
        });
        if (estChip && !estChip.hidden) chip();
        document.dispatchEvent(new CustomEvent('ace360:quote', { detail: {
          lang: l,
          lines: r.lines.map(function (x) { return [x.label, '+' + money(round10(x.lo * r.mult), l)]; }),
          range: money(r.lo, l) + ' – ' + money(r.hi, l),
          weeks: weeksText(r.w0, r.w1, l),
          care: r.care ? money(cfg.care * (r.vat ? 1 + cfg.vat / 100 : 1), l) + (l === 'nl' ? ' /mnd' : ' /mo') : (l === 'nl' ? 'geen' : 'none'),
          vat: r.vat ? (l === 'nl' ? 'incl. btw' : 'incl. VAT') : (l === 'nl' ? 'excl. btw' : 'excl. VAT')
        } }));
      };

      var summary = function (r, l) {
        var parts = r.lines.map(function (x) { return x.label; });
        return parts.join(', ') + ' — ' + money(r.lo, l) + '–' + money(r.hi, l) + (r.vat ? (l === 'nl' ? ' incl. btw' : ' incl. VAT') : (l === 'nl' ? ' excl. btw' : ' excl. VAT')) + ', ' + weeksText(r.w0, r.w1, l) + (r.care ? (l === 'nl' ? ', met onderhoud' : ', with care plan') : '');
      };
      var chip = function () { if (estChipText && last) estChipText.textContent = summary(last, lang()); };

      quote.addEventListener('input', function () { render(true); });
      quote.addEventListener('change', function () { render(true); });
      document.addEventListener('ace360:lang', function () { render(false); });
      render(false);

      // service cards preselect a project type
      document.querySelectorAll('[data-pick-type]').forEach(function (a) {
        a.addEventListener('click', function () {
          var input = quote.querySelector('#q_type_' + a.getAttribute('data-pick-type'));
          if (input) { input.checked = true; render(true); }
        });
      });

      var send = quote.querySelector('[data-q-send]');
      if (send) {
        send.addEventListener('click', function () {
          var r = last;
          if (estField) {
            // the email always gets the English line, whatever the visitor's language
            var saved = root.getAttribute('data-lang');
            root.setAttribute('data-lang', 'en');
            estField.value = summary(calc(), 'en');
            root.setAttribute('data-lang', saved);
          }
          if (estChip) { estChip.hidden = false; chip(); }
          var needVal = r.type.id === 'store' ? 'Online store' : r.type.id === 'care' ? 'Maintenance' : 'Website';
          var need = document.querySelector('input[name="ace360_need"][value="' + needVal + '"]');
          if (need) need.checked = true;
          var contact = document.getElementById('contact');
          if (contact) scrollToEl(contact);
          setTimeout(function () { var n = document.getElementById('ace360_name'); if (n) n.focus({ preventScroll: true }); }, 1400);
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
          ? 'Alleen voorbeeld: in WordPress mailt dit formulier de aanvraag naar ' + 'info@ace360services.nl.'
          : 'Preview only: in WordPress this form emails the enquiry to info@ace360services.nl.';
        note.hidden = false;
        note.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  /* ---------- Chapters tell the 3D laptop what to show ---------- */
  function film() { return window.ACE360_FILM; }
  function show(key, image, title) { var f = film(); if (f && key) f.setScreen(key, image, title); }
  if (hasGsap) {
    document.querySelectorAll('[data-k][data-screen]:not(.tall)').forEach(function (ch) {
      ScrollTrigger.create({
        trigger: ch, start: 'top 55%', end: 'bottom 45%',
        onToggle: function (self) { if (self.isActive) show(ch.getAttribute('data-screen')); }
      });
    });

    /* Work: the copy cycles through projects while the laptop shows each one */
    document.querySelectorAll('.ch.tall').forEach(function (ch) {
      var items = ch.querySelectorAll('.item');
      var dots = ch.querySelectorAll('[data-go]');
      var count = ch.querySelector('[data-count]');
      var n = items.length, idx = -1, st;
      function progress() {
        var top = ch.getBoundingClientRect().top + window.scrollY;
        return Math.min(1, Math.max(0, (window.scrollY - top) / Math.max(1, ch.offsetHeight - window.innerHeight)));
      }
      function activate(i, force) {
        if (i === idx && !force) return;
        idx = i;
        items.forEach(function (it, j) { it.classList.toggle('is-on', j === i); });
        dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
        if (count) count.textContent = (i + 1) + ' / ' + n;
        if (st && st.isActive) show(items[i].getAttribute('data-screen'), items[i].getAttribute('data-image'), items[i].getAttribute('data-title'));
      }
      st = ScrollTrigger.create({
        trigger: ch, start: 'top 55%', end: 'bottom 45%',
        onUpdate: function () { activate(Math.min(n - 1, Math.floor(progress() * n * 0.999))); },
        onToggle: function (self) { if (self.isActive) activate(Math.min(n - 1, Math.floor(progress() * n * 0.999)), true); }
      });
      dots.forEach(function (d) {
        d.addEventListener('click', function () {
          var i = parseInt(d.getAttribute('data-go'), 10);
          var top = ch.getBoundingClientRect().top + window.scrollY;
          var y = top + (ch.offsetHeight - window.innerHeight) * ((i + 0.5) / n);
          if (lenis) lenis.scrollTo(y, { duration: 1.2 }); else window.scrollTo({ top: y, behavior: 'smooth' });
        });
      });
    });
  }

  if (!hasGsap || reduced) return;

  /* ---------- Reveals ---------- */
  var hl = document.querySelectorAll('.hero-title .hl');
  var heroBits = document.querySelectorAll('.hero .kicker, .hero-title, .hero .lede, .hero .actions, .hero .checks li');
  var intro = gsap.timeline({ delay: 0.15 });
  if (heroBits.length) intro.from(heroBits, { y: 22, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06 });
  if (hl.length) intro.fromTo(hl, { '--u': 0 }, { '--u': 1, duration: 0.9, ease: 'power3.inOut' }, 0.6);

  document.querySelectorAll('.ch:not(.hero):not(.tall) .copy').forEach(function (c) {
    var bits = c.querySelectorAll(':scope > .kicker, :scope > h2, :scope > .lede, :scope > .progress, :scope > .step-index');
    if (!bits.length) return;
    gsap.from(bits, { y: 26, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: c, start: 'top 82%', once: true } });
  });
  document.querySelectorAll('.band .sec-head').forEach(function (h) {
    if (!h.children.length) return;
    gsap.from(h.children, { y: 24, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
  });
  ScrollTrigger.batch('.svc li, .step-index li, .faq details, .contact-form, .direct, .quote-opts, .quote-result, .demo', {
    start: 'top 90%',
    once: true,
    onEnter: function (els) { gsap.from(els, { y: 30, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.08 }); }
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
