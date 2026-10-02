/**
 * Ace 360 · the 360° quote.
 *
 * main.js does the maths and announces every new estimate ('ace360:quote').
 * This file turns it into the things you see:
 *  - the dial: the price as a share of a full turn (log scale), ticks lighting up
 *  - the launch date (work starts the Monday after next) and the process dates
 *  - the receipt that follows you once the dial is off screen
 *  - "already included" items that fly onto the receipt at €0
 *  - "Put in my quote" on services and projects, which sets the dial
 *  - the logo ring filling up as you scroll
 * Everything here explains something; nothing moves for decoration.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var form = document.querySelector('.dial');
  if (!form) return;

  function nl() { return root.getAttribute('data-lang') !== 'en'; }
  function loc() { return nl() ? 'nl-NL' : 'en-GB'; }

  /* ---------- dates ---------- */
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function nextWorkday(d) { var x = addDays(d, 1); while (x.getDay() === 0 || x.getDay() === 6) x = addDays(x, 1); return x; }
  // a week to talk and agree the quote, then the build starts on a Monday
  function startDay() { var d = new Date(); d.setHours(12, 0, 0, 0); d = addDays(d, 7); while (d.getDay() !== 1) d = addDays(d, 1); return d; }
  function liveDay(w1) { return w1 <= 0 ? null : addDays(startDay(), (w1 - 1) * 7 + 4); }
  function fmt(d, long) { return new Intl.DateTimeFormat(loc(), long ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'short', day: 'numeric', month: 'short' }).format(d); }

  /* ---------- the dial ---------- */
  var arc = form.querySelector('[data-ring-arc]');
  var knob = form.querySelector('[data-ring-knob]');
  var ticks = Array.prototype.slice.call(form.querySelectorAll('[data-ring-ticks] line'));
  var dateOut = form.querySelector('[data-ring-date]');
  var vatOut = form.querySelector('[data-ring-vat]');
  var ring = form.querySelector('[data-ring]');
  var rArc = document.querySelector('[data-receipt-arc]');
  var shown = { f: 0 };
  var last = null;

  // €400 … €9.000 spread over the turn on a log scale, so a one-pager and a big store both read
  function share(hi) { var a = Math.log(400), b = Math.log(9000); return Math.max(0.05, Math.min(0.97, (Math.log(Math.max(hi, 400)) - a) / (b - a))); }
  function draw() {
    var deg = shown.f * 360;
    if (arc) arc.style.strokeDasharray = deg + ' 360';
    if (rArc) rArc.style.strokeDasharray = deg + ' 360';
    if (knob) knob.setAttribute('transform', 'rotate(' + deg + ' 200 200)');
    for (var i = 0; i < ticks.length; i++) ticks[i].classList.toggle('on', i * 5 <= deg);
  }
  function bump(el) { if (!el || reduced) return; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }

  /* ---------- receipt ---------- */
  var receipt = document.querySelector('[data-receipt]');
  var rPrice = document.querySelector('[data-receipt-price]');
  var rDate = document.querySelector('[data-receipt-date]');
  var rIncl = document.querySelector('[data-receipt-incl]');
  var rLines = document.querySelector('[data-receipt-lines]');
  var rIncluded = document.querySelector('[data-receipt-included]');
  var rTotal = document.querySelector('[data-receipt-total]');
  var rToggle = document.querySelector('[data-receipt-toggle]');
  var rPanel = document.querySelector('[data-receipt-panel]');
  var pill = document.querySelector('.receipt-pill');
  var included = [];

  // bilingual elements hold both languages; read only the one on screen
  function visibleText(el) { var c = el.querySelector('[data-l="' + (nl() ? 'nl' : 'en') + '"]'); return (c || el).textContent.trim(); }
  document.addEventListener('ace360:lang', function () { renderReceipt(); if (last) renderPlan(); });
  function renderReceipt() {
    if (!last || !receipt) return;
    rPrice.textContent = last.range;
    var d = liveDay(last.w1);
    rDate.textContent = d ? (nl() ? 'live ' : 'live ') + fmt(d) : (nl() ? 'direct' : 'right away');
    rLines.innerHTML = '';
    (last.items || []).forEach(function (x) {
      var li = document.createElement('li'); li.innerHTML = '<span></span><b></b>';
      li.firstChild.textContent = x[0]; li.lastChild.textContent = x[1] + (x[2] !== x[1] ? ' – ' + x[2] : '');
      rLines.appendChild(li);
    });
    rIncluded.innerHTML = '';
    included.forEach(function (src) { var li = document.createElement('li'); li.innerHTML = '<span></span><b>€ 0</b>'; li.firstChild.textContent = visibleText(src); rIncluded.appendChild(li); });
    rTotal.textContent = last.range + ' ' + last.vat;
    rIncl.hidden = !included.length;
    rIncl.textContent = '+' + included.length + (nl() ? ' inbegrepen' : ' included');
  }
  function setOpen(open) {
    if (!rPanel) return;
    rPanel.hidden = !open;
    rToggle.setAttribute('aria-expanded', String(open));
    receipt.classList.toggle('is-open', open);
  }
  if (rToggle) rToggle.addEventListener('click', function () { setOpen(rPanel.hidden); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && rPanel && !rPanel.hidden) setOpen(false); });
  var rSend = document.querySelector('[data-receipt-send]');
  var send = form.querySelector('[data-q-send]');
  if (rSend && send) rSend.addEventListener('click', function () { setOpen(false); send.click(); });
  var rChange = receipt && receipt.querySelector('a[href="#prijs"]');
  if (rChange) rChange.addEventListener('click', function () { setOpen(false); });

  // the receipt appears once the dial has scrolled out of view, and hides at the contact form
  var dialOut = form.querySelector('.dial-out');
  var contact = document.getElementById('contact');
  var dialVisible = true, contactVisible = false;
  function syncReceipt() { if (receipt) receipt.classList.toggle('is-on', !dialVisible && !contactVisible); if (dialVisible || contactVisible) setOpen(false); }
  if ('IntersectionObserver' in window && receipt) {
    new IntersectionObserver(function (es) { dialVisible = es[0].isIntersecting; syncReceipt(); }, { threshold: 0.15 }).observe(dialOut);
    if (contact) new IntersectionObserver(function (es) { contactVisible = es[0].isIntersecting; syncReceipt(); }, { threshold: 0.2 }).observe(contact);
  }

  /* ---------- process dates follow the dial ---------- */
  var planDates = document.querySelectorAll('[data-plan-date]');
  function renderPlan() {
    if (!last || !planDates.length) return;
    var talk = nextWorkday(new Date()), quote = nextWorkday(talk), start = startDay(), live = liveDay(last.w1);
    var build = live ? addDays(start, Math.max(1, Math.round((last.w1 - 1) * 0.4)) * 7) : start;
    var dates = [talk, quote, start, build, live || start];
    planDates.forEach(function (el, i) {
      var d = dates[Math.min(i, dates.length - 1)];
      var txt = fmt(d);
      if (el.textContent !== txt) { el.textContent = txt; bump(el); }
    });
  }

  /* ---------- every new estimate ---------- */
  document.addEventListener('ace360:quote', function (e) {
    last = e.detail;
    var f = share(last.hi);
    if (gsap && !reduced) gsap.to(shown, { f: f, duration: 0.9, ease: 'power3.out', onUpdate: draw, overwrite: true });
    else { shown.f = f; draw(); }
    var d = liveDay(last.w1);
    if (dateOut) dateOut.textContent = d ? fmt(d, true) : (nl() ? 'Direct' : 'Right away');
    if (vatOut) vatOut.textContent = (last.isVat ? (nl() ? 'incl. btw' : 'incl. VAT') : (nl() ? 'excl. btw' : 'excl. VAT')) + (nl() ? ' · vast in de offerte' : ' · fixed in the quote');
    renderReceipt();
    renderPlan();
    bump(pill);
  });
  // main.js has already priced the default answers; ask it again now we are listening
  form.dispatchEvent(new Event('change', { bubbles: true }));

  /* ---------- "already included" lands on the receipt ---------- */
  var incl = Array.prototype.slice.call(document.querySelectorAll('[data-incl]'));
  function addIncluded(li, i) {
    if (li.classList.contains('is-in')) return;
    li.classList.add('is-in');
    included.push(li.querySelector('.incl-text'));
    renderReceipt();
    if (reduced || !pill || !receipt.classList.contains('is-on') || !li.animate) { bump(pill); return; }
    var a = li.querySelector('.incl-tick').getBoundingClientRect(), b = pill.getBoundingClientRect();
    var dot = document.createElement('span'); dot.className = 'fly-tick'; dot.setAttribute('aria-hidden', 'true');
    dot.style.left = a.left + 'px'; dot.style.top = a.top + 'px';
    document.body.appendChild(dot);
    var dx = b.left + 22 - a.left, dy = b.top + b.height / 2 - a.top - 11;
    dot.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + dx * 0.5 + 'px,' + (dy * 0.5 - 80) + 'px) scale(1.15)', opacity: 1, offset: 0.5 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(0.4)', opacity: 0.2 }],
      { duration: 900, delay: i * 90, easing: 'cubic-bezier(0.5, 0, 0.2, 1)', fill: 'forwards' }).onfinish = function () { dot.remove(); bump(pill); };
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      var k = 0;
      es.forEach(function (e) { if (e.isIntersecting) { addIncluded(e.target, k++); io.unobserve(e.target); } });
    }, { threshold: 0.9, rootMargin: '0px 0px -12% 0px' });
    incl.forEach(function (li) { io.observe(li); });
  } else incl.forEach(addIncluded);

  /* ---------- "Put in my quote": services and projects set the dial ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-use-quote]');
    if (!b) return;
    var q = {};
    try { q = JSON.parse(b.getAttribute('data-use-quote')); } catch (err) {}
    var t = form.querySelector('#q_type_' + q.type);
    if (t) t.checked = true;
    if (q.extras) form.querySelectorAll('input[name="q_extra"]').forEach(function (x) { x.checked = q.extras.indexOf(x.value) !== -1; });
    form.dispatchEvent(new Event('change', { bubbles: true }));
    var dlg = b.closest('dialog'); if (dlg) dlg.close();
    var top = document.getElementById('prijs');
    if (top) { if (window.ACE360_SCROLL) window.ACE360_SCROLL(top); else top.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
    setOpen(false);
    setTimeout(function () { bump(ring); }, reduced ? 0 : 900);
  });

  /* ---------- more work ---------- */
  var grid = document.querySelector('.work-grid');
  var more = document.querySelector('[data-more-work]');
  function showAll() { if (grid) grid.classList.add('show-all'); if (more) more.parentNode.hidden = true; if (ST) ST.refresh(); }
  if (more) more.addEventListener('click', showAll);
  document.querySelectorAll('[data-filter]').forEach(function (c) { c.addEventListener('click', function () { if (c.getAttribute('data-filter') !== 'all') showAll(); }); });

  /* ---------- the logo ring fills as you read ---------- */
  var prog = document.querySelector('.wordmark-progress');
  if (prog) {
    var tick = false;
    var upd = function () { tick = false; var max = document.documentElement.scrollHeight - window.innerHeight; var p = max > 0 ? window.scrollY / max : 0; prog.style.strokeDasharray = (p * 360) + ' 360'; };
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* ---------- quiet reveals ---------- */
  if (!gsap || !ST || reduced) return;
  gsap.fromTo('.hero-dial .kicker, .hero-dial .hero-title, .hero-dial .lede', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.1 });
  gsap.fromTo('.dial-ask .ask, .ask-more', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07, delay: 0.3, clearProps: 'transform,opacity' });
  gsap.fromTo('.dial-out', { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.2, clearProps: 'transform,opacity' });
  var hl = document.querySelectorAll('.hero-dial .hero-title .hl');
  if (hl.length) gsap.fromTo(hl, { '--u': 0 }, { '--u': 1, duration: 0.9, ease: 'power3.inOut', delay: 0.7 });
  var plan = document.querySelector('.plan');
  if (plan) gsap.fromTo(plan, { '--line': 0 }, { '--line': 1, ease: 'none', scrollTrigger: { trigger: plan, start: 'top 75%', end: 'bottom 60%', scrub: 0.5 } });
  ST.batch('.service, .plan-step, .guarantees li, .facts li, .incl-list li, .who-card', {
    start: 'top 90%', once: true,
    onEnter: function (els) { gsap.fromTo(els, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07, overwrite: true }); }
  });
})();
