/**
 * ace360 film: one fixed three.js stage behind the whole front page.
 *
 * Every chapter (<section data-k="...">) has a keyframe: camera position, target,
 * which side of the screen the scene sits on, and the state of each object.
 * Scroll position blends between keyframes, so the camera glides through one
 * continuous scene: a floating browser window inside a ring of Delft tiles.
 *
 * The page script tells the stage what the window shows via
 * window.ACE360_FILM.setScreen(key, imageUrl).
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var canvas = document.getElementById('stage');
  function fail() { root.classList.add('no-webgl'); }
  if (!canvas || typeof window.THREE === 'undefined') { fail(); return; }

  var THREE = window.THREE;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { fail(); return; }
  if (!renderer.getContext()) { fail(); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

  var C = {
    night: '#070c22', night2: '#101a45', porcelain: '#eef1fa', paper: '#e6ebf7', ink: '#0b1438',
    cobalt: '#3d5bff', deep: '#2238c4', delft: '#2440c9', oranje: '#ff6b1a', grey: '#c9cdd8'
  };
  var DISPLAY = '"Archivo Variable", "Archivo", "Arial Narrow", sans-serif';
  var BODY = '"Hanken Grotesk Variable", "Hanken Grotesk", system-ui, sans-serif';

  /* ---------- canvas helpers ---------- */
  function makeCanvasTex(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return { c: c, g: c.getContext('2d'), t: t, w: w, h: h };
  }
  function rr(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  function box(g, x, y, w, h, r, fill) { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); }
  function text(g, s, x, y, size, color, weight, font, align) {
    g.font = (weight || 500) + ' ' + size + 'px ' + (font || DISPLAY);
    g.fillStyle = color;
    g.textAlign = align || 'left';
    g.textBaseline = 'alphabetic';
    g.fillText(s, x, y);
  }
  function bars(g, x, y, widths, h, gap, color) {
    widths.forEach(function (w, i) { box(g, x, y + i * (h + gap), w, h, h / 2, color); });
  }
  function chrome(g, w, h, url, dark) {
    var barH = 44;
    g.fillStyle = dark ? '#0d1330' : '#e9ecf4';
    g.fillRect(0, 0, w, barH);
    ['#ff5f57', '#febc2e', '#28c840'].forEach(function (col, i) {
      g.beginPath(); g.arc(24 + i * 20, barH / 2, 6, 0, Math.PI * 2); g.fillStyle = col; g.fill();
    });
    box(g, w / 2 - 170, 10, 340, 24, 12, dark ? '#1a2350' : '#ffffff');
    text(g, url, w / 2, 27, 14, dark ? 'rgba(238,241,250,.7)' : '#56607f', 500, BODY, 'center');
    return barH;
  }
  function tileRing(g, cx, cy, rx, ry, n, size) {
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2;
      var x = cx + Math.cos(a) * rx;
      var y = cy + Math.sin(a) * ry;
      g.save(); g.translate(x, y); g.rotate(a);
      g.fillStyle = i === 3 ? C.oranje : (i % 4 === 1 ? C.cobalt : '#f4f6fd');
      g.fillRect(-size / 2, -size / 2, size, size);
      if (i !== 3 && i % 4 !== 1) { g.strokeStyle = C.delft; g.lineWidth = 2; g.strokeRect(-size / 2 + 3, -size / 2 + 3, size - 6, size - 6); }
      g.restore();
    }
  }
  function art(g, variant, x, y, w, h) {
    g.save();
    g.beginPath(); g.rect(x, y, w, h); g.clip();
    if (variant === 'roast') {
      for (var r = Math.max(w, h); r > 0; r -= 14) {
        g.beginPath(); g.arc(x + w * 0.66, y + h * 0.55, r, 0, Math.PI * 2);
        g.fillStyle = (r / 14) % 2 < 1 ? C.deep : C.cobalt; g.fill();
      }
      g.beginPath(); g.arc(x + w * 0.66, y + h * 0.55, h * 0.16, 0, Math.PI * 2); g.fillStyle = C.oranje; g.fill();
    } else if (variant === 'grid') {
      g.fillStyle = C.paper; g.fillRect(x, y, w, h);
      g.strokeStyle = 'rgba(11,20,56,.14)'; g.lineWidth = 1;
      for (var gx = x; gx < x + w; gx += 28) { g.beginPath(); g.moveTo(gx, y); g.lineTo(gx, y + h); g.stroke(); }
      for (var gy = y; gy < y + h; gy += 28) { g.beginPath(); g.moveTo(x, gy); g.lineTo(x + w, gy); g.stroke(); }
      g.fillStyle = C.cobalt; g.fillRect(x + w * 0.14, y + h * 0.36, w * 0.26, h * 0.44);
      g.fillStyle = C.oranje; g.fillRect(x + w * 0.42, y + h * 0.5, w * 0.1, h * 0.22);
      g.fillStyle = C.ink; g.fillRect(x + w * 0.56, y + h * 0.18, w * 0.2, h * 0.64);
    } else if (variant === 'wheel') {
      g.fillStyle = C.paper; g.fillRect(x, y, w, h);
      [0.3, 0.7].forEach(function (fx) {
        g.beginPath(); g.arc(x + w * fx, y + h * 0.58, h * 0.24, 0, Math.PI * 2);
        g.lineWidth = h * 0.045; g.strokeStyle = C.cobalt; g.stroke();
        g.beginPath(); g.arc(x + w * fx, y + h * 0.58, h * 0.035, 0, Math.PI * 2); g.fillStyle = C.oranje; g.fill();
      });
      g.beginPath(); g.moveTo(x + w * 0.3, y + h * 0.58); g.lineTo(x + w * 0.47, y + h * 0.3); g.lineTo(x + w * 0.7, y + h * 0.58);
      g.lineWidth = h * 0.03; g.strokeStyle = C.ink; g.stroke();
    } else {
      for (var s = -h; s < w + h; s += 36) {
        g.fillStyle = (s / 36) % 2 < 1 ? C.deep : C.cobalt;
        g.beginPath(); g.moveTo(x + s, y + h); g.lineTo(x + s + h * 0.35, y); g.lineTo(x + s + h * 0.35 + 36, y); g.lineTo(x + s + 36, y + h); g.fill();
      }
      g.fillStyle = C.oranje;
      g.beginPath(); g.moveTo(x + w * 0.42, y + h); g.lineTo(x + w * 0.6, y); g.lineTo(x + w * 0.66, y); g.lineTo(x + w * 0.48, y + h); g.fill();
    }
    g.restore();
  }

  /* ---------- what the browser window shows ---------- */
  var PAINT = {
    live: function (g, w, h) {
      var grd = g.createLinearGradient(0, 0, w, h);
      grd.addColorStop(0, C.night); grd.addColorStop(1, C.night2);
      g.fillStyle = grd; g.fillRect(0, 0, w, h);
      var top = chrome(g, w, h, 'ace360services.nl', true);
      text(g, 'ace360', 40, top + 46, 22, C.porcelain, 650);
      [0, 1, 2].forEach(function (i) { box(g, w - 330 + i * 80, top + 32, 56, 8, 4, 'rgba(238,241,250,.4)'); });
      box(g, w - 92, top + 22, 60, 28, 3, C.porcelain);
      text(g, 'Websites that', 40, top + 170, 64, C.porcelain, 560);
      text(g, 'move', 40, top + 236, 64, C.oranje, 560);
      text(g, 'Dutch brands.', 40, top + 302, 64, C.porcelain, 560);
      bars(g, 40, top + 340, [380, 340, 250], 10, 12, 'rgba(238,241,250,.35)');
      box(g, 40, top + 430, 150, 44, 3, C.porcelain);
      text(g, 'Start a project', 115, top + 458, 16, C.ink, 600, DISPLAY, 'center');
      tileRing(g, w * 0.76, h * 0.55, 190, 80, 22, 34);
    },
    loading: function (g, w, h) {
      g.fillStyle = '#d7dae3'; g.fillRect(0, 0, w, h);
      var top = chrome(g, w, h, 'www.oude-website.nl', false);
      g.fillStyle = '#c3c7d2'; g.fillRect(0, top, w, 70);
      for (var i = 0; i < 3; i++) box(g, 40 + i * 320, top + 300, 290, 180, 6, '#c8ccd6');
      box(g, 40, top + 100, w - 80, 170, 6, '#cdd1db');
      g.lineWidth = 10; g.lineCap = 'round';
      g.beginPath(); g.arc(w / 2, top + 185, 46, 0, Math.PI * 2); g.strokeStyle = 'rgba(80,88,110,.18)'; g.stroke();
      g.beginPath(); g.arc(w / 2, top + 185, 46, -Math.PI / 2, Math.PI * 0.35); g.strokeStyle = '#5b6380'; g.stroke();
      text(g, 'Loading… 6.4 s', w / 2, top + 268, 22, '#5b6380', 500, BODY, 'center');
      box(g, w - 300, h - 110, 260, 80, 6, '#ffffff');
      text(g, 'Only card payments', w - 280, h - 72, 17, '#5b6380', 600, BODY);
      text(g, 'iDEAL not available', w - 280, h - 48, 15, '#b04a4a', 500, BODY);
    },
    wire: function (g, w, h) {
      g.fillStyle = '#f7f8fc'; g.fillRect(0, 0, w, h);
      var top = chrome(g, w, h, 'staging.jouwmerk.nl', false);
      g.setLineDash([8, 6]); g.lineWidth = 2; g.strokeStyle = '#8a93b2';
      function frame(x, y, ww, hh, label) {
        g.strokeRect(x, y, ww, hh);
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + ww, y + hh); g.moveTo(x + ww, y); g.lineTo(x, y + hh);
        g.strokeStyle = 'rgba(138,147,178,.35)'; g.stroke(); g.strokeStyle = '#8a93b2';
        text(g, label, x + 12, y + 26, 14, '#56607f', 600, BODY);
      }
      frame(30, top + 18, w - 60, 50, 'HEADER · logo · menu · NL/EN');
      frame(30, top + 88, w * 0.55, 230, 'HERO · headline · CTA');
      frame(w * 0.55 + 50, top + 88, w * 0.45 - 80, 230, 'IMAGE / 3D');
      for (var i = 0; i < 3; i++) frame(30 + i * ((w - 60) / 3 + 0), top + 340, (w - 60) / 3 - 20, 150, 'CARD ' + (i + 1));
      g.setLineDash([]);
      box(g, w - 230, top + 26, 196, 34, 17, C.oranje);
      text(g, 'Sitemap v1 · 12 pages', w - 132, top + 49, 14, '#0b1438', 600, BODY, 'center');
    },
    design: function (g, w, h) {
      g.fillStyle = C.porcelain; g.fillRect(0, 0, w, h);
      var top = chrome(g, w, h, 'jouwmerk.nl', false);
      text(g, 'jouwmerk', 40, top + 44, 22, C.ink, 650);
      [0, 1, 2].forEach(function (i) { box(g, w - 320 + i * 80, top + 30, 56, 8, 4, 'rgba(11,20,56,.3)'); });
      box(g, 30, top + 76, w * 0.52, 260, 6, C.deep);
      text(g, 'Handgemaakt', 64, top + 160, 46, C.porcelain, 560);
      text(g, 'in Utrecht.', 64, top + 212, 46, C.oranje, 560);
      bars(g, 64, top + 240, [300, 240], 9, 11, 'rgba(238,241,250,.5)');
      art(g, 'roast', w * 0.52 + 50, top + 76, w * 0.48 - 80, 260);
      for (var i = 0; i < 3; i++) {
        var x = 30 + i * ((w - 60) / 3);
        box(g, x, top + 360, (w - 60) / 3 - 20, 150, 6, '#ffffff');
        box(g, x + 18, top + 380, 90, 70, 4, i === 1 ? C.oranje : C.cobalt);
        bars(g, x + 124, top + 392, [120, 90], 9, 12, 'rgba(11,20,56,.25)');
      }
    },
    chart: function (g, w, h) {
      g.fillStyle = C.night; g.fillRect(0, 0, w, h);
      var top = chrome(g, w, h, 'rapport · maand 6', true);
      text(g, 'Organic visitors', 50, top + 60, 26, C.porcelain, 560);
      text(g, 'Monthly report', 50, top + 88, 15, 'rgba(238,241,250,.6)', 500, BODY);
      var x0 = 60, x1 = w - 60, y0 = h - 80, y1 = top + 130;
      g.strokeStyle = 'rgba(238,241,250,.15)'; g.lineWidth = 1;
      for (var k = 0; k <= 4; k++) { var yy = y0 - (k / 4) * (y0 - y1); g.beginPath(); g.moveTo(x0, yy); g.lineTo(x1, yy); g.stroke(); }
      var pts = [0.12, 0.16, 0.22, 0.3, 0.44, 0.58, 0.74, 0.92];
      g.beginPath();
      pts.forEach(function (p, i) {
        var x = x0 + (i / (pts.length - 1)) * (x1 - x0), y = y0 - p * (y0 - y1);
        if (i) g.lineTo(x, y); else g.moveTo(x, y);
      });
      var lineGrad = g.createLinearGradient(0, y1, 0, y0);
      lineGrad.addColorStop(0, 'rgba(255,107,26,.45)'); lineGrad.addColorStop(1, 'rgba(255,107,26,0)');
      g.lineWidth = 5; g.strokeStyle = C.oranje; g.stroke();
      g.lineTo(x1, y0); g.lineTo(x0, y0); g.closePath(); g.fillStyle = lineGrad; g.fill();
      ['Launch', 'Month 2', 'Month 4', 'Month 6'].forEach(function (l, i) {
        text(g, l, x0 + (i / 3) * (x1 - x0), y0 + 30, 14, 'rgba(238,241,250,.6)', 500, BODY, i === 0 ? 'left' : i === 3 ? 'right' : 'center');
      });
    },
    'nl-ideal': function (g, w, h) {
      g.fillStyle = '#f3f5fb'; g.fillRect(0, 0, w, h);
      var top = chrome(g, w, h, 'jouwmerk.nl/afrekenen', false);
      text(g, 'Afrekenen', 60, top + 70, 40, C.ink, 600);
      var methods = ['iDEAL', 'Bancontact', 'Klarna', 'Creditcard'];
      methods.forEach(function (m, i) {
        var y = top + 100 + i * 78, on = i === 0;
        box(g, 60, y, 520, 64, 8, '#ffffff');
        if (on) { rr(g, 60, y, 520, 64, 8); g.lineWidth = 3; g.strokeStyle = C.cobalt; g.stroke(); }
        g.beginPath(); g.arc(94, y + 32, 11, 0, Math.PI * 2); g.lineWidth = 2.5; g.strokeStyle = on ? C.cobalt : '#9aa1b8'; g.stroke();
        if (on) { g.beginPath(); g.arc(94, y + 32, 6, 0, Math.PI * 2); g.fillStyle = C.cobalt; g.fill(); }
        text(g, m, 124, y + 40, 20, C.ink, 600, BODY);
        if (on) { box(g, 380, y + 14, 180, 36, 6, '#eef1fa'); text(g, 'Kies je bank ▾', 470, y + 38, 15, '#56607f', 500, BODY, 'center'); }
      });
      box(g, 640, top + 100, 320, 300, 8, '#ffffff');
      text(g, 'Jouw bestelling', 664, top + 140, 18, C.ink, 600, BODY);
      bars(g, 664, top + 166, [220, 180, 200], 9, 16, 'rgba(11,20,56,.18)');
      text(g, 'Totaal', 664, top + 290, 18, '#56607f', 500, BODY);
      text(g, '€ 64,95', 936, top + 290, 24, C.ink, 650, DISPLAY, 'right');
      box(g, 664, top + 320, 272, 56, 6, C.cobalt);
      text(g, 'Betalen met iDEAL', 800, top + 355, 18, '#ffffff', 600, BODY, 'center');
    },
    'nl-postcode': function (g, w, h) {
      g.fillStyle = '#f3f5fb'; g.fillRect(0, 0, w, h);
      var top = chrome(g, w, h, 'jouwmerk.nl/bezorging', false);
      text(g, 'Bezorgadres', 60, top + 70, 40, C.ink, 600);
      var f = [['Postcode', '1012 AB', 60, 280, false], ['Huisnummer', '1', 360, 160, false], ['Straat', 'Dam', 60, 460, true], ['Plaats', 'Amsterdam', 60, 460, true]];
      f.forEach(function (it, i) {
        var y = top + 110 + (i < 2 ? 0 : (i - 1) * 110);
        text(g, it[0], it[2], y, 16, '#56607f', 500, BODY);
        box(g, it[2], y + 12, it[3], 58, 8, it[4] ? '#eaf7ef' : '#ffffff');
        rr(g, it[2], y + 12, it[3], 58, 8); g.lineWidth = 2; g.strokeStyle = it[4] ? '#2e9b5a' : '#c9cfdf'; g.stroke();
        text(g, it[1], it[2] + 18, y + 50, 22, C.ink, 600, BODY);
        if (it[4]) text(g, '✓', it[2] + it[3] - 34, y + 50, 24, '#2e9b5a', 700, BODY);
      });
      box(g, 600, top + 120, 360, 150, 10, C.deep);
      text(g, 'Automatisch ingevuld', 628, top + 170, 22, '#ffffff', 600);
      text(g, 'via postcode + huisnummer', 628, top + 202, 17, 'rgba(255,255,255,.75)', 500, BODY);
      box(g, 628, top + 222, 80, 8, 4, C.oranje);
    },
    'nl-avg': function (g, w, h) {
      PAINT.design(g, w, h);
      g.fillStyle = 'rgba(11,20,56,.55)'; g.fillRect(0, 44, w, h - 44);
      box(g, w / 2 - 260, 120, 520, 420, 12, '#ffffff');
      text(g, 'Wij gebruiken cookies', w / 2 - 224, 180, 30, C.ink, 600);
      bars(g, w / 2 - 224, 200, [430, 380], 9, 12, 'rgba(11,20,56,.2)');
      [['Noodzakelijk', true], ['Statistieken', false], ['Marketing', false]].forEach(function (r, i) {
        var y = 262 + i * 58;
        text(g, r[0], w / 2 - 224, y + 24, 19, C.ink, 500, BODY);
        box(g, w / 2 + 160, y + 4, 60, 30, 15, r[1] ? C.cobalt : '#d3d8e6');
        g.beginPath(); g.arc(w / 2 + (r[1] ? 205 : 175), y + 19, 11, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill();
      });
      box(g, w / 2 - 224, 456, 210, 52, 6, '#eef1fa');
      text(g, 'Alleen noodzakelijk', w / 2 - 119, 488, 16, C.ink, 600, BODY, 'center');
      box(g, w / 2 + 6, 456, 214, 52, 6, C.cobalt);
      text(g, 'Alles accepteren', w / 2 + 113, 488, 16, '#fff', 600, BODY, 'center');
    },
    'nl-access': function (g, w, h) {
      PAINT.design(g, w, h);
      box(g, 30, 56, 210, 40, 4, C.ink);
      text(g, 'Ga naar inhoud', 135, 82, 16, '#fff', 600, BODY, 'center');
      rr(g, 54, 330, 230, 56, 6); g.lineWidth = 4; g.strokeStyle = C.oranje; g.stroke();
      box(g, 60, 336, 218, 44, 4, C.porcelain);
      text(g, 'Naar winkelwagen', 169, 364, 16, C.ink, 600, BODY, 'center');
      box(g, w - 330, 330, 300, 190, 10, '#ffffff');
      ['Contrast AA', 'Toetsenbord', 'Schermlezer', 'Minder beweging'].forEach(function (l, i) {
        text(g, '✓', w - 306, 372 + i * 40, 22, '#2e9b5a', 700, BODY);
        text(g, l, w - 274, 372 + i * 40, 18, C.ink, 500, BODY);
      });
    },
    'nl-lang': function (g, w, h) {
      g.fillStyle = C.porcelain; g.fillRect(0, 0, w, h);
      chrome(g, w, h, 'jouwmerk.nl/nl  ·  /en', false);
      g.fillStyle = C.deep; g.fillRect(w / 2, 44, w / 2, h - 44);
      text(g, 'Handgemaakt', 50, 230, 52, C.ink, 560);
      text(g, 'in Utrecht.', 50, 290, 52, C.cobalt, 560);
      text(g, 'Handmade', w / 2 + 50, 230, 52, C.porcelain, 560);
      text(g, 'in Utrecht.', w / 2 + 50, 290, 52, C.oranje, 560);
      bars(g, 50, 330, [330, 280], 9, 12, 'rgba(11,20,56,.25)');
      bars(g, w / 2 + 50, 330, [330, 280], 9, 12, 'rgba(238,241,250,.4)');
      box(g, w / 2 - 70, 70, 140, 40, 20, '#ffffff');
      box(g, w / 2 - 66, 74, 66, 32, 16, C.cobalt);
      text(g, 'NL', w / 2 - 33, 96, 15, '#fff', 700, BODY, 'center');
      text(g, 'EN', w / 2 + 33, 96, 15, C.ink, 700, BODY, 'center');
      text(g, 'hreflang="nl-NL"', 50, h - 50, 16, '#56607f', 500, BODY);
      text(g, 'hreflang="en"', w / 2 + 50, h - 50, 16, 'rgba(238,241,250,.7)', 500, BODY);
    },
    'nl-ship': function (g, w, h) {
      g.fillStyle = '#f3f5fb'; g.fillRect(0, 0, w, h);
      var top = chrome(g, w, h, 'jouwmerk.nl/wp-admin · bestellingen', false);
      box(g, 60, top + 40, 420, 500, 8, '#ffffff');
      text(g, 'VERZENDLABEL', 90, top + 90, 22, C.ink, 700);
      text(g, 'Aan', 90, top + 130, 14, '#56607f', 500, BODY);
      bars(g, 90, top + 145, [220, 180, 160], 10, 12, 'rgba(11,20,56,.3)');
      for (var i = 0; i < 52; i++) {
        var bw = (i * 7) % 3 + 2;
        g.fillStyle = C.ink; g.fillRect(90 + i * 6.8, top + 260, bw, 120);
      }
      text(g, '3S ACE 360 NL', 270, top + 410, 18, C.ink, 600, BODY, 'center');
      box(g, 540, top + 40, 420, 230, 8, '#ffffff');
      text(g, 'Bestelling #1043', 570, top + 86, 22, C.ink, 600);
      text(g, 'PostNL · DHL · Sendcloud', 570, top + 120, 16, '#56607f', 500, BODY);
      box(g, 570, top + 160, 200, 50, 6, C.cobalt);
      text(g, 'Label printen', 670, top + 192, 17, '#fff', 600, BODY, 'center');
      box(g, 540, top + 300, 420, 120, 8, C.deep);
      text(g, 'Track & trace verstuurd', 570, top + 352, 20, '#fff', 600);
      box(g, 570, top + 372, 90, 8, 4, C.oranje);
    }
  };
  ['roast', 'grid', 'wheel', 'drape'].forEach(function (v) {
    PAINT['work-' + v] = function (g, w, h, title) {
      g.fillStyle = C.porcelain; g.fillRect(0, 0, w, h);
      var top = chrome(g, w, h, (title || 'project').toLowerCase().replace(/[^a-z]+/g, '') + '.nl', false);
      art(g, v, 0, top, w, h - top - 130);
      g.fillStyle = '#ffffff'; g.fillRect(0, h - 130, w, 130);
      text(g, title || '', 40, h - 70, 36, C.ink, 600);
      box(g, w - 200, h - 96, 160, 46, 3, C.ink);
      text(g, 'Bekijk', w - 120, h - 66, 16, '#fff', 600, BODY, 'center');
    };
  });

  function paintPhone(g, w, h, key, title) {
    var dark = key === 'live' || key === 'chart';
    g.fillStyle = dark ? C.night : C.porcelain; g.fillRect(0, 0, w, h);
    box(g, w / 2 - 50, 14, 100, 22, 11, '#000');
    var fg = dark ? C.porcelain : C.ink;
    text(g, key.indexOf('work-') === 0 ? (title || '').split(' ')[0] : 'jouwmerk', 24, 82, 20, fg, 650);
    if (key.indexOf('work-') === 0) {
      art(g, key.slice(5), 0, 110, w, 300);
    } else if (key === 'live') {
      text(g, 'Websites', 24, 170, 40, fg, 560);
      text(g, 'that move', 24, 214, 40, C.oranje, 560);
      tileRing(g, w / 2, 340, 110, 40, 14, 22);
    } else {
      box(g, 0, 110, w, 300, 0, C.deep);
      text(g, 'Handgemaakt', 24, 230, 32, C.porcelain, 560);
      text(g, 'in Utrecht.', 24, 268, 32, C.oranje, 560);
    }
    bars(g, 24, 440, [w - 80, w - 120, w - 150], 10, 14, dark ? 'rgba(238,241,250,.35)' : 'rgba(11,20,56,.22)');
    box(g, 24, 540, w - 48, 54, 4, dark ? C.porcelain : C.cobalt);
    text(g, key === 'nl-ideal' ? 'Betalen met iDEAL' : 'Bekijk', w / 2, 574, 17, dark ? C.ink : '#fff', 600, BODY, 'center');
  }

  /* ---------- Delft tile texture for the ring ---------- */
  function tileTexture() {
    var t = makeCanvasTex(256, 256), g = t.g, s = 256;
    var grad = g.createRadialGradient(s * 0.45, s * 0.4, s * 0.1, s / 2, s / 2, s * 0.75);
    grad.addColorStop(0, '#fbfcff'); grad.addColorStop(1, '#dfe5f4');
    g.fillStyle = grad; g.fillRect(0, 0, s, s);
    g.strokeStyle = C.delft; g.fillStyle = C.delft;
    g.lineWidth = 5; g.strokeRect(12, 12, s - 24, s - 24);
    [[0, 0], [s, 0], [0, s], [s, s]].forEach(function (p) {
      g.beginPath(); g.arc(p[0], p[1], 34, 0, Math.PI * 2); g.fill();
      g.lineWidth = 4; g.beginPath(); g.arc(p[0], p[1], 52, 0, Math.PI * 2); g.stroke();
    });
    g.save(); g.translate(s / 2, s / 2);
    for (var i = 0; i < 8; i++) {
      g.rotate(Math.PI / 4);
      g.beginPath(); g.ellipse(0, -40, 11, 26, 0, 0, Math.PI * 2);
      g.globalAlpha = i % 2 ? 0.55 : 1; g.fill();
    }
    g.globalAlpha = 1; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, 16, 0, Math.PI * 2); g.stroke();
    g.restore();
    t.t.needsUpdate = true;
    return t.t;
  }
  function glowTexture() {
    var t = makeCanvasTex(256, 256), g = t.g;
    var gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    t.t.needsUpdate = true;
    return t.t;
  }

  /* ---------- scene objects ---------- */
  var DW = 3.4, DH = 2.12;
  var device = new THREE.Group();
  var deviceBody = new THREE.Mesh(
    new THREE.BoxGeometry(DW + 0.1, DH + 0.1, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x1a2250, metalness: 0.65, roughness: 0.32 })
  );
  device.add(deviceBody);
  var screenTex = makeCanvasTex(1024, 640);
  var faceMat = new THREE.MeshBasicMaterial({ map: screenTex.t, toneMapped: false });
  var face = new THREE.Mesh(new THREE.PlaneGeometry(DW, DH), faceMat);
  face.position.z = 0.042;
  device.add(face);

  var glowMat = new THREE.MeshBasicMaterial({ map: glowTexture(), color: new THREE.Color(C.oranje), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.4 });
  var glow = new THREE.Mesh(new THREE.PlaneGeometry(DW * 2.6, DH * 2.8), glowMat);
  glow.position.z = -0.4;
  device.add(glow);

  // exploded page layers (header, hero, cards, footer)
  var layerDefs = [
    { h: 0.32, y: DH / 2 - 0.16, paint: function (g, w, h) { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); text(g, 'jouwmerk', 30, h * 0.62, h * 0.38, C.ink, 650); [0, 1, 2].forEach(function (i) { box(g, w - 340 + i * 90, h * 0.45, 64, 10, 5, 'rgba(11,20,56,.3)'); }); } },
    { h: 0.92, y: DH / 2 - 0.32 - 0.46, paint: function (g, w, h) { g.fillStyle = C.deep; g.fillRect(0, 0, w, h); text(g, 'Handgemaakt in Utrecht.', 40, h * 0.42, 44, C.porcelain, 560); box(g, 40, h * 0.6, 190, 50, 4, C.oranje); art(g, 'roast', w * 0.62, 0, w * 0.38, h); } },
    { h: 0.6, y: DH / 2 - 1.24 - 0.3, paint: function (g, w, h) { g.fillStyle = C.porcelain; g.fillRect(0, 0, w, h); for (var i = 0; i < 3; i++) { box(g, 24 + i * (w / 3), 24, w / 3 - 40, h - 48, 8, '#ffffff'); box(g, 44 + i * (w / 3), 44, 100, h - 88, 6, i === 1 ? C.oranje : C.cobalt); } } },
    { h: 0.28, y: -DH / 2 + 0.14, paint: function (g, w, h) { g.fillStyle = C.ink; g.fillRect(0, 0, w, h); bars(g, 30, h * 0.4, [180], 10, 0, 'rgba(238,241,250,.4)'); text(g, 'KvK · BTW · Privacy', w - 30, h * 0.62, h * 0.3, 'rgba(238,241,250,.7)', 500, BODY, 'right'); } }
  ];
  var layers = layerDefs.map(function (d, i) {
    var t = makeCanvasTex(1024, Math.round(1024 * d.h / DW));
    d.paint(t.g, t.w, t.h);
    t.t.needsUpdate = true;
    var m = new THREE.Mesh(new THREE.PlaneGeometry(DW, d.h), new THREE.MeshBasicMaterial({ map: t.t, transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false }));
    m.position.set(0, d.y, 0.05);
    m.userData = { i: i, y: d.y };
    m.visible = false;
    device.add(m);
    return m;
  });

  scene.add(device);

  // phone
  var phone = new THREE.Group();
  phone.add(new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.84, 0.07), new THREE.MeshStandardMaterial({ color: 0x1a2250, metalness: 0.65, roughness: 0.3 })));
  var phoneTex = makeCanvasTex(360, 720);
  var phoneFace = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 1.76), new THREE.MeshBasicMaterial({ map: phoneTex.t, toneMapped: false }));
  phoneFace.position.z = 0.037;
  phone.add(phoneFace);
  phone.position.set(-2.05, -0.45, 1.0);
  scene.add(phone);

  // ring of tiles
  var COLS = 26, ROWS = 3, RADIUS = 3.3, SIZE = 0.62, ROW_GAP = 0.7;
  var seed = 360;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  var tiles = [];
  for (var r = 0; r < ROWS; r++) {
    for (var col = 0; col < COLS; col++) {
      var roll = rand();
      var isAccent = r === 1 && col === 4;
      if (roll < 0.08 && !isAccent) continue;
      tiles.push({
        theta: (col / COLS) * Math.PI * 2 + (r % 2 ? Math.PI / COLS : 0),
        y: (r - (ROWS - 1) / 2) * ROW_GAP,
        kind: isAccent ? 'accent' : roll < 0.28 ? 'solid' : 'glaze',
        spread: 0.5 + rand(),
        spin: (rand() - 0.5) * 2,
        delay: rand() * 0.5 + (col / COLS) * 0.6
      });
    }
  }
  var tileGeo = new THREE.BoxGeometry(SIZE, SIZE, 0.06);
  var mats = {
    glaze: new THREE.MeshStandardMaterial({ map: tileTexture(), roughness: 0.22, metalness: 0.02 }),
    solid: new THREE.MeshStandardMaterial({ color: new THREE.Color(C.cobalt), roughness: 0.3, metalness: 0.4 }),
    accent: new THREE.MeshStandardMaterial({ color: new THREE.Color(C.oranje), roughness: 0.3, metalness: 0.2, emissive: new THREE.Color(C.oranje), emissiveIntensity: 0.25 })
  };
  var ringGroup = new THREE.Group();
  var inst = {};
  Object.keys(mats).forEach(function (k) {
    var n = tiles.filter(function (t) { return t.kind === k; }).length;
    inst[k] = new THREE.InstancedMesh(tileGeo, mats[k], Math.max(n, 1));
    inst[k].count = n;
    inst[k].instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    ringGroup.add(inst[k]);
  });
  var counters = { glaze: 0, solid: 0, accent: 0 };
  tiles.forEach(function (t) { t.mesh = inst[t.kind]; t.slot = counters[t.kind]++; });
  ringGroup.rotation.x = 0.3;
  ringGroup.rotation.z = -0.12;
  scene.add(ringGroup);

  // dust
  var DUST = 520;
  var dustPos = new Float32Array(DUST * 3);
  for (var d = 0; d < DUST; d++) {
    dustPos[d * 3] = (rand() - 0.5) * 18;
    dustPos[d * 3 + 1] = (rand() - 0.5) * 10;
    dustPos[d * 3 + 2] = (rand() - 0.5) * 12 - 1;
  }
  var dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  var dustMat = new THREE.PointsMaterial({ color: 0xcfd8ff, size: 0.035, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending });
  var dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // lights
  var hemi = new THREE.HemisphereLight(0xdfe6ff, 0x0a1030, 0.75);
  scene.add(hemi);
  var key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(4, 6, 8);
  scene.add(key);
  var rim = new THREE.PointLight(0xff6b1a, 1, 14);
  rim.position.set(-3, -1.5, 2.5);
  scene.add(rim);

  /* ---------- keyframes ---------- */
  var BASE = { cx: 0, cy: 0.5, cz: 8.6, tx: 0, ty: 0, tz: 0, side: 1, ring: 1, ringR: 1, explode: 0, phone: 0, dust: 0.55, hemi: 0.75, key: 1.1, glow: 0.45, bright: 1, devRY: -0.18 };
  var SEQ = [
    ['hero', { cx: -0.4, cy: 2.1, cz: 11.5, ty: 0.3, devRY: -0.22 }],
    ['why', { cx: 0.4, cy: 0.1, cz: 5.0, ty: 0, ring: 0.45, ringR: 1.7, hemi: 0.45, key: 0.7, glow: 0, dust: 0.3, bright: 0.85, devRY: -0.1 }],
    ['believe', { side: -1, cx: 3.2, cy: 1.4, cz: 8.4, ring: 0.85, ringR: 1.2, glow: 0.25, dust: 0.5, hemi: 0.7, key: 1.1, bright: 1, devRY: 0.3 }],
    ['process', { side: 1, cx: -0.6, cy: 0.2, cz: 6.4, ring: 0.35, ringR: 1.9, devRY: -0.12, glow: 0.1 }],
    ['s1', { cx: -1, cy: 0.3, cz: 5.6 }],
    ['s2', { cx: -1.6, cy: 0.9, cz: 6.2 }],
    ['s3', { cx: -5.4, cy: 1.5, cz: 4.6, tx: -0.2, explode: 1, devRY: -0.05 }],
    ['s4', { cx: -0.8, cy: 0.4, cz: 8.2, tx: 0, explode: 0, ring: 1, ringR: 0.95, glow: 1.1, key: 1.3, devRY: -0.2 }],
    ['s5', { cx: 0, cy: 2.6, cz: 8.8, ty: 0.5, glow: 0.5, ringR: 1.05 }],
    ['services', { side: -1, cx: 2, cy: 0.6, cz: 9.2, ty: 0, phone: 1, ring: 0.7, ringR: 1.35, devRY: 0.22, glow: 0.4 }],
    ['market', { side: 1, cx: -1.1, cy: 0.4, cz: 6.1, phone: 0, ring: 0.3, ringR: 2, dust: 0.12, hemi: 1.15, key: 1.2, glow: 0.15, devRY: -0.16 }],
    ['work', { side: -1, cx: 1.4, cy: 0.3, cz: 8.4, phone: 1, ring: 0.45, ringR: 1.6, dust: 0.5, hemi: 0.75, devRY: 0.2, glow: 0.3 }],
    ['care', { side: 1, cx: -2.8, cy: 2.8, cz: 9.6, ty: 0.3, phone: 0, ring: 1, ringR: 1.1, glow: 0.35, dust: 0.7, devRY: -0.25 }],
    ['contact', { side: -1, cx: 2.2, cy: 1.6, cz: 12, ty: 0.2, ring: 1, ringR: 0.92, glow: 1.1, key: 1.3, devRY: 0.25 }]
  ];
  var KF = {};
  var prev = BASE;
  SEQ.forEach(function (s) { prev = Object.assign({}, prev, s[1]); KF[s[0]] = prev; });
  var S = Object.assign({}, BASE);

  var secs = Array.prototype.slice.call(document.querySelectorAll('[data-k]'));
  var anchors = [];
  function measure() {
    var H = window.innerHeight;
    anchors = [];
    secs.forEach(function (s) {
      var k = KF[s.dataset.k];
      if (!k) return;
      var top = s.getBoundingClientRect().top + window.scrollY, h = s.offsetHeight;
      if (h > H * 1.3) { anchors.push({ y: top, k: k }); anchors.push({ y: top + h - H, k: k }); }
      else anchors.push({ y: top + (h - H) / 2, k: k });
    });
    anchors.sort(function (a, b) { return a.y - b.y; });
  }
  function smooth(x) { return x * x * (3 - 2 * x); }
  function sample(y) {
    if (!anchors.length) return;
    var a = anchors[0], b = anchors[0], t = 0, last = anchors[anchors.length - 1];
    if (y >= last.y) { a = b = last; }
    else if (y > anchors[0].y) {
      for (var i = 0; i < anchors.length - 1; i++) {
        if (y >= anchors[i].y && y < anchors[i + 1].y) {
          a = anchors[i]; b = anchors[i + 1];
          t = smooth((y - a.y) / Math.max(1, b.y - a.y));
          break;
        }
      }
    }
    for (var k in BASE) S[k] = a.k[k] + (b.k[k] - a.k[k]) * t;
  }

  /* ---------- sizing ---------- */
  var W = 1, H = 1;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setSize(W, H, false);
    var asp = W / H;
    camera.aspect = asp;
    camera.fov = asp < 1 ? 38 + (1 - asp) * 40 : 38;
    camera.updateProjectionMatrix();
    measure();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('load', measure);
  setTimeout(measure, 1500);
  if (window.ScrollTrigger) window.ScrollTrigger.addEventListener('refresh', measure);
  resize();

  /* ---------- screen content ---------- */
  var current = '';
  var flip = { a: 0 };
  var flipTl = null;
  var imageCache = {};
  function paintScreen(keyName, title, img) {
    var g = screenTex.g, w = screenTex.w, h = screenTex.h;
    g.clearRect(0, 0, w, h);
    if (img) {
      g.fillStyle = C.porcelain; g.fillRect(0, 0, w, h);
      var top = chrome(g, w, h, (title || '').toLowerCase().replace(/[^a-z]+/g, '') + '.nl', false);
      var s = Math.max(w / img.width, (h - top) / img.height);
      g.drawImage(img, (w - img.width * s) / 2, top + ((h - top) - img.height * s) / 2, img.width * s, img.height * s);
    } else {
      (PAINT[keyName] || PAINT.live)(g, w, h, title);
    }
    screenTex.t.needsUpdate = true;
    paintPhone(phoneTex.g, phoneTex.w, phoneTex.h, keyName, title);
    phoneTex.t.needsUpdate = true;
  }
  function setScreen(keyName, imageUrl, title) {
    var id = keyName + '|' + (imageUrl || '') + '|' + (title || '');
    if (id === current) return;
    current = id;
    function apply(img) {
      if (!gsap || reduce) { paintScreen(keyName, title, img); return; }
      if (flipTl) flipTl.kill();
      flipTl = gsap.timeline()
        .to(flip, { a: Math.PI / 2, duration: 0.35, ease: 'power2.in' })
        .add(function () { paintScreen(keyName, title, img); })
        .fromTo(flip, { a: -Math.PI / 2 }, { a: 0, duration: 0.7, ease: 'power3.out' });
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
  paintScreen('live');
  current = 'live||';
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      var parts = current.split('|');
      current = '';
      setScreen(parts[0], parts[1], parts[2]);
    });
  }

  window.ACE360_FILM = { setScreen: setScreen, measure: measure };

  /* ---------- pointer ---------- */
  var ptr = { x: 0, y: 0 }, eased = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    ptr.x = e.clientX / W - 0.5;
    ptr.y = e.clientY / H - 0.5;
  }, { passive: true });

  /* ---------- frame ---------- */
  var intro = { v: reduce ? 1 : 0 };
  if (gsap && !reduce) gsap.to(intro, { v: 1, duration: 2.8, delay: 0.15, ease: 'power3.out' });

  var dummy = new THREE.Object3D();
  var clock = new THREE.Clock();
  var ys = window.scrollY;
  var spin = 0;
  var target = new THREE.Vector3();

  function easeOutBack(x) { var c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }

  function frame() {
    var dt = Math.min(clock.getDelta(), 0.05);
    var time = clock.elapsedTime;
    ys += (window.scrollY - ys) * (reduce ? 1 : 1 - Math.exp(-dt * 7));
    sample(ys + 0);
    eased.x += (ptr.x - eased.x) * 0.05;
    eased.y += (ptr.y - eased.y) * 0.05;

    // camera
    var iv = intro.v;
    camera.position.set(S.cx + eased.x * 0.5, S.cy - eased.y * 0.3 + (1 - iv) * 0.8, S.cz + (1 - iv) * 4);
    target.set(S.tx, S.ty, S.tz);
    camera.lookAt(target);
    if (W > 900) camera.setViewOffset(W, H, -W * 0.2 * S.side, 0, W, H);
    else camera.setViewOffset(W, H, 0, H * 0.2, W, H);

    // device
    device.rotation.y = S.devRY + flip.a + eased.x * 0.12;
    device.rotation.x = eased.y * 0.06;
    device.position.y = reduce ? 0 : Math.sin(time * 0.8) * 0.05;
    var ds = 0.85 + 0.15 * iv;
    device.scale.setScalar(ds);
    faceMat.color.setScalar(S.bright * (0.3 + 0.7 * iv));
    glowMat.opacity = S.glow * 0.55 * iv;

    var ex = S.explode;
    layers.forEach(function (m) {
      var i = m.userData.i;
      m.visible = ex > 0.05;
      m.material.opacity = Math.min(1, (ex - 0.05) * 3);
      m.position.z = 0.05 + ex * (0.35 + i * 0.5);
      m.position.x = ex * (i - 1.5) * 0.12;
      m.position.y = m.userData.y + ex * (1.5 - i) * 0.12;
    });

    // phone
    var pv = S.phone;
    phone.visible = pv > 0.01;
    phone.scale.setScalar(Math.max(0.001, pv));
    phone.rotation.y = 0.35 + (1 - pv) * 1.2 + eased.x * 0.1;
    phone.position.y = -0.45 + (reduce ? 0 : Math.sin(time * 0.9 + 1) * 0.06);

    // ring
    if (!reduce) spin += dt * 0.1;
    ringGroup.rotation.y = spin + ys * 0.0004;
    var rv = S.ring * iv;
    for (var i = 0; i < tiles.length; i++) {
      var t = tiles[i];
      var a = Math.min(Math.max((intro.v * 2.8 - t.delay) / 1.1, 0), 1);
      var grow = a <= 0 ? 0.0001 : easeOutBack(a);
      var wave = reduce ? 0 : Math.sin(time * 1.3 + t.theta * 3 + t.y * 2) * 0.05;
      var rad = RADIUS * (1 + (S.ringR - 1) * t.spread) + wave + (1 - Math.min(a * 1.4, 1)) * 2.5;
      var yy = t.y * (1 + (S.ringR - 1) * 0.6 * t.spread);
      dummy.position.set(Math.sin(t.theta) * rad, yy, Math.cos(t.theta) * rad);
      var loose = Math.max(0, S.ringR - 1);
      dummy.rotation.set(loose * t.spin, t.theta, loose * t.spin * 0.6);
      dummy.scale.setScalar(Math.max(0.0001, grow * (0.25 + 0.75 * S.ring)));
      dummy.updateMatrix();
      t.mesh.setMatrixAt(t.slot, dummy.matrix);
    }
    inst.glaze.instanceMatrix.needsUpdate = true;
    inst.solid.instanceMatrix.needsUpdate = true;
    inst.accent.instanceMatrix.needsUpdate = true;
    ringGroup.visible = rv > 0.02;

    // dust + lights
    dust.rotation.y = reduce ? 0 : time * 0.012;
    dust.position.y = reduce ? 0 : Math.sin(time * 0.2) * 0.2;
    dustMat.opacity = S.dust * 0.8;
    hemi.intensity = S.hemi;
    key.intensity = S.key;
    rim.intensity = 0.4 + S.glow;

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
