/* Short 01 · One-minute website clinic: "Your homepage has 5 seconds to answer 3 questions."
   A concept homepage (Loop Fysio, fictional) fails the 5-second test, then gets fixed one question at a time.
   Education first; text kept inside the YouTube Shorts safe area (top 120, bottom 380, right 150 px). */
(function () {
  var mock = null, NAVY = '#13233a', TEAL = '#0f8b8d', GREY = '#6b7480';
  function mix(a, b, k) { return a * (1 - k) + b * k; }
  // the concept homepage, drawn fresh each frame so its parts can morph: k1 headline, k2 audience, k3 next step
  function homepage(K, k1, k2, k3) {
    var c = mock || (mock = K.mkc(1024, 640)), x = c.getContext('2d'), S = K.SANS;
    function rr(a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
    function tx(s, a, b, sz, col, wt, al, alpha) { x.globalAlpha = alpha == null ? 1 : alpha; x.font = (wt || 500) + ' ' + sz + 'px ' + S; x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, a, b); x.globalAlpha = 1; }
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, 1024, 640);
    x.fillStyle = '#eef0f3'; x.fillRect(0, 0, 1024, 36);
    ['#ff5f57', '#febc2e', '#28c840'].forEach(function (cl, i) { x.beginPath(); x.arc(20 + i * 16, 18, 5, 0, 7); x.fillStyle = cl; x.fill(); });
    rr(372, 8, 280, 20, 10); x.fillStyle = '#fff'; x.fill(); tx('loopfysio.nl', 512, 23, 12, '#6b7480', 500, 'center');
    // nav: nine vague items → four clear ones and a booking button
    tx('Loop', 40, 78, 26, NAVY, 800); tx('FYSIO', 104, 78, 11, TEAL, 700);
    var bad = ['Home', 'About us', 'Our team', 'Philosophy', 'Services', 'Treatments', 'News', 'Blog', 'Contact'];
    bad.forEach(function (n, i) { tx(n, 300 + i * 78, 76, 12.5, GREY, 500, 'left', 1 - k3); });
    ['Treatments', 'Team', 'Prices', 'Contact'].forEach(function (n, i) { tx(n, 520 + i * 98, 77, 15, NAVY, 600, 'left', k3); });
    if (k3 > 0) { x.globalAlpha = k3; rr(904, 56, 92, 32, 16); x.fillStyle = TEAL; x.fill(); x.globalAlpha = 1; tx('Book', 950, 77, 14, '#fff', 700, 'center', k3); }
    x.fillStyle = '#eceef1'; x.fillRect(0, 108, 1024, 1);
    // hero copy
    tx('WELCOME TO OUR WEBSITE', 60, 168, 13, GREY, 700, 'left', 1 - k2);
    tx('RUNNERS & ATHLETES · UTRECHT-OOST', 60, 168, 13, TEAL, 700, 'left', k2);
    tx('Excellence', 60, 238, 60, NAVY, 800, 'left', 1 - k1); tx('in motion.', 60, 304, 60, NAVY, 800, 'left', 1 - k1);
    tx('Physiotherapy for', 60, 224, 44, NAVY, 800, 'left', k1); tx('runners and sports', 60, 274, 44, NAVY, 800, 'left', k1); tx('injuries.', 60, 324, 44, NAVY, 800, 'left', k1);
    tx('We are passionate about what we do and', 60, 368, 17, GREY, 400, 'left', 1 - k2); tx('always strive for the best possible results.', 60, 392, 17, GREY, 400, 'left', 1 - k2);
    tx('Back to running sooner, with a plan that fits', 60, 368, 17, '#3b4552', 400, 'left', k2); tx('your sport. Evening and Saturday appointments.', 60, 392, 17, '#3b4552', 400, 'left', k2);
    if (k3 > 0) {
      x.globalAlpha = k3; rr(60, 418, 236, 50, 12); x.fillStyle = TEAL; x.fill(); x.globalAlpha = 1;
      tx('Book an assessment  →', 178, 449, 16, '#fff', 700, 'center', k3); tx('See treatments', 318, 449, 15, NAVY, 600, 'left', k3);
    }
    // hero image: a running track, same in both versions
    var gr = x.createLinearGradient(560, 130, 980, 440); gr.addColorStop(0, '#d7eef0'); gr.addColorStop(1, '#8cc9cc');
    rr(560, 130, 410, 330, 20); x.fillStyle = gr; x.fill();
    x.save(); rr(560, 130, 410, 330, 20); x.clip();
    for (var i = 0; i < 5; i++) { x.beginPath(); x.ellipse(765, 520, 360 - i * 46, 230 - i * 30, 0, Math.PI, 0); x.strokeStyle = 'rgba(255,255,255,' + (0.85 - i * 0.12) + ')'; x.lineWidth = 6; x.stroke(); }
    x.beginPath(); x.arc(880, 210, 34, 0, 7); x.fillStyle = 'rgba(255,255,255,0.75)'; x.fill(); x.restore();
    // feature row
    var fb = ['Quality', 'Passion', 'Care'], fg = ['Sports injuries', 'Running analysis', 'Rehab plans'];
    for (var j = 0; j < 3; j++) {
      var fx = 60 + j * 312; rr(fx, 500, 290, 74, 14); x.fillStyle = '#f5f7f9'; x.fill();
      x.beginPath(); x.arc(fx + 34, 537, 15, 0, 7); x.fillStyle = '#d7eef0'; x.fill();
      tx(fb[j], fx + 62, 543, 17, NAVY, 600, 'left', 1 - k2); tx(fg[j], fx + 62, 543, 17, NAVY, 600, 'left', k2);
    }
    tx('Learn more ›', 512, 612, 12, '#9aa1aa', 500, 'center', 1 - k3);
    return c;
  }
  // camera: focus point in mock pixels + zoom
  var CAMS = [[0, 512, 320, 1], [9.2, 512, 320, 1], [10.2, 250, 250, 1.75], [18.6, 250, 250, 1.75], [19.6, 300, 300, 1.55], [27.6, 300, 300, 1.55], [28.6, 512, 340, 1.08], [36.8, 512, 340, 1.08], [37.6, 512, 320, 1]];
  function cam(t, K) {
    for (var i = CAMS.length - 1; i >= 0; i--) if (t >= CAMS[i][0]) break;
    var a = CAMS[Math.max(0, i)], b = CAMS[Math.min(CAMS.length - 1, i + 1)], k = b[0] > a[0] ? K.inOut(K.seg(t, a[0], b[0])) : 0;
    return { fx: mix(a[1], b[1], k), fy: mix(a[2], b[2], k), s: mix(a[3], b[3], k) };
  }
  var X0 = 40, Y0 = 640, CW = 1000, CH = 625, SC = CW / 1024, CX = X0 + CW / 2, CY = Y0 + CH / 2;
  function map(mx, my, c) { return [CX + (mx - c.fx) * SC * c.s, CY + (my - c.fy) * SC * c.s]; }
  function box(K, c, mx, my, mw, mh, color, k) { // highlight box drawn around a mock region
    if (k <= 0) return; var g = K.g, p = map(mx, my, c), w = mw * SC * c.s, h = mh * SC * c.s;
    g.save(); g.globalAlpha *= k; g.strokeStyle = color; g.lineWidth = 6; g.setLineDash([]);
    K.rr(p[0] - 10, p[1] - 10, w + 20, h + 20, 14); g.stroke(); g.restore();
  }
  function chip(K, n, label, x, y, state, a) { // question chip: state 0 neutral, -1 fail, 1 pass
    if (a <= 0) return; var g = K.g; g.save(); g.globalAlpha *= a; g.translate(0, (1 - a) * 20);
    K.font(700, 34); var w = g.measureText(label).width + 120;
    K.rr(x, y, w, 76, 38); g.fillStyle = 'rgba(255,255,255,0.08)'; g.fill();
    g.strokeStyle = state > 0 ? K.GREEN : state < 0 ? K.RED : 'rgba(255,255,255,0.2)'; g.lineWidth = 3; g.stroke();
    g.beginPath(); g.arc(x + 38, y + 38, 22, 0, 7); g.fillStyle = state > 0 ? K.GREEN : state < 0 ? K.RED : K.OR; g.fill();
    K.text(state > 0 ? '✓' : state < 0 ? '✕' : String(n), x + 38, y + 50, 28, '#111', 800, 'center');
    K.text(label, x + 76, y + 50, 34, K.CREAM, 700); g.restore();
  }
  function cursor(K, x, y, press) {
    var g = K.g; g.save(); g.translate(x, y); g.scale(1.6 - press * 0.2, 1.6 - press * 0.2);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 30); g.lineTo(8, 23); g.lineTo(14, 36); g.lineTo(19, 34); g.lineTo(13, 21); g.lineTo(23, 21); g.closePath();
    g.fillStyle = '#111'; g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 2.5; g.stroke(); g.restore();
  }
  function timer(K, x, y, r, p, color, label) {
    var g = K.g; g.save(); g.lineWidth = 12; g.strokeStyle = 'rgba(255,255,255,0.12)'; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
    g.strokeStyle = color; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - p)); g.stroke();
    K.text(label, x, y + 22, 64, K.CREAM, 800, 'center'); g.restore();
  }

  window.REEL_SCENE = {
    duration: 48,
    cues: { cover: 2.4, low: 98, beat: [9.4, 36.8], rest: [[18.6, 19.6], [27.6, 28.6]], tick: [3.6, 4.6, 5.6, 6.6, 7.6], whoosh: [9.2, 19.0, 28.0, 37.2], click: [14.4, 23.6, 34.6], chime: [15.0, 24.2, 35.2, 39.4], swell: [8.2], hit: [41.6] },
    draw: function (t, K) {
      var g = K.g;
      var k1 = K.inOut(K.seg(t, 14.4, 15.4)), k2 = K.inOut(K.seg(t, 23.6, 24.6)), k3 = K.inOut(K.seg(t, 33.6, 34.6));
      var c = cam(t, K), src = homepage(K, k1, k2, k3);
      var cardA = K.ease(K.seg(t, 0.15, 0.7)) * (1 - K.seg(t, 41.2, 41.7));

      // ---- the homepage in a browser card, with camera zoom ----
      if (cardA > 0) {
        g.save(); g.globalAlpha = cardA;
        g.shadowColor = 'rgba(255,110,20,0.35)'; g.shadowBlur = 90; g.shadowOffsetY = 30; K.rr(X0, Y0, CW, CH, 26); g.fillStyle = '#000'; g.fill(); g.shadowColor = 'transparent';
        g.save(); K.rr(X0, Y0, CW, CH, 26); g.clip();
        g.translate(CX, CY); g.scale(c.s, c.s); g.translate(-c.fx * SC, -c.fy * SC); g.drawImage(src, 0, 0, CW, CH);
        g.restore();
        g.strokeStyle = 'rgba(255,200,150,0.25)'; g.lineWidth = 2; K.rr(X0, Y0, CW, CH, 26); g.stroke();
        // label: this is a concept, not a client
        K.font(700, 24, K.MONO); var lw = g.measureText('CONCEPT HOMEPAGE').width + 36;
        K.rr(X0 + 20, Y0 - 22, lw, 44, 22); g.fillStyle = '#1d1814'; g.fill(); g.strokeStyle = 'rgba(255,255,255,0.15)'; g.stroke();
        K.text('CONCEPT HOMEPAGE', X0 + 38, Y0 + 8, 24, K.MUTED, 700, 'left', K.MONO);
        g.restore();
      }

      // ---- 0–3.2 hook ----
      var ha = 1 - K.seg(t, 3.0, 3.4);
      if (ha > 0) { g.save(); g.globalAlpha = ha; K.headline(['Your homepage has', '*5 seconds* to answer', '*3 questions*.'], 70, 300, 82, 0.0, t, 98); g.restore(); }

      // ---- 3.2–9.2 the problem: the 5-second test fails ----
      var pa = K.win(t, 3.2, 9.4, 0.3, 0.3);
      if (pa > 0) {
        g.save(); g.globalAlpha = pa;
        K.kicker('The 5-second test', 70, 250, 1);
        K.rich('It looks *professional*.', 70, 360, 76); K.rich('But does it *answer*?', 70, 460, 76);
        var secs = K.c01((t - 3.5) / 5), left = Math.max(0, Math.ceil(5 - secs * 5 - 0.001));
        timer(K, 900, 420, 78, secs, secs < 1 ? K.OR : K.RED, String(left));
        var qs = [['What do you do?', 5.0], ['Who is it for?', 5.6], ['What do I do next?', 6.2]];
        qs.forEach(function (q, i) { chip(K, i + 1, q[0], 70, 1310 + i * 92, t > 7.9 ? -1 : 0, K.back(K.seg(t, q[1], q[1] + 0.4))); });
        g.restore();
      }

      // ---- 9.2–37 three questions, one fix each ----
      var Q = [
        [9.2, 19.0, 'Question 1', 'What do you *do*?', 'Name the service in plain words.', 'Clever can come second.', [44, 176, 460, 162], 14.4],
        [19.0, 28.0, 'Question 2', 'Is this *for me*?', 'Say who you help, and where.', 'Visitors should think: “that’s me”.', [40, 150, 480, 255], 23.6],
        [28.0, 37.2, 'Question 3', 'What do I do *next*?', 'One clear button, above the fold.', '“Learn more” is not a next step.', [40, 50, 980, 430], 33.6]
      ];
      Q.forEach(function (q, i) {
        var a = K.win(t, q[0], q[1], 0.35, 0.3); if (a <= 0) return;
        g.save(); g.globalAlpha = a;
        K.kicker(q[2], 70, 250, 1); K.rich(q[3], 70, 380, 92);
        var fixed = t >= q[7] + 0.6;
        var r = q[6], hb = K.ease(K.seg(t, q[0] + 1.6, q[0] + 2.1));
        if (i === 0) box(K, c, r[0], r[1], r[2], r[3], fixed ? K.GREEN : K.RED, hb);
        if (i === 1) { box(K, c, 54, 150, 330, 24, fixed ? K.GREEN : K.RED, hb); box(K, c, 54, 350, 420, 52, fixed ? K.GREEN : K.RED, hb); }
        // strike-through on the vague line before the fix
        if (i === 0 && t > 12.0 && t < 14.6) { var p1 = map(60, 225, c), p2 = map(370, 225, c), sk = K.ease(K.seg(t, 12.0, 12.6)); g.strokeStyle = K.RED; g.lineWidth = 8; g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(K.lerp(p1[0], p2[0], sk), p1[1]); g.stroke(); }
        if (i === 1 && t > 21.0 && t < 23.8) { var b1 = map(60, 162, c), b2 = map(260, 162, c), s2 = K.ease(K.seg(t, 21.0, 21.5)); g.strokeStyle = K.RED; g.lineWidth = 6; g.beginPath(); g.moveTo(b1[0], b1[1]); g.lineTo(K.lerp(b1[0], b2[0], s2), b1[1]); g.stroke(); }
        if (i === 2) {
          // the cursor hunts for a next step, finds only a faint "Learn more" and a crowded menu
          var cx, cy, press = 0;
          if (t < 33.6) {
            var h = K.c01((t - 29.0) / 3.6), pts = [[300, 300], [700, 250], [820, 76], [420, 76], [512, 560], [512, 610]];
            var seg = Math.min(pts.length - 2, Math.floor(h * (pts.length - 1))), lk = K.inOut(h * (pts.length - 1) - seg);
            var pa2 = map(mix(pts[seg][0], pts[seg + 1][0], lk), mix(pts[seg][1], pts[seg + 1][1], lk), c); cx = pa2[0]; cy = pa2[1];
            box(K, c, 296, 62, 690, 22, K.RED, K.ease(K.seg(t, 30.2, 30.6)) * (1 - K.seg(t, 33.2, 33.6)));
            box(K, c, 470, 598, 84, 20, K.RED, K.ease(K.seg(t, 32.0, 32.4)) * (1 - K.seg(t, 33.2, 33.6)));
            if (t > 30.4 && t < 33.4) K.tag('9 menu items', 70, 1520, K.RED, K.ease(K.seg(t, 30.4, 30.8)));
            if (t > 32.2 && t < 33.4) K.tag('Tiny, at the bottom', 460, 1520, K.RED, K.ease(K.seg(t, 32.2, 32.6)));
          } else {
            var bt = map(178, 443, c), from = map(512, 610, c), mk = K.inOut(K.seg(t, 33.8, 34.6));
            cx = K.lerp(from[0], bt[0], mk); cy = K.lerp(from[1], bt[1], mk); press = K.c01(1 - Math.abs(t - 34.7) / 0.15);
            box(K, c, 56, 414, 244, 58, K.GREEN, K.ease(K.seg(t, 34.6, 35.0)));
          }
          if (t > 28.8) cursor(K, cx, cy, press);
        }
        var ta = K.ease(K.seg(t, q[7] + 0.4, q[7] + 0.9));
        if (ta > 0) { g.save(); g.globalAlpha = a * ta; g.translate(0, (1 - ta) * 20);
          K.rr(70, 1330, 940, 150, 26); g.fillStyle = 'rgba(43,209,126,0.12)'; g.fill(); g.strokeStyle = 'rgba(43,209,126,0.5)'; g.lineWidth = 2; g.stroke();
          K.text('FIX', 110, 1385, 26, K.GREEN, 700, 'left', K.MONO); K.text(q[4], 110, 1432, 40, K.CREAM, 700);
          g.restore(); }
        var why = K.ease(K.seg(t, q[0] + 2.4, q[0] + 2.9)) * (1 - ta);
        if (why > 0) { g.save(); g.globalAlpha = a * why; K.text(q[5], 70, 1400, 38, K.MUTED, 600); g.restore(); }
        g.restore();
      });

      // ---- 37.2–41.6 all three answered ----
      var ra = K.win(t, 37.2, 41.7, 0.35, 0.35);
      if (ra > 0) {
        g.save(); g.globalAlpha = ra;
        K.kicker('After', 70, 250, 1); K.rich('Same design.', 70, 360, 80); K.rich('Now it *answers*.', 70, 460, 80);
        var s2 = K.c01((t - 37.6) / 1.6); timer(K, 900, 420, 78, s2, K.GREEN, String(Math.max(0, Math.ceil(5 - s2 * 5 - 0.001))));
        ['What you do', 'Who it’s for', 'What to do next'].forEach(function (l, i) { chip(K, i + 1, l, 70, 1310 + i * 92, 1, K.back(K.seg(t, 38.6 + i * 0.25, 39.0 + i * 0.25))); });
        g.restore();
      }

      // ---- 41.6–45 takeaway + light CTA (kept high, out of the Shorts UI) ----
      var ea = K.ease(K.seg(t, 41.6, 42.1));
      if (ea > 0) {
        g.save(); g.globalAlpha = ea;
        K.kicker('Try it today', 70, 300, 1);
        K.headline(['Show your homepage', 'to someone for', '*5 seconds*.', 'Then ask the', '*3 questions*.'], 70, 440, 84, 41.65, t, 100);
        var ca = K.ease(K.seg(t, 42.8, 43.3));
        g.globalAlpha = ea * ca;
        K.logoRing(110, 1080, 34, K.ease(K.seg(t, 42.8, 43.8)), 8);
        K.text('Follow for more website fixes', 170, 1074, 40, K.CREAM, 700); K.text('ace360services.nl', 170, 1124, 32, K.MUTED, 600, 'left', K.MONO);
        g.restore();
      }
    }
  };
})();
