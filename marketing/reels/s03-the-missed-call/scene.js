/* Short 03 · Story: "The missed call." A made-up salon owner (Noor, labelled as an example) misses a call mid-haircut;
   the caller books elsewhere. Lesson: let the website answer: visible prices, online booking with real times, automatic reminders.
   Storyteller pacing; ends on like / share / subscribe. Text kept inside the Shorts safe area (top 120, bottom 380, right 150 px). */
(function () {
  var mock = null, phoneC = null, ROSE = '#b0476a', PLUM = '#3a2030', GREY = '#7a6f73', CREAMY = '#fbf6f2';
  function rrOn(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
  function txOn(x, S, s, a, b, sz, col, wt, al, alpha, fam) { x.globalAlpha = alpha == null ? 1 : alpha; x.font = (wt || 500) + ' ' + sz + 'px ' + (fam || S); x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, a, b); x.globalAlpha = 1; }

  // Noor's website, drawn fresh so it can change: k1 prices, k2 online booking
  function site(K, k1, k2) {
    var c = mock || (mock = K.mkc(1024, 640)), x = c.getContext('2d'), S = K.SANS, SER = K.SERIF;
    function tx(s, a, b, sz, col, wt, al, alpha, fam) { txOn(x, S, s, a, b, sz, col, wt, al, alpha, fam); }
    x.fillStyle = CREAMY; x.fillRect(0, 0, 1024, 640);
    x.fillStyle = '#efe7e1'; x.fillRect(0, 0, 1024, 36);
    ['#ff5f57', '#febc2e', '#28c840'].forEach(function (cl, i) { x.beginPath(); x.arc(20 + i * 16, 18, 5, 0, 7); x.fillStyle = cl; x.fill(); });
    rrOn(x, 372, 8, 280, 20, 10); x.fillStyle = '#fff'; x.fill(); tx('salonnoor.nl', 512, 23, 12, GREY, 500, 'center');
    x.font = 'italic 400 34px ' + SER; x.fillStyle = PLUM; x.textAlign = 'left'; x.fillText('Salon Noor', 40, 84);
    ['Home', 'About', 'Contact'].forEach(function (n, i) { tx(n, 640 + i * 90, 80, 15, GREY, 500, 'left', 1 - k2); });
    ['Prices', 'About', 'Contact'].forEach(function (n, i) { tx(n, 600 + i * 86, 80, 15, PLUM, 600, 'left', k2); });
    if (k2 > 0) { x.globalAlpha = k2; rrOn(x, 878, 58, 110, 34, 17); x.fillStyle = ROSE; x.fill(); x.globalAlpha = 1; tx('Book', 933, 80, 15, '#fff', 700, 'center', k2); }
    x.fillStyle = 'rgba(0,0,0,0.07)'; x.fillRect(0, 112, 1024, 1);
    // hero photo: soft salon shapes (mirror, chair)
    var gr = x.createLinearGradient(560, 140, 990, 600); gr.addColorStop(0, '#f1d9d6'); gr.addColorStop(1, '#d9a6ad');
    rrOn(x, 580, 140, 404, 300, 22); x.fillStyle = gr; x.fill();
    x.save(); rrOn(x, 580, 140, 404, 300, 22); x.clip();
    x.beginPath(); x.ellipse(782, 250, 70, 92, 0, 0, 7); x.fillStyle = 'rgba(255,255,255,0.55)'; x.fill(); x.lineWidth = 6; x.strokeStyle = 'rgba(255,255,255,0.8)'; x.stroke();
    rrOn(x, 720, 350, 124, 70, 18); x.fillStyle = 'rgba(58,32,48,0.55)'; x.fill(); x.fillRect(776, 420, 12, 30);
    x.restore();
    // hero copy
    tx('HAIR & BEAUTY · CITY CENTRE', 40, 176, 13, ROSE, 700);
    tx('Welcome to', 40, 236, 46, PLUM, 800); tx('Salon Noor.', 40, 290, 46, PLUM, 800);
    tx('Cuts, colour and styling in a relaxed setting.', 40, 330, 17, GREY, 400);
    // before: the only way in is a phone call
    var ph = 1 - k2 * 0.55;
    x.globalAlpha = 1; rrOn(x, 40, 362, 420 * ph + 60 * (1 - ph), 70 * ph + 20, 14); x.fillStyle = 'rgba(176,71,106,' + (0.12 * (1 - k2)) + ')'; x.fill();
    tx('☎  Call us: 020 ··· ····', 62, 362 + 46 * ph, Math.round(30 * ph), PLUM, 800, 'left', 1 - k2 * 0.6);
    tx('Call us for prices', 40, 476, 18, GREY, 500, 'left', 1 - k1);
    // after (k2): online booking with real free times
    if (k2 > 0) {
      x.globalAlpha = k2; rrOn(x, 40, 362, 250, 54, 27); x.fillStyle = ROSE; x.fill(); x.globalAlpha = 1;
      tx('Book online  →', 165, 396, 19, '#fff', 800, 'center', k2);
      tx('or call 020 ··· ····', 306, 396, 15, GREY, 500, 'left', k2);
    }
    // prices (k1)
    if (k1 > 0) {
      var rows = [['Cut & blow-dry', 'from €45'], ['Colour', 'from €65'], ['Kids’ cut', 'from €25']];
      x.globalAlpha = k1; rrOn(x, 40, 452, 520, 160, 16); x.fillStyle = '#fff'; x.fill(); x.strokeStyle = 'rgba(0,0,0,0.08)'; x.lineWidth = 1; x.stroke(); x.globalAlpha = 1;
      tx('PRICES', 60, 482, 12, ROSE, 700, 'left', k1);
      rows.forEach(function (r, i) { tx(r[0], 60, 516 + i * 34, 18, PLUM, 600, 'left', k1); tx(r[1], 540, 516 + i * 34, 18, PLUM, 700, 'right', k1); });
    }
    if (k2 > 0) {
      ['Today 15:30', 'Thu 14:00', 'Fri 10:00'].forEach(function (s, i) {
        var a = K.c01(k2 * 3 - i); x.globalAlpha = a; rrOn(x, 590 + i * 132, 470, 122, 42, 21); x.fillStyle = '#fff'; x.fill(); x.strokeStyle = ROSE; x.lineWidth = 1.5; x.stroke(); x.globalAlpha = 1;
        tx(s, 651 + i * 132, 497, 15, PLUM, 700, 'center', a);
      });
      tx('FREE TIMES THIS WEEK', 590, 456, 12, ROSE, 700, 'left', k2);
    }
    return c;
  }

  // the phone: 'ring' incoming call, 'missed', 'lock' with booking notifications, 'sms' reminder
  function phoneUI(K, t, mode, n) {
    var c = phoneC || (phoneC = K.mkc(360, 740)), x = c.getContext('2d'), S = K.SANS, M = K.MONO;
    function tx(s, a, b, sz, col, wt, al, alpha, fam) { txOn(x, S, s, a, b, sz, col, wt, al, alpha, fam); }
    var bg = x.createLinearGradient(0, 0, 0, 740); bg.addColorStop(0, '#2a1d24'); bg.addColorStop(1, '#120d10'); x.fillStyle = bg; x.fillRect(0, 0, 360, 740);
    x.fillStyle = '#000'; rrOn(x, 128, 14, 104, 26, 13); x.fill();
    if (mode === 'ring' || mode === 'missed') {
      tx('11:00', 180, 120, 20, 'rgba(255,255,255,0.7)', 600, 'center');
      tx(mode === 'ring' ? 'incoming call…' : 'missed call', 180, 210, 18, mode === 'ring' ? 'rgba(255,255,255,0.6)' : '#ff6b6b', 600, 'center', 1, M);
      x.beginPath(); x.arc(180, 300, 54, 0, 7); x.fillStyle = 'rgba(255,255,255,0.12)'; x.fill(); tx('?', 180, 320, 52, '#fff', 700, 'center');
      tx('+31 6 ·· ·· ·· 14', 180, 400, 22, '#fff', 700, 'center');
      tx('Mobile · not in contacts', 180, 430, 14, 'rgba(255,255,255,0.5)', 500, 'center');
      if (mode === 'ring') {
        [[90, '#ff4d4d'], [270, '#2bd17e']].forEach(function (b) { x.beginPath(); x.arc(b[0], 620, 36, 0, 7); x.fillStyle = b[1]; x.fill(); });
        tx('✕', 90, 632, 30, '#fff', 800, 'center'); tx('✓', 270, 632, 30, '#fff', 800, 'center');
      } else {
        rrOn(x, 40, 560, 280, 70, 20); x.fillStyle = 'rgba(255,255,255,0.08)'; x.fill(); tx('No voicemail', 180, 603, 18, 'rgba(255,255,255,0.7)', 600, 'center');
      }
    } else if (mode === 'lock') {
      tx('Tuesday', 180, 110, 18, 'rgba(255,255,255,0.7)', 600, 'center'); tx('11:00', 180, 190, 72, '#fff', 300, 'center');
      var notes = [['New booking · Wed 10:00', 'booked online · 23:41'], ['New booking · Thu 14:00', 'booked online · 00:12'], ['New booking · Sat 11:30', 'booked online · 06:58']];
      notes.forEach(function (r, i) {
        var a = K.c01(n * 3 - i); if (a <= 0) return; var y = 250 + i * 92;
        x.globalAlpha = a; rrOn(x, 18, y, 324, 80, 18); x.fillStyle = 'rgba(255,255,255,0.9)'; x.fill();
        rrOn(x, 30, y + 16, 46, 46, 12); x.fillStyle = ROSE; x.fill(); x.globalAlpha = 1;
        tx('N', 53, y + 48, 24, '#fff', 800, 'center', a); tx(r[0], 88, y + 36, 15, '#111', 700, 'left', a); tx(r[1], 88, y + 58, 12, '#555', 500, 'left', a, M);
      });
    } else {
      tx('Messages', 180, 90, 16, 'rgba(255,255,255,0.7)', 700, 'center');
      tx('Salon Noor', 180, 130, 22, '#fff', 700, 'center'); tx('yesterday, 11:00', 180, 200, 12, 'rgba(255,255,255,0.45)', 500, 'center', 1, M);
      var a = K.c01(n * 2);
      x.globalAlpha = a; rrOn(x, 18, 220, 290, 160, 22); x.fillStyle = '#3a3036'; x.fill(); x.globalAlpha = 1;
      ['Reminder: your appointment', 'at Salon Noor is tomorrow,', 'Thu 14:00. See you then!', 'Need to change it? Tap here.'].forEach(function (l, i) { tx(l, 36, 256 + i * 30, 16, i === 3 ? '#ff9fbd' : '#fff', 500, 'left', a); });
      tx('sent automatically', 26, 404, 12, 'rgba(255,255,255,0.45)', 500, 'left', a, M);
    }
    return c;
  }

  function thumb(K, cx, cy, s, on) { // like icon
    var g = K.g; g.save(); g.translate(cx, cy); g.scale(s, s);
    g.fillStyle = on ? K.CREAM : 'rgba(244,239,233,0.9)';
    K.rr(-34, -6, 16, 40, 4); g.fill();
    g.beginPath(); g.moveTo(-12, -6); g.lineTo(2, -32); g.quadraticCurveTo(8, -42, 14, -34); g.lineTo(10, -12); g.lineTo(30, -12);
    g.quadraticCurveTo(40, -10, 36, 2); g.lineTo(30, 28); g.quadraticCurveTo(28, 34, 20, 34); g.lineTo(-12, 34); g.closePath(); g.fill();
    g.restore();
  }
  function share(K, cx, cy, s) { // share icon: curved arrow
    var g = K.g; g.save(); g.translate(cx, cy); g.scale(s, s); g.fillStyle = 'rgba(244,239,233,0.9)';
    g.beginPath(); g.moveTo(4, -30); g.lineTo(36, 0); g.lineTo(4, 30); g.lineTo(4, 12); g.quadraticCurveTo(-24, 10, -36, 30); g.quadraticCurveTo(-30, -10, 4, -12); g.closePath(); g.fill();
    g.restore();
  }
  function bell(K, cx, cy, s, col) {
    var g = K.g; g.save(); g.translate(cx, cy); g.scale(s, s); g.fillStyle = col;
    g.beginPath(); g.moveTo(-18, 10); g.quadraticCurveTo(-18, -18, 0, -20); g.quadraticCurveTo(18, -18, 18, 10); g.lineTo(22, 16); g.lineTo(-22, 16); g.closePath(); g.fill();
    g.beginPath(); g.arc(0, 20, 6, 0, Math.PI); g.fill(); g.restore();
  }
  function cursor(K, x, y, press) {
    var g = K.g; g.save(); g.translate(x, y); g.scale(1.6 - press * 0.2, 1.6 - press * 0.2);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 30); g.lineTo(8, 23); g.lineTo(14, 36); g.lineTo(19, 34); g.lineTo(13, 21); g.lineTo(23, 21); g.closePath();
    g.fillStyle = '#111'; g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 2.5; g.stroke(); g.restore();
  }
  function storyLabel(K, a) {
    if (a <= 0) return; var g = K.g; g.save(); g.globalAlpha *= a;
    K.font(700, 24, K.MONO); var s = 'A STORY · NOOR IS A MADE-UP EXAMPLE', w = g.measureText(s).width + 40;
    K.rr(70, 150, w, 46, 23); g.fillStyle = '#1d1814'; g.fill(); g.strokeStyle = 'rgba(255,255,255,0.15)'; g.lineWidth = 2; g.stroke();
    K.text(s, 90, 182, 24, K.MUTED, 700, 'left', K.MONO); g.restore();
  }
  function lines(K, t, arr, x, y, size, gap) { // story captions that build one by one: [text, start]
    arr.forEach(function (l, i) { var k = K.ease(K.seg(t, l[1], l[1] + 0.5)); if (k <= 0) return; var g = K.g; g.save(); g.globalAlpha *= k; g.translate(0, (1 - k) * 24); K.rich(l[0], x, y + i * gap, size); g.restore(); });
  }

  var X0 = 40, Y0 = 600, CW = 1000;
  var RING = []; for (var r = 0; r < 3; r++) for (var q = 0; q < 4; q++) RING.push(+(3.3 + r * 0.8 + q * 0.07).toFixed(2));

  window.REEL_SCENE = {
    duration: 59.5,
    cues: { cover: 16.6, low: 92, beat: [19.2, 45.9], tick: RING, whoosh: [5.8, 11.3, 19.1, 39.8, 46.2, 52.4], chime: [21.4, 27.6, 34.0, 44.1, 44.5, 44.9], click: [57.4], swell: [10.0, 50.5], hit: [52.4] },
    draw: function (t, K) {
      var g = K.g;
      // night falls between the call and the fixes
      var night = K.ease(K.seg(t, 11.0, 12.0)) * (1 - K.ease(K.seg(t, 19.0, 20.0)));
      if (night > 0) { g.save(); g.globalAlpha = night * 0.55; g.fillStyle = '#0a1130'; g.fillRect(0, 0, K.W, K.H); g.globalAlpha = night;
        g.beginPath(); g.arc(860, 250, 46, 0, 7); g.fillStyle = '#f4efe9'; g.fill(); g.beginPath(); g.arc(842, 236, 44, 0, 7); g.fillStyle = 'rgba(10,17,48,0.92)'; g.fill(); g.restore(); }

      storyLabel(K, K.ease(K.seg(t, 0.2, 0.7)) * (1 - K.seg(t, 51.8, 52.3)));

      // ---- 0–11 the call ----
      var ca = 1 - K.seg(t, 10.9, 11.3);
      if (ca > 0) {
        g.save(); g.globalAlpha = ca;
        var first = 1 - K.seg(t, 5.5, 5.9);
        if (first > 0) { g.save(); g.globalAlpha = ca * first; lines(K, t, [['*Tuesday*, 11:00.', 0.1], ['Noor is halfway through', 2.3], ['a *haircut*…', 2.5]], 70, 340, 76, 96); g.restore(); }
        var mode = t < 5.9 ? 'ring' : 'missed', shake = mode === 'ring' && t > 3.3 ? Math.sin(t * 60) * 6 * (Math.sin(t * 7.8) > 0 ? 1 : 0) : 0;
        var pe = K.ease(K.seg(t, 1.0, 1.8));
        g.save(); g.translate(shake, 0); K.phone(560, 640 + (1 - pe) * 160, 380, phoneUI(K, t, mode), pe, 0.04); g.restore();
        if (mode === 'ring' && t > 3.3) { for (var w = 0; w < 3; w++) { var p = ((t - 3.3) * 0.9 + w / 3) % 1; g.save(); g.globalAlpha = ca * (1 - p) * 0.6; g.strokeStyle = K.OR; g.lineWidth = 6; g.beginPath(); g.arc(750, 1030, 240 + p * 160, -0.6, 0.6); g.stroke(); g.beginPath(); g.arc(750, 1030, 240 + p * 160, Math.PI - 0.6, Math.PI + 0.6); g.stroke(); g.restore(); } }
        // what happens next, under the phone's left side
        var la = K.ease(K.seg(t, 5.9, 6.3));
        g.save(); g.globalAlpha = ca * la; lines(K, t, [['She can’t *answer*.', 5.9]], 70, 340, 76, 96); g.restore();
        [['No message.', 7.33, K.MUTED], ['Booked somewhere *else*.', 9.51, K.CREAM]].forEach(function (r, i) {
          var k = K.ease(K.seg(t, r[1], r[1] + 0.4)); if (k <= 0) return;
          g.save(); g.globalAlpha = ca * k; g.translate((1 - k) * -40, 0);
          K.rr(70, 1150 + i * 120, 470, 96, 24); g.fillStyle = i ? 'rgba(255,90,90,0.16)' : 'rgba(255,255,255,0.08)'; g.fill();
          K.rich(r[0], 96, 1212 + i * 120, 36, r[2]); g.restore();
        });
        g.restore();
      }

      // ---- 11–39.6 the website, then three fixes ----
      var k1 = K.inOut(K.seg(t, 21.4, 22.4)), k2 = K.inOut(K.seg(t, 27.6, 28.6));
      var sa = K.win(t, 11.3, 39.9, 0.5, 0.4);
      if (sa > 0) {
        g.save(); g.globalAlpha = sa;
        var src = site(K, k1, k2), ch = CW * 640 / 1024;
        var shrink = K.inOut(K.seg(t, 33.8, 34.6)); // make room for the reminder phone
        var sc = K.lerp(1, 0.86, shrink), cw = CW * sc;
        K.windowCard(X0, Y0, cw, src, K.ease(K.seg(t, 11.4, 12.2)), 1);
        var S = cw / 1024, mx = function (v) { return X0 + v * S; }, my = function (v) { return Y0 + v * S; };
        // the old site: a phone number and "call us for prices"
        if (t > 15.6 && t < 21.6) { var bk = K.ease(K.seg(t, 15.84, 16.3)) * (1 - K.seg(t, 21.0, 21.6)); g.save(); g.globalAlpha *= bk; g.strokeStyle = K.RED; g.lineWidth = 6; K.rr(mx(30), my(354), 440 * S, 98 * S, 14); g.stroke(); g.restore(); }
        if (t > 17.0 && t < 21.6) K.marker(mx(130), my(470), 120 * S + 10, 26, K.ease(K.seg(t, 17.2, 17.9)) * (1 - K.seg(t, 21.0, 21.6)), K.RED, 6);
        if (t > 21.8 && t < 27.4) { var gk = K.ease(K.seg(t, 22.2, 22.6)) * (1 - K.seg(t, 27.0, 27.4)); g.save(); g.globalAlpha *= gk; g.strokeStyle = K.GREEN; g.lineWidth = 6; K.rr(mx(30), my(442), 540 * S, 180 * S, 16); g.stroke(); g.restore(); }
        if (t > 28.2 && t < 34.0) { var gb = K.ease(K.seg(t, 28.6, 29.0)) * (1 - K.seg(t, 33.6, 34.0)); g.save(); g.globalAlpha *= gb; g.strokeStyle = K.GREEN; g.lineWidth = 6; K.rr(mx(30), my(352), 270 * S, 74 * S, 16); g.stroke(); K.rr(mx(580), my(440), 420 * S, 82 * S, 16); g.stroke(); g.restore(); }
        // midnight booking
        K.notification(500, 1390, 'New booking · Thu 14:00', 'booked online at 00:12', K.ease(K.seg(t, 31.2, 31.6)) * (1 - K.seg(t, 33.4, 33.8)), 'N', ROSE);
        // fix 3: the reminder arrives on the customer's phone
        var pr = K.ease(K.seg(t, 34.4, 35.2));
        if (pr > 0) K.phone(600, 860 + (1 - pr) * 300, 300, phoneUI(K, t, 'sms', K.seg(t, 35.2, 36.2)), pr, 0.05);
        // captions
        var cap = [
          [11.4, 19.1, 'That night', ['Noor opens *her*', '*own* website.'], [['A phone number.', 15.84], ['And “call us for *prices*”.', 17.2]]],
          [19.2, 27.3, 'Fix 1 of 3', ['Prices, *out in*', '*the open*.'], [['A “from” price answers', 23.81], ['what callers *wanted to ask*.', 24.1]]],
          [27.4, 33.7, 'Fix 2 of 3', ['Booking, with *real*', '*free times*.'], [['Book at midnight,', 30.72], ['*without calling*.', 31.0]]],
          [33.8, 39.8, 'Fix 3 of 3', ['An automatic', '*reminder*.'], [['Sent the day *before*,', 35.4], ['so it’s harder to *forget*.', 36.6]]]
        ];
        cap.forEach(function (c, i) {
          var a = K.win(t, c[0], c[1], 0.35, 0.3); if (a <= 0) return;
          g.save(); g.globalAlpha = sa * a;
          if (i) K.steps(3, i - 1, 70, 210, sa * a); g.globalAlpha = sa * a;
          K.kicker(c[2], 70, 270, 1); K.headline(c[3], 70, 380, 80, c[0] + 0.05, t, 96);
          if (i === 3) { lines(K, t, c[4], 70, 1260, 40, 56); }
          else if (i !== 2 || t < 31.0) { lines(K, t, c[4], 70, 1300, 44, 60); }
          g.restore();
        });
        if (t > 19.2 && t < 21.2) { g.save(); g.globalAlpha = sa * K.win(t, 19.2, 21.2, 0.3, 0.3); K.text('So she changes three things.', 70, 1320, 44, K.CREAM, 700); g.restore(); }
        g.restore();
      }

      // ---- 39.9–46 next Tuesday ----
      var na = K.win(t, 39.8, 46.2, 0.4, 0.35);
      if (na > 0) {
        g.save(); g.globalAlpha = na;
        lines(K, t, [['Next *Tuesday*, 11:00.', 39.9], ['The phone stays *quiet*.', 42.31]], 70, 340, 70, 92);
        K.phone(330, 620, 420, phoneUI(K, t, 'lock', K.seg(t, 44.0, 45.4)), K.ease(K.seg(t, 40.1, 40.8)), -0.03);
        g.restore();
      }

      // ---- 46.2–52.4 the lesson ----
      var le = K.win(t, 46.2, 52.5, 0.4, 0.35);
      if (le > 0) {
        g.save(); g.globalAlpha = le;
        lines(K, t, [['Noor is *made up*.', 46.3], ['The missed call *isn’t*.', 47.83]], 70, 380, 70, 96);
        K.headline(['When your hands are busy,', 'let your *website answer*.'], 70, 720, 64, 49.43, t, 82);
        [['Prices you can see', 50.4], ['Book online, any hour', 50.7], ['Automatic reminders', 51.0]].forEach(function (r, i) {
          K.tag('✓ ' + r[0], 70, 1000 + i * 92, K.GREEN, K.back(K.seg(t, r[1], r[1] + 0.4)));
        });
        g.restore();
      }

      // ---- 52.4–59.5 like, share, subscribe ----
      var ea = K.ease(K.seg(t, 52.4, 52.9));
      if (ea > 0) {
        g.save(); g.globalAlpha = ea;
        K.headline(['Found this', '*useful*?'], 540, 400, 110, 52.45, t, 126, 'center');
        var likeK = K.back(K.seg(t, 53.4, 53.8)), likeOn = t > 54.0, shareK = K.back(K.seg(t, 54.6, 55.0));
        [[340, likeK, 'Like'], [740, shareK, 'Share']].forEach(function (b, i) {
          if (b[1] <= 0) return; g.save(); g.globalAlpha = ea * K.c01(b[1]); g.translate(b[0], 760); g.scale(b[1], b[1]);
          g.beginPath(); g.arc(0, 0, 92, 0, 7); g.fillStyle = i === 0 && likeOn ? K.OR : 'rgba(255,255,255,0.1)'; g.fill(); g.strokeStyle = 'rgba(255,255,255,0.2)'; g.lineWidth = 3; g.stroke();
          if (i === 0) thumb(K, 0, -4, 1.5, likeOn); else share(K, 0, 0, 1.4);
          g.restore(); K.text(b[2], b[0], 900, 40, K.CREAM, 700, 'center');
        });
        // subscribe: the cursor taps it and it turns into "Subscribed"
        var sk = K.back(K.seg(t, 56.6, 57.0)), subbed = t > 57.5, press = K.c01(1 - Math.abs(t - 57.45) / 0.12);
        if (sk > 0) {
          g.save(); g.globalAlpha = ea * K.c01(sk); g.translate(540, 1080); g.scale(K.lerp(0.9, 1, sk) * (1 - press * 0.04), K.lerp(0.9, 1, sk) * (1 - press * 0.04));
          g.shadowColor = subbed ? 'transparent' : 'rgba(255,40,40,0.55)'; g.shadowBlur = 50;
          K.rr(-300, -64, 600, 128, 64); g.fillStyle = subbed ? '#2a2522' : '#e8231f'; g.fill(); g.shadowColor = 'transparent';
          if (subbed) { bell(K, -170, -2, 1.6, K.CREAM); K.text('Subscribed', -118, 20, 54, K.CREAM, 800, 'left'); }
          else K.text('SUBSCRIBE', 0, 20, 58, '#fff', 800, 'center');
          g.restore();
          var mk = K.inOut(K.seg(t, 56.8, 57.4));
          if (t < 58.6) cursor(K, K.lerp(820, 600, mk), K.lerp(1300, 1100, mk), press);
        }
        var fa = K.ease(K.seg(t, 57.8, 58.3));
        if (fa > 0) { g.save(); g.globalAlpha = ea * fa; K.logoRing(320, 1290, 30, K.ease(K.seg(t, 57.8, 58.8)), 7); K.text('Ace 360 · website tips', 370, 1286, 36, K.CREAM, 700); K.text('ace360services.nl', 370, 1330, 28, K.MUTED, 600, 'left', K.MONO); g.restore(); }
        g.restore();
      }
    }
  };
})();
