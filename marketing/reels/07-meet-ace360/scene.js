/* Relaunch 1 · Meet Ace 360: who we are, what we build, for whom, why. */
window.REEL_SCENE = {
  duration: 17,
  cues: { cover: 1.9, swell: [0.05], chime: [1.4, 12.0], beat: [3.0, 15.8], whoosh: [3.0, 4.8, 6.6, 8.6], tick: [9.3, 9.7, 10.1], hit: [13.4] },
  draw: function (t, K) {
    var g = K.g;
    // 0–3 · hello
    var ia = 1 - K.seg(t, 2.7, 3.1);
    if (ia > 0) {
      g.save(); g.globalAlpha = ia;
      K.logoRing(540, 720, 170, K.ease(K.seg(t, 0.1, 1.4)), 34);
      var h = K.ease(K.seg(t, 0.9, 1.4)); g.globalAlpha = ia * h; K.text('Hi, we’re', 540, 1040 + (1 - h) * 30, 60, K.MUTED, 600, 'center');
      var n = K.ease(K.seg(t, 1.2, 1.8)); g.globalAlpha = ia * n; K.text('Ace 360', 540, 1190 + (1 - n) * 40, 150, K.CREAM, 800, 'center');
      K.text('S E R V I C E S', 540, 1262, 34, K.MUTED, 600, 'center', K.MONO);
      g.restore();
    }
    // 3–8.6 · we build …
    var wa = K.win(t, 3.0, 8.7, 0.4, 0.35);
    if (wa > 0) {
      g.save(); g.globalAlpha = wa;
      K.kicker('What we do', 90, 380, 1);
      K.text('We build', 90, 520, 104, K.CREAM, 800);
      var items = [['websites', 'korrel'], ['online stores', 'molen'], ['booking systems', 'noor']];
      items.forEach(function (it, i) {
        var a0 = 3.0 + i * 1.85, k = K.win(t, a0, a0 + 1.9, 0.3, 0.25);
        if (i === 2) k = K.ease(K.seg(t, a0, a0 + 0.3)) * (1 - K.seg(t, 8.4, 8.7));
        if (k <= 0) return;
        g.save(); g.globalAlpha = wa * k; g.translate(0, (1 - k) * 40);
        K.font('400 italic', 132, K.SERIF); g.fillStyle = K.ORL; g.textAlign = 'left'; g.fillText(it[0] + '.', 90, 660);
        g.restore();
        g.save(); g.globalAlpha = wa * k; K.windowCard(40 + (1 - k) * 80, 780, 1000, K.site(it[1], 'warm'), 1); g.restore();
      });
      g.restore();
    }
    // 8.6–11.6 · for whom
    var fa = K.win(t, 8.6, 11.7, 0.35, 0.3);
    if (fa > 0) {
      g.save(); g.globalAlpha = fa;
      K.kicker('Who for', 90, 470, 1);
      K.headline(['For businesses in', 'the *Netherlands*', 'and *worldwide*.'], 90, 620, 98, 8.7, t, 116);
      ['English', 'Nederlands', 'Your time zone'].forEach(function (s, i) { K.tag(s, 90 + [0, 250, 560][i], 1080, i === 2 ? K.GREEN : K.OR, K.back(K.seg(t, 9.3 + i * 0.4, 9.7 + i * 0.4))); });
      g.restore();
    }
    // 11.6–13.4 · the promise
    var pa = K.win(t, 11.6, 13.5, 0.35, 0.3);
    if (pa > 0) {
      g.save(); g.globalAlpha = pa;
      K.headline(['Websites that *earn*,', 'while you *sleep*.'], 540, 820, 92, 11.7, t, 112, 'center');
      K.notification(540, 1180, 'New booking · Sat 10:30', 'Booked online at 23:14', K.ease(K.seg(t, 12.0, 12.4)), 'B');
      g.restore();
    }
    K.endCard(t, 13.4, 'Nice to *meet* you.');
  }
};
