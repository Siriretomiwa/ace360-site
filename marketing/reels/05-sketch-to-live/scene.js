/* Reel 5 · From a napkin sketch to a live website: brief → wireframe → design → live. */
window.REEL_SCENE = {
  duration: 21,
  cues: { cover: 1.7, beat: [2.6, 20.2], tick: [2.8, 6.8, 10.8, 14.8], whoosh: [6.6, 10.6, 14.6], chime: [15.6], hit: [17.4] },
  draw: function (t, K) {
    var g = K.g, X = 40, Y = 640, PW = 1000, PH = 700;
    if (t < 3) {
      g.save(); g.globalAlpha = 1 - K.seg(t, 2.6, 3);
      K.kicker('Process', 90, 560, K.ease(K.seg(t, 0, 0.3)));
      K.headline(['From a napkin', 'sketch to a', '*live* website.'], 90, 690, 112, 0.05, t, 124);
      g.restore();
    }
    var STEPS = [[2.6, 6.8, 'Brief', 'It starts with *your words*.'], [6.6, 10.8, 'Wireframe', 'Then a *plan* on paper.'], [10.6, 14.8, 'Design', 'Then it gets *your look*.'], [14.6, 17.6, 'Live', 'And it goes *live*.']];
    var cur = -1; STEPS.forEach(function (s, i) { if (t >= s[0]) cur = i; });
    if (t > 2.6 && t < 17.8) {
      var aa = K.ease(K.seg(t, 2.6, 3)) * (1 - K.seg(t, 17.3, 17.8));
      STEPS.forEach(function (s) { var k = K.win(t, s[0], s[1], 0.35, 0.25); if (k <= 0) return; g.save(); g.globalAlpha = aa * k; K.kicker(s[2], 90, 380, 1); K.rich(s[3], 90, 500, 74); g.restore(); });
      K.steps(4, cur, 90, 590, aa);
    }
    // paper (brief + wireframe)
    var pa = K.win(t, 2.7, 11.2, 0.4, 0.5);
    if (pa > 0) {
      g.save(); g.globalAlpha = pa; g.translate(X, Y);
      g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 60; g.shadowOffsetY = 24; K.rr(0, 0, PW, PH, 18); g.fillStyle = '#fbfaf6'; g.fill(); g.shadowColor = 'transparent';
      g.fillStyle = 'rgba(80,120,200,0.16)'; for (var ly = 90; ly < PH; ly += 48) g.fillRect(30, ly, PW - 60, 2);
      g.fillStyle = 'rgba(214,69,69,0.3)'; g.fillRect(84, 0, 2, PH);
      var ink = '#24315e', HAND = 'italic 500 40px Georgia, serif';
      if (t < 7.2) {
        var lines = ['New website!', '• online bookings', '• iDEAL payments', '• Dutch + English', '• works on phones', '• I can edit it myself'];
        lines.forEach(function (l, i) {
          var st = 3.0 + i * 0.55, n = Math.floor(K.c01((t - st) / 0.5) * l.length); if (n <= 0) return;
          g.font = i ? HAND : 'italic 700 52px Georgia, serif'; g.fillStyle = ink; g.textAlign = 'left'; g.fillText(l.slice(0, n), 110, 78 + i * 96);
        });
        var cK = K.ease(K.seg(t, 6.2, 6.7)); if (cK > 0) { g.strokeStyle = K.OR; g.lineWidth = 5; g.beginPath(); g.ellipse(330, 270, 230, 40, -0.02, 0, Math.PI * 2 * cK); g.stroke(); }
      } else {
        // wireframe drawn line by line
        var shapes = [[60, 50, 880, 600], [90, 80, 180, 44], [700, 80, 220, 44], [90, 170, 820, 210], [90, 410, 250, 160], [375, 410, 250, 160], [660, 410, 250, 160]];
        g.strokeStyle = ink; g.lineWidth = 4; g.lineJoin = 'round';
        shapes.forEach(function (r, i) {
          var k = K.c01((t - 7.0 - i * 0.35) / 0.45); if (k <= 0) return;
          var per = 2 * (r[2] + r[3]), len = per * k; g.setLineDash([len, per]); g.strokeRect(r[0], r[1], r[2], r[3]); g.setLineDash([]);
        });
        var xk = K.c01((t - 9.5) / 0.4); if (xk > 0) { g.beginPath(); g.moveTo(90, 170); g.lineTo(90 + 820 * xk, 170 + 210 * xk); g.moveTo(910, 170); g.lineTo(910 - 820 * xk, 170 + 210 * xk); g.stroke(); }
        var bk = K.ease(K.seg(t, 9.9, 10.3)); if (bk > 0) { g.globalAlpha = pa * bk; g.fillStyle = K.OR; g.fillRect(90, 595, 240, 40); g.font = 'italic 600 30px Georgia, serif'; g.fillStyle = '#fff'; g.fillText('Book now', 125, 625); }
      }
      g.restore();
    }
    // design: the site wipes in over the wireframe
    var d = K.win(t, 10.6, 17.4, 0.1, 0.4);
    if (d > 0) {
      var src = K.site('noor', 'warm'), w = 1000, h = w * 640 / 1024, y = 680, wk = K.inOut(K.seg(t, 10.7, 11.6));
      g.save(); g.globalAlpha = d; g.beginPath(); g.rect(X, 0, w * wk, K.H); g.clip(); K.windowCard(X, y, w, src, 1); g.restore();
      if (wk > 0 && wk < 1) { g.fillStyle = K.OR; g.fillRect(X + w * wk - 4, y, 8, h); }
      ['Your colours', 'Your photos', 'Booking built in'].forEach(function (l, i) { K.tag(l, X + 20 + (i % 2) * 400, y + 720 + Math.floor(i / 2) * 80, K.OR, K.back(K.seg(t, 12 + i * 0.4, 12.4 + i * 0.4)) * (1 - K.seg(t, 14.4, 14.8))); });
      var lv = K.ease(K.seg(t, 14.8, 15.3));
      if (lv > 0) {
        K.phone(700, 1060, 230, K.phoneSite('noor', 'warm'), lv * d, 0.06);
        K.tag('● Live', X + 20, y + 760, K.GREEN, K.back(K.seg(t, 15.1, 15.5)) * d);
        K.notification(540, 250, 'New booking · Sat 10:30', 'Studio Noor · Cut & finish', K.ease(K.seg(t, 15.6, 16)) * d, 'B');
      }
    }
    K.endCard(t, 17.4, 'Your idea, *live*.');
  }
};
