/* Short 02 · Quick explainer: "4 questions to ask before you pay a web designer."
   Teaches what to settle before a website project starts: scope + total, design before build, ownership, care after launch.
   The quote is labelled as an example; no client, no results. Text kept inside the Shorts safe area (top 120, bottom 380, right 150 px). */
(function () {
  var PAPER = '#fbf8f3', INK = '#16120f', GREY = '#7a7470';
  function paperCard(K, x, y, w, h, a) {
    var g = K.g; g.save(); g.globalAlpha *= a;
    g.shadowColor = 'rgba(255,110,20,0.3)'; g.shadowBlur = 80; g.shadowOffsetY = 26; K.rr(x, y, w, h, 26); g.fillStyle = PAPER; g.fill(); g.shadowColor = 'transparent';
    g.restore();
  }
  function label(K, s, x, y) { // dark pill that says what the viewer is looking at (example, not a client)
    var g = K.g; K.font(700, 24, K.MONO); var lw = g.measureText(s).width + 36;
    K.rr(x, y - 22, lw, 44, 22); g.fillStyle = '#1d1814'; g.fill(); g.strokeStyle = 'rgba(255,255,255,0.15)'; g.lineWidth = 2; g.stroke();
    K.text(s, x + 18, y + 8, 24, K.MUTED, 700, 'left', K.MONO);
  }
  function check(K, x, y, r, on, bad) {
    var g = K.g; g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = bad ? K.RED : on > 0.5 ? K.GREEN : 'rgba(0,0,0,0.08)'; g.fill();
    if (on > 0.5 || bad) {
      g.strokeStyle = '#fff'; g.lineWidth = r * 0.22; g.lineCap = 'round'; g.beginPath();
      if (bad) { g.moveTo(x - r * 0.35, y - r * 0.35); g.lineTo(x + r * 0.35, y + r * 0.35); g.moveTo(x + r * 0.35, y - r * 0.35); g.lineTo(x - r * 0.35, y + r * 0.35); }
      else { g.moveTo(x - r * 0.4, y); g.lineTo(x - r * 0.1, y + r * 0.32); g.lineTo(x + r * 0.42, y - r * 0.32); }
      g.stroke();
    }
  }
  function fixCard(K, t, t0, s, a) {
    var g = K.g, k = K.ease(K.seg(t, t0, t0 + 0.5)); if (k <= 0) return 0;
    g.save(); g.globalAlpha = a * k; g.translate(0, (1 - k) * 20);
    K.rr(70, 1330, 860, 150, 26); g.fillStyle = 'rgba(43,209,126,0.12)'; g.fill(); g.strokeStyle = 'rgba(43,209,126,0.5)'; g.lineWidth = 2; g.stroke();
    K.text('ASK FOR', 110, 1385, 26, K.GREEN, 700, 'left', K.MONO); K.text(s, 110, 1432, 40, K.CREAM, 700);
    g.restore(); return k;
  }
  function why(K, t, t0, s, a, hide) { var k = K.ease(K.seg(t, t0, t0 + 0.5)) * (1 - hide); if (k > 0) { K.g.save(); K.g.globalAlpha = a * k; K.text(s, 70, 1410, 38, K.MUTED, 600); K.g.restore(); } }

  var Q = [ // start, end, title lines
    [10.8, 20.7, ['What’s *included*,', 'and the *total*?']],
    [20.6, 29.1, ['Will I see the *design*', '*before* you build?']],
    [29.0, 36.5, ['Who *owns* the domain', 'and the logins?']],
    [36.4, 44.9, ['What happens', 'after *launch*?']]
  ];

  window.REEL_SCENE = {
    duration: 54.5,
    cues: { cover: 2.6, low: 98, beat: [3.6, 52.5], rest: [[20.2, 21.0], [28.6, 29.4], [36.0, 36.8]], whoosh: [3.5, 10.8, 20.7, 29.0, 36.5, 44.8], tick: [7.0, 8.2, 9.4], click: [17.6, 32.6], chime: [18.0, 26.2, 33.2, 39.5, 41.0, 42.5, 47.0], swell: [9.8], hit: [44.9] },
    draw: function (t, K) {
      var g = K.g;

      // ---- 0–3.5 hook ----
      var ha = 1 - K.seg(t, 3.1, 3.5);
      if (ha > 0) {
        g.save(); g.globalAlpha = ha;
        K.headline(['Before you pay', 'a web designer,', 'ask these', '*4 questions*.'], 70, 420, 100, 0.0, t, 118);
        for (var i = 0; i < 4; i++) {
          var k = K.back(K.seg(t, 1.2 + i * 0.25, 1.6 + i * 0.25)); if (k <= 0) continue;
          g.save(); g.globalAlpha = ha * K.c01(k); var cx = 140 + i * 190, cy = 1060;
          g.translate(cx, cy); g.scale(k, k);
          g.beginPath(); g.arc(0, 0, 70, 0, 7); g.fillStyle = 'rgba(255,255,255,0.06)'; g.fill(); g.strokeStyle = K.OR; g.lineWidth = 5; g.stroke();
          K.text(String(i + 1), 0, 26, 72, K.CREAM, 800, 'center');
          g.restore();
        }
        g.restore();
      }

      // ---- 3.5–10.9 the problem ----
      var pa = K.win(t, 3.4, 10.9, 0.35, 0.3);
      if (pa > 0) {
        g.save(); g.globalAlpha = pa;
        K.kicker('Where it goes wrong', 70, 250, 1);
        K.headline(['Most problems start', '*before* the build.'], 70, 380, 84, 3.5, t, 104);
        [[7.0, 'A vague quote', '“Website · €€€ · extras TBD”'], [8.2, 'A design you see too late', 'when it’s already built'], [9.4, 'Logins you never get', 'domain and hosting in their name']].forEach(function (p, i) {
          var k = K.ease(K.seg(t, p[0], p[0] + 0.4)); if (k <= 0) return;
          var y = 720 + i * 190;
          g.save(); g.globalAlpha = pa * k; g.translate((1 - k) * -60, 0);
          K.rr(70, y, 860, 160, 28); g.fillStyle = 'rgba(255,90,90,0.09)'; g.fill(); g.strokeStyle = 'rgba(255,90,90,0.45)'; g.lineWidth = 2; g.stroke();
          check(K, 140, y + 80, 36, 0, true);
          K.text(p[1], 210, y + 72, 46, K.CREAM, 750); K.text(p[2], 210, y + 120, 32, K.MUTED, 500);
          g.restore();
        });
        g.restore();
      }

      // ---- the four questions ----
      Q.forEach(function (q, qi) {
        var a = K.win(t, q[0], q[1], 0.35, 0.3); if (a <= 0) return;
        g.save(); g.globalAlpha = a;
        K.steps(4, qi, 70, 168, a); g.globalAlpha = a;
        K.kicker('Question ' + (qi + 1), 70, 260, 1);
        K.headline(q[2], 70, 380, 80, q[0] + 0.05, t, 96);

        if (qi === 0) {
          // an example quote: vague first, then itemised with a total
          var m = K.inOut(K.seg(t, 17.4, 18.0)), py = 560, ph = 700;
          paperCard(K, 70, py, 860, ph, K.ease(K.seg(t, 11.2, 11.8)));
          g.save(); g.globalAlpha = a * K.ease(K.seg(t, 11.2, 11.8));
          K.text('QUOTE', 120, py + 80, 34, INK, 800); K.text('Your business · website', 120, py + 122, 26, GREY, 500, 'left', K.MONO);
          g.fillStyle = 'rgba(0,0,0,0.1)'; g.fillRect(120, py + 150, 760, 2);
          // vague version
          g.save(); g.globalAlpha *= 1 - m;
          K.text('1 × Website', 120, py + 230, 40, INK, 700); K.text('€ ? ? ?', 880, py + 230, 40, INK, 700, 'right');
          K.text('Extras: to be discussed', 120, py + 310, 34, GREY, 500);
          K.text('Revisions: as needed', 120, py + 370, 34, GREY, 500);
          K.text('Timeline: ASAP', 120, py + 430, 34, GREY, 500);
          K.marker(300, py + 300, 220, 48, K.ease(K.seg(t, 14.6, 15.4)), K.RED, 7);
          K.marker(800, py + 218, 110, 46, K.ease(K.seg(t, 15.2, 16.0)), K.RED, 7);
          g.restore();
          // itemised version
          if (m > 0) {
            g.save(); g.globalAlpha *= m;
            var rows = [['Design + build, 5 pages', '€1,000'], ['Copywriting, 5 pages', '€300'], ['Online booking', '€250'], ['Two feedback rounds', 'incl.'], ['Launch date', 'week 3']];
            rows.forEach(function (r, i) {
              var ry = py + 220 + i * 74, rk = K.ease(K.seg(t, 17.6 + i * 0.15, 18.0 + i * 0.15));
              g.save(); g.globalAlpha *= rk; check(K, 140, ry - 12, 18, 1);
              K.text(r[0], 176, ry, 34, INK, 600); K.text(r[1], 880, ry, 34, INK, 700, 'right'); g.restore();
            });
            g.fillStyle = INK; g.fillRect(120, py + 590, 760, 3);
            K.text('Total', 120, py + 650, 40, INK, 800); K.text('€1,550', 880, py + 650, 44, '#d45500', 800, 'right');
            g.restore();
          }
          g.restore();
          label(K, 'EXAMPLE QUOTE', 90, py);
          why(K, t, 13.9, '“Website” is not a scope.', a, K.seg(t, 18.2, 18.6));
          fixCard(K, t, 18.4, 'Every item on its own line, plus a total.', a);
        }

        if (qi === 1) {
          // sketch → finished design: cheap to change early, expensive late
          var src = K.site('adem', 'warm'), w = 940, h = w * 640 / 1024, x = 70, y = 600, e = K.ease(K.seg(t, 21.2, 21.8));
          var wk = K.inOut(K.seg(t, 25.8, 26.8));
          g.save(); g.globalAlpha = a * e;
          K.rr(x, y, w, h, 26); g.fillStyle = '#f7f4ee'; g.fill();
          g.strokeStyle = '#3a3f4a'; g.lineWidth = 4; g.setLineDash([14, 10]);
          [[40, 40, 860, 46], [40, 120, 400, 190], [470, 120, 430, 190], [40, 340, 260, 180], [320, 340, 260, 180], [600, 340, 300, 180]].forEach(function (r) { g.strokeRect(x + r[0], y + r[1], r[2], r[3]); });
          g.setLineDash([]);
          // a pencil edit on the sketch: a box gets moved in seconds
          var mv = K.inOut(K.seg(t, 24.0, 24.8));
          if (t < 26.8) { g.strokeStyle = K.OR; g.lineWidth = 5; g.strokeRect(x + 40 + mv * 430, y + 120, 400, 190); }
          g.save(); g.beginPath(); g.rect(x, 0, w * wk, K.H); g.clip(); K.windowCard(x, y, w, src, 1); g.restore();
          if (wk > 0 && wk < 1) { g.fillStyle = K.OR; g.fillRect(x + w * wk - 4, y, 8, h); }
          g.restore();
          label(K, wk < 0.5 ? 'SKETCH' : 'BUILT', 90, y);
          K.tag('Sketch: minutes to change', 70, 1280, K.GREEN, K.back(K.seg(t, 23.8, 24.2)) * (1 - K.seg(t, 26.0, 26.3)));
          K.tag('Built: can take days', 70, 1280, K.OR, K.back(K.seg(t, 26.6, 27.0)));
          fixCard(K, t, 27.2, 'See the design first. Then build.', a);
        }

        if (qi === 2) {
          // who owns what: every account flips to the client's name
          var acc = [['Domain', 'yourbusiness.nl'], ['Hosting', 'server + email'], ['Website login', 'admin account']];
          acc.forEach(function (r, i) {
            var y = 620 + i * 210, k = K.ease(K.seg(t, 29.6 + i * 0.3, 30.0 + i * 0.3)), flip = K.inOut(K.seg(t, 32.6 + i * 0.4, 33.0 + i * 0.4));
            if (k <= 0) return;
            g.save(); g.globalAlpha = a * k; g.translate((1 - k) * 60, 0);
            K.rr(70, y, 860, 170, 28); g.fillStyle = 'rgba(255,255,255,0.06)'; g.fill(); g.strokeStyle = flip > 0.5 ? 'rgba(43,209,126,0.55)' : 'rgba(255,90,90,0.4)'; g.lineWidth = 2; g.stroke();
            // key icon
            g.strokeStyle = K.ORL; g.lineWidth = 7; g.beginPath(); g.arc(140, y + 85, 22, 0, 7); g.stroke();
            g.beginPath(); g.moveTo(162, y + 85); g.lineTo(204, y + 85); g.moveTo(190, y + 85); g.lineTo(190, y + 103); g.moveTo(204, y + 85); g.lineTo(204, y + 99); g.stroke();
            K.text(r[0], 240, y + 76, 46, K.CREAM, 750); K.text(r[1], 240, y + 122, 30, K.MUTED, 500, 'left', K.MONO);
            K.text('OWNER', 900, y + 62, 22, K.MUTED, 600, 'right', K.MONO);
            g.save(); g.globalAlpha *= 1 - flip; K.text('The agency', 900, y + 112, 36, K.RED, 750, 'right'); g.restore();
            g.save(); g.globalAlpha *= flip; K.text('You ✓', 900, y + 112, 40, K.GREEN, 800, 'right'); g.restore();
            g.restore();
          });
          why(K, t, 30.8, 'No logins means no control.', a, K.seg(t, 33.6, 34.0));
          fixCard(K, t, 33.8, 'Everything in your name.', a);
        }

        if (qi === 3) {
          // after launch: three things to agree on
          var items = [['Updates', 'who installs them?', 39.5], ['Backups', 'how often, and where?', 41.0], ['Something breaks', 'who do I call?', 42.5]];
          var ck = K.ease(K.seg(t, 37.0, 37.6));
          paperCard(K, 70, 600, 860, 640, ck);
          g.save(); g.globalAlpha = a * ck;
          K.text('After launch', 120, 680, 38, INK, 800); K.text('agree on this before you start', 120, 722, 26, GREY, 500, 'left', K.MONO);
          g.fillStyle = 'rgba(0,0,0,0.1)'; g.fillRect(120, 752, 760, 2);
          items.forEach(function (r, i) {
            var y = 850 + i * 140, on = K.ease(K.seg(t, r[2], r[2] + 0.3));
            check(K, 150, y - 14, 30, on);
            K.text(r[0], 205, y - 6, 42, INK, 750); K.text(r[1], 205, y + 38, 30, GREY, 500);
          });
          g.restore();
          label(K, 'CHECKLIST', 90, 600);
          fixCard(K, t, 43.2, 'Who looks after it, in writing.', a);
        }
        g.restore();
      });

      // ---- 44.8–54.5 takeaway + light CTA (kept high, out of the Shorts UI) ----
      var ea = K.ease(K.seg(t, 44.8, 45.3));
      if (ea > 0) {
        g.save(); g.globalAlpha = ea;
        K.kicker('Before you pay', 70, 260, 1);
        K.headline(['Get all *4 answers*', '*in writing*.'], 70, 400, 92, 44.85, t, 110);
        [['What’s included + the total', 46.0], ['The design before the build', 46.3], ['Everything in your name', 46.6], ['Who looks after it', 46.9]].forEach(function (r, i) {
          var k = K.back(K.seg(t, r[1], r[1] + 0.4)); if (k <= 0) return;
          var y = 600 + i * 104;
          g.save(); g.globalAlpha = ea * K.c01(k); g.translate(0, (1 - K.c01(k)) * 20);
          K.rr(70, y, 860, 82, 41); g.fillStyle = 'rgba(255,255,255,0.07)'; g.fill(); g.strokeStyle = K.GREEN; g.lineWidth = 3; g.stroke();
          check(K, 112, y + 41, 24, 1); K.text(r[0], 154, y + 54, 38, K.CREAM, 700);
          g.restore();
        });
        var ia = K.ease(K.seg(t, 47.8, 48.3));
        if (ia > 0) { g.save(); g.globalAlpha = ea * ia; K.rich('Ask them on any first call, including *ours*.', 70, 1090, 44, K.CREAM); g.restore(); }
        var ca = K.ease(K.seg(t, 50.4, 50.9));
        if (ca > 0) {
          g.save(); g.globalAlpha = ea * ca;
          K.logoRing(110, 1250, 34, K.ease(K.seg(t, 50.4, 51.4)), 8);
          K.text('Follow for more website tips', 170, 1244, 40, K.CREAM, 700); K.text('ace360services.nl', 170, 1294, 32, K.MUTED, 600, 'left', K.MONO);
          g.restore();
        }
        g.restore();
      }
    }
  };
})();
