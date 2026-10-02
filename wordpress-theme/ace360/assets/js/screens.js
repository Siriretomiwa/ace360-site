/**
 * Ace 360 screen designs: the 2D canvas painters for every project mockup.
 *
 * Used by film.js (the 3D laptop and phone screens) and by main.js (the
 * thumbnails and close-ups in the All work grid). Has no dependency on three.js
 * so the grid still gets its pictures when WebGL is unavailable.
 */
(function () {
  'use strict';

  var INK = '#111111', MUTED = '#6a6e75', OR = '#ff6a00';
  var SANS = '"Inter Variable", "Inter", system-ui, sans-serif';
  var MONO = '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace';

  /* ---------- 2D helpers ---------- */
  function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
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

  /* ---------- template designs (data-driven) ----------
   * Each entry describes a made-up site: colours, type, copy, a decorative
   * "art" panel (motif) and one of four lower layouts:
   * cards (3 products), slots (services + booking widget), menu (price list)
   * or stats (impact numbers + progress bar).
   */
  var TPL = {
    korrel: { url: 'bakkerijkorrel.nl', bg: '#fbf6ee', ink: '#3a2414', muted: '#8a6f5a', accent: '#c8742c', onAccent: '#ffffff', serif: true, brand: 'Bakkerij Korrel', nav: ['Bread', 'Pastry', 'Cakes'], kicker: 'Baked every night', h: ['Fresh from the oven,', 'ready at 7:30.'], sub: 'Order today, pick up tomorrow morning.', cta: 'Pre-order', art: ['#f1d9b8', '#d99a5b'], motif: 'plates', badge: 'Pickup 07:30 – 12:00', layout: 'cards', items: [['Bread', 'Sourdough loaf', '€4.50'], ['Pastry', 'Croissants (4)', '€6.80'], ['Cakes', 'Dutch apple pie', '€18.50']] },
    noor: { url: 'studionoor.nl', bg: '#ffffff', ink: '#1d1a1f', muted: '#7b7178', accent: '#b07c68', onAccent: '#ffffff', serif: true, brand: 'Studio Noor', nav: ['Services', 'Team', 'Gallery'], kicker: 'Hair studio · Utrecht', h: ['Hair that feels', 'like you.'], sub: 'Book your stylist, service and time online.', cta: 'Book now', art: ['#f3e3dc', '#c99a87'], motif: 'arch', badge: '★ 4.9 · 380 reviews', layout: 'slots', day: 'Saturday 14 June', items: [['Cut & finish', '€55'], ['Colour & gloss', '€95'], ['Braids', 'from €120'], ['Kids cut', '€25']] },
    spaak: { url: 'spaakfiets.nl', bg: '#f5f7f2', ink: '#13261b', muted: '#5e7065', accent: '#2f9e44', onAccent: '#ffffff', brand: 'Spaak', nav: ['Repairs', 'Prices', 'E-bikes'], kicker: 'Bike repair · Amsterdam-Oost', h: ['Flat tyre?', 'Fixed today.'], sub: 'Fixed prices. Book a slot, drop off, ride home.', cta: 'Book a repair', art: ['#d3f9d8', '#2f9e44'], motif: 'wheel', badge: 'Ready in 2 hours', layout: 'slots', day: 'Today', items: [['Flat tyre', '€17.50'], ['Full service', '€59'], ['Brake check', '€22'], ['E-bike check', '€79']] },
    zout: { url: 'zoutenzuur.nl', bg: '#141414', ink: '#f4efe6', muted: '#a8a29a', accent: '#e2b04a', onAccent: '#141414', serif: true, dark: true, panel: 'rgba(255,255,255,0.06)', brand: 'Zout & Zuur', nav: ['Menu', 'Gift cards', 'Private dining'], kicker: 'Small plates · Rotterdam', h: ['Small plates,', 'big evenings.'], sub: 'Open Wednesday to Sunday from 17:30.', cta: 'Reserve', art: ['#3a2a14', '#e2b04a'], motif: 'plates', badge: 'Tonight: 4 tables left', layout: 'menu', items: [['Burrata, blood orange', '€12'], ['Charred leek, hazelnut', '€9'], ['Mussels, cider, lovage', '€14'], ['Beef tartare, pickles', '€15'], ['Lamb, salsa verde', '€19'], ['Basque cheesecake', '€8']] },
    adem: { url: 'ademruimte.nl', bg: '#f3f1ec', ink: '#2d3a2e', muted: '#6f7a6d', accent: '#7d9471', onAccent: '#ffffff', serif: true, brand: 'Ademruimte', nav: ['Schedule', 'Teachers', 'Prices'], kicker: 'Yoga studio · Haarlem', h: ['Make room', 'to breathe.'], sub: 'Classes every day, from gentle yin to strong flow.', cta: 'Try a week', art: ['#e3e9dc', '#9fb394'], motif: 'arch', badge: 'Today 19:00 · 3 spots left', layout: 'cards', items: [['Start', 'Intro week', '€25'], ['Flexible', '10-class card', '€140'], ['Most chosen', 'Unlimited', '€89/mo']] },
    gracht: { url: 'grachtzicht.com', bg: '#ffffff', ink: '#0f1e33', muted: '#5d6b80', accent: '#1f5fbf', onAccent: '#ffffff', brand: 'Grachtzicht', nav: ['Apartments', 'Amsterdam', 'Guest guide'], kicker: 'Canal-side stays · Amsterdam', h: ['Wake up on', 'the canal.'], sub: 'Book direct for the best price. Free cancellation.', cta: 'Check dates', art: ['#dbe7f7', '#1f5fbf'], motif: 'arch', badge: '★ 9.6 · Superb', layout: 'cards', items: [['2 guests', 'Canal Suite', '€189 / night'], ['4 guests', 'Garden Loft', '€149 / night'], ['2 guests', 'Studio', '€109 / night']] },
    molen: { url: 'molencoffee.com', bg: '#f6f0e8', ink: '#24170f', muted: '#7d6a5c', accent: '#d9480f', onAccent: '#ffffff', brand: 'MOLEN', nav: ['Coffee', 'Subscribe', 'Brew guides'], kicker: 'Small-batch roasters', h: ['Roasted Monday,', 'in your cup Wednesday.'], sub: 'Fresh beans every two weeks. Skip or pause any time.', cta: 'Subscribe', art: ['#f0d9c4', '#9c5a33'], motif: 'plates', badge: 'Free shipping from €30', layout: 'cards', items: [['Single origin', 'Ethiopia Guji', '€14'], ['Everyday', 'House Blend', '€11'], ['Subscription', 'Every 2 weeks', 'from €12']] },
    voedselbrug: { url: 'voedselbrug.nl', bg: '#ffffff', ink: '#1b2a1b', muted: '#5f6f5f', accent: '#e8590c', onAccent: '#ffffff', brand: 'Voedselbrug', nav: ['Get help', 'Volunteer', 'Donate'], kicker: 'Food bank · Eindhoven', h: ['Nobody in our town', 'goes to bed hungry.'], sub: 'Give food, time or money. It all gets used this week.', cta: 'Volunteer', art: ['#fff0e6', '#f08c4a'], motif: 'people', badge: '23 shifts open this week', layout: 'stats', items: [['2,350', 'families helped'], ['640', 'volunteers'], ['18 t', 'food saved']], bar: ['Raised this year', '€48,200 of €60,000', 0.8] },
    youthrise: { url: 'youthrise.org', bg: '#fffdf5', ink: '#1e1b4b', muted: '#5b5891', accent: '#facc15', onAccent: '#1e1b4b', brand: 'Youth Rise', nav: ['Programme', 'Stories', 'Mentors'], kicker: 'Mentoring · NL & Ghana', h: ['Every young person', 'deserves a mentor.'], sub: 'One hour a week changes where a life goes.', cta: 'Become a mentor', art: ['#e0e7ff', '#4338ca'], motif: 'people', badge: '42 mentees waiting', layout: 'stats', items: [['480', 'young people mentored'], ['92%', 'in school or work'], ['120', 'mentors']], bar: ['Sponsored this year', '312 of 400 mentees', 0.78] },
    ebene: { url: 'ebeneskin.com', bg: '#2a1a14', ink: '#f6e9dc', muted: '#c4ab98', accent: '#d4a373', onAccent: '#2a1a14', serif: true, dark: true, panel: 'rgba(255,255,255,0.06)', brand: 'Ébène', nav: ['Shop', 'By concern', 'Stories'], kicker: 'Made for melanin-rich skin', h: ['Even tone,', 'zero guesswork.'], sub: 'Routines built around dark spots, dryness and texture.', cta: 'Find my routine', art: ['#4a2e22', '#d4a373'], motif: 'bottles', badge: '★ 4.8 · 2,100 reviews', layout: 'cards', items: [['Dark spots', 'Even Tone Serum', '€38'], ['Dryness', 'Shea Barrier Balm', '€26'], ['Texture', 'Gentle Exfoliant', '€29']] },
    glow: { url: 'glowritual.nl', bg: '#fff5f7', ink: '#3b1f2b', muted: '#8a6475', accent: '#e64980', onAccent: '#ffffff', serif: true, brand: 'Glow Ritual', nav: ['Lashes', 'Brows', 'Aftercare'], kicker: 'Lash & brow studio · Den Haag', h: ['Wake up', 'already done.'], sub: 'Lifts, laminations and tints, booked in a minute.', cta: 'Book now', art: ['#ffe3ec', '#f06595'], motif: 'arch', badge: 'Next free: today 15:30', layout: 'slots', day: 'Thursday 12 June', items: [['Lash lift & tint', '€65'], ['Brow lamination', '€55'], ['Lash + brow combo', '€110'], ['Brow shape', '€25']] },
    jollof: { url: 'jollofhouse.nl', bg: '#fff8f0', ink: '#2b1105', muted: '#7f5b48', accent: '#c92a2a', onAccent: '#ffffff', brand: 'Jollof House', nav: ['Menu', 'Catering', 'Party trays'], kicker: 'West African kitchen · Rotterdam', h: ['Party jollof,', 'delivered hot.'], sub: 'Catering for 10 to 300 guests. Order 48 hours ahead.', cta: 'Order catering', art: ['#ffd8a8', '#e8590c'], motif: 'plates', badge: 'Delivery Fri – Sun', layout: 'menu', items: [['Party jollof tray (10 p.)', '€65'], ['Suya platter', '€45'], ['Fried plantain', '€18'], ['Egusi & pounded yam', '€18'], ['Puff-puff (50)', '€25'], ['Chapman (1 L)', '€9']] },
    lens: { url: 'lensandlinen.com', bg: '#ffffff', ink: '#222222', muted: '#77706a', accent: '#8c7b6b', onAccent: '#ffffff', serif: true, brand: 'Lens & Linen', nav: ['Weddings', 'Journal', 'Packages'], kicker: 'Wedding photography · NL & Europe', h: ['Your day,', 'honestly told.'], sub: 'Calm, natural photos. Check your date in seconds.', cta: 'Check my date', art: ['#e9e4de', '#8c7b6b'], motif: 'arch', badge: '14 June · still free', layout: 'cards', items: [['Amsterdam', 'City elopement', 'from €1,450'], ['Tuscany', 'Destination', 'from €3,200'], ['Full day', '10-hour coverage', '€2,350']] }
  };
  var SERIF = 'Georgia, "Times New Roman", serif';

  function motif(g, c, x, y, w, h) {
    var gr = g.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, c.art[0]); gr.addColorStop(1, c.art[1]);
    g.fillStyle = gr; rr(g, x, y, w, h, 22 * h / 246); g.fill();
    g.save(); rr(g, x, y, w, h, 22 * h / 246); g.clip();
    var s = h / 246, cx = x + w * 0.56, cy = y + h * 0.5, W8 = 'rgba(255,255,255,0.85)', W5 = 'rgba(255,255,255,0.5)';
    if (c.motif === 'plates') {
      circle(g, cx, cy, 92 * s, W8); circle(g, cx, cy, 66 * s, c.art[0]); circle(g, cx, cy, 30 * s, c.art[1]);
      circle(g, x + w * 0.86, y + h * 0.24, 36 * s, W5); circle(g, x + w * 0.86, y + h * 0.24, 22 * s, c.art[1]);
    } else if (c.motif === 'arch') {
      [[150, W5], [104, W8]].forEach(function (a) {
        var aw = a[0] * s, ax = cx - aw / 2, top = y + h * 0.12 + (150 - a[0]) * 0.4 * s;
        g.beginPath(); g.moveTo(ax, y + h); g.lineTo(ax, top + aw / 2); g.arc(cx, top + aw / 2, aw / 2, Math.PI, 0); g.lineTo(ax + aw, y + h); g.closePath();
        g.fillStyle = a[1]; g.fill();
      });
      circle(g, cx, y + h * 0.62, 26 * s, c.art[1]);
    } else if (c.motif === 'bottles') {
      box(g, cx - 110 * s, y + 60 * s, 64 * s, 170 * s, 12 * s, W8); box(g, cx - 96 * s, y + 36 * s, 36 * s, 28 * s, 6 * s, c.art[1]);
      box(g, cx - 30 * s, y + 104 * s, 84 * s, 126 * s, 18 * s, c.art[1]); box(g, cx - 10 * s, y + 86 * s, 44 * s, 22 * s, 6 * s, W8);
      box(g, cx + 70 * s, y + 156 * s, 76 * s, 74 * s, 36 * s, W8);
    } else if (c.motif === 'wheel') {
      [x + w * 0.32, x + w * 0.74].forEach(function (wx) {
        g.beginPath(); g.arc(wx, cy + 20 * s, 64 * s, 0, Math.PI * 2); g.strokeStyle = W8; g.lineWidth = 10 * s; g.stroke();
        for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; g.beginPath(); g.moveTo(wx, cy + 20 * s); g.lineTo(wx + Math.cos(a) * 60 * s, cy + 20 * s + Math.sin(a) * 60 * s); g.strokeStyle = W5; g.lineWidth = 2 * s; g.stroke(); }
      });
      g.beginPath(); g.moveTo(x + w * 0.32, cy + 20 * s); g.lineTo(x + w * 0.5, cy - 40 * s); g.lineTo(x + w * 0.74, cy + 20 * s); g.lineTo(x + w * 0.46, cy + 20 * s); g.closePath(); g.strokeStyle = '#ffffff'; g.lineWidth = 8 * s; g.stroke();
    } else if (c.motif === 'people') {
      [[0.3, 1, W5], [0.72, 1, W5], [0.51, 1.25, W8]].forEach(function (p) {
        var px = x + w * p[0], r = 28 * s * p[1], base = y + h;
        circle(g, px, base - 120 * s * p[1], r, p[2]);
        g.beginPath(); g.ellipse(px, base, 62 * s * p[1], 72 * s * p[1], 0, Math.PI, 0); g.fillStyle = p[2]; g.fill();
      });
    }
    g.restore();
  }

  function badge(g, c, x, y, size) {
    g.font = '600 ' + size + 'px ' + SANS;
    var bw = g.measureText(c.badge).width + size * 3.2;
    box(g, x, y, bw, size * 2.6, size * 1.3, '#ffffff'); circle(g, x + size * 1.3, y + size * 1.3, size * 0.4, c.accent);
    txt(g, c.badge, x + size * 2.1, y + size * 1.7, size, '#111111', 600);
  }

  function tplScreen(c, g, w, h) {
    g.fillStyle = c.bg; g.fillRect(0, 0, w, h);
    var t = chrome(g, w, c.url, c.dark), F = c.serif ? SERIF : SANS, HW = c.serif ? 400 : 750;
    var panel = c.panel || '#ffffff', line = c.dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
    txt(g, c.brand, 40, t + 46, 22, c.ink, c.serif ? 500 : 800, F);
    c.nav.forEach(function (s, i) { txt(g, s, 440 + i * 108, t + 45, 14, c.muted, 500); });
    g.font = '700 13px ' + SANS; var bw = g.measureText(c.cta).width + 40;
    box(g, w - 40 - bw, t + 24, bw, 34, 17, c.accent); txt(g, c.cta, w - 40 - bw / 2, t + 46, 13, c.onAccent, 700, SANS, 'center');
    // hero
    txt(g, c.kicker.toUpperCase(), 40, t + 112, 12, c.accent, 700);
    txt(g, c.h[0], 40, t + 168, 44, c.ink, HW, F); txt(g, c.h[1], 40, t + 220, 44, c.ink, HW, F);
    txt(g, c.sub, 40, t + 258, 16, c.muted, 400);
    g.font = '700 15px ' + SANS; var cw = g.measureText(c.cta).width + 52;
    box(g, 40, t + 280, cw, 46, 23, c.accent); txt(g, c.cta + ' →', 40 + cw / 2, t + 308, 15, c.onAccent, 700, SANS, 'center');
    motif(g, c, 600, t + 84, 384, 246);
    badge(g, c, 616, t + 270, 13);
    // lower layout
    var y0 = t + 372;
    if (c.layout === 'cards') {
      c.items.forEach(function (it, i) {
        var x = 40 + i * 320; box(g, x, y0, 296, 168, 16, panel); if (!c.panel) stroke(g, x, y0, 296, 168, 16, line, 1.5);
        box(g, x + 16, y0 + 16, 84, 136, 12, i === 1 ? c.art[1] : c.art[0]);
        txt(g, it[0].toUpperCase(), x + 118, y0 + 46, 11, c.accent, 700);
        txt(g, it[1], x + 118, y0 + 76, 16, c.ink, 600);
        txt(g, it[2], x + 118, y0 + 132, 22, c.ink, c.serif ? 400 : 750, F);
      });
    } else if (c.layout === 'slots') {
      txt(g, 'Services', 40, y0 + 6, 18, c.ink, 700, F);
      c.items.forEach(function (it, i) {
        var yy = y0 + 30 + i * 44; g.fillStyle = line; g.fillRect(40, yy, 450, 1);
        txt(g, it[0], 40, yy + 29, 16, c.ink, 500); txt(g, it[1], 490, yy + 29, 16, c.ink, 650, SANS, 'right');
      });
      box(g, 540, y0 - 20, 444, 224, 18, panel); if (!c.panel) stroke(g, 540, y0 - 20, 444, 224, 18, line, 1.5);
      txt(g, c.day || 'Saturday', 564, y0 + 14, 16, c.ink, 650);
      ['09:00', '10:30', '11:15', '13:00', '14:45', '16:30'].forEach(function (s, i) {
        var sx = 564 + (i % 3) * 136, sy = y0 + 32 + Math.floor(i / 3) * 52, on = i === 1;
        if (on) box(g, sx, sy, 124, 40, 20, c.accent); else stroke(g, sx, sy, 124, 40, 20, line, 1.5);
        txt(g, s, sx + 62, sy + 26, 15, on ? c.onAccent : c.ink, 600, SANS, 'center');
      });
      box(g, 564, y0 + 142, 396, 44, 22, c.ink); txt(g, 'Book 10:30', 762, y0 + 170, 15, c.bg, 700, SANS, 'center');
    } else if (c.layout === 'menu') {
      txt(g, 'Menu', 40, y0 + 8, 26, c.ink, c.serif ? 400 : 750, F);
      c.items.forEach(function (it, i) {
        var col = i % 2, row = Math.floor(i / 2), x = 40 + col * 492, yy = y0 + 58 + row * 52, cw2 = 452;
        txt(g, it[0], x, yy, 16, c.ink, 500);
        g.font = '500 16px ' + SANS; var nw = g.measureText(it[0]).width;
        g.font = '650 16px ' + SANS; var pw = g.measureText(it[1]).width;
        g.fillStyle = line; for (var d = x + nw + 10; d < x + cw2 - pw - 10; d += 7) g.fillRect(d, yy - 4, 2, 2);
        txt(g, it[1], x + cw2, yy, 16, c.accent, 650, SANS, 'right');
      });
      g.fillStyle = line; g.fillRect(40, y0 + 210, w - 80, 1);
    } else if (c.layout === 'stats') {
      c.items.forEach(function (it, i) { var x = 40 + i * 320; txt(g, it[0], x, y0 + 30, 44, c.ink, 800); txt(g, it[1], x, y0 + 60, 15, c.muted, 500); });
      box(g, 40, y0 + 92, w - 80, 86, 14, c.dark ? panel : '#f6f6f4');
      txt(g, c.bar[0], 64, y0 + 126, 16, c.ink, 650); txt(g, c.bar[1], w - 64, y0 + 126, 15, c.muted, 500, SANS, 'right');
      box(g, 64, y0 + 144, w - 128, 12, 6, line); box(g, 64, y0 + 144, (w - 128) * c.bar[2], 12, 6, c.accent);
    }
  }

  function tplPhone(c, g, w, h) {
    var F = c.serif ? SERIF : SANS, HW = c.serif ? 400 : 750;
    g.fillStyle = c.bg; g.fillRect(0, 50, w, h);
    txt(g, c.brand, 24, 96, 22, c.ink, c.serif ? 500 : 800, F);
    motif(g, c, 18, 116, w - 36, 210);
    txt(g, c.h[0], 24, 376, 26, c.ink, HW, F); txt(g, c.h[1], 24, 410, 26, c.ink, HW, F);
    box(g, 24, 436, w - 48, 50, 25, c.accent); txt(g, c.cta, w / 2, 467, 16, c.onAccent, 700, SANS, 'center');
    var it = c.items[0];
    box(g, 18, 512, w - 36, 104, 16, c.panel || '#ffffff'); if (!c.panel) stroke(g, 18, 512, w - 36, 104, 16, 'rgba(0,0,0,0.08)', 1.5);
    if (c.layout === 'stats') { txt(g, it[0], 40, 566, 34, c.ink, 800); txt(g, it[1], 40, 594, 14, c.muted, 500); }
    else { var name = it.length === 3 ? it[1] : it[0], price = it.length === 3 ? it[2] : it[1]; txt(g, name, 40, 556, 17, c.ink, 600); txt(g, price, 40, 592, 22, c.accent, 700); }
  }

  /* ---------- project laptop screens (1024 × 640) ---------- */
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
      } else if (kind === 'prkiosk') {
        g.fillStyle = '#fbfaf7'; g.fillRect(0, 0, w, h); t = chrome(g, w, 'theprkiosk.com', false);
        txt(g, 'THE PR KIOSK', 40, t + 44, 20, '#111111', 900, 'Georgia, serif'); g.fillStyle = '#d62839'; g.fillRect(40, t + 54, 46, 4);
        ['Packages', 'Media list', 'Coverage'].forEach(function (s, i) { txt(g, s, 560 + i * 110, t + 44, 14, '#444444', 500); });
        box(g, w - 130, t + 24, 94, 34, 4, '#111111'); txt(g, 'Submit story', w - 83, t + 46, 13, '#ffffff', 650, SANS, 'center');
        g.fillStyle = '#111111'; g.fillRect(40, t + 80, w - 80, 2);
        txt(g, 'PRESS RELEASES · DELIVERED TO 400+ OUTLETS', 40, t + 112, 12, '#d62839', 700, SANS);
        txt(g, 'Get your story', 40, t + 172, 50, '#111111', 700, 'Georgia, serif'); txt(g, 'in the news.', 40, t + 228, 50, '#111111', 700, 'Georgia, serif');
        txt(g, 'Pick a package, upload your release, we publish.', 40, t + 266, 17, '#555555', 400);
        g.fillStyle = '#e9e5dc'; g.fillRect(620, t + 104, 364, 180); g.fillStyle = '#111111'; g.fillRect(640, t + 124, 150, 10); g.fillRect(640, t + 142, 110, 10);
        [0, 1, 2, 3, 4].forEach(function (i) { g.fillStyle = '#c9c3b6'; g.fillRect(640, t + 168 + i * 20, i % 2 ? 240 : 320, 6); });
        g.fillStyle = '#d62839'; g.fillRect(904, t + 124, 60, 60);
        [['Starter', '€149', '25 outlets'], ['Feature', '€399', '150 outlets'], ['Headline', '€899', '400+ outlets']].forEach(function (p, i) {
          var x = 40 + i * 320, on = i === 1;
          box(g, x, t + 316, 296, 200, 6, on ? '#111111' : '#ffffff'); if (!on) stroke(g, x, t + 316, 296, 200, 6, '#dcd7cc', 2);
          var c = on ? '#ffffff' : '#111111';
          txt(g, p[0].toUpperCase(), x + 24, t + 350, 12, on ? '#ff8f9a' : '#d62839', 700, SANS);
          txt(g, p[1], x + 24, t + 408, 46, c, 700, 'Georgia, serif'); txt(g, p[2], x + 24, t + 440, 15, on ? '#bbbbbb' : '#666666', 500);
          box(g, x + 24, t + 462, 248, 36, 4, on ? '#d62839' : '#f1eee7'); txt(g, 'Choose', x + 148, t + 486, 14, on ? '#ffffff' : '#111111', 650, SANS, 'center');
        });
      } else if (kind === 'shop4likes') {
        g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); t = chrome(g, w, 'shop4likes.com', false);
        var sg = g.createLinearGradient(0, t, w, t + 330); sg.addColorStop(0, '#ff3d77'); sg.addColorStop(0.55, '#a43dff'); sg.addColorStop(1, '#4f46e5');
        g.fillStyle = sg; g.fillRect(0, t, w, 330);
        txt(g, 'Shop4likes', 40, t + 44, 22, '#ffffff', 800); ['Instagram', 'TikTok', 'YouTube', 'Track order'].forEach(function (s, i) { txt(g, s, 520 + i * 110, t + 44, 14, 'rgba(255,255,255,.85)', 500); });
        txt(g, 'Grow your socials,', 40, t + 140, 48, '#ffffff', 800); txt(g, 'starting today.', 40, t + 196, 48, '#ffffff', 800);
        txt(g, 'Real delivery · instant checkout · 24/7 support', 40, t + 236, 17, 'rgba(255,255,255,.85)', 500);
        box(g, 40, t + 260, 170, 46, 23, '#ffffff'); txt(g, 'Pick a package', 125, t + 289, 15, '#a43dff', 750, SANS, 'center');
        box(g, 660, t + 90, 300, 200, 22, 'rgba(255,255,255,.18)'); txt(g, '♥', 700, t + 156, 40, '#ffffff', 700); txt(g, '+12.4K', 750, t + 156, 40, '#ffffff', 800); txt(g, 'this month', 700, t + 190, 16, 'rgba(255,255,255,.85)', 500);
        g.beginPath(); [0.1, 0.18, 0.3, 0.45, 0.7, 0.95].forEach(function (pp, i) { var x = 700 + i * 44, y = t + 270 - pp * 60; if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.strokeStyle = '#ffffff'; g.lineWidth = 5; g.lineJoin = 'round'; g.stroke();
        [['Instagram', '1,000 followers', '€9.99', '#ff3d77'], ['TikTok', '5,000 views', '€6.99', '#111111'], ['YouTube', '500 subscribers', '€14.99', '#ff2a2a']].forEach(function (p, i) {
          var x = 40 + i * 320; stroke(g, x, t + 356, 296, 180, 18, '#ece9f5', 2);
          circle(g, x + 44, t + 400, 22, p[3]); txt(g, p[0], x + 80, t + 407, 18, '#15121f', 750);
          txt(g, p[1], x + 24, t + 456, 16, '#6b6580', 500); txt(g, p[2], x + 24, t + 500, 30, '#15121f', 800);
          box(g, x + 176, t + 476, 96, 38, 19, '#a43dff'); txt(g, 'Buy', x + 224, t + 500, 15, '#ffffff', 700, SANS, 'center');
        });
      } else if (kind === 'ngo') {
        g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); t = chrome(g, w, 'brightwells.org', false);
        circle(g, 52, t + 38, 12, '#0f766e'); txt(g, 'Bright Wells', 72, t + 45, 20, '#0b3b38', 750);
        ['Our work', 'Projects', 'ANBI'].forEach(function (s, i) { txt(g, s, 560 + i * 100, t + 45, 14, '#355f5b', 500); });
        box(g, w - 120, t + 24, 84, 34, 17, '#f59e0b'); txt(g, 'Donate', w - 78, t + 46, 14, '#3b2400', 750, SANS, 'center');
        var ng = g.createLinearGradient(0, t + 70, 0, t + 360); ng.addColorStop(0, '#0f766e'); ng.addColorStop(1, '#0b4f4a'); g.fillStyle = ng; g.fillRect(0, t + 70, w, 290);
        g.fillStyle = 'rgba(255,255,255,.07)'; for (var wv = 0; wv < 4; wv++) { g.beginPath(); g.arc(860, t + 380, 120 + wv * 60, Math.PI, Math.PI * 2); g.lineWidth = 18; g.strokeStyle = 'rgba(255,255,255,.07)'; g.stroke(); }
        txt(g, 'CLEAN WATER · 2026', 40, t + 118, 12, '#99f6e4', 700, SANS);
        txt(g, '€25 gives one child', 40, t + 176, 46, '#ffffff', 750); txt(g, 'clean water for a year.', 40, t + 230, 46, '#ffffff', 750);
        box(g, 40, t + 262, 380, 56, 28, '#ffffff');
        ['€10', '€25', '€50'].forEach(function (a, i) { box(g, 46 + i * 84, t + 268, 78, 44, 22, i === 1 ? '#0f766e' : '#ffffff'); txt(g, a, 85 + i * 84, t + 297, 16, i === 1 ? '#ffffff' : '#0b3b38', 750, SANS, 'center'); });
        box(g, 300, t + 268, 114, 44, 22, '#f59e0b'); txt(g, 'Give now', 357, t + 297, 15, '#3b2400', 750, SANS, 'center');
        [['12,480', 'people with clean water'], ['38', 'wells built'], ['1,206', 'monthly donors']].forEach(function (p, i) {
          var x = 40 + i * 320; txt(g, p[0], x, t + 430, 40, '#0b3b38', 800); txt(g, p[1], x, t + 460, 15, '#5b7f7b', 500);
        });
        box(g, 40, t + 490, w - 80, 56, 12, '#f0fdfa'); txt(g, 'ANBI registered · 100% of your gift goes to projects · Yearly report 2025', 64, t + 524, 15, '#0f766e', 600);
      } else if (kind === 'skincare') {
        g.fillStyle = '#f4ede6'; g.fillRect(0, 0, w, h); t = chrome(g, w, 'veloursskin.nl', false);
        txt(g, 'velours', w / 2, t + 48, 30, '#3b2a22', 400, 'Georgia, serif', 'center');
        ['Shop', 'Skin quiz', 'Ingredients'].forEach(function (s, i) { txt(g, s, 40 + i * 100, t + 45, 14, '#6b574c', 500); });
        txt(g, 'Bag (2)', w - 40, t + 45, 14, '#3b2a22', 600, SANS, 'right');
        txt(g, 'Skincare that', 40, t + 170, 52, '#3b2a22', 400, 'Georgia, serif'); txt(g, 'keeps it simple.', 40, t + 230, 52, '#3b2a22', 400, 'Georgia, serif');
        txt(g, 'Three steps. Clean ingredients. Refills every 6 weeks.', 40, t + 270, 17, '#7a6558', 400);
        box(g, 40, t + 296, 190, 48, 24, '#3b2a22'); txt(g, 'Take the skin quiz', 135, t + 326, 15, '#f4ede6', 650, SANS, 'center');
        var sk = g.createRadialGradient(780, t + 220, 10, 780, t + 220, 220); sk.addColorStop(0, '#e8d5c4'); sk.addColorStop(1, '#f4ede6'); g.fillStyle = sk; g.fillRect(560, t + 80, 440, 300);
        // bottles
        box(g, 680, t + 140, 70, 200, 14, '#ffffff'); box(g, 696, t + 112, 38, 32, 6, '#a8b5a0');
        box(g, 770, t + 190, 90, 150, 20, '#c9a58a'); box(g, 790, t + 170, 50, 24, 6, '#3b2a22');
        box(g, 880, t + 250, 80, 90, 40, '#ffffff'); box(g, 890, t + 236, 60, 18, 8, '#a8b5a0');
        txt(g, 'V', 715, t + 250, 26, '#3b2a22', 400, 'Georgia, serif', 'center');
        [['Cleanse', 'Oat milk cleanser', '€24'], ['Treat', 'Niacinamide serum', '€32'], ['Hydrate', 'Barrier cream', '€28']].forEach(function (p, i) {
          var x = 40 + i * 320; box(g, x, t + 400, 296, 140, 16, '#fbf8f4');
          box(g, x + 18, t + 418, 70, 104, 12, i === 1 ? '#c9a58a' : '#ffffff');
          txt(g, p[0].toUpperCase(), x + 108, t + 444, 11, '#8a9a82', 700, SANS); txt(g, p[1], x + 108, t + 474, 16, '#3b2a22', 600);
          txt(g, p[2], x + 108, t + 510, 20, '#3b2a22', 400, 'Georgia, serif');
        });
      } else if (TPL[kind]) {
        tplScreen(TPL[kind], g, w, h);
      } else {
        g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); t = chrome(g, w, (title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com', false);
        txt(g, title || '', 60, t + 260, 64, INK, 750); box(g, 60, t + 300, 160, 46, 10, OR);
      }
    };
  }
  /* ---------- project phone screens (360 × 740; the caller paints the notch) ---------- */
  function phoneWork(g, w, h, k, title) {
    if (TPL[k]) { tplPhone(TPL[k], g, w, h); return; }
      if (k === 'hesed') { g.fillStyle = '#f7f1e8'; g.fillRect(0, 50, w, h); var gr = g.createLinearGradient(0, 120, w, 420); gr.addColorStop(0, '#6b4a8a'); gr.addColorStop(1, '#2a1d3a'); g.fillStyle = gr; rr(g, 18, 110, w - 36, 300, 18); g.fill(); txt(g, 'Hesed', 24, 90, 24, '#2a1d3a', 700, 'Georgia, serif'); txt(g, 'A church that', 40, 230, 30, '#ffffff', 400, 'Georgia, serif'); txt(g, 'shows up.', 40, 270, 30, '#ffffff', 400, 'Georgia, serif'); box(g, 40, 300, 130, 40, 8, '#c4923a'); box(g, 18, 440, w - 36, 120, 14, '#ffffff'); txt(g, 'Give with iDEAL', w / 2, 510, 18, '#2a1d3a', 700, SANS, 'center'); return; }
      if (k === 'sidwalk') { txt(g, 'SIDWALK', w / 2, 260, 64, '#f2f2f2', 900, SANS, 'center'); box(g, 60, 300, w - 120, 46, 0, '#f2f2f2'); txt(g, 'SHOP THE DROP', w / 2, 330, 15, '#0e0e0e', 800, SANS, 'center'); g.fillStyle = '#1d1d1d'; g.fillRect(18, 380, w / 2 - 27, 220); g.fillRect(w / 2 + 9, 380, w / 2 - 27, 220); return; }
      if (k === 'crea8or') { txt(g, 'Crea8or', 24, 90, 24, '#5b3df5', 800); txt(g, 'Hire creators', 24, 180, 34, '#15121f', 750); txt(g, 'who deliver.', 24, 222, 34, '#15121f', 750); box(g, 24, 250, w - 48, 50, 12, '#f3f0ff'); box(g, 24, 330, w - 48, 90, 14, '#15121f'); txt(g, '€ 1.240,00', 48, 384, 26, '#ffffff', 750); return; }
      if (k === 'prkiosk') { g.fillStyle = '#fbfaf7'; g.fillRect(0, 50, w, h); txt(g, 'THE PR KIOSK', 24, 92, 20, '#111111', 900, 'Georgia, serif'); g.fillStyle = '#d62839'; g.fillRect(24, 102, 40, 4); txt(g, 'Get your story', 24, 190, 34, '#111111', 700, 'Georgia, serif'); txt(g, 'in the news.', 24, 232, 34, '#111111', 700, 'Georgia, serif'); box(g, 24, 270, w - 48, 170, 6, '#111111'); txt(g, 'FEATURE', 48, 306, 12, '#ff8f9a', 700, SANS); txt(g, '€399', 48, 366, 44, '#ffffff', 700, 'Georgia, serif'); box(g, 48, 390, w - 96, 36, 4, '#d62839'); txt(g, 'Choose', w / 2, 414, 14, '#ffffff', 650, SANS, 'center'); return; }
      if (k === 'shop4likes') { var pg = g.createLinearGradient(0, 50, w, 420); pg.addColorStop(0, '#ff3d77'); pg.addColorStop(1, '#4f46e5'); g.fillStyle = pg; g.fillRect(0, 50, w, 380); txt(g, 'Shop4likes', 24, 96, 22, '#ffffff', 800); txt(g, 'Grow your', 24, 200, 36, '#ffffff', 800); txt(g, 'socials.', 24, 244, 36, '#ffffff', 800); box(g, 24, 280, 170, 46, 23, '#ffffff'); txt(g, 'Pick a package', 109, 309, 15, '#a43dff', 750, SANS, 'center'); stroke(g, 18, 456, w - 36, 120, 18, '#ece9f5', 2); circle(g, 56, 496, 18, '#ff3d77'); txt(g, '1,000 followers', 86, 503, 17, '#15121f', 700); txt(g, '€9.99', 40, 556, 28, '#15121f', 800); return; }
      if (k === 'ngo') { g.fillStyle = '#0f766e'; g.fillRect(0, 50, w, 420); txt(g, 'Bright Wells', 24, 96, 22, '#ffffff', 750); txt(g, '€25 gives one', 24, 200, 32, '#ffffff', 750); txt(g, 'child clean water.', 24, 240, 32, '#ffffff', 750); box(g, 24, 280, w - 48, 54, 27, '#f59e0b'); txt(g, 'Give €25 with iDEAL', w / 2, 314, 17, '#3b2400', 750, SANS, 'center'); txt(g, '12,480', 24, 540, 40, '#0b3b38', 800); txt(g, 'people with clean water', 24, 570, 15, '#5b7f7b', 500); return; }
      if (k === 'skincare') { g.fillStyle = '#f4ede6'; g.fillRect(0, 50, w, h); txt(g, 'velours', w / 2, 98, 28, '#3b2a22', 400, 'Georgia, serif', 'center'); txt(g, 'Skincare that', 24, 190, 32, '#3b2a22', 400, 'Georgia, serif'); txt(g, 'keeps it simple.', 24, 230, 32, '#3b2a22', 400, 'Georgia, serif'); box(g, 110, 280, 60, 170, 12, '#ffffff'); box(g, 186, 320, 74, 130, 18, '#c9a58a'); box(g, 24, 490, w - 48, 52, 26, '#3b2a22'); txt(g, 'Take the skin quiz', w / 2, 522, 16, '#f4ede6', 650, SANS, 'center'); return; }
    txt(g, title || '', 24, 200, 34, INK, 750);
  }

  var KINDS = ['hesed', 'sidwalk', 'crea8or', 'prkiosk', 'shop4likes', 'ngo', 'skincare'].concat(Object.keys(TPL)).concat(['generic']);

  window.ACE360_PAINT = {
    SANS: SANS, MONO: MONO,
    mk: mk, rr: rr, box: box, stroke: stroke, txt: txt, bars: bars, circle: circle, chrome: chrome,
    kinds: KINDS,
    screen: workScreen,
    phone: phoneWork,
    // Paint a project's desktop screen into any canvas, scaled to fit.
    paint: function (canvas, kind, title) {
      var g = canvas.getContext('2d'), sc = canvas.width / 1024;
      g.save(); g.scale(sc, canvas.height / 640); workScreen(KINDS.indexOf(kind) < 0 ? 'generic' : kind)(g, 1024, 640, title); g.restore();
    }
  };
})();
