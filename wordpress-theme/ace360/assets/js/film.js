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
  if (!canvas || typeof window.THREE === 'undefined' || !window.ACE360_PAINT) { fail(); return; }
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
  var P = window.ACE360_PAINT;
  var mk = P.mk, rr = P.rr, box = P.box, stroke = P.stroke, txt = P.txt, bars = P.bars, circle = P.circle, chrome = P.chrome;
  function toTex(c) { var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = aniso; return t; }

  /* ---------- laptop screens (1024 × 640) ---------- */
  var SW = 1024, SH = 640;
  // notifications a client gets once the new site is live: [icon, colour, title, text]
  var NOTES = [
    ['€', '#cc0066', 'Payment received', '€64.50 · order #1042 · iDEAL'],
    ['B', '#ff6a00', 'New booking', 'Sat 10:30 · Cut & finish'],
    ['W', '#25d366', 'WhatsApp', '“Is Saturday still free?”'],
    ['@', '#3b82f6', 'New enquiry', 'Website form · budget €2k'],
    ['★', '#f5b400', 'New 5-star review', '“Quick, friendly, great site”'],
    ['↗', '#111111', 'Visitors today', '1,284 · up 38% on last week']
  ];
  var SCREENS = {
    // the site the visitor has now: dated, insecure, slow and not built for phones
    old: function (g, w, h) {
      var TNR = '"Times New Roman", Times, serif', COMIC = '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive';
      g.fillStyle = '#efe9d2'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#eef0f3'; g.fillRect(0, 0, w, 40);
      ['#ff5f57', '#febc2e', '#28c840'].forEach(function (c, i) { circle(g, 22 + i * 18, 20, 5.5, c); });
      box(g, w / 2 - 200, 9, 400, 22, 11, '#ffffff');
      txt(g, '⚠ Not secure', w / 2 - 186, 25, 12, '#d64545', 700);
      txt(g, 'http://www.yourbusiness.nl/index.html', w / 2 - 92, 25, 12, '#5d6168', 500, MONO);
      var t = 40, gr = g.createLinearGradient(0, t, 0, t + 84); gr.addColorStop(0, '#4a7be0'); gr.addColorStop(1, '#1d3f8f');
      g.fillStyle = gr; g.fillRect(0, t, w, 84);
      txt(g, 'Welcome to our Website!!!', w / 2, t + 56, 36, '#ffef5a', 700, COMIC, 'center');
      ['HOME', 'ABOUT US', 'SERVICES', 'GUESTBOOK', 'CONTACT'].forEach(function (s, i) {
        var x = 16 + i * 199;
        g.fillStyle = '#c0c0c0'; g.fillRect(x, t + 94, 188, 30);
        g.fillStyle = '#ffffff'; g.fillRect(x, t + 94, 188, 2); g.fillRect(x, t + 94, 2, 30);
        g.fillStyle = '#7a7a7a'; g.fillRect(x, t + 122, 188, 2); g.fillRect(x + 186, t + 94, 2, 30);
        txt(g, s, x + 94, t + 115, 14, '#000080', 700, TNR, 'center');
      });
      txt(g, 'Since 2009 your partner for all your needs.', 24, t + 170, 19, '#111111', 400, TNR);
      txt(g, 'Click HERE for our prices (PDF, 4.2 MB)', 24, t + 202, 19, '#0000ee', 400, TNR); g.fillStyle = '#0000ee'; g.fillRect(24, t + 206, 330, 1.5);
      txt(g, '*** Under construction ***', 24, t + 236, 19, '#c00000', 700, TNR);
      txt(g, 'Best viewed in Internet Explorer at 800×600', 24, t + 266, 14, '#666666', 400, TNR);
      g.fillStyle = '#000000'; g.fillRect(24, t + 288, 190, 32); txt(g, 'Visitors: 000417', 119, t + 310, 16, '#39ff14', 700, MONO, 'center');
      g.strokeStyle = '#9a9a9a'; g.lineWidth = 1.5; g.setLineDash([6, 4]); g.strokeRect(560, t + 150, 430, 250); g.setLineDash([]);
      txt(g, '▨ header_photo_FINAL_v3.jpg', 580, t + 180, 13, '#777777', 400, MONO);
      for (var i = 0; i < 10; i++) { var a = i * Math.PI / 5; circle(g, 775 + Math.cos(a) * 32, t + 280 + Math.sin(a) * 32, 6, 'rgba(60,60,60,' + (0.12 + i * 0.08) + ')'); }
      txt(g, 'Loading… 8.4 s', 775, t + 346, 14, '#555555', 600, SANS, 'center');
      box(g, 24, t + 350, 300, 92, 12, '#ffffff'); stroke(g, 24, t + 350, 300, 92, 12, '#e3c9c9', 2);
      g.beginPath(); g.arc(72, t + 396, 28, 0, Math.PI * 2); g.strokeStyle = '#fde2e2'; g.lineWidth = 7; g.stroke();
      g.beginPath(); g.arc(72, t + 396, 28, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.23); g.strokeStyle = '#d64545'; g.stroke();
      txt(g, '23', 72, t + 404, 20, '#d64545', 800, SANS, 'center'); txt(g, 'Mobile speed', 116, t + 390, 17, INK, 650); txt(g, 'Poor · not mobile-friendly', 116, t + 414, 14, '#d64545', 500);
      g.fillStyle = '#1d3f8f'; g.fillRect(0, h - 36, w, 36);
      txt(g, '© 2014 Your Business · Last updated 12-03-2016', w / 2, h - 13, 13, '#cfd8ff', 400, TNR, 'center');
    },
    // after launch: the owner's dashboard on a good week
    results: function (g, w, h) {
      g.fillStyle = '#f6f7f9'; g.fillRect(0, 0, w, h);
      var t = chrome(g, w, 'yourbrand.nl/dashboard', false);
      g.fillStyle = INK; g.fillRect(0, t, 190, h - t);
      circle(g, 30, t + 34, 8, OR); txt(g, 'yourbrand', 46, t + 40, 17, '#ffffff', 700);
      ['Overview', 'Orders', 'Bookings', 'Enquiries', 'Pages'].forEach(function (s, i) {
        if (!i) box(g, 12, t + 70, 166, 34, 8, 'rgba(255,255,255,0.1)');
        txt(g, s, 28, t + 92 + i * 42, 15, i ? '#9aa0aa' : '#ffffff', i ? 500 : 650);
      });
      txt(g, 'Good morning, Sanne', 220, t + 46, 26, INK, 750);
      txt(g, 'Here is your week so far', 220, t + 72, 15, MUTED, 500);
      box(g, w - 150, t + 26, 118, 34, 17, '#e8f7ee'); circle(g, w - 130, t + 43, 5, '#1a8f4e'); txt(g, 'Site live', w - 118, t + 48, 14, '#1a8f4e', 650);
      [['Visitors', '4,812', '+38%'], ['Enquiries', '27', '+12'], ['Bookings', '19', '+7'], ['Revenue', '€3,460', '+24%']].forEach(function (c, i) {
        var x = 220 + i * 197; box(g, x, t + 96, 183, 92, 14, '#ffffff'); stroke(g, x, t + 96, 183, 92, 14, LINE, 1.5);
        txt(g, c[0], x + 18, t + 124, 13, MUTED, 600); txt(g, c[1], x + 18, t + 166, 30, INK, 750); txt(g, c[2], x + 165, t + 166, 14, '#1a8f4e', 700, SANS, 'right');
      });
      box(g, 220, t + 204, 470, 286, 14, '#ffffff'); stroke(g, 220, t + 204, 470, 286, 14, LINE, 1.5);
      txt(g, 'Visitors this week', 242, t + 236, 15, INK, 650);
      var pts = [0.22, 0.3, 0.27, 0.45, 0.52, 0.68, 0.9], cx0 = 250, cw = 410, cy0 = t + 460, ch = 190;
      g.beginPath(); pts.forEach(function (p, i) { var x = cx0 + i * cw / 6, y = cy0 - p * ch; if (i) g.lineTo(x, y); else g.moveTo(x, y); });
      g.lineTo(cx0 + cw, cy0); g.lineTo(cx0, cy0); g.closePath();
      var ag = g.createLinearGradient(0, cy0 - ch, 0, cy0); ag.addColorStop(0, 'rgba(255,106,0,0.28)'); ag.addColorStop(1, 'rgba(255,106,0,0)'); g.fillStyle = ag; g.fill();
      g.beginPath(); pts.forEach(function (p, i) { var x = cx0 + i * cw / 6, y = cy0 - p * ch; if (i) g.lineTo(x, y); else g.moveTo(x, y); });
      g.strokeStyle = OR; g.lineWidth = 4; g.lineJoin = 'round'; g.stroke();
      circle(g, cx0 + cw, cy0 - pts[6] * ch, 7, OR);
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(function (d, i) { txt(g, d, cx0 + i * cw / 6, t + 482, 11, MUTED, 500, SANS, 'center'); });
      box(g, 706, t + 204, 286, 286, 14, '#ffffff'); stroke(g, 706, t + 204, 286, 286, 14, LINE, 1.5);
      txt(g, 'Just now', 726, t + 236, 15, INK, 650);
      [['#cc0066', 'Order #1042', '€64.50 · iDEAL'], ['#ff6a00', 'Booking', 'Sat 10:30 · Sanne'], ['#3b82f6', 'Enquiry', 'Website form'], ['#25d366', 'WhatsApp', '“Still free Saturday?”'], ['#f5b400', 'Review', '★★★★★']].forEach(function (r, i) {
        var y = t + 260 + i * 44; circle(g, 740, y + 14, 12, r[0]);
        txt(g, r[1], 762, y + 12, 14, INK, 650); txt(g, r[2], 762, y + 30, 12, MUTED, 500);
      });
    },
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
      txt(g, P.L('See an', 'Je ziet een'), 44, t + 160, 58, INK, 700);
      var hw = P.L('estimate', 'prijsindicatie');
      txt(g, hw, 44, t + 222, 58, ORD, 700);
      var hwW = g.measureText(hw).width;
      g.fillStyle = OR; g.fillRect(44, t + 230, hwW, 6);
      txt(g, P.L(' before we', ' al'), 44 + hwW, t + 222, 58, INK, 700);
      txt(g, P.L('get on a call.', 'voordat we bellen.'), 44, t + 284, 58, INK, 700);
      bars(g, 44, t + 318, [420, 380, 300], 9, 11, '#d9dce1');
      box(g, 44, t + 400, 190, 46, 9, OR); txt(g, 'Get my estimate →', 139, t + 429, 15, INK, 650, SANS, 'center');
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
      txt(g, 'Your quote and launch date', 300, t + 70, 26, INK, 700);
      txt(g, 'Ace 360 Services · hello@ace360services.nl', 300, t + 102, 14, MUTED, 500);
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
  P.kinds.forEach(function (k) { SCREENS['work-' + k] = P.screen(k); });

  /* ---------- hero: a landing page at work ----------
   * An 11-second loop played on the laptop while the hero is on screen:
   * found in search → lands on the page → pre-orders → pays with iDEAL →
   * the owner gets the order at 23:14. It uses one of the sample sites
   * (Bakkerij Korrel) and its product photos. */
  var STORY_T = 11, storyClock = 0, storyAcc = 0;
  var landC = mk(SW, SH);
  function paintLanding() { P.screen('korrel')(landC.getContext('2d'), SW, SH, 'Bakkerij Korrel'); }
  paintLanding();
  P.onPhotos(paintLanding);
  function ez(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  function seg(t, a, b) { return ez((t - a) / (b - a)); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function pointer(g, x, y, clickAge) {
    if (clickAge >= 0 && clickAge < 0.5) {
      g.beginPath(); g.arc(x, y, 8 + clickAge * 60, 0, Math.PI * 2);
      g.strokeStyle = 'rgba(255,106,0,' + (1 - clickAge * 2) + ')'; g.lineWidth = 4; g.stroke();
    }
    g.save(); g.translate(x, y); var sc = clickAge >= 0 && clickAge < 0.15 ? 0.88 : 1; g.scale(sc, sc);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 26); g.lineTo(7, 20); g.lineTo(12, 31); g.lineTo(17, 29); g.lineTo(12, 18); g.lineTo(21, 18); g.closePath();
    g.fillStyle = '#111111'; g.fill(); g.strokeStyle = '#ffffff'; g.lineWidth = 2; g.stroke(); g.restore();
  }
  function storyFrame(g, w, h, tt) {
    var t = tt % STORY_T, cx, cy, click = -1;
    g.clearRect(0, 0, w, h);
    if (t < 2.5) {
      // 1 · searched for, found first
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      var top = chrome(g, w, 'search · bakery utrecht pre-order', false);
      var q = P.L('bakery utrecht pre-order', 'bakker utrecht bestellen'), n = Math.round(seg(t, 0.15, 1.1) * q.length);
      box(g, 120, top + 34, 620, 50, 25, '#f1f3f4');
      g.beginPath(); g.arc(150, top + 59, 9, 0, Math.PI * 2); g.strokeStyle = '#5d6168'; g.lineWidth = 2.5; g.stroke(); g.beginPath(); g.moveTo(157, top + 66); g.lineTo(164, top + 73); g.stroke();
      txt(g, q.slice(0, n), 176, top + 67, 22, INK, 500);
      if (t < 1.3 && Math.floor(t * 3) % 2 === 0) { g.font = '500 22px ' + SANS; g.fillStyle = INK; g.fillRect(178 + g.measureText(q.slice(0, n)).width, top + 47, 2, 24); }
      var rv = seg(t, 1.2, 1.5);
      g.globalAlpha = rv;
      txt(g, 'About 1,240 results (0.31 seconds)', 120, top + 120, 13, MUTED, 500);
      var hover = t > 1.95;
      [['Bakkerij Korrel · Fresh bread, ready at 7:30', 'bakkerijkorrel.nl', 'Order today, pick up tomorrow from 07:30. Sourdough, croissants and cakes. ★ 4.8 (312 reviews)'],
       ['Bakeries in Utrecht · the city guide', 'utrecht-guide.nl › food', 'Twelve neighbourhood bakeries worth crossing town for, from Lombok to Oudwijk.'],
       ['Where to buy sourdough in Utrecht (2026)', 'foodblog.nl › utrecht', 'We tasted 9 loaves. Here are the ones that made the cut.']].forEach(function (r, i) {
        var y = top + 160 + i * 110;
        if (i === 0) { box(g, 104, y - 26, 680, 100, 12, hover ? '#fff3eb' : '#ffffff'); circle(g, 132, y - 2, 12, '#c8742c'); txt(g, 'K', 132, y + 3, 13, '#ffffff', 800, SANS, 'center'); }
        txt(g, r[1], i === 0 ? 152 : 120, y + 2, 13, '#3c6e47', 500);
        txt(g, r[0], 120, y + 30, 23, i === 0 && hover ? '#c94f00' : '#1d4ed8', 600);
        if (i === 0 && hover) { g.fillStyle = '#c94f00'; g.font = '600 23px ' + SANS; g.fillRect(120, y + 34, g.measureText(r[0]).width, 2); }
        txt(g, r[2].length > 78 ? r[2].slice(0, 76) + '…' : r[2], 120, y + 58, 15, '#4a4d52', 400);
      });
      g.globalAlpha = 1;
      var m = seg(t, 1.4, 2.1); cx = lerp(860, 330, m); cy = lerp(560, top + 190, m); click = t - 2.2;
    } else if (t < 8.0) {
      // 2 · the landing page, then 3 · checkout
      g.drawImage(landC, 0, 0);
      if (t < 2.8) { g.fillStyle = 'rgba(255,255,255,' + (1 - seg(t, 2.5, 2.8)) + ')'; g.fillRect(0, 0, w, h); }
      var live = Math.round(19 + seg(t, 2.6, 4.5) * 4);
      box(g, w - 210, 56 + 40, 170, 30, 15, 'rgba(17,17,17,0.82)'); circle(g, w - 192, 111, 5, '#2bd17e'); txt(g, P.L(live + ' people browsing', live + ' mensen kijken nu'), w - 180, 116, 13, '#ffffff', 600);
      if (t < 5.0) { var m2 = seg(t, 2.9, 4.4); cx = lerp(500, 110, m2); cy = lerp(420, 344, m2); click = t - 4.55; }
      else {
        var o = seg(t, 5.0, 5.35);
        g.fillStyle = 'rgba(17,17,17,' + 0.45 * o + ')'; g.fillRect(0, 0, w, h);
        var px = w / 2 - 270, py = lerp(140, 76, o), pw = 540;
        g.globalAlpha = o;
        g.save(); g.shadowColor = 'rgba(0,0,0,0.25)'; g.shadowBlur = 30; box(g, px, py, pw, 470, 18, '#ffffff'); g.restore();
        txt(g, 'Your order', px + 32, py + 50, 24, INK, 750); txt(g, 'Pickup tomorrow · 07:30', px + pw - 32, py + 50, 14, MUTED, 500, SANS, 'right');
        [['korrel-1', 'Sourdough loaf', '€4.50'], ['korrel-2', 'Butter croissants (4)', '€6.80'], ['korrel-3', 'Dutch apple pie', '€18.50']].forEach(function (it, i) {
          var y = py + 78 + i * 64; g.fillStyle = LINE; g.fillRect(px + 32, y - 6, pw - 64, 1);
          if (!P.photo(g, it[0], px + 32, y + 4, 48, 48, 10)) box(g, px + 32, y + 4, 48, 48, 10, '#f1d9b8');
          txt(g, it[1], px + 96, y + 34, 17, INK, 550); txt(g, it[2], px + pw - 32, y + 34, 17, INK, 650, SANS, 'right');
        });
        g.fillStyle = INK; g.fillRect(px + 32, py + 276, pw - 64, 2);
        txt(g, 'Total', px + 32, py + 310, 19, INK, 700); txt(g, '€29.80', px + pw - 32, py + 310, 22, INK, 800, SANS, 'right');
        [['iDEAL', '#cc0066'], ['Card', '#3b82f6'], ['Apple Pay', '#111111']].forEach(function (pm, i) {
          var x = px + 32 + i * 162, on = i === 0;
          box(g, x, py + 330, 150, 44, 10, on ? '#fdf0f6' : '#ffffff'); stroke(g, x, py + 330, 150, 44, 10, on ? '#cc0066' : LINE, on ? 2.5 : 1.5);
          circle(g, x + 22, py + 352, 8, pm[1]); txt(g, pm[0], x + 38, py + 358, 15, INK, 600);
        });
        var paid = t > 7.25, busy = t > 6.95 && !paid;
        box(g, px + 32, py + 392, pw - 64, 52, 26, paid ? '#1a8f4e' : OR);
        if (busy) { for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2 + t * 8; circle(g, w / 2 + Math.cos(a) * 11, py + 418 + Math.sin(a) * 11, 2.6, 'rgba(17,17,17,' + (0.2 + k * 0.1) + ')'); } }
        else txt(g, paid ? 'Paid ✓' : 'Pay €29.80 with iDEAL', w / 2, py + 425, 18, paid ? '#ffffff' : INK, 750, SANS, 'center');
        g.globalAlpha = 1;
        var m3 = seg(t, 5.6, 6.7); cx = lerp(110, w / 2 + 60, m3); cy = lerp(344, py + 418, m3); click = t - 6.85;
      }
    } else {
      // 4 · the owner's side: order in, while they slept
      g.drawImage(landC, 0, 0);
      g.fillStyle = 'rgba(17,17,17,0.5)'; g.fillRect(0, 0, w, h);
      var o2 = seg(t, 8.0, 8.35), px2 = w / 2 - 230, py2 = 120;
      g.globalAlpha = o2;
      g.save(); g.shadowColor = 'rgba(0,0,0,0.25)'; g.shadowBlur = 30; box(g, px2, py2, 460, 300, 18, '#ffffff'); g.restore();
      circle(g, w / 2, py2 + 78, 38, '#1a8f4e');
      g.strokeStyle = '#ffffff'; g.lineWidth = 7; g.lineCap = 'round'; g.lineJoin = 'round';
      var ck = seg(t, 8.2, 8.6); g.beginPath(); g.moveTo(w / 2 - 16, py2 + 78); g.lineTo(w / 2 - 4, py2 + 90); if (ck > 0.5) g.lineTo(w / 2 - 4 + 22 * (ck - 0.5) * 2, py2 + 90 - 26 * (ck - 0.5) * 2); g.stroke(); g.lineCap = 'butt';
      txt(g, 'Order confirmed', w / 2, py2 + 160, 28, INK, 750, SANS, 'center');
      txt(g, 'Order #1043 · €29.80 · paid with iDEAL', w / 2, py2 + 196, 16, MUTED, 500, SANS, 'center');
      txt(g, 'Pick up tomorrow from 07:30', w / 2, py2 + 236, 18, '#c8742c', 650, SANS, 'center');
      g.globalAlpha = 1;
      // the owner's notification
      var n2 = seg(t, 8.5, 8.9), nx = lerp(w + 20, w - 380, n2);
      box(g, nx, 64, 360, 76, 16, 'rgba(17,17,17,0.92)'); box(g, nx + 16, 82, 40, 40, 10, OR); txt(g, '€', nx + 36, 110, 22, INK, 800, SANS, 'center');
      txt(g, 'New order #1043 · €29.80', nx + 70, 98, 16, '#ffffff', 700); txt(g, 'Bakkerij Korrel · iDEAL · now', nx + 70, 122, 13, '#9aa0aa', 500);
      // counters tick up
      var flip = t > 8.9;
      box(g, 40, h - 120, 214, 76, 14, '#ffffff'); txt(g, 'Orders today', 60, h - 90, 13, MUTED, 600); txt(g, flip ? '13' : '12', 60, h - 58, 26, INK, 800); if (flip) txt(g, '+1', 110, h - 58, 15, '#1a8f4e', 700);
      box(g, 268, h - 120, 214, 76, 14, '#ffffff'); txt(g, 'Revenue today', 288, h - 90, 13, MUTED, 600); txt(g, flip ? '€372.30' : '€342.50', 288, h - 58, 26, INK, 800);
      var cap = seg(t, 9.0, 9.4);
      g.globalAlpha = cap; box(g, w - 560, h - 100, 520, 58, 29, OR); txt(g, '23:14 · your website took this order while you slept', w - 300, h - 64, 17, INK, 750, SANS, 'center'); g.globalAlpha = 1;
      if (t > 10.5) { g.fillStyle = 'rgba(255,255,255,' + seg(t, 10.5, 11) + ')'; g.fillRect(0, 0, w, h); }
    }
    if (cx != null) pointer(g, cx, cy, click);
  }
  // the story is drawn full-size off screen, then a moving crop zooms in on the action
  var storyC = mk(SW, SH), storyG = storyC.getContext('2d');
  var ZOOM = [[0, 70, 30, 820], [2.3, 70, 30, 820], [2.75, 0, 40, 780], [4.8, 0, 90, 700], [5.3, 120, 56, 810], [7.6, 135, 64, 790], [8.1, 0, 0, 1024], [11, 0, 0, 1024]];
  function storyCompose(g, tt) {
    var t = tt % STORY_T, i = 0;
    while (i < ZOOM.length - 2 && t > ZOOM[i + 1][0]) i++;
    var a = ZOOM[i], b = ZOOM[i + 1], k = ez((t - a[0]) / Math.max(0.001, b[0] - a[0]));
    var rw = lerp(a[3], b[3], k), rh = rw * SH / SW, rx = lerp(a[1], b[1], k), ry = lerp(a[2], b[2], k);
    storyFrame(storyG, SW, SH, tt);
    g.clearRect(0, 0, SW, SH);
    g.drawImage(storyC, rx, ry, rw, rh, 0, 0, SW, SH);
  }
  SCREENS.story = function (g) { storyCompose(g, reduce ? 9.6 : storyClock); };
  // stills from the same story for the "-baar" words: found in search, paid with iDEAL
  SCREENS.search = function (g) { storyCompose(g, 2.2); };
  SCREENS.checkout = function (g) { storyCompose(g, 7.45); };
  // "Build a homepage": the sample business and mood the visitor picked
  var tryState = { key: 'korrel', mood: 'warm' };
  SCREENS.try = function (g, w, h) { g.clearRect(0, 0, w, h); P.screenMood(tryState.key, tryState.mood, g, w, h); };

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
    if (key === 'try') { P.phoneMood(tryState.key, tryState.mood, g, w, h); box(g, w / 2 - 52, 14, 104, 26, 13, '#000'); return; }
    if (key === 'old') {
      g.fillStyle = '#efe9d2'; g.fillRect(0, 44, w, h);
      g.save(); g.translate(0, 70); g.scale(w / SW, w / SW); SCREENS.old(g, SW, SH); g.restore();
      txt(g, 'Pinch to zoom…', w / 2, 330, 15, '#777777', 500, SANS, 'center');
      box(g, 24, h - 200, w - 48, 80, 16, '#ffffff'); stroke(g, 24, h - 200, w - 48, 80, 16, '#f2c4c4', 2);
      circle(g, 62, h - 160, 16, '#d64545'); txt(g, '✕', 62, h - 154, 16, '#ffffff', 800, SANS, 'center');
      txt(g, 'Not mobile-friendly', 92, h - 166, 17, INK, 700); txt(g, 'Text too small to read', 92, h - 142, 14, '#d64545', 500);
      return;
    }
    if (key === 'results') {
      var lg = g.createLinearGradient(0, 0, w, h); lg.addColorStop(0, '#ffb27a'); lg.addColorStop(0.55, '#ff7a29'); lg.addColorStop(1, '#c94f00');
      g.fillStyle = lg; g.fillRect(0, 44, w, h); box(g, w / 2 - 52, 14, 104, 26, 13, '#000');
      txt(g, 'Saturday 14 June', w / 2, 110, 16, 'rgba(255,255,255,0.9)', 600, SANS, 'center');
      txt(g, '09:41', w / 2, 186, 72, '#ffffff', 300, SANS, 'center');
      NOTES.slice(0, 4).forEach(function (n, i) {
        var y = 240 + i * 96; box(g, 16, y, w - 32, 84, 18, 'rgba(255,255,255,0.88)');
        box(g, 30, y + 16, 38, 38, 10, n[1]); txt(g, n[0], 49, y + 42, 18, '#ffffff', 800, SANS, 'center');
        txt(g, n[2], 80, y + 34, 15, INK, 700); txt(g, n[3], 80, y + 58, 14, '#4a4d52', 500); txt(g, 'now', w - 30, y + 32, 12, '#6a6e75', 500, SANS, 'right');
      });
      return;
    }
    if (key.indexOf('work-') === 0) { P.phone(g, w, h, key.slice(5), title); return; }
    circle(g, 34, 80, 9, OR); txt(g, 'Ace 360', 52, 87, 18, fg, 700);
    txt(g, P.L('See an', 'Je ziet een'), 24, 200, 34, fg, 700); txt(g, P.L('estimate', 'prijsindicatie'), 24, 242, 34, ORD, 700); txt(g, 'before we call.', 24, 284, 34, fg, 700);
    box(g, 24, 320, w - 48, 52, 10, OR); txt(g, 'Get my estimate →', w / 2, 352, 17, INK, 700, SANS, 'center');
    box(g, 24, 400, w - 48, 200, 16, INK); txt(g, '€1,200 – €1,600', 44, 460, 26, '#ffffff', 700); g.fillStyle = OR; g.fillRect(44, 474, 40, 4);
  }

  /* ---------- floating website cards ---------- */
  var CARD_W = 1.0, CARD_H = 0.62;
  var CARDS = [
    function (g, w, h) { txt(g, 'ESTIMATE', 34, 70, 22, MUTED, 600, MONO); txt(g, '€2,240', 34, 170, 92, INK, 750); g.fillStyle = OR; g.fillRect(34, 196, 90, 8); txt(g, 'Launch · 28 May', 34, 260, 26, MUTED, 500); },
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
  // studio environment: soft white light boxes and one warm orange bounce, so
  // metal, glass and ceramic pick up real reflections as the camera moves
  var envC = mk(1024, 512), eg = envC.getContext('2d');
  var egr = eg.createLinearGradient(0, 0, 0, 512);
  egr.addColorStop(0, '#ffffff'); egr.addColorStop(0.46, '#eef0f3'); egr.addColorStop(0.54, '#c9cdd3'); egr.addColorStop(1, '#7d828b');
  eg.fillStyle = egr; eg.fillRect(0, 0, 1024, 512);
  eg.filter = 'blur(14px)';
  [[150, 70, 230, 110, '#ffffff'], [470, 40, 300, 90, '#ffffff'], [820, 90, 120, 150, '#ffd0ab'], [40, 300, 160, 40, '#ffffff'], [600, 290, 220, 30, '#ffe7d6']].forEach(function (b) {
    eg.fillStyle = b[4]; eg.fillRect(b[0], b[1], b[2], b[3]);
  });
  eg.filter = 'none';
  var envTex = new THREE.CanvasTexture(envC);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  envTex.encoding = THREE.sRGBEncoding;
  var pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(envTex).texture;
  pmrem.dispose(); envTex.dispose();

  var alu = new THREE.MeshStandardMaterial({ color: col('#d9dbdf'), roughness: 0.3, metalness: 0.55, envMapIntensity: 0.9 });
  var aluDark = new THREE.MeshStandardMaterial({ color: col('#bfc2c8'), roughness: 0.34, metalness: 0.5, envMapIntensity: 0.9 });
  var bezel = new THREE.MeshStandardMaterial({ color: col('#0e0f12'), roughness: 0.2, metalness: 0.1 });
  var phoneMat = new THREE.MeshPhysicalMaterial({ color: col('#1b1c20'), roughness: 0.28, metalness: 0.6, clearcoat: 1, clearcoatRoughness: 0.15 });
  // glass sheen over both screens: adds the studio reflections on top of the picture
  var glassMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.06, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false });
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
  var screenGlass = new THREE.Mesh(screen.geometry, glassMat);
  screenGlass.position.set(0, LIDH / 2 + 0.03, 0.034);
  lidG.add(screenGlass);
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
  var phoneGlass = new THREE.Mesh(phoneScreen.geometry, glassMat);
  phoneGlass.position.z = 0.038;
  phone.add(phoneGlass);
  var PHONE_FLAT_P = new THREE.Vector3(2.55, 0.035, 0.75);
  var PHONE_FLAT_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, -0.35));
  var PHONE_UP_P = new THREE.Vector3(2.35, 1.25, 0.9);
  var PHONE_UP_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.12, -0.42, 0.04));
  var PHONE_LEFT_P = new THREE.Vector3(-2.2, 1.2, 1.25);
  var PHONE_LEFT_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.1, 0.45, -0.04));

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

  /* ---------- desk props: mug with steam, notebook with the brief, pen ---------- */
  var ceramic = new THREE.MeshPhysicalMaterial({ color: col('#fbfbfa'), roughness: 0.22, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08 });
  var orangeMat = new THREE.MeshStandardMaterial({ color: col(OR), roughness: 0.35, metalness: 0.05 });
  var mug = new THREE.Group();
  var mugPts = [[0, 0], [0.2, 0], [0.225, 0.012], [0.24, 0.06], [0.25, 0.5], [0.24, 0.515], [0.228, 0.5], [0.218, 0.08], [0, 0.075]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
  var mugBody = new THREE.Mesh(new THREE.LatheGeometry(mugPts, 48), ceramic);
  mugBody.castShadow = true; mugBody.receiveShadow = true; mug.add(mugBody);
  var band = new THREE.Mesh(new THREE.CylinderGeometry(0.2535, 0.2505, 0.06, 48, 1, true), orangeMat);
  band.position.y = 0.3; mug.add(band);
  var handle = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.028, 14, 28, Math.PI), ceramic);
  handle.rotation.z = -Math.PI / 2; handle.position.set(0.245, 0.28, 0); handle.castShadow = true; mug.add(handle);
  var coffee = new THREE.Mesh(new THREE.CircleGeometry(0.22, 40), new THREE.MeshStandardMaterial({ color: col('#3a2314'), roughness: 0.12, metalness: 0 }));
  coffee.rotation.x = -Math.PI / 2; coffee.position.y = 0.43; mug.add(coffee);
  mug.position.set(-2.35, 0, -1.5); mug.rotation.y = 0.5;
  scene.add(mug);

  // steam: soft sprites rising and fading above the mug
  var steamC = mk(128, 128), stg = steamC.getContext('2d');
  var srg = stg.createRadialGradient(64, 64, 4, 64, 64, 62); srg.addColorStop(0, 'rgba(255,255,255,1)'); srg.addColorStop(1, 'rgba(255,255,255,0)');
  stg.fillStyle = srg; stg.fillRect(0, 0, 128, 128);
  var steamTex = new THREE.CanvasTexture(steamC);
  var steam = [];
  for (var si = 0; si < (mobile ? 8 : 14); si++) {
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, color: new THREE.Color('#aab0b8'), transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
    sp.userData = { o: si / 14, s: si * 1.7 };
    scene.add(sp); steam.push(sp);
  }

  // open notebook: the client's brief on the left page, a wireframe sketch on the right
  var bookC = mk(1024, 700), bk = bookC.getContext('2d'), HAND = 'italic 500 30px Georgia, "Times New Roman", serif', bookTex = null;
  function paintBook() {
  bk.fillStyle = '#fbfaf6'; bk.fillRect(0, 0, 1024, 700);
  bk.fillStyle = 'rgba(80,120,200,0.18)'; for (var ly = 90; ly < 700; ly += 44) { bk.fillRect(30, ly, 452, 2); bk.fillRect(542, ly, 452, 2); }
  bk.fillStyle = 'rgba(214,69,69,0.35)'; bk.fillRect(78, 0, 2, 700);
  var grad = bk.createLinearGradient(452, 0, 572, 0); grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(0.5, 'rgba(0,0,0,0.12)'); grad.addColorStop(1, 'rgba(0,0,0,0)'); bk.fillStyle = grad; bk.fillRect(452, 0, 120, 700);
  bk.font = 'italic 700 38px Georgia, serif'; bk.fillStyle = '#1d2b4f'; bk.fillText(P.L('New website!', 'Nieuwe website!'), 96, 76);
  (P.isNL() ? ['• online boekingen', '• iDEAL-betalingen', '• Nederlands + Engels', '• werkt op mobiel', '• zelf aanpassen', '• budget ± €2k?'] : ['• online bookings', '• iDEAL payments', '• Dutch + English', '• works on phones', '• I can edit it myself', '• budget ± €2k?']).forEach(function (l, i) { bk.font = HAND; bk.fillStyle = '#24315e'; bk.fillText(l, 96, 128 + i * 44); });
  bk.strokeStyle = OR; bk.lineWidth = 4; bk.beginPath(); bk.ellipse(250, 340, 160, 30, -0.03, 0, Math.PI * 2); bk.stroke();
  bk.strokeStyle = '#24315e'; bk.lineWidth = 3; bk.lineJoin = 'round';
  bk.strokeRect(580, 70, 380, 520); bk.strokeRect(600, 92, 120, 30); bk.strokeRect(840, 92, 100, 30);
  bk.strokeRect(600, 150, 340, 150); bk.beginPath(); bk.moveTo(600, 150); bk.lineTo(940, 300); bk.moveTo(940, 150); bk.lineTo(600, 300); bk.stroke();
  [0, 1, 2].forEach(function (i) { bk.strokeRect(600 + i * 118, 330, 104, 130); });
  bk.fillStyle = 'rgba(255,106,0,0.85)'; bk.fillRect(600, 490, 170, 44);
  bk.font = 'italic 600 26px Georgia, serif'; bk.fillStyle = '#ffffff'; bk.fillText(P.L('Book now', 'Boek nu'), 624, 520);
    if (bookTex) bookTex.needsUpdate = true;
  }
  paintBook();
  var notebook = new THREE.Group();
  var cover = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.03, 1.12), new THREE.MeshStandardMaterial({ color: col('#1d2433'), roughness: 0.7 }));
  cover.position.y = 0.015; cover.castShadow = true; cover.receiveShadow = true; notebook.add(cover);
  bookTex = toTex(bookC);
  var pages = new THREE.Mesh(new THREE.PlaneGeometry(1.56, 1.06), new THREE.MeshStandardMaterial({ map: bookTex, roughness: 0.92 }));
  pages.rotation.x = -Math.PI / 2; pages.position.y = 0.032; pages.receiveShadow = true; notebook.add(pages);
  var pen = new THREE.Group();
  var penBody = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.9, 16), orangeMat); penBody.rotation.z = Math.PI / 2; pen.add(penBody);
  var penTip = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.08, 16), new THREE.MeshStandardMaterial({ color: col('#2b2d31'), metalness: 0.6, roughness: 0.3 }));
  penTip.rotation.z = Math.PI / 2; penTip.position.x = 0.49; pen.add(penTip);
  pen.children.forEach(function (m) { m.castShadow = true; });
  pen.position.set(0.25, 0.06, 0.38); pen.rotation.y = 0.5; notebook.add(pen);
  notebook.position.set(2.75, 0, -1.25); notebook.rotation.y = -0.32;
  scene.add(notebook);


  /* ---------- desk lamp: decoration by day, the main light at night ---------- */
  var lampInk = new THREE.MeshStandardMaterial({ color: col('#1c1d21'), roughness: 0.35, metalness: 0.5 });
  var lamp = new THREE.Group();
  var UP = new THREE.Vector3(0, 1, 0);
  function rod(a, b, r) {
    var d = new THREE.Vector3().subVectors(b, a), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 14), lampInk);
    m.position.copy(a).addScaledVector(d, 0.5); m.scale.y = d.length(); m.quaternion.setFromUnitVectors(UP, d.normalize());
    m.castShadow = true; lamp.add(m); return m;
  }
  var L_BASE = new THREE.Vector3(-3.35, 0.06, -2.45), L_JOINT = new THREE.Vector3(-3.05, 1.8, -2.15), L_HEAD = new THREE.Vector3(-2.25, 2.3, -1.45), L_AIM = new THREE.Vector3(-0.9, 0, 0.3);
  var lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.06, 40), lampInk);
  lampBase.position.set(L_BASE.x, 0.03, L_BASE.z); lampBase.castShadow = true; lampBase.receiveShadow = true; lamp.add(lampBase);
  rod(L_BASE, L_JOINT, 0.028); rod(L_JOINT, L_HEAD, 0.024);
  var lampJoint = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), orangeMat); lampJoint.position.copy(L_JOINT); lamp.add(lampJoint);
  var aimDir = new THREE.Vector3().subVectors(L_AIM, L_HEAD).normalize();
  var shadeQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), aimDir);
  var shadeOut = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.42, 36, 1, true), lampInk);
  shadeOut.quaternion.copy(shadeQ); shadeOut.position.copy(L_HEAD).addScaledVector(aimDir, 0.12); shadeOut.castShadow = true; lamp.add(shadeOut);
  var shadeInMat = new THREE.MeshStandardMaterial({ color: col('#ffe3c7'), emissive: col('#ffb36b'), emissiveIntensity: 0, side: THREE.BackSide, roughness: 0.6 });
  var shadeIn = new THREE.Mesh(shadeOut.geometry, shadeInMat); shadeIn.quaternion.copy(shadeQ); shadeIn.position.copy(shadeOut.position); shadeIn.scale.setScalar(0.97); lamp.add(shadeIn);
  var bulbMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff4e6'), toneMapped: false });
  var bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), bulbMat); bulb.position.copy(L_HEAD).addScaledVector(aimDir, 0.22); lamp.add(bulb);
  var lampLight = new THREE.SpotLight(col('#ffc48a'), 0, 16, 0.72, 0.75, 1.1);
  lampLight.position.copy(bulb.position); lampLight.target.position.copy(L_AIM);
  scene.add(lampLight); scene.add(lampLight.target);
  scene.add(lamp);
  // the warm pool the lamp throws on the desk (seen against the dark page)
  var poolC = mk(256, 256), plg = poolC.getContext('2d');
  var prg = plg.createRadialGradient(128, 128, 0, 128, 128, 128); prg.addColorStop(0, 'rgba(255,190,120,0.55)'); prg.addColorStop(0.45, 'rgba(255,160,90,0.18)'); prg.addColorStop(1, 'rgba(255,150,80,0)');
  plg.fillStyle = prg; plg.fillRect(0, 0, 256, 256);
  var pool = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(poolC), transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
  pool.rotation.x = -Math.PI / 2; pool.position.set(L_AIM.x - 0.3, 0.004, L_AIM.z - 0.4);
  scene.add(pool);


  /* ---------- "Build a homepage": the screen comes apart in four strips and rebuilds ---------- */
  var STRIPS = 4, stripH = screen.geometry.parameters.height / STRIPS, stripW = screen.geometry.parameters.width;
  var strips = [];
  for (var si3 = 0; si3 < STRIPS; si3++) {
    var sc3 = mk(1024, 160), sm3 = new THREE.Mesh(new THREE.PlaneGeometry(stripW, stripH), new THREE.MeshBasicMaterial({ map: toTex(sc3), toneMapped: false, transparent: true, side: THREE.DoubleSide }));
    sm3.userData = { c: sc3, y0: screen.position.y + stripW * SH / SW / 2 - stripH / 2 - si3 * stripH, i: si3 };
    sm3.visible = false; sm3.castShadow = true; lidG.add(sm3); strips.push(sm3);
  }
  function sliceInto(src) { strips.forEach(function (m, i) { var g = m.userData.c.getContext('2d'); g.clearRect(0, 0, 1024, 160); g.drawImage(src, 0, i * 160, 1024, 160, 0, 0, 1024, 160); m.material.map.needsUpdate = true; }); }
  var tryFx = { v: 0 }, tryC = mk(SW, SH);
  function rebuild(key, mood) {
    var go = function () { tryState.key = key; tryState.mood = mood; if (current.indexOf('try|') === 0) paintScreen('try'); };
    if (!window.gsap || reduce || current.indexOf('try|') !== 0) { go(); return; }
    window.gsap.killTweensOf(tryFx);
    sliceInto(screenC);
    window.gsap.timeline()
      .to(tryFx, { v: 1, duration: 0.7, ease: 'power2.in' })
      .add(function () {
        tryState.key = key; tryState.mood = mood;
        var g = tryC.getContext('2d'); SCREENS.try(g, SW, SH); sliceInto(tryC);
        sg.clearRect(0, 0, SW, SH); sg.drawImage(tryC, 0, 0); screenTex.needsUpdate = true;
        paintPhoneNow('try'); buzz = 1;
      })
      .to(tryFx, { v: 0, duration: 1.1, ease: 'power3.out' });
  }
  document.addEventListener('ace360:try', function (e) { var d = e.detail || {}; rebuild(d.key || tryState.key, d.mood || tryState.mood); });

  /* ---------- sticky notes on the laptop: what the client is fed up with ---------- */
  var STICKY = [
    { c: '#ffe066', lines: ['Looks old', 'on phones'], nl: ['Oud op', 'je mobiel'], p: [-1.05, LIDH + 0.08, 0.05], r: 0.1 },
    { c: '#ffc078', lines: ['Nobody', 'books online'], nl: ['Niemand', 'boekt online'], p: [0.75, LIDH + 0.1, 0.05], r: -0.08 },
    { c: '#d0ebff', lines: ['New price =', 'wait a week'], nl: ['Nieuwe prijs =', 'week wachten'], p: [LW / 2 + 0.12, 1.45, 0.05], r: -0.06 }
  ];
  var stickyGeo = new THREE.PlaneGeometry(0.5, 0.5);
  var stickies = STICKY.map(function (n) {
    var c = mk(256, 256);
    var m = new THREE.Mesh(stickyGeo, new THREE.MeshStandardMaterial({ map: toTex(c), roughness: 0.85, side: THREE.DoubleSide }));
    m.userData = { n: n, c: c, solved: -1 };
    m.position.set(n.p[0], n.p[1], n.p[2]); m.rotation.z = n.r; m.castShadow = true;
    lidG.add(m);
    return m;
  });
  function paintSticky(m, solved) {
    var g = m.userData.c.getContext('2d'), n = m.userData.n;
    g.fillStyle = n.c; g.fillRect(0, 0, 256, 256);
    var sh = g.createLinearGradient(0, 0, 0, 256); sh.addColorStop(0, 'rgba(0,0,0,0.08)'); sh.addColorStop(0.25, 'rgba(0,0,0,0)'); g.fillStyle = sh; g.fillRect(0, 0, 256, 256);
    (P.isNL() ? n.nl : n.lines).forEach(function (l, i) { g.font = 'italic 600 ' + (P.isNL() ? 30 : 34) + 'px Georgia, serif'; g.fillStyle = '#2b2b2b'; g.fillText(l, 22, 104 + i * 46); });
    if (solved) {
      g.strokeStyle = 'rgba(17,17,17,0.75)'; g.lineWidth = 5; g.beginPath(); g.moveTo(16, 96); g.lineTo(236, 148); g.stroke();
      circle(g, 206, 52, 30, OR); g.strokeStyle = '#ffffff'; g.lineWidth = 7; g.lineCap = 'round'; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(192, 52); g.lineTo(203, 63); g.lineTo(222, 41); g.stroke(); g.lineCap = 'butt';
    }
    m.material.map.needsUpdate = true;
  }
  stickies.forEach(function (m) { paintSticky(m, false); m.userData.solved = 0; });

  /* ---------- notifications that pop out of the phone after launch ---------- */
  var NW = 1.3, NH = 0.325;
  var noteGeo = new THREE.PlaneGeometry(NW, NH);
  function paintNote(n) {
    var c = mk(640, 160), g = c.getContext('2d');
    g.clearRect(0, 0, 640, 160);
    g.save(); g.shadowColor = 'rgba(17,17,17,0.18)'; g.shadowBlur = 18; g.shadowOffsetY = 6;
    box(g, 14, 10, 612, 132, 30, '#ffffff'); g.restore();
    stroke(g, 14, 10, 612, 132, 30, 'rgba(17,17,17,0.06)', 2);
    box(g, 38, 36, 80, 80, 20, n[1]); txt(g, n[0], 78, 92, 40, '#ffffff', 800, SANS, 'center');
    txt(g, n[2], 140, 70, 30, INK, 700); txt(g, n[3], 140, 110, 25, '#4a4d52', 500);
    txt(g, 'now', 600, 64, 22, '#8a8e95', 500, SANS, 'right');
    return toTex(c);
  }
  var notes = NOTES.map(function (n, i) {
    var m = new THREE.Mesh(noteGeo, new THREE.MeshBasicMaterial({ map: paintNote(n), transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    m.userData = { i: i, shown: false };
    m.renderOrder = 5;
    scene.add(m);
    return m;
  });
  // orange ring that pulses out of the phone when a notification arrives
  var rings = [0, 1, 2].map(function () {
    var r = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.19, 48), new THREE.MeshBasicMaterial({ color: col(OR), transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
    r.userData.age = 1; scene.add(r); return r;
  });
  var ringNext = 0;

  /* ---------- floor, lights, dust ---------- */
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.13 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  var hemi = new THREE.HemisphereLight(0xffffff, col('#dfe2e6'), 0.6);
  scene.add(hemi);
  var key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(-4, 9, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  key.shadow.camera.left = -8; key.shadow.camera.right = 8; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  key.shadow.camera.near = 1; key.shadow.camera.far = 30; key.shadow.bias = -0.0005; key.shadow.radius = 6;
  scene.add(key);
  var fill = new THREE.DirectionalLight(0xffffff, 0.3);
  fill.position.set(6, 3, 5);
  scene.add(fill);
  var screenLight = new THREE.PointLight(col('#ffd2b0'), 0, 6, 2);
  scene.add(screenLight);

  var DUST = mobile ? 220 : 420;
  var dpos = new Float32Array(DUST * 3), seed = 360;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  for (var di = 0; di < DUST; di++) { dpos[di * 3] = (rnd() - 0.5) * 16; dpos[di * 3 + 1] = rnd() * 6; dpos[di * 3 + 2] = (rnd() - 0.5) * 12; }
  var dgeo = new THREE.BufferGeometry(); dgeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  var dustMat = new THREE.PointsMaterial({ color: col('#9aa0aa'), size: 0.035, map: steamTex, transparent: true, opacity: 0.4, depthWrite: false });
  var dust = new THREE.Points(dgeo, dustMat);
  scene.add(dust);

  /* ---------- keyframes ---------- */
  var BASE = { cx: -3.2, cy: 2.5, cz: 6.4, tx: 0.2, ty: 0.95, tz: -0.4, side: 1, lid: 1, fly: 0, gather: 0, paper: 0, lay: 0, phone: 0, nophone: 0, explode: 0, glow: 0.7, orbit: 0, dust: 0.5, keyI: 1.3, hemiI: 0.6, notes: 0, solved: 0, notify: 0, steam: 1, phoneL: 0, spin: 0, props: 1 };
  var SEQ = [
    ['hero', {}],
    ['pain', { props: 1, side: -1, cx: -0.4, cy: 2.3, cz: 6.9, tx: 0.35, ty: 1.15, tz: -0.1, notes: 1, phone: 1, phoneL: 1, glow: 0.3, dust: 0.3, keyI: 1.1 }],
    ['fix', { side: 1, cx: 3.4, cy: 2.4, cz: 6.4, tx: 1.1, ty: 1.2, tz: 0.1, phoneL: 0, notes: 1, solved: 1, phone: 1, notify: 1, glow: 1.25, dust: 0.6, keyI: 1.3 }],
    ['try', { side: 1, cx: 2.6, cy: 1.9, cz: 5.3, tx: 0.55, ty: 1.15, tz: -0.4, notes: 0, solved: 0, notify: 0, phone: 1, phoneL: 0, glow: 1.25, dust: 0.5, props: 1 }],
    ['services', { side: -1, cx: 3.9, cy: 3.4, cz: 6.6, tx: -0.3, ty: 1.2, tz: -0.2, fly: 1, orbit: 1, notes: 0, notify: 0, phone: 0, glow: 0.7, dust: 0.5 }],
    ['quote', { side: 1, cx: 4.6, cy: 2.8, cz: 5.6, tx: 1.9, ty: 1.0, tz: 0.1, fly: 1, gather: 1, paper: 1, orbit: 0, nophone: 1 }],
    ['process', { side: -1, cx: 0.6, cy: 6.6, cz: 5.6, tx: 0, ty: 0.2, tz: 0, lid: 0, gather: 1, paper: 0, glow: 0, dust: 0.35, nophone: 1 }],
    ['s1', { side: 1, cx: 3.6, cy: 2.0, cz: 4.4, tx: 2.1, ty: 0.9, tz: 0.4, phone: 1, nophone: 0, lid: 0.12 }],
    ['s2', { side: -1, cx: -2.4, cy: 4.6, cz: 3.8, tx: -1.6, ty: 0.2, tz: 0.6, phone: 0, paper: 1, lay: 1, lid: 0.55, glow: 0.4 }],
    ['s3', { side: 1, cx: -1.2, cy: 2.1, cz: 5.2, tx: 0.1, ty: 1.15, tz: -0.6, paper: 0, lay: 0, lid: 1, glow: 0.8 }],
    ['s4', { side: -1, cx: 4.6, cy: 2.6, cz: 3.6, tx: 0, ty: 1.15, tz: -0.6, explode: 1, glow: 0.9 }],
    ['s5', { side: 1, cx: -3.6, cy: 2.8, cz: 6.2, tx: 0.2, ty: 1.1, tz: -0.4, explode: 0, gather: 0, fly: 1, orbit: 1, glow: 1.3, dust: 0.7 }],
    ['demo', { side: 1, cx: 4.8, cy: 5.2, cz: 9.5, tx: 1.4, ty: 0.6, tz: -0.4, fly: 0.0, orbit: 0, glow: 0.8, dust: 0.4, notify: 0 }],
    ['work', { side: 1, cx: 3.2, cy: 1.9, cz: 5.4, tx: 0.9, ty: 1.0, tz: -0.2, phone: 1, glow: 1 }],
    ['more', { side: 0, cx: -0.8, cy: 8.2, cz: 5.2, tx: 0, ty: 0.3, tz: 0, phone: 0, nophone: 1, fly: 1, orbit: 1, glow: 0.8, dust: 0.45 }],
    ['faq', { side: 0, cx: 0.4, cy: 9.5, cz: 3.6, tx: 0.2, ty: 0, tz: 0, fly: 0, orbit: 0, glow: 0.6, dust: 0.3 }],
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
  function paintTo(g, key, title, img) {
    g.clearRect(0, 0, SW, SH);
    if (img) {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, SW, SH);
      var t = chrome(g, SW, (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com', false);
      var s = SW / img.width;
      g.drawImage(img, 0, t, SW, img.height * s);
    } else {
      (SCREENS[key] || SCREENS.ace)(g, SW, SH, title);
    }
  }
  function paintPhoneNow(key, title) { paintPhone(pg, 360, 740, key, title); phoneTex.needsUpdate = true; }
  function paintScreen(key, title, img) {
    paintTo(sg, key, title, img);
    screenTex.needsUpdate = true;
    paintPhoneNow(key, title);
  }
  // new screens are "rebuilt" over the old one: an orange scan line sweeps left to right
  var prevC = mk(SW, SH), prevG = prevC.getContext('2d'), nextC = mk(SW, SH), nextG = nextC.getContext('2d');
  var wipe = { v: 1 };
  function drawWipe() {
    var x = Math.round(SW * wipe.v);
    sg.clearRect(0, 0, SW, SH);
    sg.drawImage(prevC, 0, 0);
    if (x > 0) sg.drawImage(nextC, 0, 0, x, SH, 0, 0, x, SH);
    if (wipe.v < 1) {
      var gl = sg.createLinearGradient(x - 90, 0, x, 0); gl.addColorStop(0, 'rgba(255,106,0,0)'); gl.addColorStop(1, 'rgba(255,106,0,0.35)');
      sg.fillStyle = gl; sg.fillRect(x - 90, 0, 90, SH);
      sg.fillStyle = OR; sg.fillRect(x - 3, 0, 6, SH);
    }
    screenTex.needsUpdate = true;
  }
  function setScreen(key, imageUrl, title) {
    var id = key + '|' + (imageUrl || '') + '|' + (title || '');
    if (id === current) return;
    current = id;
    function apply(img) {
      if (!window.gsap || reduce) { paintScreen(key, title, img); return; }
      window.gsap.killTweensOf(wipe);
      prevG.clearRect(0, 0, SW, SH); prevG.drawImage(screenC, 0, 0);
      paintTo(nextG, key, title, img);
      wipe.v = 0;
      window.gsap.to(wipe, { v: 1, duration: 0.95, ease: 'power2.inOut', onUpdate: drawWipe, onComplete: drawWipe });
      window.gsap.delayedCall(0.3, function () { paintPhoneNow(key, title); });
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
  paintScreen('story');
  current = 'story||';
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      var p = current.split('|'); current = ''; setScreen(p[0], p[1], p[2]);
      paintQuote();
      cards.forEach(function (c, i) { c.material.map.dispose(); c.material.map = cardTexture(CARDS[i]); c.material.needsUpdate = true; });
      notes.forEach(function (m) { m.material.map.dispose(); m.material.map = paintNote(NOTES[m.userData.i]); m.material.needsUpdate = true; });
    });
  }
  // the language switch repaints every Ace screen, the notes, notifications and notebook
  document.addEventListener('ace360:lang', function () {
    paintLanding(); paintBook();
    stickies.forEach(function (m) { paintSticky(m, !!m.userData.solved); });
    notes.forEach(function (m) { m.material.map.dispose(); m.material.map = paintNote(NOTES[m.userData.i]); m.material.needsUpdate = true; });
    var p = current.split('|');
    if (!p[1]) { window.gsap && window.gsap.killTweensOf(wipe); wipe.v = 1; paintScreen(p[0], p[2]); }
  });
  // product photos arrive after page load: repaint whatever is on the laptop and phone now
  P.onPhotos(function () {
    var p = current.split('|');
    if (!p[1]) { window.gsap && window.gsap.killTweensOf(wipe); wipe.v = 1; paintScreen(p[0], p[2]); }
  });
  window.ACE360_FILM = { setScreen: setScreen, measure: measure, storyAt: function (canvas, t) { storyCompose(canvas.getContext('2d'), t); },
    // freeze the rebuild at a point (0–1) for checking: ACE360_FILM.tryAt(0.6)
    // paint any laptop / phone screen into a canvas (used by the marketing reels)
    screenAt: function (canvas, key) { paintTo(canvas.getContext('2d'), key); },
    phoneAt: function (canvas, key) { paintPhone(canvas.getContext('2d'), 360, 740, key); },
    tryAt: function (v) { if (window.gsap) window.gsap.killTweensOf(tryFx); sliceInto(screenC); tryFx.v = v; } };

  /* ---------- day / night ---------- */
  var night = { v: root.getAttribute('data-theme') === 'night' ? 1 : 0 }, lastNight = -1;
  document.addEventListener('ace360:theme', function (e) {
    var to = e.detail && e.detail.night ? 1 : 0;
    if (window.gsap && !reduce) window.gsap.to(night, { v: to, duration: 1.6, ease: 'power2.inOut', overwrite: true });
    else night.v = to;
  });
  var envMats = [];
  scene.traverse(function (o) { if (o.material && o.material.envMapIntensity !== undefined && envMats.indexOf(o.material) < 0) { envMats.push(o.material); o.material.userData.env = o.material.envMapIntensity; } });
  var DAY_KEY = new THREE.Color(0xffffff), MOON_KEY = col('#8fa6d9'), DAY_SKY = new THREE.Color(0xffffff), NIGHT_SKY = col('#3a4560');
  var DUST_DAY = col('#9aa0aa'), DUST_NIGHT = col('#ffb26b'), STEAM_DAY = new THREE.Color('#aab0b8'), STEAM_NIGHT = new THREE.Color('#d8dce2');
  function applyNight(nt) {
    renderer.toneMappingExposure = 1.05 - nt * 0.2;
    key.color.copy(DAY_KEY).lerp(MOON_KEY, nt);
    hemi.color.copy(DAY_SKY).lerp(NIGHT_SKY, nt);
    fill.intensity = 0.3 * (1 - nt * 0.7);
    envMats.forEach(function (m) { m.envMapIntensity = m.userData.env * (1 - nt * 0.8); });
    cards.forEach(function (c) { c.material.emissiveIntensity = 0.06 + nt * 0.32; });
    // lamp light and its pool are set every frame (they also follow the props fade)
    shadeInMat.emissiveIntensity = nt * 1.4;
    bulbMat.color.setRGB(1, 0.96 - (1 - nt) * 0.1, 0.9 - (1 - nt) * 0.2);
    floor.material.opacity = 0.13 + nt * 0.3;
    dustMat.color.copy(DUST_DAY).lerp(DUST_NIGHT, nt);
    dustMat.size = 0.035 + nt * 0.03;
    steam.forEach(function (sp) { sp.material.color.copy(STEAM_DAY).lerp(STEAM_NIGHT, nt); });
  }

  /* ---------- pointer: parallax, hover hints and clicks on the 3D objects ---------- */
  var ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  var fine = window.matchMedia('(pointer: fine)').matches;
  var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(-9, -9), over = false, hot = '', shownHot = '';
  var hv = { laptop: 0, phone: 0, mug: 0, notebook: 0, notes: 0, notify: 0, lamp: 0 };
  var telLink = document.querySelector('a[href^="tel:"]');
  var PICK = {
    laptop: { en: 'Get my estimate', nl: 'Bekijk mijn prijsindicatie', href: '#prijs' },
    phone: { en: 'Call now', nl: 'Bel nu', href: telLink ? telLink.getAttribute('href') : '#contact' },
    mug: { en: 'Coffee and a chat? Get in touch', nl: 'Koffie en een praatje? Neem contact op', href: '#contact' },
    notebook: { en: 'See how a project runs', nl: 'Zo verloopt een project', href: '#werkwijze' },
    notes: { en: 'All fixable. See how', nl: 'Allemaal op te lossen. Zo werkt het', href: '#resultaat' },
    notify: { en: 'I want this too', nl: 'Dit wil ik ook', href: '#contact' },
    lamp: { en: 'Lights off: night mode', nl: 'Licht uit: nachtmodus', en2: 'Lights on: day mode', nl2: 'Licht aan: dagmodus', href: '' }
  };
  function tag(obj, key) { obj.traverse(function (o) { if (o.isMesh) o.userData.pick = key; }); }
  tag(laptop, 'laptop'); tag(phone, 'phone'); tag(mug, 'mug'); tag(notebook, 'notebook'); tag(lamp, 'lamp');
  stickies.forEach(function (m) { m.userData.pick = 'notes'; });
  notes.forEach(function (m) { m.userData.pick = 'notify'; });
  var pickables = [];
  [laptop, phone, mug, notebook, lamp].concat(notes).forEach(function (o) { o.traverse(function (m) { if (m.isMesh) pickables.push(m); }); });
  function shown(o) { while (o) { if (!o.visible || o.scale.x < 0.2) return false; o = o.parent; } return true; }
  function blocked(el) { return !el || !el.closest || !!el.closest('a,button,input,select,textarea,label,summary,details,dialog,.copy,.band,.sec-head,.site-header,.site-footer,.fab-call,.stage-tip'); }
  var tip = document.createElement('div');
  tip.className = 'stage-tip'; tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    ptr.x = e.clientX / W - 0.5; ptr.y = e.clientY / H - 0.5;
    ndc.set(e.clientX / W * 2 - 1, -(e.clientY / H) * 2 + 1);
    over = fine && !blocked(e.target);
    tip.style.left = e.clientX + 'px'; tip.style.top = e.clientY + 'px';
  }, { passive: true });
  document.addEventListener('pointerleave', function () { over = false; });
  window.addEventListener('scroll', function () { over = false; }, { passive: true });
  function go(href) {
    if (href.indexOf('tel:') === 0) { window.location.href = href; return; }
    var a = document.querySelector('.site-main a[href="' + href + '"]');
    if (a) { a.click(); return; }
    var el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  window.addEventListener('click', function (e) {
    if (!fine || !hot || blocked(e.target)) return;
    if (hot === 'lamp') { if (window.ACE360_THEME) window.ACE360_THEME.set(!window.ACE360_THEME.isNight(), { x: e.clientX, y: e.clientY }); shownHot = ''; return; }
    go(PICK[hot].href);
  });
  function hoverTest() {
    hot = '';
    if (over) {
      ray.setFromCamera(ndc, camera);
      var hits = ray.intersectObjects(pickables, false);
      for (var i = 0; i < hits.length; i++) {
        var o = hits[i].object;
        if (!shown(o) || (o.material && o.material.transparent && o.material.opacity < 0.3)) continue;
        hot = o.userData.pick || ''; break;
      }
    }
    if (hot !== shownHot) {
      shownHot = hot;
      if (hot) {
        var nl = root.getAttribute('data-lang') === 'nl', pk = PICK[hot];
        tip.textContent = hot === 'lamp' && root.getAttribute('data-theme') === 'night' ? (nl ? pk.nl2 : pk.en2) : (nl ? pk.nl : pk.en);
        tip.classList.add('on'); document.body.style.cursor = 'pointer';
      }
      else { tip.classList.remove('on'); document.body.style.cursor = ''; }
    }
    for (var k in hv) hv[k] += ((hot === k ? 1 : 0) - hv[k]) * 0.15;
  }

  /* ---------- frame ---------- */
  var clock = new THREE.Clock();
  var ys = window.scrollY;
  var intro = { v: reduce ? 1 : 0 };
  if (window.gsap && !reduce) window.gsap.to(intro, { v: 1, duration: 2.6, delay: 0.2, ease: 'power3.out' });
  var v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), q1 = new THREE.Quaternion(), q2 = new THREE.Quaternion(), e1 = new THREE.Euler();
  var target = new THREE.Vector3();
  var screenWorld = new THREE.Vector3();
  var PILE = new THREE.Vector3(-2.65, 0.01, -0.35);
  var NOTE_P = new THREE.Vector3(1.45, 2.5, 1.5);
  var buzz = 0;

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
    // on phones the centred "-baar" shots pull back so the whole laptop and the word fit
    if (mobile) { var pull = 1 + 0.55 * (1 - Math.min(1, Math.abs(S.side))); camera.position.sub(target).multiplyScalar(pull).add(target); }
    camera.lookAt(target);
    if (W >= 800) camera.setViewOffset(W, H, -W * 0.2 * S.side, 0, W, H);
    else camera.setViewOffset(W, H, 0, H * (0.24 * Math.min(1, Math.abs(S.side)) + 0.06 * (1 - Math.min(1, Math.abs(S.side)))), W, H);
    camera.updateMatrixWorld();
    hoverTest();

    // laptop lid opens on load and per chapter
    var lid = sm(c01(S.lid)) * sm(c01(iv * 1.4 - 0.2));
    lidG.rotation.x = 1.52 * (1 - lid) - 0.3 * lid;
    screenMat.color.setScalar(Math.max(0.03, bright.v * (0.25 + 0.75 * lid) * (1 - sm(c01(tryFx.v * 1.4)) * 0.9)));
    laptop.position.y = hv.laptop * 0.05;
    laptop.rotation.y = S.spin;

    // the hero story plays on the laptop while it is the current screen
    if (current.indexOf('story|') === 0 && wipe.v >= 1 && lid > 0.3 && !reduce) {
      storyClock += dt; storyAcc += dt;
      if (storyAcc > (mobile ? 1 / 20 : 1 / 30)) { storyAcc = 0; storyCompose(sg, storyClock); screenTex.needsUpdate = true; }
    }

    // "Build a homepage" strips
    var tf = tryFx.v;
    strips.forEach(function (m, i) {
      var k = sm(c01(tf * 1.25 - (STRIPS - 1 - i) * 0.08));
      m.visible = tf > 0.002;
      m.position.set((i % 2 ? 1 : -1) * k * 0.3, m.userData.y0 + (1.5 - i) * k * 0.32, 0.04 + k * (0.55 + (3 - i) * 0.28));
      m.rotation.set(-k * 0.25, (i % 2 ? -1 : 1) * k * 0.3, (i % 2 ? 1 : -1) * k * 0.06);
    });

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
    screenLight.intensity = S.glow * lid * (1.4 + night.v * 2.4);

    // phone: flat on the desk → lifted toward the camera
    var ph = sm(c01(S.phone));
    phone.position.lerpVectors(PHONE_FLAT_P, PHONE_UP_P, ph);
    phone.position.y += Math.sin(ph * Math.PI) * 0.4 + (reduce ? 0 : Math.sin(t * 0.9) * 0.03 * ph);
    phone.quaternion.slerpQuaternions(PHONE_FLAT_Q, PHONE_UP_Q, ph);
    var pL = sm(c01(S.phoneL));
    if (pL > 0) { phone.position.lerp(PHONE_LEFT_P, pL); phone.position.y += Math.sin(pL * Math.PI) * 0.35; phone.quaternion.slerp(PHONE_LEFT_Q, pL); }
    phone.position.y += hv.phone * 0.08;
    if (buzz > 0) { buzz = Math.max(0, buzz - dt * 2.5); phone.rotateZ(Math.sin(t * 95) * 0.035 * buzz); }
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

    // mug, steam and notebook
    // the desk props step aside when the laptop takes centre stage
    var pr = sm(c01(S.props));
    [mug, notebook, lamp].forEach(function (o, i) { var k = sm(c01(pr * 1.3 - i * 0.12)); o.scale.setScalar(Math.max(0.001, k)); o.visible = k > 0.01; });
    lampLight.intensity = night.v * 3.2 * pr; pool.material.opacity = night.v * pr;
    mug.position.y = hv.mug * 0.08;
    notebook.position.y = hv.notebook * 0.05;
    steam.forEach(function (sp) {
      var u = sp.userData, life = ((reduce ? 0.5 : t * 0.2) + u.o) % 1;
      sp.position.set(mug.position.x + Math.sin(t * 0.9 + u.s) * 0.08 * (0.2 + life), mug.position.y + 0.5 + life * 1.15, mug.position.z + Math.cos(t * 0.7 + u.s) * 0.06 * (0.2 + life));
      var ss = 0.16 + life * 0.55; sp.scale.set(ss, ss, 1);
      sp.material.opacity = Math.sin(life * Math.PI) * 0.42 * S.steam * pr;
    });

    // sticky notes: pop onto the lid, get ticked off once the new site is live
    var nv = c01(S.notes);
    stickies.forEach(function (m, i) {
      var f = sm(c01(nv * 1.6 - i * 0.25));
      m.visible = f > 0.01;
      m.scale.setScalar(Math.max(0.001, f) * (1 + hv.notes * 0.06));
      m.rotation.z = m.userData.n.r + (1 - f) * 0.8 + (reduce ? 0 : Math.sin(t * 1.4 + i * 2) * 0.012);
      var sol = S.solved > 0.35 + i * 0.15 ? 1 : 0;
      if (sol !== m.userData.solved) { m.userData.solved = sol; paintSticky(m, !!sol); }
    });

    // notifications: fly out of the phone and stack up, newest on top
    phoneScreen.getWorldPosition(v2);
    var NN = notes.length, nf = S.notify * (1 + (NN - 1) * 0.16);
    notes.forEach(function (m, i) {
      var a = sm(c01(nf - i * 0.16));
      m.visible = a > 0.01;
      if (!m.visible) { m.userData.shown = false; return; }
      if (a > 0.5 && !m.userData.shown) {
        m.userData.shown = true;
        if (!reduce) { var r = rings[ringNext++ % rings.length]; r.position.copy(v2); r.userData.age = 0; buzz = 1; }
      }
      v1.set(NOTE_P.x, NOTE_P.y - i * 0.3 + (reduce ? 0 : Math.sin(t * 0.8 + i) * 0.015), NOTE_P.z + i * 0.02);
      m.position.lerpVectors(v2, v1, a);
      m.quaternion.copy(camera.quaternion);
      m.scale.setScalar((0.2 + 0.6 * a) * (1 + hv.notify * 0.04));
      m.material.opacity = c01(a * 1.5);
    });
    rings.forEach(function (r) {
      var u = r.userData;
      r.visible = u.age < 1;
      if (!r.visible) return;
      u.age = Math.min(1, u.age + dt * 1.3);
      r.scale.setScalar(1 + u.age * 2.2);
      r.material.opacity = (1 - u.age) * 0.55;
      r.quaternion.copy(camera.quaternion);
    });

    // dust and light
    dust.rotation.y = t * 0.01;
    dust.position.y = Math.sin(t * 0.15) * 0.15;
    var nt = night.v;
    if (Math.abs(nt - lastNight) > 0.001) { applyNight(nt); lastNight = nt; }
    key.intensity = S.keyI * (1 - nt * 0.8);
    hemi.intensity = S.hemiI * (1 - nt * 0.7);
    dustMat.opacity = S.dust * (0.55 + nt * 0.4);
    lamp.position.y = hv.lamp * 0.04;

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
