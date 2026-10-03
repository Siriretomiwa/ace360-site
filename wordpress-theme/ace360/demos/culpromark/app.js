/**
 * Culpromark · builds the page from content.js and runs the interactive parts:
 * live monitor, the processing line, the readiness check, sector tabs,
 * article reader and the contact form. No libraries.
 */
(function () {
  'use strict';
  var C = window.CULPROMARK;
  if (!C) return;
  var doc = document, root = doc.documentElement;
  root.classList.add('js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function $(s, el) { return (el || doc).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(s)); }
  function get(path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, C); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(s) { return esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>'); }
  function el(tag, cls, html) { var e = doc.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- plain text slots ---------- */
  $$('[data-c]').forEach(function (n) {
    var v = get(n.getAttribute('data-c'));
    if (v == null) return;
    if (n.hasAttribute('data-rich')) n.innerHTML = rich(v); else n.textContent = v;
  });
  $$('[data-list]').forEach(function (n) {
    (get(n.getAttribute('data-list')) || []).forEach(function (t) { n.appendChild(el('li', '', esc(t))); });
  });
  $$('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
  var concept = $('[data-concept]');
  if (concept) concept.href = C.footer.conceptUrl;

  /* ---------- navigation ---------- */
  ['[data-nav]', '[data-mnav]', '[data-foot-nav]'].forEach(function (s) {
    var n = $(s); if (!n) return;
    C.nav.forEach(function (l) { var a = el('a', '', esc(l[0])); a.href = l[1]; n.appendChild(a); });
  });
  var menu = $('[data-menu]'), mnav = $('[data-mnav]');
  if (menu) {
    menu.addEventListener('click', function () {
      var open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open)); mnav.hidden = !open;
    });
    mnav.addEventListener('click', function (e) { if (e.target.closest('a')) { menu.setAttribute('aria-expanded', 'false'); mnav.hidden = true; } });
  }
  var top = $('[data-top]');
  function onScroll() { if (top) top.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if ('IntersectionObserver' in window) {
    var navLinks = $$('[data-nav] a');
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    C.nav.forEach(function (l) { var t = $(l[1]); if (t) spy.observe(t); });
  }

  /* ---------- status bar ---------- */
  var clock = $('[data-clock]'), lot = $('[data-lot]');
  function tick() { var d = new Date(); if (clock) clock.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  tick(); setInterval(tick, 20000);
  if (lot) { var d0 = new Date(), start = new Date(d0.getFullYear(), 0, 0); lot.textContent = String(d0.getFullYear()).slice(2) + '-' + Math.floor((d0 - start) / 864e5); }

  /* ---------- live monitor ---------- */
  var mon = $('[data-monitor]');
  if (mon) {
    var rows = C.hero.monitor.map(function (m) {
      var r = el('div', 'mrow');
      r.innerHTML = '<span class="mrow-label">' + esc(m.label) + '</span><span class="mrow-val"><span data-v></span><small>' + esc(m.unit) + '</small></span>' +
        '<svg class="mrow-spark" viewBox="0 0 120 26" preserveAspectRatio="none" aria-hidden="true"><line x1="0" x2="120" y1="3" y2="3"/><polyline points=""/></svg>' +
        '<span class="mrow-limit">' + esc(m.limit) + '</span>';
      mon.appendChild(r);
      var hist = [];
      for (var i = 0; i < 24; i++) hist.push(m.value + (Math.random() - 0.5) * m.jitter);
      return { m: m, r: r, hist: hist, v: $('[data-v]', r), line: $('polyline', r) };
    });
    var decimals = function (m) { return m.value >= 50 && m.unit === 'ppm' ? 0 : 1; };
    var draw = function () {
      rows.forEach(function (o) {
        var m = o.m, n = m.value + (Math.random() - 0.5) * 2 * m.jitter;
        if (m.max != null) n = Math.min(n, m.max - m.jitter * 0.3);
        if (m.min != null) n = Math.max(n, m.min + m.jitter * 0.3);
        o.hist.push(n); o.hist.shift();
        o.v.textContent = n.toFixed(decimals(m));
        var lo = Math.min.apply(null, o.hist) - m.jitter, hi = Math.max.apply(null, o.hist) + m.jitter;
        o.line.setAttribute('points', o.hist.map(function (v, i) { return (i * 120 / 23).toFixed(1) + ',' + (24 - (v - lo) / (hi - lo) * 18).toFixed(1); }).join(' '));
      });
    };
    draw();
    if (!reduced) setInterval(draw, 1400);
  }

  /* ---------- standards marquee ---------- */
  var strip = $('[data-standards]');
  if (strip) {
    var items = C.standards.concat(C.standards, C.standards, C.standards);
    items.forEach(function (s, i) { var sp = el('span', '', esc(s)); if (i >= C.standards.length) sp.setAttribute('aria-hidden', 'true'); strip.appendChild(sp); });
  }

  /* ---------- icons ---------- */
  var ICON = {
    plan: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M10 12h6M10 16h6M10 8h2"/>',
    audit: '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20M8.5 11l2 2 3.5-4"/>',
    lab: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 18l-5-9V3"/><path d="M7.5 15h9"/>',
    line: '<path d="M3 17h18M5 17v3M19 17v3"/><rect x="5" y="9" width="5" height="6" rx="1"/><rect x="13" y="6" width="6" height="9" rx="1"/><path d="M8 9V6"/>',
    train: '<path d="M3 9l9-5 9 5-9 5z"/><path d="M7 11v5c3 2 7 2 10 0v-5M21 9v6"/>',
    label: '<path d="M4 4h9l7 7-9 9-7-7z"/><circle cx="9" cy="9" r="1.6"/>',
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    wash: '<path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z"/><path d="M10 13a2 2 0 0 0 2 2"/>',
    mix: '<path d="M6 8h12l-1.5 11h-9z"/><path d="M12 3v9M9 12l3 3 3-3"/>',
    heat: '<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
    cool: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>',
    pack: '<path d="M4 8l8-4 8 4v9l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v9"/>',
    metal: '<path d="M5 20V7a7 7 0 0 1 14 0v13"/><path d="M9 20v-9a3 3 0 0 1 6 0v9"/>',
    store: '<path d="M4 20V9l8-5 8 5v11z"/><path d="M8 20v-6h8v6M12 7.5v2"/>'
  };
  function icon(k, size) { return '<svg viewBox="0 0 24 24" width="' + (size || 24) + '" height="' + (size || 24) + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[k] || ICON.plan) + '</svg>'; }

  /* ---------- services ---------- */
  var svcs = $('[data-services]');
  if (svcs) C.services.forEach(function (s, i) {
    var c = el('article', 'svc rv');
    c.setAttribute('data-n', pad(i + 1));
    c.innerHTML = '<span class="svc-ico">' + icon(s.icon) + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p><ul>' + s.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>';
    svcs.appendChild(c);
  });

  /* ---------- the processing line ---------- */
  (function () {
    var wrap = $('[data-line]'); if (!wrap) return;
    var stages = C.line.stages, N = stages.length;
    var svg = $('[data-line-svg]'), chips = $('[data-line-chips]'), panel = $('[data-line-panel]');
    var W = 1200, H = 300, x0 = 90, x1 = W - 90, beltY = 196;
    var xs = stages.map(function (s, i) { return N === 1 ? W / 2 : x0 + (x1 - x0) * i / (N - 1); });
    var NS = 'http://www.w3.org/2000/svg';
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var html = '';
    // legs, belt and rollers
    for (var l = 0; l < 6; l++) { var lx = 70 + l * (W - 140) / 5; html += '<line class="leg" x1="' + lx + '" x2="' + lx + '" y1="' + (beltY + 18) + '" y2="' + (beltY + 46) + '"/>'; }
    html += '<rect class="belt" x="40" y="' + beltY + '" width="' + (W - 80) + '" height="18" rx="9"/>';
    html += '<line class="belt-top" x1="49" x2="' + (W - 49) + '" y1="' + beltY + '" y2="' + beltY + '"/>';
    html += '<line class="belt-dash" x1="52" x2="' + (W - 52) + '" y1="' + (beltY + 9) + '" y2="' + (beltY + 9) + '"/>';
    html += '<circle class="roller" cx="49" cy="' + (beltY + 9) + '" r="11"/><circle class="roller" cx="' + (W - 49) + '" cy="' + (beltY + 9) + '" r="11"/>';
    // stations
    stages.forEach(function (s, i) {
      var x = xs[i], bw = 104, bh = 86, by = 70;
      html += '<g class="st" data-st="' + i + '" tabindex="0" role="button" aria-label="' + esc((i + 1) + '. ' + s.name + (s.ccp ? ', critical control point ' + s.ccp : '')) + '">';
      html += '<line x1="' + x + '" x2="' + x + '" y1="' + (by + bh) + '" y2="' + beltY + '" stroke="#2f6b55" stroke-width="2" stroke-dasharray="3 4"/>';
      html += '<rect class="st-box" x="' + (x - bw / 2) + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="16"/>';
      html += '<g class="st-ico" transform="translate(' + (x - 20) + ',' + (by + 23) + ') scale(1.67)">' + '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (ICON[s.icon] || ICON.pack) + '</g></g>';
      if (s.ccp) {
        html += '<g transform="translate(' + (x + bw / 2 - 6) + ',' + (by + 4) + ')"><rect class="st-ccp" x="-22" y="-14" width="44" height="20" rx="5"/><text class="st-ccp-t" x="0" y="0">CCP ' + s.ccp + '</text></g>';
      }
      html += '<text class="st-name" x="' + x + '" y="' + (beltY + 66) + '">' + esc(s.name) + '</text>';
      html += '<text class="st-num" x="' + x + '" y="' + (beltY + 84) + '">' + pad(i + 1) + '</text>';
      html += '</g>';
    });
    // the product travelling along the line
    html += '<g class="token" data-token><rect class="token-scan" x="-26" y="' + (beltY - 120) + '" width="52" height="120" rx="6" opacity="0"/><rect class="token-body" x="-15" y="' + (beltY - 34) + '" width="30" height="34" rx="5"/><rect class="token-lid" x="-17" y="' + (beltY - 40) + '" width="34" height="9" rx="3"/><rect x="-9" y="' + (beltY - 24) + '" width="18" height="10" rx="2" fill="#f4c430"/></g>';
    svg.innerHTML = html;
    var token = $('[data-token]', svg), scan = $('.token-scan', svg), dash = $('.belt-dash', svg);

    stages.forEach(function (s, i) {
      var b = el('button', 'chip', '<b>' + pad(i + 1) + '</b>' + esc(s.name) + (s.ccp ? ' <span class="ccp-tag">CCP ' + s.ccp + '</span>' : ''));
      b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('data-st', i);
      chips.appendChild(b);
    });

    var cur = -1, playing = !reduced, timer = null;
    function show(i) {
      cur = (i + N) % N;
      var s = stages[cur];
      token.setAttribute('transform', 'translate(' + xs[cur] + ',0)');
      token.style.transform = 'translateX(' + xs[cur] + 'px)';
      token.removeAttribute('transform');
      scan.setAttribute('opacity', s.ccp ? '1' : '0');
      $$('.st', svg).forEach(function (g, j) { g.classList.toggle('on', j === cur); });
      // on narrow screens the line scrolls sideways: keep the active station in view
      var stage = svg.parentNode;
      if (stage.scrollWidth > stage.clientWidth) stage.scrollTo({ left: xs[cur] / W * svg.clientWidth - stage.clientWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
      $$('.chip', chips).forEach(function (c, j) { c.setAttribute('aria-selected', String(j === cur)); });
      panel.innerHTML = '<div class="lp-head lp-fade"><span class="mono">STATION ' + pad(cur + 1) + ' / ' + pad(N) + '</span><h3>' + esc(s.name) + '</h3>' +
        (s.ccp ? '<span class="lp-badge ccp">◆ CCP ' + s.ccp + ' · Critical control point</span>' : '<span class="lp-badge pp">● Prerequisite control</span>') +
        '<p class="lp-we"><b>What Culpromark does</b>' + esc(s.we) + '</p></div>' +
        '<dl class="lp-grid lp-fade"><div class="lp-cell"><dt>Hazard</dt><dd>' + esc(s.hazard) + '</dd></div><div class="lp-cell"><dt>Control</dt><dd>' + esc(s.control) + '</dd></div>' +
        '<div class="lp-cell limit' + (s.ccp ? ' ccp' : '') + '"><dt>' + (s.ccp ? 'Critical limit' : 'Target') + '</dt><dd>' + esc(s.limit) + '</dd></div><div class="lp-cell"><dt>Monitoring</dt><dd>' + esc(s.monitor) + '</dd></div></dl>';
    }
    function loop() { clearInterval(timer); if (playing) timer = setInterval(function () { show(cur + 1); }, 3800); }
    var playBtn = $('[data-line-play]'), playLabel = $('[data-line-play-label]');
    function setPlaying(p) {
      playing = p; playBtn.setAttribute('aria-pressed', String(p)); playLabel.textContent = p ? 'Pause' : 'Play';
      dash.classList.toggle('paused', !p); loop();
    }
    playBtn.addEventListener('click', function () { setPlaying(!playing); });
    function pick(e) { var t = e.target.closest('[data-st]'); if (!t) return; show(+t.getAttribute('data-st')); setPlaying(false); }
    svg.addEventListener('click', pick); chips.addEventListener('click', pick);
    svg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(e); } });
    chips.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      show(cur + (e.key === 'ArrowRight' ? 1 : -1)); setPlaying(false); $$('.chip', chips)[cur].focus();
    });
    show(0); setPlaying(playing);
    // only run while the section is on screen
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) clearInterval(timer); else loop(); }); }).observe(wrap);
  })();

  /* ---------- readiness check ---------- */
  (function () {
    var form = $('[data-check]'); if (!form) return;
    var qs = $('[data-check-qs]'), Q = C.check.questions;
    Q.forEach(function (q, i) {
      var li = el('li', 'cq rv');
      li.innerHTML = '<p>' + esc(q.q) + '</p><div class="cq-opts" role="radiogroup" aria-label="' + esc(q.q) + '">' +
        [['2', 'Yes'], ['1', 'Partly'], ['0', 'No']].map(function (o) { return '<label><input type="radio" name="q' + i + '" value="' + o[0] + '"><span>' + o[1] + '</span></label>'; }).join('') + '</div>';
      qs.appendChild(li);
    });
    var arc = $('[data-ring]'), score = $('[data-score]'), tier = $('[data-tier]'), tierText = $('[data-tier-text]'), fixes = $('[data-fixes]'), prog = $('[data-check-progress]');
    var shown = 0;
    function count(to) {
      if (reduced) { score.textContent = to; shown = to; return; }
      var from = shown, t0 = performance.now();
      (function step(t) { var k = Math.min(1, (t - t0) / 600); shown = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); score.textContent = shown; if (k < 1) requestAnimationFrame(step); })(t0);
    }
    function update() {
      var answered = 0, sum = 0, gaps = [];
      Q.forEach(function (q, i) {
        var v = form.querySelector('input[name="q' + i + '"]:checked');
        var li = qs.children[i]; li.classList.toggle('done', !!v);
        if (!v) return;
        answered++; sum += +v.value;
        if (+v.value < 2) gaps.push({ w: +v.value, fix: q.fix });
      });
      prog.textContent = answered + ' OF ' + Q.length + ' ANSWERED';
      if (!answered) return;
      var pct = Math.round(sum / (answered * 2) * 100);
      count(pct);
      arc.style.strokeDashoffset = 327 * (1 - pct / 100);
      arc.style.stroke = pct >= 80 ? '#4ade80' : pct >= 50 ? '#f4c430' : '#e0664c';
      var t = C.check.tiers.filter(function (x) { return pct >= x.min; })[0];
      tier.textContent = t.name + (answered < Q.length ? ' (so far)' : '');
      tierText.textContent = t.text;
      gaps.sort(function (a, b) { return a.w - b.w; });
      fixes.innerHTML = gaps.slice(0, 3).map(function (g) { return '<li>' + esc(g.fix) + '</li>'; }).join('');
    }
    form.addEventListener('change', update);
    update();
  })();

  /* ---------- sectors ---------- */
  (function () {
    var tabs = $('[data-sector-tabs]'), card = $('[data-sector-card]'); if (!tabs) return;
    C.sectors.forEach(function (s, i) { var b = el('button', '', esc(s.name)); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('data-i', i); tabs.appendChild(b); });
    function show(i) {
      var s = C.sectors[i];
      $$('button', tabs).forEach(function (b, j) { b.setAttribute('aria-selected', String(j === i)); });
      card.innerHTML = '<p class="sector-line">' + esc(s.line) + '</p><h3>' + esc(s.name) + '</h3>' +
        '<ul class="hz">' + s.hazards.map(function (h) { return '<li class="lp-fade"><small>Hazard</small>' + esc(h) + '</li>'; }).join('') + '</ul>' +
        '<p class="sector-ccp"><b>TYPICAL CCPs</b><span>' + esc(s.ccps) + '</span></p>' +
        '<a class="btn btn-yellow" href="#contact">Talk about your ' + esc(s.name.toLowerCase()) + ' line <i aria-hidden="true">→</i></a>';
    }
    tabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(+b.getAttribute('data-i')); });
    show(0);
  })();

  /* ---------- steps + stats ---------- */
  var steps = $('[data-steps]');
  if (steps) C.steps.forEach(function (s) { steps.appendChild(el('li', 'rv', '<span class="mono">' + esc(s.time) + '</span><h3>' + esc(s.name) + '</h3><p>' + esc(s.text) + '</p>')); });
  var stats = $('[data-stats]');
  if (stats) {
    C.stats.forEach(function (s) { stats.appendChild(el('div', 'stat rv', '<b data-to="' + s.value + '" data-suf="' + esc(s.suffix) + '">0' + esc(s.suffix) + '</b><span>' + esc(s.label) + '</span>')); });
    var fmt = new Intl.NumberFormat('en-GB');
    var run = function (b) {
      var to = +b.getAttribute('data-to'), suf = b.getAttribute('data-suf'), t0 = performance.now();
      if (reduced) { b.textContent = fmt.format(to) + suf; return; }
      (function step(t) { var k = Math.min(1, (t - t0) / 1400); b.textContent = fmt.format(Math.round(to * (1 - Math.pow(1 - k, 3)))) + suf; if (k < 1) requestAnimationFrame(step); })(t0);
    };
    if ('IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { $$('[data-to]', stats).forEach(run); so.disconnect(); } }); }, { threshold: 0.4 });
      so.observe(stats);
    } else $$('[data-to]', stats).forEach(run);
  }

  /* ---------- insights + reader ---------- */
  (function () {
    var list = $('[data-insights]'), dlg = $('[data-reader]'); if (!list) return;
    var palettes = [['#134e3a', '#2f8f5b', '#f4c430'], ['#0b3628', '#d9edf2', '#2f8f5b'], ['#2c4038', '#f4c430', '#d6ebdd']];
    function art(i) {
      var p = palettes[i % palettes.length], s = '';
      if (i % 3 === 0) { for (var r = 0; r < 6; r++) for (var c = 0; c < 14; c++) s += '<circle cx="' + (14 + c * 26) + '" cy="' + (16 + r * 26) + '" r="' + (((r * 7 + c * 3) % 5) + 3) + '" fill="' + (((r + c) % 7 === 0) ? p[2] : p[1]) + '" opacity="' + (((r + c) % 7 === 0) ? 1 : 0.45) + '"/>'; }
      else if (i % 3 === 1) { s += '<circle cx="290" cy="80" r="110" fill="none" stroke="' + p[1] + '" stroke-width="2" opacity=".5"/><circle cx="290" cy="80" r="70" fill="none" stroke="' + p[1] + '" stroke-width="2" opacity=".5"/>'; for (var k = 0; k < 18; k++) s += '<circle cx="' + (260 + (k * 37) % 80) + '" cy="' + (50 + (k * 23) % 70) + '" r="' + (3 + k % 4) + '" fill="' + (k % 5 ? p[2] : p[1]) + '"/>'; s += '<path d="M0 120 Q 80 70 160 110 T 340 100" fill="none" stroke="' + p[2] + '" stroke-width="3"/>'; }
      else { for (var b = 0; b < 9; b++) s += '<rect x="' + (20 + b * 38) + '" y="' + (130 - (20 + (b * 37) % 90)) + '" width="24" height="' + (20 + (b * 37) % 90) + '" rx="3" fill="' + (b === 5 ? p[1] : p[2]) + '" opacity="' + (b === 5 ? 1 : 0.8) + '"/>'; s += '<line x1="0" x2="380" y1="52" y2="52" stroke="' + p[1] + '" stroke-dasharray="6 6" stroke-width="2"/>'; }
      return '<svg viewBox="0 0 370 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="370" height="150" fill="' + p[0] + '"/>' + s + '</svg>';
    }
    C.insights.forEach(function (a, i) {
      var b = el('button', 'ins rv');
      b.type = 'button';
      b.innerHTML = '<span class="ins-art">' + art(i) + '</span><span class="ins-body"><span class="ins-meta"><b>' + esc(a.tag) + '</b>' + a.minutes + ' min read</span><h3>' + esc(a.title) + '</h3><span class="more">Read →</span></span>';
      b.addEventListener('click', function () {
        $('[data-reader-tag]', dlg).textContent = a.tag + ' · ' + a.minutes + ' min read';
        $('[data-reader-title]', dlg).textContent = a.title;
        $('[data-reader-body]', dlg).innerHTML = a.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
        if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      });
      list.appendChild(b);
    });
    if (dlg) {
      dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('[data-reader-close]') || e.target.closest('[data-reader-cta]')) dlg.close(); });
    }
  })();

  /* ---------- faq ---------- */
  var faq = $('[data-faq]');
  if (faq) C.faq.forEach(function (f) { faq.appendChild(el('details', 'rv', '<summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p>')); });

  /* ---------- contact ---------- */
  (function () {
    var dl = $('[data-contact-dl]'), co = C.company;
    if (dl) {
      var rows = [['Email', '<a href="mailto:' + esc(co.email) + '">' + esc(co.email) + '</a>']];
      if (co.phone) rows.push(['Phone', '<a href="tel:' + esc(co.phone.replace(/[^0-9+]/g, '')) + '">' + esc(co.phone) + '</a>']);
      rows.push(['Hours', esc(co.hours)], ['Where', esc(co.area)]);
      dl.innerHTML = rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('');
    }
    var needs = $('[data-needs]');
    if (needs) C.contact.needs.forEach(function (n) { needs.appendChild(el('label', '', '<input type="checkbox" name="need" value="' + esc(n) + '"><span>' + esc(n) + '</span>')); });
    var form = $('[data-contact]'), msg = $('[data-form-msg]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name, email = form.elements.email, ok = true;
      [name, email].forEach(function (f) { var bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)); f.setAttribute('aria-invalid', String(bad)); if (bad) ok = false; });
      msg.hidden = false;
      if (!ok) { msg.className = 'form-msg err'; msg.textContent = 'Please add your name and a valid email address.'; return; }
      // To receive requests, set contact.endpoint in content.js (e.g. a Formspree or WordPress URL).
      var done = function () { msg.className = 'form-msg'; msg.textContent = C.contact.thanks; form.reset(); };
      if (C.contact.endpoint) {
        fetch(C.contact.endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw r; done(); })
          .catch(function () { msg.className = 'form-msg err'; msg.textContent = 'Sending failed. Please email ' + co.email + '.'; });
      } else done();
    });
  })();

  /* ---------- reveal on scroll ---------- */
  $$('.sec-head, .hero-copy > *, .monitor, .line, .sector-card, .contact-form').forEach(function (n) { n.classList.add('rv'); });
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(function (n, i) { n.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(n); });
  } else $$('.rv').forEach(function (n) { n.classList.add('in'); });
})();
