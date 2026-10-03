/* Ace 360 reels: shared look and helpers.
   A reel page defines window.REEL_SCENE = { duration, cues, draw(t, K) } and loads this file;
   K is the toolkit below. Every frame is a pure function of t. */
(function () {
  'use strict';
  var W = 1080, H = 1920;
  var cv = document.getElementById('reel'), g = cv.getContext('2d');
  var P = window.ACE360_PAINT, FILM = window.ACE360_FILM;
  var SANS = '"Inter Variable", Inter, system-ui, sans-serif', SERIF = '"EB Garamond", Georgia, serif', MONO = '"JetBrains Mono Variable", monospace';
  var OR = '#ff6a00', ORL = '#ff8a3d', CREAM = '#f4efe9', MUTED = 'rgba(244,239,233,0.62)', NIGHT = '#0d0a08', GREEN = '#2bd17e', RED = '#ff5a5a';
  var SITE = 'www.ace360services.nl', MAIL = 'hello@ace360services.nl';

  function c01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { x = c01(x); return 1 - Math.pow(1 - x, 3); }
  function inOut(x) { x = c01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function back(x) { x = c01(x); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
  function seg(t, a, b) { return c01((t - a) / (b - a)); }
  function win(t, a, b, fi, fo) { return ease(seg(t, a, a + (fi || 0.4))) * (1 - seg(t, b - (fo || 0.3), b)); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function font(w, size, fam) { g.font = w + ' ' + size + 'px ' + (fam || SANS); }
  function text(s, x, y, size, color, weight, align, fam) { font(weight || 600, size, fam); g.fillStyle = color || CREAM; g.textAlign = align || 'left'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y); }

  // *word* is set in the orange serif italic, the site's accent
  function rich(str, x, y, size, color, align) {
    var parts = str.split('*'), widths = [], total = 0;
    var f = function (i) { return i % 2 ? '400 italic ' + Math.round(size * 1.12) + 'px ' + SERIF : '700 ' + size + 'px ' + SANS; };
    parts.forEach(function (p, i) { g.font = f(i); var w = g.measureText(p).width; widths.push(w); total += w; });
    var cx = align === 'center' ? x - total / 2 : x;
    g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    parts.forEach(function (p, i) { g.font = f(i); g.fillStyle = i % 2 ? ORL : (color || CREAM); g.fillText(p, cx, y); cx += widths[i]; });
    return total;
  }
  function headline(lines, x, y0, size, t0, t, gap, align) {
    lines.forEach(function (l, i) {
      var k = ease(seg(t, t0 + i * 0.12, t0 + i * 0.12 + 0.55));
      if (k <= 0) return;
      g.save(); g.globalAlpha *= k; g.translate(0, (1 - k) * 40); rich(l, x, y0 + i * (gap || size * 1.15), size, CREAM, align); g.restore();
    });
  }
  function kicker(s, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.fillStyle = OR; g.fillRect(x, y - 16, 14, 14); font(600, 26, MONO); g.fillStyle = MUTED; g.textAlign = 'left'; g.fillText(s.toUpperCase().split('').join(' '), x + 28, y - 3); g.restore(); }
  function logoRing(cx, cy, r, draw, lw) {
    g.save(); g.strokeStyle = OR; g.lineWidth = lw || r * 0.2; g.setLineDash([r * 0.43, r * 0.195]);
    g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * c01(draw)); g.stroke(); g.setLineDash([]);
    if (draw > 0.9) { var s = r * 0.5 * ease(seg(draw, 0.9, 1)); g.fillStyle = OR; rr(cx - s / 2, cy - r - s / 2, s, s, s * 0.15); g.fill(); }
    g.restore();
  }

  /* background: warm dark, drifting light, grain, dust */
  var grain = document.createElement('canvas'); grain.width = grain.height = 256;
  (function () { var gg = grain.getContext('2d'), d = gg.createImageData(256, 256), s = 7; for (var i = 0; i < d.data.length; i += 4) { s = (s * 16807) % 2147483647; d.data[i] = d.data[i + 1] = d.data[i + 2] = s % 255; d.data[i + 3] = 18; } gg.putImageData(d, 0, 0); })();
  var specks = []; (function () { var s = 3; function r() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; } for (var i = 0; i < 70; i++) specks.push([r(), r(), 1 + r() * 2.5, 0.2 + r() * 0.6, r() * 6]); })();
  function background(t) {
    g.globalAlpha = 1; g.fillStyle = NIGHT; g.fillRect(0, 0, W, H);
    [[0.75 + Math.sin(t * 0.3) * 0.08, 0.3 + Math.cos(t * 0.25) * 0.05, 900, 'rgba(255,110,20,0.42)'], [0.15, 0.85 + Math.sin(t * 0.2) * 0.04, 800, 'rgba(255,90,10,0.25)'], [0.1, 0.05, 700, 'rgba(255,200,140,0.14)']].forEach(function (b) {
      var gr = g.createRadialGradient(b[0] * W, b[1] * H, 0, b[0] * W, b[1] * H, b[2]); gr.addColorStop(0, b[3]); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    });
    g.save(); g.globalCompositeOperation = 'overlay'; g.fillStyle = g.createPattern(grain, 'repeat'); g.fillRect(0, 0, W, H); g.restore();
    specks.forEach(function (p) { var y = ((p[1] - t * 0.012 * p[3]) % 1 + 1) % 1; g.fillStyle = 'rgba(255,190,130,' + (0.25 + 0.35 * Math.pow(Math.sin(t * p[3] + p[4]), 2)) + ')'; g.beginPath(); g.arc(p[0] * W + Math.sin(t * 0.4 + p[4]) * 20, y * H, p[2], 0, 7); g.fill(); });
  }

  /* screens */
  function mkc(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  var cache = {};
  function site(kind, mood) { var k = 'site:' + kind + ':' + (mood || ''); if (!cache[k]) { var c = mkc(1024, 640); P.screenMood(kind, mood || 'warm', c.getContext('2d'), 1024, 640); cache[k] = c; } return cache[k]; }
  function screen(key) { var k = 'scr:' + key; if (!cache[k]) { var c = mkc(1024, 640); FILM.screenAt(c, key); cache[k] = c; } return cache[k]; }
  function phoneScr(key) { var k = 'ph:' + key; if (!cache[k]) { var c = mkc(360, 740); FILM.phoneAt(c, key); cache[k] = c; } return cache[k]; }
  function phoneSite(kind, mood) { var k = 'phs:' + kind + ':' + (mood || ''); if (!cache[k]) { var c = mkc(360, 740), cg = c.getContext('2d'); cg.fillStyle = '#fff'; cg.fillRect(0, 0, 360, 740); P.phoneMood(kind, mood || 'warm', cg, 360, 740); cg.fillStyle = '#000'; rrOn(cg, 128, 14, 104, 26, 13); cg.fill(); cache[k] = c; } return cache[k]; }
  function rrOn(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  var storyC = mkc(1024, 640);
  function story(t) { FILM.storyAt(storyC, t); return storyC; }

  function windowCard(x, y, w, src, a, scale, glow) {
    var h = w * src.height / src.width; scale = scale || 1;
    if (a <= 0) return h;
    g.save(); g.globalAlpha *= a; g.translate(x + w / 2, y + h / 2); g.scale(scale, scale); g.translate(-w / 2, -h / 2);
    g.shadowColor = glow || 'rgba(255,110,20,0.35)'; g.shadowBlur = 90; g.shadowOffsetY = 30; rr(0, 0, w, h, 26); g.fillStyle = '#000'; g.fill(); g.shadowColor = 'transparent';
    g.save(); rr(0, 0, w, h, 26); g.clip(); g.drawImage(src, 0, 0, w, h); g.restore();
    g.strokeStyle = 'rgba(255,200,150,0.25)'; g.lineWidth = 2; rr(0, 0, w, h, 26); g.stroke();
    g.restore(); return h;
  }
  function phone(x, y, w, src, a, rot) {
    var h = w * 740 / 360; if (a <= 0) return;
    g.save(); g.globalAlpha *= a; g.translate(x + w / 2, y + h / 2); g.rotate(rot || 0); g.translate(-w / 2, -h / 2);
    g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 60; g.shadowOffsetY = 30; rr(-12, -12, w + 24, h + 24, 46); g.fillStyle = '#1b1c20'; g.fill(); g.shadowColor = 'transparent';
    g.save(); rr(0, 0, w, h, 36); g.clip(); g.drawImage(src, 0, 0, w, h); g.restore(); g.restore();
  }
  // a hand-drawn style circle around something, drawn in over time
  function marker(cx, cy, rx, ry, k, color, lw) {
    if (k <= 0) return; g.save(); g.strokeStyle = color || OR; g.lineWidth = lw || 7; g.lineCap = 'round';
    g.beginPath(); for (var i = 0; i <= 60 * k; i++) { var a = -2.2 + i / 60 * Math.PI * 2.15, wob = 1 + Math.sin(i * 0.7) * 0.03; var px = cx + Math.cos(a) * rx * wob, py = cy + Math.sin(a) * ry * wob; if (i) g.lineTo(px, py); else g.moveTo(px, py); } g.stroke(); g.restore();
  }
  function tag(s, x, y, color, a, align) {
    if (a <= 0) return; g.save(); g.globalAlpha *= a; font(700, 32); var w = g.measureText(s).width + 44, x0 = align === 'right' ? x - w : x;
    g.translate(0, (1 - a) * 20); rr(x0, y - 44, w, 64, 32); g.fillStyle = color || OR; g.fill(); g.fillStyle = color === GREEN ? '#062a16' : '#111'; g.textAlign = 'left'; g.fillText(s, x0 + 22, y); g.restore();
  }
  function notification(x, y, title, sub, a, icon, iconColor) {
    if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y);
    g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 50; g.shadowOffsetY = 20; rr(-430, -78, 860, 156, 40); g.fillStyle = 'rgba(250,246,240,0.96)'; g.fill(); g.shadowColor = 'transparent';
    rr(-398, -46, 92, 92, 22); g.fillStyle = iconColor || OR; g.fill();
    text(icon || '€', -352, 18, 52, '#111', 800, 'center'); text(title, -280, -8, 38, '#111', 700); text(sub, -280, 38, 30, '#4a4d52', 500); text('now', 398, -12, 26, '#8a8e95', 500, 'right');
    g.restore();
  }
  function steps(n, cur, x, y, a) { for (var i = 0; i < n; i++) { g.globalAlpha = a; g.fillStyle = i <= cur ? OR : 'rgba(255,255,255,0.2)'; rr(x + i * 70, y, i === cur ? 56 : 40, 8, 4); g.fill(); } g.globalAlpha = 1; }

  /* the shared end card: logo, line, website and email */
  function endCard(t, t0, line) {
    var e = ease(seg(t, t0, t0 + 0.5)); if (e <= 0) return;
    g.save(); g.globalAlpha = e;
    logoRing(540, 640, 140, ease(seg(t, t0 + 0.1, t0 + 1.1)), 28);
    text('Ace 360', 540, 940, 92, CREAM, 800, 'center'); text('S E R V I C E S', 540, 992, 30, MUTED, 600, 'center', MONO);
    rich(line || 'Websites that *earn*.', 540, 1120, 64, CREAM, 'center');
    var p = ease(seg(t, t0 + 0.7, t0 + 1.2));
    g.globalAlpha = e * p; g.save(); g.translate(540, 1300); g.scale(lerp(0.9, 1, back(seg(t, t0 + 0.7, t0 + 1.2))), lerp(0.9, 1, back(seg(t, t0 + 0.7, t0 + 1.2)))); g.translate(-540, -1300);
    g.shadowColor = 'rgba(255,106,0,0.7)'; g.shadowBlur = 50; rr(150, 1244, 780, 116, 58); g.fillStyle = OR; g.fill(); g.shadowColor = 'transparent';
    text('Book a free call  →', 540, 1320, 50, '#111', 800, 'center'); g.restore();
    g.globalAlpha = e * ease(seg(t, t0 + 1, t0 + 1.5)); text(SITE, 540, 1440, 40, CREAM, 700, 'center'); text(MAIL, 540, 1496, 34, MUTED, 600, 'center');
    g.restore();
  }

  var K = { g: g, W: W, H: H, P: P, FILM: FILM, OR: OR, ORL: ORL, CREAM: CREAM, MUTED: MUTED, GREEN: GREEN, RED: RED, SANS: SANS, SERIF: SERIF, MONO: MONO, SITE: SITE, MAIL: MAIL,
    c01: c01, ease: ease, inOut: inOut, back: back, seg: seg, win: win, lerp: lerp, rr: rr, font: font, text: text, rich: rich, headline: headline, kicker: kicker, logoRing: logoRing,
    background: background, mkc: mkc, site: site, screen: screen, phoneScr: phoneScr, phoneSite: phoneSite, story: story, windowCard: windowCard, phone: phone, marker: marker, tag: tag, notification: notification, steps: steps, endCard: endCard };

  function ready() {
    var fonts = Promise.all(['700 40px "Inter Variable"', 'italic 400 40px "EB Garamond"', '600 20px "JetBrains Mono Variable"'].map(function (f) { return document.fonts.load(f); }));
    var photos = new Promise(function (res) { P.onPhotos(res); });
    return Promise.all([fonts, photos]).then(function () { return new Promise(function (r) { setTimeout(r, 300); }); });
  }
  /* signature on every frame, so a reused clip still carries the brand:
     a large faint ring turning behind the content (can't be cropped out) and a small ring + name in the top-right corner
     (clear of the Shorts UI). A scene can switch the corner mark off for a moment with REEL_SCENE.markOff = [[from, to], …]. */
  function signatureBack(t) {
    g.save(); g.globalAlpha = 0.06; g.translate(W / 2, H * 0.47); g.rotate(t * 0.05);
    g.strokeStyle = OR; g.lineWidth = 46; g.setLineDash([186, 84]);
    g.beginPath(); g.arc(0, 0, 430, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
    g.fillStyle = OR; rr(-34, -430 - 34, 68, 68, 10); g.fill();
    g.restore();
  }
  function signatureCorner(t) {
    var off = (S.markOff || []).some(function (r) { return t >= r[0] && t < r[1]; });
    if (off) return;
    g.save(); g.globalAlpha = 0.85;
    var x = 1010, y = 172;
    font(800, 28); g.textAlign = 'right'; g.textBaseline = 'alphabetic'; g.fillStyle = CREAM; g.fillText('ACE 360', x, y + 10);
    var w = g.measureText('ACE 360').width;
    g.restore();
    g.save(); g.globalAlpha = 0.85; logoRing(x - w - 30, y, 17, 1, 5); g.restore();
  }
  var S = window.REEL_SCENE;
  window.REEL = { duration: S.duration, cues: S.cues, ready: ready, draw: function (t) { background(t); signatureBack(t); S.draw(t, K); g.globalAlpha = 1; signatureCorner(t); },
    frame: function (t, q) { this.draw(t); return cv.toDataURL('image/jpeg', q || 0.92); } };
})();
