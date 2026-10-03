/* Relaunch 3 · How it works: five steps from first call to launch. */
window.REEL_SCENE = {
  duration: 18,
  cues: { cover: 12.6, beat: [1.8, 16.4], tick: [2.4, 4.6, 6.8, 9.0, 11.2], chime: [11.4], hit: [14.2] },
  draw: function (t, K) {
    var g = K.g;
    var a = 1 - K.seg(t, 13.6, 14.1);
    if (a <= 0) { K.endCard(t, 14.1, 'From first call to *live*.'); return; }
    g.save(); g.globalAlpha = a;
    K.kicker('How it works', 90, 330, K.ease(K.seg(t, 0, 0.3)));
    K.headline(['Five steps.', 'No *surprises*.'], 90, 470, 104, 0.05, t, 118);
    var steps = [['Book a free call', '20 minutes, in your time zone'], ['Get a clear plan', 'price and launch date in writing'], ['See your design', 'before anything is built'], ['We build, you watch', 'on a live test site'], ['Launch', 'then hand-over or care plan']];
    var x = 150, y0 = 760, gap = 196, n = steps.length;
    var prog = K.c01((t - 2.2) / (n * 2.2 - 1.2));
    g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(x - 3, y0, 6, gap * (n - 1));
    g.fillStyle = K.OR; g.fillRect(x - 3, y0, 6, gap * (n - 1) * prog);
    steps.forEach(function (s, i) {
      var st = 2.2 + i * 2.2, on = K.ease(K.seg(t, st, st + 0.4)), y = y0 + i * gap;
      g.beginPath(); g.arc(x, y, 34, 0, Math.PI * 2); g.fillStyle = on > 0.5 ? K.OR : '#1d1814'; g.fill();
      g.lineWidth = 4; g.strokeStyle = on > 0.5 ? K.OR : 'rgba(255,255,255,0.25)'; g.stroke();
      if (on > 0.5) { g.strokeStyle = '#111'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 13, y + 1); g.lineTo(x - 3, y + 11); g.lineTo(x + 15, y - 10); g.stroke(); }
      else K.text(String(i + 1), x, y + 13, 34, K.MUTED, 700, 'center', K.MONO);
      g.save(); g.globalAlpha = a * K.lerp(0.35, 1, on); g.translate((1 - on) * 20, 0);
      K.text(s[0], x + 80, y - 2, 58, K.CREAM, 750); K.text(s[1], x + 80, y + 50, 34, K.MUTED, 500);
      g.restore();
    });
    var done = K.ease(K.seg(t, 12.0, 12.5));
    if (done > 0) K.tag('Live, and looked after', 90, 1790, K.GREEN, done);
    g.restore();
  }
};
