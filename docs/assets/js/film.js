/**
 * Ace 360 film: a laptop and a phone on a white desk, fixed behind the front page.
 *
 * Every chapter (<section data-k="...">) is a camera keyframe that also sets the
 * state of the props: the laptop lid, the floating website cards (in the screen,
 * orbiting, or piled on the desk), the paper quote, the phone, the exploded page
 * layers and the screen glow. Scrolling blends between keyframes. What the laptop
 * screen shows comes from data-screen on the chapter (see setScreen()).
 *
 * The quote on the desk is repainted live from the self-quote calculator
 * (main.js fires an 'ace360:quote' event with the current estimate).
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var canvas = document.getElementById('stage');
  function fail() { root.classList.add('no-webgl'); }
  if (!canvas || typeof window.THREE === 'undefined') { fail(); return; }
  var THREE = window.THREE;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.innerWidth < 800;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { fail(); return; }
  if (!renderer.getContext()) { fail(); return; }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  var aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(36, 1, 0.05, 80);

  function col(hex) { return new THREE.Color(hex).convertSRGBToLinear(); }
  var INK = '#111111', MUTED = '#6a6e75', LINE = '#e6e8eb', GREY = '#f4f5f7', OR = '#ff6a00', ORD = '#c94f00';
  var SANS = '"Inter Variable", "Inter", system-ui, sans-serif';
  var MONO = '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace';

  /* ---------- 2D helpers ---------- */
  function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function toTex(c) { var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = aniso; return t; }
  function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function box(g, x, y, w, h, r, fill) { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); }
  function stroke(g, x, y, w, h, r, c, lw) { rr(g, x, y, w, h, r); g.strokeStyle = c; g.lineWidth = lw || 2; g.stroke(); }
  function txt(g, s, x, y, size, color, weight, font, align) {
    g.font = (weight || 500) + ' ' + size + 'px ' + (font || SANS);
    g.fillStyle = color; g.textAlign = align || 'left'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y);
  }
  function bars(g, x, y, ws, h, gap, c) { ws.forEach(function (w, i) { box(g, x, y + i * (h + gap), w, h, h / 2, c); }); }
  function circle(g, x, y, r, c) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = c; g.fill(); }
  function chrome(g, w, url, dark) {
    g.fillStyle = dark ? '#16171b' : '#eef0f3'; g.fillRect(0, 0, w, 40);
    ['#ff5f57', '#febc2e', '#28c840'].forEach(function (c, i) { circle(g, 22 + i * 18, 20, 5.5, c); });
    box(g, w / 2 - 170, 9, 340, 22, 11, dark ? '#24262c' : '#ffffff');
    txt(g, url, w / 2, 25, 13, dark ? '#9aa0aa' : '#5d6168', 500, MONO, 'center');
    return 40;
  }

  /* ---------- laptop screens (1024 × 640) ---------- */
  var SW = 1024, SH = 640;
  var SCREENS = {
    blank: function (g, w, h) {
      var gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#1a1b1f'); gr.addColorStop(1, '#0c0c0e');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.globalAlpha = 0.06; g.fillStyle = '#ffffff';
      g.beginPath(); g.moveTo(w * 0.55, 0); g.lineTo(w * 0.75, 0); g.lineTo(w * 0.45, h); g.lineTo(w * 0.25, h); g.fill(); g.globalAlpha = 1;
    },
    ace: function (g, w, h) {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      var t = chrome(g, w, 'ace360services.nl', false);
      circle(g, 44, t + 38, 11, OR); circle(g, 44, t + 38, 6, '#ffffff');
      txt(g, 'Ace 360', 64, t + 44, 18, INK, 700);
      ['Services', 'Process', 'Work', 'Questions'].forEach(function (s, i) { txt(g, s, 520 + i * 92, t + 44, 14, MUTED, 500); });
      box(g, w - 130, t + 22, 100, 34, 8, OR); txt(g, 'Call now', w - 80, t + 45, 14, INK, 650, SANS, 'center');
      txt(g, 'You know the', 44, t + 160, 58, INK, 700);
      txt(g, 'price', 44, t + 222, 58, ORD, 700);
      g.fillStyle = OR; g.fillRect(44, t + 230, 148, 6);
      txt(g, ' before we', 192, t + 222, 58, INK, 700);
      txt(g, 'get on a call.', 44, t + 284, 58, INK, 700);
      bars(g, 44, t + 318, [420, 380, 300], 9, 11, '#d9dce1');
      box(g, 44, t + 400, 190, 46, 9, OR); txt(g, 'Price my website →', 139, t + 429, 15, INK, 650, SANS, 'center');
      stroke(g, 246, t + 400, 120, 46, 9, '#d6d8dd', 2); txt(g, 'Call now', 306, t + 429, 15, INK, 600, SANS, 'center');
      // estimate card
      box(g, 620, t + 120, 340, 300, 16, INK);
      txt(g, 'YOUR ESTIMATE', 648, t + 162, 12, '#9aa0aa', 600, MONO);
      txt(g, '€1,200 – €1,600', 648, t + 214, 34, '#ffffff', 700);
      g.fillStyle = OR; g.fillRect(648, t + 230, 52, 4);
      txt(g, 'Timeline', 648, t + 280, 12, '#9aa0aa', 600, MONO); txt(g, '3–4 weeks', 648, t + 304, 18, '#ffffff', 650);
      txt(g, 'Care', 800, t + 280, 12, '#9aa0aa', 600, MONO); txt(g, '€95 /mo', 800, t + 304, 18, '#ffffff', 650);
      box(g, 648, t + 340, 284, 46, 9, OR); txt(g, 'Send this as an enquiry', 790, t + 369, 15, INK, 650, SANS, 'center');
    },
    call: function (g, w, h) {
      g.fillStyle = '#121316'; g.fillRect(0, 0, w, h);
      var t = chrome(g, w, 'meet · first call', true);
      box(g, 40, t + 30, 600, h - t - 70, 18, '#1f2126');
      circle(g, 340, t + 220, 72, OR); txt(g, 'A', 340, t + 246, 70, INK, 800, SANS, 'center');
      txt(g, 'Ace 360 Services', 340, t + 340, 22, '#ffffff', 650, SANS, 'center');
      txt(g, '18:42', 340, t + 372, 16, '#9aa0aa', 500, MONO, 'center');
      [-60, 0, 60].forEach(function (dx, i) { circle(g, 340 + dx, t + 470, 24, i === 1 ? '#e5484d' : '#34363d'); });
      box(g, 664, t + 30, 320, h - t - 70, 18, '#ffffff');
      txt(g, 'Project notes', 690, t + 80, 22, INK, 700);
      [['GOAL', '30 bookings a month'], ['MUST', 'iDEAL · NL + EN'], ['PAGES', 'Home · Book · Contact'], ['LIVE', 'before 1 June']].forEach(function (n, i) {
        var y = t + 130 + i * 72; g.fillStyle = LINE; g.fillRect(690, y - 30, 270, 1);
        txt(g, n[0], 690, y, 12, ORD, 700, MONO); txt(g, n[1], 690, y + 26, 17, INK, 550);
      });
    },
    quote: function (g, w, h) {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      var t = chrome(g, w, 'mail · inbox', false);
      g.fillStyle = GREY; g.fillRect(0, t, 260, h - t);
      ['Inbox', 'Starred', 'Sent'].forEach(function (s, i) { txt(g, s, 30, t + 50 + i * 40, 16, i ? MUTED : INK, i ? 500 : 700); });
      txt(g, 'Your fixed quote and launch date', 300, t + 70, 26, INK, 700);
      txt(g, 'Ace 360 Services · info@ace360services.nl', 300, t + 102, 14, MUTED, 500);
      bars(g, 300, t + 140, [600, 560, 480], 10, 14, '#dfe2e6');
      box(g, 300, t + 230, 360, 120, 12, GREY); stroke(g, 300, t + 230, 360, 120, 12, LINE, 2);
      box(g, 322, t + 254, 56, 72, 6, OR); txt(g, 'PDF', 350, t + 296, 14, INK, 800, SANS, 'center');
      txt(g, 'Quote Q-2026-041.pdf', 396, t + 284, 17, INK, 650); txt(g, '€2,240 · live 28 May', 396, t + 310, 14, MUTED, 500, MONO);
      box(g, 300, t + 380, 200, 50, 10, OR); txt(g, 'Accept quote', 400, t + 411, 16, INK, 700, SANS, 'center');
    },
    design: function (g, w, h) {
      g.fillStyle = '#f0f1f3'; g.fillRect(0, 0, w, h);
      var t = chrome(g, w, 'figma · homepage v2', false);
      g.fillStyle = '#ffffff'; g.fillRect(0, t, 200, h - t); g.fillRect(w - 200, t, 200, h - t);
      ['Frames', 'Home', 'Book', 'Contact', 'Mobile'].forEach(function (s, i) { txt(g, s, 24, t + 40 + i * 32, 14, i === 1 ? INK : MUTED, i === 1 ? 650 : 500); });
      box(g, 230, t + 30, 564, h - t - 60, 6, '#ffffff');
      var x = 254, y = t + 54;
      txt(g, 'yourbrand', x, y + 10, 16, INK, 700); box(g, x + 440, y - 6, 76, 24, 6, OR);
      txt(g, 'Fresh every morning,', x, y + 80, 30, INK, 700); txt(g, 'booked in seconds.', x, y + 116, 30, INK, 700);
      box(g, x, y + 140, 130, 34, 7, INK);
      var gr = g.createRadialGradient(x + 400, y + 110, 10, x + 400, y + 110, 140); gr.addColorStop(0, '#ffd9bd'); gr.addColorStop(0.6, '#ff8a3a'); gr.addColorStop(1, ORD);
      g.fillStyle = gr; rr(g, x + 290, y + 50, 230, 140, 12); g.fill();
      for (var i = 0; i < 3; i++) box(g, x + i * 176, y + 220, 160, 110, 10, GREY);
      // comments
      box(g, x + 330, y + 30, 150, 34, 17, INK); txt(g, '1  Bigger photo?', x + 405, y + 52, 13, '#ffffff', 600, SANS, 'center');
      box(g, x - 10, y + 190, 170, 34, 17, INK); txt(g, '2  Button in orange', x + 75, y + 212, 13, '#ffffff', 600, SANS, 'center');
      txt(g, 'Feedback', w - 176, t + 40, 14, INK, 700);
      box(g, w - 176, t + 60, 150, 30, 15, OR); txt(g, 'Round 1 ✓', w - 101, t + 80, 13, INK, 700, SANS, 'center');
      box(g, w - 176, t + 100, 150, 30, 15, OR); txt(g, 'Round 2 ✓', w - 101, t + 120, 13, INK, 700, SANS, 'center');
    },
    build: function (g, w, h) {
      g.fillStyle = '#14151a'; g.fillRect(0, 0, w, h);
      var t = chrome(g, w, 'staging.yourbrand.nl', true);
      var code = [['<section class="hero">', '#e6e6e6'], ['  <h1><?php the_title(); ?></h1>', '#e6e6e6'], ['  <a class="btn" href="/book">', '#e6e6e6'], ['</section>', '#e6e6e6'], ['', ''], ['mollie()->payments->create([', '#ffb27a'], ["  'method' => 'ideal',", '#ffb27a'], ["  'amount' => '65.00',", '#ffb27a'], [']);', '#ffb27a']];
      code.forEach(function (c, i) { txt(g, c[0], 30, t + 50 + i * 30, 15, c[1], 500, MONO); });
      box(g, 480, t + 20, 520, h - t - 40, 12, '#ffffff');
      var x = 504, y = t + 44;
      txt(g, 'yourbrand', x, y + 10, 15, INK, 700); txt(g, 'NL · EN', x + 420, y + 10, 12, MUTED, 600, MONO);
      txt(g, 'Fresh every morning, booked', x, y + 64, 24, INK, 700); txt(g, 'in seconds.', x, y + 94, 24, INK, 700);
      box(g, x, y + 116, 120, 32, 7, OR);
      stroke(g, x, y + 170, 472, 60, 10, LINE, 2);
      ['Date', 'Time', 'Guests'].forEach(function (s, i) { box(g, x + 12 + i * 112, y + 182, 100, 36, 6, GREY); txt(g, s, x + 22 + i * 112, y + 205, 12, MUTED, 500); });
      box(g, x + 352, y + 182, 108, 36, 6, INK); txt(g, 'Pay · iDEAL', x + 406, y + 205, 12, '#ffffff', 650, SANS, 'center');
      for (var i = 0; i < 3; i++) box(g, x + i * 160, y + 250, 148, 120, 10, GREY);
      ['iDEAL ✓', 'NL / EN ✓', 'Forms ✓', 'Mobile ✓'].forEach(function (s, i) { box(g, 30 + i * 108, h - 64, 100, 30, 15, '#24262c'); txt(g, s, 80 + i * 108, h - 44, 12, '#9be3b8', 600, SANS, 'center'); });
    },
    live: function (g, w, h) {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      var t = chrome(g, w, '🔒 yourbrand.nl', false);
      box(g, w - 84, 9, 64, 22, 11, OR); txt(g, 'Live', w - 52, 25, 13, INK, 800, SANS, 'center');
      txt(g, 'yourbrand', 44, t + 46, 20, INK, 700);
      ['Menu', 'Book', 'About'].forEach(function (s, i) { txt(g, s, 640 + i * 90, t + 46, 15, MUTED, 500); });
      box(g, w - 150, t + 22, 110, 38, 9, OR); txt(g, 'Book now', w - 95, t + 47, 15, INK, 700, SANS, 'center');
      txt(g, 'Fresh every morning,', 44, t + 150, 46, INK, 700); txt(g, 'booked in seconds.', 44, t + 204, 46, INK, 700);
      bars(g, 44, t + 236, [360, 300], 9, 11, '#dfe2e6');
      box(g, 44, t + 290, 170, 46, 10, INK); txt(g, 'Book a table', 129, t + 319, 16, '#ffffff', 650, SANS, 'center');
      var gr = g.createRadialGradient(780, t + 190, 10, 780, t + 190, 220); gr.addColorStop(0, '#ffd9bd'); gr.addColorStop(0.6, '#ff8a3a'); gr.addColorStop(1, ORD);
      g.fillStyle = gr; rr(g, 560, t + 90, 420, 260, 18); g.fill();
      [98, 100, 100, 100].forEach(function (s, i) {
        var cx = 90 + i * 110, cy = h - 90;
        g.beginPath(); g.arc(cx, cy, 34, 0, Math.PI * 2); g.strokeStyle = '#d7f0e1'; g.lineWidth = 7; g.stroke();
        g.beginPath(); g.arc(cx, cy, 34, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * s / 100); g.strokeStyle = '#1a8f4e'; g.stroke();
        txt(g, String(s), cx, cy + 9, 22, '#1a8f4e', 700, SANS, 'center');
      });
      box(g, 560, h - 130, 420, 76, 14, INK); circle(g, 600, h - 92, 18, OR); txt(g, '✓', 600, h - 85, 18, INK, 800, SANS, 'center');
      txt(g, 'iDEAL payment received', 630, h - 98, 17, '#ffffff', 650); txt(g, '€65.00 · booking for Saturday', 630, h - 74, 14, '#9aa0aa', 500);
    }
  };
  function workScreen(kind) {
    return function (g, w, h, title) {
      var t;
      if (kind === 'hesed') {
        g.fillStyle = '#f7f1e8'; g.fillRect(0, 0, w, h); t = chrome(g, w, 'hesedimpactministries.com', false);
        txt(g, 'Hesed', 40, t + 44, 24, '#2a1d3a', 700, 'Georgia, serif'); txt(g, 'IMPACT MINISTRIES', 40, t + 62, 10, '#2a1d3a', 600, SANS);
        ['Events', 'Media', 'About'].forEach(function (s, i) { txt(g, s, 640 + i * 80, t + 48, 14, '#2a1d3a', 500); });
        box(g, w - 110, t + 26, 74, 32, 7, '#c4923a'); txt(g, 'Give', w - 73, t + 47, 14, '#ffffff', 650, SANS, 'center');
        var gr = g.createRadialGradient(w * 0.8, t + 90, 20, w * 0.6, t + 200, 520); gr.addColorStop(0, '#6b4a8a'); gr.addColorStop(1, '#2a1d3a');
        g.fillStyle = gr; rr(g, 40, t + 84, w - 80, 250, 18); g.fill();
        txt(g, 'SUNDAY 10:30 · ALL WELCOME', 76, t + 130, 12, '#e8dcf2', 600, SANS);
        txt(g, 'A church that shows up', 76, t + 190, 40, '#ffffff', 400, 'Georgia, serif'); txt(g, 'for its city.', 76, t + 236, 40, '#ffffff', 400, 'Georgia, serif');
        box(g, 76, t + 262, 130, 38, 7, '#c4923a'); stroke(g, 218, t + 262, 140, 38, 7, 'rgba(255,255,255,.6)', 2);
        txt(g, 'Upcoming events', 40, t + 380, 20, '#2a1d3a', 700);
        [['SUN 14', 'Sunday service'], ['WED 17', 'Bible study'], ['SAT 20', 'Community meal']].forEach(function (e, i) {
          var y = t + 410 + i * 50; g.fillStyle = 'rgba(42,29,58,.15)'; g.fillRect(40, y, w - 80, 1);
          txt(g, e[0], 40, y + 32, 13, '#c4923a', 700, SANS); txt(g, e[1], 130, y + 32, 16, '#2a1d3a', 600);
          stroke(g, w - 120, y + 12, 80, 28, 14, '#2a1d3a', 1.5); txt(g, 'RSVP', w - 80, y + 31, 12, '#2a1d3a', 600, SANS, 'center');
        });
      } else if (kind === 'sidwalk') {
        g.fillStyle = '#0e0e0e'; g.fillRect(0, 0, w, h); t = chrome(g, w, 'sidwalk.com', true);
        txt(g, 'SIDWALK', 40, t + 44, 20, '#f2f2f2', 900); ['SHOP', 'DROP 01', 'LOOKBOOK'].forEach(function (s, i) { txt(g, s, 600 + i * 100, t + 44, 13, '#bbbbbb', 600); });
        txt(g, 'SIDWALK', w / 2, t + 230, 150, '#f2f2f2', 900, SANS, 'center');
        txt(g, 'D R O P   0 1   —   O U T   N O W', w / 2, t + 274, 15, '#cfcfcf', 600, SANS, 'center');
        box(g, w / 2 - 90, t + 296, 180, 40, 0, '#f2f2f2'); txt(g, 'SHOP THE DROP', w / 2, t + 322, 13, '#0e0e0e', 800, SANS, 'center');
        [['LOGO TEE', '€45'], ['HEAVY HOODIE', '€89'], ['CARGO PANT', '€95'], ['CREW CAP', '€35']].forEach(function (p, i) {
          var x = 40 + i * ((w - 80) / 4); g.fillStyle = '#1d1d1d'; g.fillRect(x, t + 370, (w - 80) / 4 - 16, 170);
          g.fillStyle = '#3a3a3a'; g.fillRect(x + 50, t + 400, (w - 80) / 4 - 116, 110);
          txt(g, p[0], x, t + 566, 12, '#dddddd', 600); txt(g, p[1], x + (w - 80) / 4 - 16, t + 566, 12, '#ffffff', 700, SANS, 'right');
        });
      } else if (kind === 'crea8or') {
        g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); t = chrome(g, w, 'crea8or.com', false);
        txt(g, 'Crea8or', 40, t + 44, 22, '#5b3df5', 800); ['Explore', 'How it works', 'Sell'].forEach(function (s, i) { txt(g, s, 600 + i * 110, t + 44, 14, MUTED, 500); });
        var gr = g.createLinearGradient(0, t + 70, 0, t + 330); gr.addColorStop(0, '#f3f0ff'); gr.addColorStop(1, '#ffffff'); g.fillStyle = gr; g.fillRect(0, t + 70, w, 260);
        txt(g, 'Hire creators who', 40, t + 150, 46, '#15121f', 750); txt(g, 'make things happen.', 40, t + 204, 46, '#15121f', 750);
        stroke(g, 40, t + 236, 560, 52, 12, '#ddd6ff', 2); txt(g, 'Video editors, illustrators…', 62, t + 268, 16, '#8a849c', 500);
        box(g, 500, t + 242, 92, 40, 9, '#5b3df5'); txt(g, 'Search', 546, t + 268, 15, '#ffffff', 650, SANS, 'center');
        [['AV', 'Video editing'], ['MK', 'Illustration'], ['JD', 'Motion design']].forEach(function (p, i) {
          var x = 40 + i * 320; stroke(g, x, t + 330, 300, 90, 14, '#ece8f7', 2); circle(g, x + 44, t + 375, 26, '#ebe6ff');
          txt(g, p[0], x + 44, t + 381, 14, '#5b3df5', 800, SANS, 'center'); txt(g, p[1], x + 84, t + 372, 16, '#15121f', 650); txt(g, '★ 4.9 · from €90', x + 84, t + 396, 13, '#6b6580', 500);
        });
        box(g, 40, t + 446, w - 80, 100, 16, '#15121f'); txt(g, 'Payout', 70, t + 482, 13, '#9a96a8', 500); txt(g, '€ 1.240,00', 70, t + 522, 32, '#ffffff', 750);
        box(g, w - 160, t + 480, 92, 32, 16, '#2bd17e'); txt(g, 'Paid', w - 114, t + 501, 14, '#0b2a19', 750, SANS, 'center');
      } else {
        g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); t = chrome(g, w, (title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com', false);
        txt(g, title || '', 60, t + 260, 64, INK, 750); box(g, 60, t + 300, 160, 46, 10, OR);
      }
    };
  }
  ['hesed', 'sidwalk', 'crea8or', 'generic'].forEach(function (k) { SCREENS['work-' + k] = workScreen(k); });

  /* ---------- phone screens (360 × 740) ---------- */
  function paintPhone(g, w, h, key, title) {
    var dark = key === 'call' || key === 'blank' || key === 'build' || key === 'work-sidwalk';
    g.fillStyle = dark ? '#121316' : '#ffffff'; g.fillRect(0, 0, w, h);
    box(g, w / 2 - 52, 14, 104, 26, 13, '#000');
    var fg = dark ? '#ffffff' : INK;
    if (key === 'call') {
      txt(g, 'Incoming call', w / 2, 150, 18, '#9aa0aa', 500, SANS, 'center');
      circle(g, w / 2, 280, 70, OR); txt(g, 'A', w / 2, 306, 64, INK, 800, SANS, 'center');
      txt(g, 'Ace 360 Services', w / 2, 400, 24, '#ffffff', 650, SANS, 'center');
      circle(g, 100, h - 130, 38, '#e5484d'); circle(g, w - 100, h - 130, 38, '#2bd17e');
      return;
    }
    if (key.indexOf('work-') === 0) {
      var k = key.slice(5);
      if (k === 'hesed') { g.fillStyle = '#f7f1e8'; g.fillRect(0, 50, w, h); var gr = g.createLinearGradient(0, 120, w, 420); gr.addColorStop(0, '#6b4a8a'); gr.addColorStop(1, '#2a1d3a'); g.fillStyle = gr; rr(g, 18, 110, w - 36, 300, 18); g.fill(); txt(g, 'Hesed', 24, 90, 24, '#2a1d3a', 700, 'Georgia, serif'); txt(g, 'A church that', 40, 230, 30, '#ffffff', 400, 'Georgia, serif'); txt(g, 'shows up.', 40, 270, 30, '#ffffff', 400, 'Georgia, serif'); box(g, 40, 300, 130, 40, 8, '#c4923a'); box(g, 18, 440, w - 36, 120, 14, '#ffffff'); txt(g, 'Give with iDEAL', w / 2, 510, 18, '#2a1d3a', 700, SANS, 'center'); return; }
      if (k === 'sidwalk') { txt(g, 'SIDWALK', w / 2, 260, 64, '#f2f2f2', 900, SANS, 'center'); box(g, 60, 300, w - 120, 46, 0, '#f2f2f2'); txt(g, 'SHOP THE DROP', w / 2, 330, 15, '#0e0e0e', 800, SANS, 'center'); g.fillStyle = '#1d1d1d'; g.fillRect(18, 380, w / 2 - 27, 220); g.fillRect(w / 2 + 9, 380, w / 2 - 27, 220); return; }
      if (k === 'crea8or') { txt(g, 'Crea8or', 24, 90, 24, '#5b3df5', 800); txt(g, 'Hire creators', 24, 180, 34, '#15121f', 750); txt(g, 'who deliver.', 24, 222, 34, '#15121f', 750); box(g, 24, 250, w - 48, 50, 12, '#f3f0ff'); box(g, 24, 330, w - 48, 90, 14, '#15121f'); txt(g, '€ 1.240,00', 48, 384, 26, '#ffffff', 750); return; }
      txt(g, title || '', 24, 200, 34, INK, 750); return;
    }
    circle(g, 34, 80, 9, OR); txt(g, 'Ace 360', 52, 87, 18, fg, 700);
    txt(g, 'You know the', 24, 200, 34, fg, 700); txt(g, 'price', 24, 242, 34, ORD, 700); txt(g, 'before we call.', 24, 284, 34, fg, 700);
    box(g, 24, 320, w - 48, 52, 10, OR); txt(g, 'Price my website →', w / 2, 352, 17, INK, 700, SANS, 'center');
    box(g, 24, 400, w - 48, 200, 16, INK); txt(g, '€1,200 – €1,600', 44, 460, 26, '#ffffff', 700); g.fillStyle = OR; g.fillRect(44, 474, 40, 4);
  }

  /* ---------- floating website cards ---------- */
  var CARD_W = 1.0, CARD_H = 0.62;
  var CARDS = [
    function (g, w, h) { txt(g, 'FIXED QUOTE', 34, 70, 22, MUTED, 600, MONO); txt(g, '€2,240', 34, 170, 92, INK, 750); g.fillStyle = OR; g.fillRect(34, 196, 90, 8); txt(g, 'Launch · 28 May', 34, 260, 26, MUTED, 500); },
    function (g, w, h) { box(g, 34, 90, w - 68, 120, 18, OR); txt(g, 'Pay with iDEAL', w / 2, 168, 42, INK, 750, SANS, 'center'); txt(g, 'Checkout · Mollie', w / 2, 260, 24, MUTED, 500, SANS, 'center'); },
    function (g, w, h) { txt(g, '★★★★★', 34, 100, 50, OR, 700); txt(g, '“Live in three weeks,', 34, 170, 32, INK, 600); txt(g, 'exactly as quoted.”', 34, 214, 32, INK, 600); },
    function (g, w, h) { circle(g, 58, 90, 18, OR); txt(g, 'yourbrand', 90, 100, 30, INK, 700); bars(g, 34, 160, [300, 380, 240], 16, 18, '#dfe2e6'); },
    function (g, w, h) { g.fillStyle = '#1d1d1d'; g.fillRect(34, 34, 180, h - 68); g.fillStyle = '#3a3a3a'; g.fillRect(74, 84, 100, 160); txt(g, 'LOGO TEE', 240, 120, 30, INK, 800); txt(g, '€45', 240, 180, 40, ORD, 750); box(g, 240, 220, 200, 50, 10, INK); txt(g, 'Add to bag', 340, 254, 22, '#ffffff', 650, SANS, 'center'); },
    function (g, w, h) { txt(g, 'SUN', 34, 90, 26, '#c4923a', 700); txt(g, '14', 34, 160, 66, '#2a1d3a', 750); txt(g, 'Sunday service', 160, 110, 32, '#2a1d3a', 700); txt(g, '10:30 · Main hall', 160, 154, 24, MUTED, 500); box(g, 160, 196, 140, 48, 24, '#2a1d3a'); txt(g, 'RSVP', 230, 228, 22, '#ffffff', 650, SANS, 'center'); },
    function (g, w, h) { txt(g, 'Organic visitors', 34, 70, 26, INK, 700); g.beginPath(); [0.15, 0.2, 0.3, 0.42, 0.6, 0.85].forEach(function (p, i) { var x = 34 + i * ((w - 68) / 5), y = h - 40 - p * (h - 130); if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.strokeStyle = OR; g.lineWidth = 10; g.lineJoin = 'round'; g.stroke(); },
    function (g, w, h) { box(g, 34, 100, 210, 110, 55, OR); circle(g, 92, 155, 18, INK); txt(g, 'Live', 168, 170, 44, INK, 800, SANS, 'center'); txt(g, 'yourbrand.nl', 280, 168, 30, MUTED, 500, MONO); },
    function (g, w, h) { box(g, 34, 100, w - 68, 110, 55, GREY); box(g, 44, 110, (w - 88) / 2, 90, 45, INK); txt(g, 'NL', 44 + (w - 88) / 4, 170, 40, '#ffffff', 800, SANS, 'center'); txt(g, 'EN', 44 + (w - 88) * 0.75, 170, 40, INK, 800, SANS, 'center'); txt(g, 'hreflang ✓', 34, 270, 24, MUTED, 500, MONO); },
    function (g, w, h) { g.beginPath(); g.arc(120, h / 2, 76, 0, Math.PI * 2); g.strokeStyle = '#d7f0e1'; g.lineWidth = 16; g.stroke(); g.beginPath(); g.arc(120, h / 2, 76, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.98); g.strokeStyle = '#1a8f4e'; g.stroke(); txt(g, '98', 120, h / 2 + 18, 52, '#1a8f4e', 750, SANS, 'center'); txt(g, 'Performance', 230, h / 2 - 6, 30, INK, 650); txt(g, 'Lighthouse', 230, h / 2 + 34, 24, MUTED, 500); },
    function (g, w, h) { txt(g, 'Cookies', 34, 76, 30, INK, 700); [['Necessary', 1], ['Statistics', 0], ['Marketing', 0]].forEach(function (r, i) { var y = 120 + i * 62; txt(g, r[0], 34, y + 30, 26, INK, 500); box(g, w - 130, y, 84, 44, 22, r[1] ? OR : '#d6d8dd'); circle(g, w - 130 + (r[1] ? 62 : 22), y + 22, 16, '#ffffff'); }); },
    function (g, w, h) { txt(g, 'Saturday', 34, 76, 30, INK, 700); ['09:00', '10:00', '11:30'].forEach(function (s, i) { box(g, 34 + i * 150, 110, 136, 60, 12, i === 1 ? INK : GREY); txt(g, s, 102 + i * 150, 150, 26, i === 1 ? '#ffffff' : INK, 650, SANS, 'center'); }); box(g, 34, 200, w - 68, 60, 12, OR); txt(g, 'Book for 2', w / 2, 240, 26, INK, 700, SANS, 'center'); }
  ];
  function cardTexture(paint) {
    var c = mk(512, 318), g = c.getContext('2d');
    g.clearRect(0, 0, 512, 318);
    rr(g, 4, 4, 504, 310, 30); g.fillStyle = '#ffffff'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#e3e5e9'; g.stroke();
    g.save(); rr(g, 4, 4, 504, 310, 30); g.clip(); paint(g, 512, 318); g.restore();
    return toTex(c);
  }

  /* ---------- materials ---------- */
  var alu = new THREE.MeshStandardMaterial({ color: col('#d7d9dd'), roughness: 0.38, metalness: 0.25 });
  var aluDark = new THREE.MeshStandardMaterial({ color: col('#b9bcc2'), roughness: 0.45, metalness: 0.2 });
  var bezel = new THREE.MeshStandardMaterial({ color: col('#0e0f12'), roughness: 0.35, metalness: 0.1 });
  var phoneMat = new THREE.MeshStandardMaterial({ color: col('#1b1c20'), roughness: 0.35, metalness: 0.3 });
  var paperMat;

  /* ---------- laptop ---------- */
  var LW = 3.4, LD = 2.3, LH = 0.11;
  var laptop = new THREE.Group();
  scene.add(laptop);
  function roundedSlab(w, d, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -d / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    var g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 10 });
    g.rotateX(-Math.PI / 2); g.translate(0, 0.02, 0);
    return g;
  }
  var base = new THREE.Mesh(roundedSlab(LW, LD, LH - 0.04, 0.14), alu);
  base.castShadow = true; base.receiveShadow = true;
  laptop.add(base);
  // keyboard deck
  var deckC = mk(1024, 700), dg = deckC.getContext('2d');
  dg.fillStyle = '#cfd2d7'; dg.fillRect(0, 0, 1024, 700);
  for (var r = 0; r < 5; r++) for (var k = 0; k < 14; k++) { box(dg, 70 + k * 63, 40 + r * 60, 54, 50, 8, '#2a2c31'); }
  box(dg, 250, 40 + 5 * 60, 520, 50, 8, '#2a2c31');
  box(dg, 340, 420, 344, 240, 22, '#c3c6cc');
  var deck = new THREE.Mesh(new THREE.PlaneGeometry(LW - 0.24, LD - 0.24), new THREE.MeshStandardMaterial({ map: toTex(deckC), roughness: 0.6, metalness: 0.1 }));
  deck.rotation.x = -Math.PI / 2; deck.position.set(0, LH + 0.001, 0.02);
  deck.receiveShadow = true;
  laptop.add(deck);
  // lid
  var lidG = new THREE.Group();
  lidG.position.set(0, LH, -LD / 2 + 0.04);
  laptop.add(lidG);
  var LIDH = 2.2;
  var lidBack = new THREE.Mesh(new THREE.BoxGeometry(LW, LIDH, 0.06), [aluDark, aluDark, aluDark, aluDark, bezel, alu]);
  lidBack.position.set(0, LIDH / 2, 0);
  lidBack.castShadow = true;
  lidG.add(lidBack);
  var screenC = mk(SW, SH), sg = screenC.getContext('2d');
  var screenTex = toTex(screenC);
  var screenMat = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false });
  var screen = new THREE.Mesh(new THREE.PlaneGeometry(LW - 0.22, (LW - 0.22) * SH / SW), screenMat);
  screen.position.set(0, LIDH / 2 + 0.03, 0.031);
  lidG.add(screen);
  // exploded page layers (build step)
  var layerDefs = [[0.26, 0.82], [0.62, 0.42], [0.42, 0.0], [0.16, -0.62]];
  var layerPaint = [
    function (g, w, h) { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); txt(g, 'yourbrand', 30, h * 0.64, h * 0.4, INK, 700); box(g, w - 170, h * 0.25, 140, h * 0.5, 10, OR); },
    function (g, w, h) { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); txt(g, 'Fresh every morning, booked in seconds.', 30, h * 0.36, 44, INK, 700); box(g, 30, h * 0.56, 200, 54, 10, INK); var gr = g.createRadialGradient(w * 0.82, h * 0.5, 10, w * 0.82, h * 0.5, 200); gr.addColorStop(0, '#ffd9bd'); gr.addColorStop(1, OR); g.fillStyle = gr; rr(g, w * 0.66, 20, w * 0.32, h - 40, 16); g.fill(); },
    function (g, w, h) { g.fillStyle = '#f4f5f7'; g.fillRect(0, 0, w, h); for (var i = 0; i < 3; i++) { box(g, 24 + i * (w / 3), 20, w / 3 - 40, h - 40, 14, '#ffffff'); box(g, 44 + i * (w / 3), 40, 90, h - 80, 10, i === 1 ? OR : '#dfe2e6'); } },
    function (g, w, h) { g.fillStyle = INK; g.fillRect(0, 0, w, h); txt(g, 'KvK · BTW · Privacy', w - 30, h * 0.62, h * 0.32, '#9aa0aa', 500, SANS, 'right'); }
  ];
  var layers = layerDefs.map(function (d, i) {
    var lw = LW - 0.22, c = mk(1024, Math.round(1024 * d[0] / lw));
    layerPaint[i](c.getContext('2d'), c.width, c.height);
    var m = new THREE.Mesh(new THREE.PlaneGeometry(lw, d[0]), new THREE.MeshBasicMaterial({ map: toTex(c), transparent: true, opacity: 0, toneMapped: false, side: THREE.DoubleSide }));
    m.position.set(0, LIDH / 2 + 0.03 + d[1], 0.04);
    m.userData.y = d[1];
    m.visible = false;
    lidG.add(m);
    return m;
  });

  /* ---------- phone ---------- */
  var phone = new THREE.Group();
  scene.add(phone);
  var PW = 0.78, PH = 1.62;
  var phoneBody = new THREE.Mesh(new THREE.BoxGeometry(PW, PH, 0.07), phoneMat);
  phoneBody.castShadow = true;
  phone.add(phoneBody);
  var phoneC = mk(360, 740), pg = phoneC.getContext('2d');
  var phoneTex = toTex(phoneC);
  var phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(PW - 0.06, PH - 0.06), new THREE.MeshBasicMaterial({ map: phoneTex, toneMapped: false }));
  phoneScreen.position.z = 0.036;
  phone.add(phoneScreen);
  var PHONE_FLAT_P = new THREE.Vector3(2.55, 0.035, 0.75);
  var PHONE_FLAT_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, -0.35));
  var PHONE_UP_P = new THREE.Vector3(2.35, 1.25, 0.9);
  var PHONE_UP_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.12, -0.42, 0.04));

  /* ---------- paper quote ---------- */
  var quoteC = mk(560, 760), qg = quoteC.getContext('2d');
  var quoteTex = toTex(quoteC);
  paperMat = new THREE.MeshStandardMaterial({ map: quoteTex, roughness: 0.9, metalness: 0, side: THREE.DoubleSide });
  var paper = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.76), paperMat);
  paper.castShadow = true;
  scene.add(paper);
  var PAPER_UP_P = new THREE.Vector3(2.6, 1.3, 0.7);
  var PAPER_UP_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.08, -0.5, -0.04));
  var PAPER_LAY_P = new THREE.Vector3(-2.2, 0.012, 1.0);
  var PAPER_LAY_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0.22));
  var PAPER_HIDE_P = new THREE.Vector3(2.6, -1.5, 0.7);

  var quoteState = { lang: 'en', lines: [['Website · 5 pages', '€1,200 – €1,600']], range: '€1,200 – €1,600', weeks: '3–4 weeks', care: '€95 /mo', vat: 'excl. VAT' };
  function paintQuote() {
    var g = qg, w = 560, h = 760, nl = quoteState.lang === 'nl';
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    g.fillStyle = OR; g.fillRect(0, 0, w, 10);
    circle(g, 52, 70, 13, OR); circle(g, 52, 70, 7, '#ffffff');
    txt(g, 'Ace 360 Services', 76, 78, 22, INK, 700);
    txt(g, nl ? 'INDICATIE' : 'ESTIMATE', w - 40, 78, 16, MUTED, 700, MONO, 'right');
    txt(g, nl ? 'Jouw website' : 'Your website', 40, 150, 34, INK, 750);
    var y = 200;
    quoteState.lines.slice(0, 7).forEach(function (l) {
      g.fillStyle = LINE; g.fillRect(40, y, w - 80, 2);
      txt(g, l[0].length > 30 ? l[0].slice(0, 29) + '…' : l[0], 40, y + 38, 20, INK, 500);
      txt(g, l[1], w - 40, y + 38, 18, INK, 600, MONO, 'right');
      y += 54;
    });
    g.fillStyle = INK; g.fillRect(40, y + 6, w - 80, 3);
    txt(g, nl ? 'Totaal' : 'Total', 40, y + 56, 22, INK, 700);
    txt(g, quoteState.range, w - 40, y + 58, 30, ORD, 750, SANS, 'right');
    txt(g, quoteState.vat, w - 40, y + 86, 15, MUTED, 500, MONO, 'right');
    txt(g, (nl ? 'Doorlooptijd · ' : 'Timeline · ') + quoteState.weeks, 40, h - 96, 18, INK, 600);
    txt(g, (nl ? 'Onderhoud · ' : 'Care · ') + quoteState.care, 40, h - 64, 18, MUTED, 500);
    quoteTex.needsUpdate = true;
  }
  paintQuote();
  document.addEventListener('ace360:quote', function (e) {
    var d = e.detail || {};
    quoteState = { lang: d.lang || 'en', lines: d.lines || quoteState.lines, range: d.range || quoteState.range, weeks: d.weeks || quoteState.weeks, care: d.care || quoteState.care, vat: d.vat || quoteState.vat };
    paintQuote();
    if (!reduce) paperBump = 1;
  });
  var paperBump = 0;

  /* ---------- cards ---------- */
  var cardGeo = new THREE.PlaneGeometry(CARD_W, CARD_H);
  var cards = CARDS.map(function (paint, i) {
    var m = new THREE.Mesh(cardGeo, new THREE.MeshStandardMaterial({ map: cardTexture(paint), transparent: true, roughness: 0.7, metalness: 0, side: THREE.DoubleSide, emissive: 0xffffff, emissiveIntensity: 0.06 }));
    m.castShadow = true;
    m.userData = { i: i, a: (i / CARDS.length) * Math.PI * 2 + 0.3, r: 3.1 + (i % 3) * 0.45, y: 1.0 + ((i * 37) % 10) / 10 * 1.6, spin: (i % 2 ? 1 : -1) * (0.12 + 0.05 * (i % 3)), tilt: Math.sin(i * 1.7) * 0.3 };
    scene.add(m);
    return m;
  });

  /* ---------- floor, lights, dust ---------- */
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.13 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  var hemi = new THREE.HemisphereLight(0xffffff, col('#dfe2e6'), 1.0);
  scene.add(hemi);
  var key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(-4, 9, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  key.shadow.camera.left = -8; key.shadow.camera.right = 8; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  key.shadow.camera.near = 1; key.shadow.camera.far = 30; key.shadow.bias = -0.0005; key.shadow.radius = 6;
  scene.add(key);
  var fill = new THREE.DirectionalLight(0xffffff, 0.45);
  fill.position.set(6, 3, 5);
  scene.add(fill);
  var screenLight = new THREE.PointLight(col('#ffd2b0'), 0, 6, 2);
  scene.add(screenLight);

  var DUST = mobile ? 220 : 420;
  var dpos = new Float32Array(DUST * 3), seed = 360;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  for (var di = 0; di < DUST; di++) { dpos[di * 3] = (rnd() - 0.5) * 16; dpos[di * 3 + 1] = rnd() * 6; dpos[di * 3 + 2] = (rnd() - 0.5) * 12; }
  var dgeo = new THREE.BufferGeometry(); dgeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  var dustMat = new THREE.PointsMaterial({ color: col('#9aa0aa'), size: 0.025, transparent: true, opacity: 0.4, depthWrite: false });
  var dust = new THREE.Points(dgeo, dustMat);
  scene.add(dust);

  /* ---------- keyframes ---------- */
  var BASE = { cx: -3.2, cy: 2.5, cz: 6.4, tx: 0.2, ty: 0.95, tz: -0.4, side: 1, lid: 1, fly: 0, gather: 0, paper: 0, lay: 0, phone: 0, nophone: 0, explode: 0, glow: 0.7, orbit: 0, dust: 0.5, keyI: 1.4, hemiI: 1 };
  var SEQ = [
    ['hero', {}],
    ['services', { side: -1, cx: 3.9, cy: 3.4, cz: 6.6, tx: -0.3, ty: 1.2, tz: -0.2, fly: 1, orbit: 1 }],
    ['quote', { side: 1, cx: 4.6, cy: 2.8, cz: 5.6, tx: 1.9, ty: 1.0, tz: 0.1, fly: 1, gather: 1, paper: 1, orbit: 0, nophone: 1 }],
    ['process', { side: -1, cx: 0.6, cy: 6.6, cz: 5.6, tx: 0, ty: 0.2, tz: 0, lid: 0, gather: 1, paper: 0, glow: 0, dust: 0.35, nophone: 1 }],
    ['s1', { side: 1, cx: 3.6, cy: 2.0, cz: 4.4, tx: 2.1, ty: 0.9, tz: 0.4, phone: 1, nophone: 0, lid: 0.12 }],
    ['s2', { side: -1, cx: -2.4, cy: 4.6, cz: 3.8, tx: -1.6, ty: 0.2, tz: 0.6, phone: 0, paper: 1, lay: 1, lid: 0.55, glow: 0.4 }],
    ['s3', { side: 1, cx: -1.2, cy: 2.1, cz: 5.2, tx: 0.1, ty: 1.15, tz: -0.6, paper: 0, lay: 0, lid: 1, glow: 0.8 }],
    ['s4', { side: -1, cx: 4.6, cy: 2.6, cz: 3.6, tx: 0, ty: 1.15, tz: -0.6, explode: 1, glow: 0.9 }],
    ['s5', { side: 1, cx: -3.6, cy: 2.8, cz: 6.2, tx: 0.2, ty: 1.1, tz: -0.4, explode: 0, gather: 0, fly: 1, orbit: 1, glow: 1.3, dust: 0.7 }],
    ['demo', { side: 1, cx: 4.8, cy: 5.2, cz: 9.5, tx: 1.4, ty: 0.6, tz: -0.4, fly: 0.0, orbit: 0, glow: 0.8, dust: 0.4 }],
    ['work', { side: 1, cx: 3.2, cy: 1.9, cz: 5.4, tx: 0.9, ty: 1.0, tz: -0.2, phone: 1, glow: 1 }],
    ['faq', { side: 0, cx: 0.4, cy: 9.5, cz: 3.6, tx: 0.2, ty: 0, tz: 0, phone: 0, nophone: 1, glow: 0.6, dust: 0.3 }],
    ['contact', { side: 1, cx: 2.8, cy: 1.7, cz: 5.6, tx: 0.6, ty: 1.05, tz: -0.6, glow: 1.2, fly: 1, orbit: 1, dust: 0.6, nophone: 1 }]
  ];
  var KF = {};
  var prev = BASE;
  SEQ.forEach(function (s) { prev = Object.assign({}, prev, s[1]); KF[s[0]] = prev; });
  var S = Object.assign({}, BASE);

  var secs = Array.prototype.slice.call(document.querySelectorAll('[data-k]'));
  var anchors = [];
  function measure() {
    var vh = window.innerHeight;
    anchors = [];
    secs.forEach(function (s) {
      var k = KF[s.dataset.k];
      if (!k) return;
      var top = s.getBoundingClientRect().top + window.scrollY, h = s.offsetHeight;
      if (h > vh * 1.3) { anchors.push({ y: top, k: k }); anchors.push({ y: top + h - vh, k: k }); }
      else anchors.push({ y: top + (h - vh) / 2, k: k });
    });
    anchors.sort(function (a, b) { return a.y - b.y; });
  }
  function sm(x) { return x * x * (3 - 2 * x); }
  function c01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sample(y) {
    if (!anchors.length) return;
    var a = anchors[0], b = anchors[0], t = 0, last = anchors[anchors.length - 1];
    if (y >= last.y) { a = b = last; }
    else if (y > anchors[0].y) {
      for (var i = 0; i < anchors.length - 1; i++) {
        if (y >= anchors[i].y && y < anchors[i + 1].y) { a = anchors[i]; b = anchors[i + 1]; t = sm((y - a.y) / Math.max(1, b.y - a.y)); break; }
      }
    }
    for (var k in BASE) S[k] = a.k[k] + (b.k[k] - a.k[k]) * t;
  }

  /* ---------- sizing ---------- */
  var W = 1, H = 1;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    mobile = W < 800;
    renderer.setSize(W, H, false);
    var asp = W / H;
    camera.aspect = asp;
    camera.fov = asp < 1 ? 36 + (1 - asp) * 36 : 36;
    camera.updateProjectionMatrix();
    measure();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('load', measure);
  setTimeout(measure, 1500);
  if (window.ScrollTrigger) window.ScrollTrigger.addEventListener('refresh', measure);
  resize();

  /* ---------- screen switching ---------- */
  var current = '';
  var bright = { v: 1 };
  var imageCache = {};
  function paintScreen(key, title, img) {
    sg.clearRect(0, 0, SW, SH);
    if (img) {
      sg.fillStyle = '#ffffff'; sg.fillRect(0, 0, SW, SH);
      var t = chrome(sg, SW, (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com', false);
      var s = SW / img.width;
      sg.drawImage(img, 0, t, SW, img.height * s);
    } else {
      (SCREENS[key] || SCREENS.ace)(sg, SW, SH, title);
    }
    screenTex.needsUpdate = true;
    paintPhone(pg, 360, 740, key, title);
    phoneTex.needsUpdate = true;
  }
  function setScreen(key, imageUrl, title) {
    var id = key + '|' + (imageUrl || '') + '|' + (title || '');
    if (id === current) return;
    current = id;
    function apply(img) {
      if (!window.gsap || reduce) { paintScreen(key, title, img); return; }
      window.gsap.killTweensOf(bright);
      window.gsap.timeline()
        .to(bright, { v: 0.15, duration: 0.18, ease: 'power2.in' })
        .add(function () { paintScreen(key, title, img); })
        .to(bright, { v: 1, duration: 0.45, ease: 'power2.out' });
    }
    if (imageUrl) {
      if (imageCache[imageUrl]) { apply(imageCache[imageUrl]); return; }
      var im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = function () { imageCache[imageUrl] = im; if (current === id) apply(im); };
      im.onerror = function () { if (current === id) apply(null); };
      im.src = imageUrl;
    } else {
      apply(null);
    }
  }
  paintScreen('ace');
  current = 'ace||';
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      var p = current.split('|'); current = ''; setScreen(p[0], p[1], p[2]);
      paintQuote();
      cards.forEach(function (c, i) { c.material.map.dispose(); c.material.map = cardTexture(CARDS[i]); c.material.needsUpdate = true; });
    });
  }
  window.ACE360_FILM = { setScreen: setScreen, measure: measure };

  /* ---------- pointer ---------- */
  var ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    ptr.x = e.clientX / W - 0.5; ptr.y = e.clientY / H - 0.5;
  }, { passive: true });

  /* ---------- frame ---------- */
  var clock = new THREE.Clock();
  var ys = window.scrollY;
  var intro = { v: reduce ? 1 : 0 };
  if (window.gsap && !reduce) window.gsap.to(intro, { v: 1, duration: 2.6, delay: 0.2, ease: 'power3.out' });
  var v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), q1 = new THREE.Quaternion(), q2 = new THREE.Quaternion(), e1 = new THREE.Euler();
  var target = new THREE.Vector3();
  var screenWorld = new THREE.Vector3();
  var PILE = new THREE.Vector3(-2.7, 0.01, -0.9);

  function frame() {
    var dt = Math.min(clock.getDelta(), 0.05);
    var t = reduce ? 0 : clock.elapsedTime;
    ys += (window.scrollY - ys) * (reduce ? 1 : 1 - Math.exp(-dt * 8));
    sample(ys);
    ptr.sx += (ptr.x - ptr.sx) * 0.04; ptr.sy += (ptr.y - ptr.sy) * 0.04;
    var iv = intro.v;

    // camera (slow orbit when the chapter asks for it)
    var cx = S.cx, cz = S.cz;
    if (S.orbit > 0) {
      var oa = Math.sin(t * 0.12) * 0.35 * S.orbit, dx = cx - S.tx, dz = cz - S.tz;
      cx = S.tx + dx * Math.cos(oa) - dz * Math.sin(oa); cz = S.tz + dx * Math.sin(oa) + dz * Math.cos(oa);
    }
    camera.position.set(cx + ptr.sx * 0.5, S.cy - ptr.sy * 0.3 + (1 - iv) * 1.2, cz + (1 - iv) * 2.5);
    target.set(S.tx, S.ty, S.tz);
    camera.lookAt(target);
    if (W >= 800) camera.setViewOffset(W, H, -W * 0.2 * S.side, 0, W, H);
    else camera.setViewOffset(W, H, 0, H * 0.24, W, H);

    // laptop lid opens on load and per chapter
    var lid = sm(c01(S.lid)) * sm(c01(iv * 1.4 - 0.2));
    lidG.rotation.x = 1.52 * (1 - lid) - 0.3 * lid;
    screenMat.color.setScalar(Math.max(0.03, bright.v * (0.25 + 0.75 * lid)));
    laptop.position.y = 0;

    // exploded page layers
    var ex = sm(c01(S.explode));
    layers.forEach(function (m, i) {
      m.visible = ex > 0.03;
      m.material.opacity = c01((ex - 0.03) * 3);
      m.position.z = 0.04 + ex * (0.35 + i * 0.42);
      m.position.y = LIDH / 2 + 0.03 + m.userData.y + ex * (1.5 - i) * 0.1;
    });

    // screen glow
    lidG.updateMatrixWorld();
    screen.getWorldPosition(screenWorld);
    screenLight.position.copy(screenWorld).add(v1.set(0, 0, 1.2));
    screenLight.intensity = S.glow * lid * 1.4;

    // phone: flat on the desk → lifted toward the camera
    var ph = sm(c01(S.phone));
    phone.position.lerpVectors(PHONE_FLAT_P, PHONE_UP_P, ph);
    phone.position.y += Math.sin(ph * Math.PI) * 0.4 + (reduce ? 0 : Math.sin(t * 0.9) * 0.03 * ph);
    phone.quaternion.slerpQuaternions(PHONE_FLAT_Q, PHONE_UP_Q, ph);
    var pv = 1 - sm(c01(S.nophone));
    phone.scale.setScalar(Math.max(0.001, pv));
    phone.visible = pv > 0.01;

    // paper quote: hidden → floating upright → lying on the desk
    var pp = sm(c01(S.paper)), pl = sm(c01(S.lay));
    paper.visible = pp > 0.01;
    paper.position.lerpVectors(PAPER_HIDE_P, PAPER_UP_P, pp);
    paper.quaternion.copy(PAPER_UP_Q);
    paper.position.lerp(PAPER_LAY_P, pl);
    paper.position.y += Math.sin(pl * Math.PI) * 0.3 + (reduce ? 0 : Math.sin(t * 0.8) * 0.03 * (1 - pl));
    paper.quaternion.slerp(PAPER_LAY_Q, pl);
    if (paperBump > 0) { paperBump = Math.max(0, paperBump - dt * 2.5); paper.position.y += Math.sin(paperBump * Math.PI) * 0.12; }
    paper.scale.setScalar(Math.max(0.001, pp));

    // cards: inside the screen → orbiting the desk → piled next to the laptop
    var N = cards.length;
    cards.forEach(function (c) {
      var u = c.userData, i = u.i;
      v1.set((i % 4 - 1.5) * 0.6, LIDH / 2 + ((i % 3) - 1) * 0.4, 0.05); lidG.localToWorld(v1);
      lidG.getWorldQuaternion(q1);
      var a = u.a + t * 0.07;
      v2.set(Math.cos(a) * u.r, u.y + Math.sin(t * 0.6 + i) * 0.08, Math.sin(a) * u.r * 0.8 - 0.2);
      q2.setFromEuler(e1.set(u.tilt, -a + Math.PI / 2 + t * u.spin, Math.cos(i) * 0.15));
      var f = sm(c01(S.fly * 1.4 - i * 0.035));
      c.position.lerpVectors(v1, v2, f);
      c.quaternion.slerpQuaternions(q1, q2, f);
      v2.copy(PILE); v2.y += (N - 1 - i) * 0.008 + 0.004; v2.x += Math.sin(i * 3.1) * 0.05; v2.z += Math.cos(i * 2.3) * 0.05;
      q2.setFromEuler(e1.set(-Math.PI / 2, 0, Math.sin(i * 1.9) * 0.12));
      var gth = sm(c01(S.gather * 1.5 - (N - 1 - i) * 0.045));
      c.position.lerp(v2, gth);
      c.quaternion.slerp(q2, gth);
      var sc = Math.max(0.001, Math.max(f, gth) * (0.35 + 0.65 * Math.max(f, gth)));
      c.scale.setScalar(sc);
      c.visible = sc > 0.01;
    });

    // dust and light
    dust.rotation.y = t * 0.01;
    dust.position.y = Math.sin(t * 0.15) * 0.15;
    dustMat.opacity = S.dust * 0.55;
    key.intensity = S.keyI;
    hemi.intensity = S.hemiI;

    renderer.render(scene, camera);
  }

  var running = false;
  function loop() {
    if (document.hidden) { running = false; return; }
    frame();
    requestAnimationFrame(loop);
  }
  function start() { if (!running) { running = true; clock.getDelta(); requestAnimationFrame(loop); } }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
  start();
})();
