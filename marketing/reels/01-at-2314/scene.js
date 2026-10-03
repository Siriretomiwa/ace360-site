/* Reel 1 · "It's 23:14": a website takes an order while the owner sleeps. No prices. */
window.REEL_SCENE = {
  duration: 20.5,
  cues: { cover: 1.6, beat: [2.4, 19.8], chime: [0.75, 10.9], click: [4.6, 6.95, 9.25], tick: [13.9, 14.65, 15.4, 16.15], hit: [17.1], whoosh: [2.4, 13.6] },
  draw: function (t, K) {
    var g = K.g;
    if (t < 2.9) {
      g.save(); g.globalAlpha = 1 - K.seg(t, 2.4, 2.9);
      K.kicker('POV', 90, 560, K.ease(K.seg(t, 0, 0.3)));
      K.headline(['It’s *23:14*.', 'Your website just', 'took an order.'], 90, 690, 104, 0.05, t, 118);
      var n = K.ease(K.seg(t, 0.75, 1.2)), shake = t > 0.75 && t < 1.25 ? Math.sin(t * 90) * 10 * (1 - K.seg(t, 0.75, 1.25)) : 0;
      K.notification(540 + shake, K.lerp(260, 1220, n), 'New order #1043 · €29.80', 'Bakkerij Korrel · paid with iDEAL', n);
      g.restore();
    }
    var STEPS = [[2.4, 4.9, '1 · They *search*.'], [4.9, 8.4, '2 · Your page *sells*.'], [8.4, 10.4, '3 · They pay in *one tap*.'], [10.4, 13.6, '4 · You wake up to *orders*.']];
    if (t > 2.4 && t < 14) {
      var a = K.ease(K.seg(t, 2.4, 2.9)) * (1 - K.seg(t, 13.6, 14));
      K.kicker('How a website earns', 90, 380, a);
      STEPS.forEach(function (s, i) {
        if (t < s[0] || t > s[1]) return;
        var k = K.ease(K.seg(t, s[0] + 0.12, s[0] + 0.5)) * (i === 3 ? 1 : 1 - K.seg(t, s[1] - 0.22, s[1]));
        g.save(); g.globalAlpha = a * k; g.translate(0, (1 - k) * 30); K.rich(s[2], 90, 520, 74); g.restore();
      });
      K.windowCard(40, 690, 1000, K.story(Math.min(10.95, t - 2.4)), a, K.lerp(0.94, 1, K.ease(K.seg(t, 2.4, 3.2))));
      var cur = STEPS.reduce(function (c, s, i) { return t >= s[0] ? i : c; }, 0);
      K.steps(4, cur, 90, 1390, a);
    }
    var SEC = [['korrel', 'warm', 'Bakery'], ['noor', 'bold', 'Hair salon'], ['zout', 'warm', 'Restaurant'], ['molen', 'calm', 'Online store']];
    if (t > 13.6 && t < 17.4) {
      var b = K.ease(K.seg(t, 13.6, 14.1)) * (1 - K.seg(t, 17, 17.4));
      K.kicker('Any business', 90, 380, b);
      g.save(); g.globalAlpha = b; K.rich('Works for *yours* too.', 90, 520, 74); g.restore();
      var idx = Math.max(0, Math.min(3, Math.floor((t - 13.9) / 0.75))), local = Math.max(0, (t - 13.9) - idx * 0.75), s = SEC[idx];
      K.windowCard(40, 690, 1000, K.site(s[0], s[1]), b, 1 + 0.03 * (1 - K.ease(local / 0.3)));
      if (local < 0.28 && t > 14) { g.save(); g.globalAlpha = b; g.fillStyle = K.OR; g.fillRect(40 + 1000 * (local / 0.28) - 4, 690, 8, 625); g.restore(); }
      g.save(); g.globalAlpha = b; K.text(s[2], 90, 1440, 54, K.CREAM, 700); g.restore();
    }
    K.endCard(t, 17.1, 'Your website should work while you *sleep*.');
  }
};
