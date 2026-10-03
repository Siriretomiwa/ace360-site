/* Reel 4 · "If I built a website for a… bakery" (series episode 1). */
window.REEL_SCENE = {
  duration: 20.5,
  cues: { cover: 1.6, beat: [2.6, 19.8], tick: [3.3, 3.6, 3.9, 4.2, 4.5, 6.6, 7.2, 7.8, 8.4, 12.0, 12.8, 13.6], whoosh: [2.6, 6.1, 11.1], chime: [14.4], hit: [16.9] },
  draw: function (t, K) {
    var g = K.g, X = 40, Y = 700, w = 1000;
    if (t < 3) {
      g.save(); g.globalAlpha = 1 - K.seg(t, 2.6, 3);
      K.kicker('Episode 01', 90, 560, K.ease(K.seg(t, 0, 0.3)));
      K.headline(['If I built a', 'website for a', '*bakery*…'], 90, 690, 112, 0.05, t, 124);
      g.restore();
    }
    // the feeling: palette + type
    var a = K.win(t, 2.7, 6.3, 0.4, 0.3);
    if (a > 0) {
      g.save(); g.globalAlpha = a;
      K.kicker('The feeling', 90, 380, 1); K.rich('Warm. Crusty. *Early*.', 90, 500, 74);
      [['#fbf6ee', 'Flour'], ['#f1d9b8', 'Crumb'], ['#d99a5b', 'Crust'], ['#c8742c', 'Oven'], ['#3a2414', 'Rye']].forEach(function (c, i) {
        var k = K.back(K.seg(t, 3.3 + i * 0.3, 3.7 + i * 0.3)), cx = 170 + i * 185;
        if (k <= 0) return; g.save(); g.translate(cx, 800); g.scale(k, k);
        g.fillStyle = c[0]; g.beginPath(); g.arc(0, 0, 76, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,255,255,0.2)'; g.lineWidth = 2; g.stroke();
        g.restore(); K.text(c[1], cx, 920, 28, K.MUTED, 600, 'center', K.MONO);
      });
      var tk = K.ease(K.seg(t, 4.6, 5.2));
      g.globalAlpha = a * tk; K.text('Fresh from the oven,', 90, 1110, 78, K.CREAM, 400, 'left', 'Georgia, serif'); K.text('ready at 7:30.', 90, 1200, 78, K.ORL, 400, 'left', 'Georgia, serif');
      K.text('Georgia, set warm and generous', 90, 1270, 28, K.MUTED, 600, 'left', K.MONO);
      g.restore();
    }
    // the build: the page slides together in four strips
    var b = K.win(t, 6.1, 11.3, 0.4, 0.3);
    if (b > 0) {
      g.save(); g.globalAlpha = b;
      K.kicker('The build', 90, 380, 1); K.rich('Built to *sell bread*.', 90, 500, 74);
      var src = K.site('korrel', 'warm'), h = w * 640 / 1024, sh = h / 4;
      g.shadowColor = 'rgba(255,110,20,0.3)'; g.shadowBlur = 80; g.fillStyle = '#000'; K.rr(X, Y, w, h, 26); g.globalAlpha = b * K.ease(K.seg(t, 8.6, 9.2)); g.fill(); g.shadowColor = 'transparent'; g.globalAlpha = b;
      g.save(); K.rr(X - 600, Y, w + 1200, h, 26); g.restore();
      for (var i = 0; i < 4; i++) {
        var k = K.ease(K.seg(t, 6.5 + i * 0.6, 7.1 + i * 0.6)), dir = i % 2 ? 1 : -1;
        if (k <= 0) continue;
        g.save(); g.globalAlpha = b * k; g.translate(dir * (1 - k) * 700, 0);
        g.drawImage(src, 0, i * 160, 1024, 160, X, Y + i * sh, w, sh); g.restore();
      }
      var labels = ['Pre-order today', 'Pickup slots from 7:30', 'Your bread, photographed'];
      labels.forEach(function (l, i) { K.tag(l, X + 20 + (i % 2) * 380, Y + 720 + Math.floor(i / 2) * 80, K.OR, K.back(K.seg(t, 9.4 + i * 0.35, 9.8 + i * 0.35))); });
      g.restore();
    }
    // the phone
    var c = K.win(t, 11.1, 17.2, 0.4, 0.3);
    if (c > 0) {
      g.save(); g.globalAlpha = c;
      K.kicker('On the phone', 90, 380, 1); K.rich('Order in *30 seconds*.', 90, 500, 74);
      K.phone(120, 620, 340, K.phoneSite('korrel', 'warm'), K.ease(K.seg(t, 11.2, 11.8)), -0.04);
      [['iDEAL checkout', 12.0], ['Pick up tomorrow at 7:30', 12.8], ['Dutch + English', 13.6]].forEach(function (f, i) {
        var k = K.back(K.seg(t, f[1], f[1] + 0.4)); if (k <= 0) return;
        g.save(); g.globalAlpha = c * K.c01(k); g.translate((1 - k) * 60, 0);
        K.text('✓', 560, 820 + i * 130, 50, K.GREEN, 800); K.text(f[0], 610, 820 + i * 130, 38, K.CREAM, 700);
        g.restore();
      });
      K.notification(540, 1440, 'New order · €29.80', 'pickup tomorrow 07:30', K.ease(K.seg(t, 14.4, 14.8)) * c);
      g.restore();
    }
    K.endCard(t, 16.9, 'Your business *next*?');
  }
};
