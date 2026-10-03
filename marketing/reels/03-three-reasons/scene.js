/* Reel 3 · 3 reasons your website gets visitors but no customers. */
window.REEL_SCENE = {
  duration: 22.5,
  cues: { cover: 1.8, beat: [2.6, 21.6], tick: [3.2, 8.4, 14.4], click: [5.0], whoosh: [2.7, 8.1, 14.1], chime: [17.2], hit: [19.3] },
  draw: function (t, K) {
    var g = K.g, w = 1000, sc = w / 1024, X = 40, Y = 700;
    if (t < 3) {
      g.save(); g.globalAlpha = 1 - K.seg(t, 2.6, 3);
      K.kicker('Website check', 90, 560, K.ease(K.seg(t, 0, 0.3)));
      K.headline(['3 reasons your', 'website gets visitors', 'but *no customers*.'], 90, 690, 92, 0.05, t, 106);
      g.restore();
    }
    function title(s, a) { g.save(); g.globalAlpha = a; K.kicker('Reason ' + s[0] + ' of 3', 90, 380, 1); K.rich(s[1], 90, 500, 74); g.restore(); }
    // 1 · no clear next step
    var a1 = K.win(t, 2.8, 8.4, 0.4, 0.3);
    if (a1 > 0) {
      title(['1', 'No clear *next step*.'], a1);
      g.save(); g.globalAlpha = a1;
      K.windowCard(X, Y, w, K.site('korrel', 'warm'), 1);
      K.marker(X + 112 * sc, Y + 343 * sc, 120, 48, K.ease(K.seg(t, 4.2, 4.8)));
      K.tag('One page, one obvious action', X + 20, Y + 760, K.OR, K.back(K.seg(t, 5.2, 5.6)));
      g.restore();
    }
    // 2 · slow on phones
    var a2 = K.win(t, 8.2, 14.4, 0.4, 0.3);
    if (a2 > 0) {
      title(['2', 'It’s slow on *phones*.'], a2);
      g.save(); g.globalAlpha = a2;
      var loaded = t > 12.2, ph = K.phoneSite('noor', 'warm');
      K.phone(330, 640, 300, ph, 1, -0.03);
      if (!loaded) {
        g.save(); g.translate(480, 950); g.fillStyle = 'rgba(240,240,240,0.97)'; K.rr(-150, -310, 300, 620, 34); g.fill();
        for (var i = 0; i < 10; i++) { var an = i * Math.PI / 5 + t * 6; g.fillStyle = 'rgba(60,60,60,' + (0.12 + i * 0.08) + ')'; g.beginPath(); g.arc(Math.cos(an) * 40, Math.sin(an) * 40, 9, 0, 7); g.fill(); }
        g.restore();
      }
      var secs = Math.min(4, (t - 8.9) * 1.1);
      K.text((loaded ? '0.9' : Math.max(0, secs).toFixed(1)) + ' s', 820, 900, 96, loaded ? K.GREEN : K.RED, 800, 'center');
      K.text(loaded ? 'after' : 'loading…', 820, 960, 30, K.MUTED, 600, 'center', K.MONO);
      var f = K.ease(K.seg(t, 10.2, 10.7)) * (1 - K.seg(t, 12, 12.3));
      if (f > 0) { g.globalAlpha = a2 * f; K.rich('*53%* of mobile visitors', 540, 1440, 54, K.CREAM, 'center'); K.text('leave after 3 seconds.', 540, 1505, 54, K.CREAM, 700, 'center'); }
      if (loaded) { g.globalAlpha = a2 * K.ease(K.seg(t, 12.3, 12.7)); K.tag('Built to load in under a second', 540 - 300, 1470, K.GREEN, 1); }
      g.restore();
    }
    // 3 · can't book or pay
    var a3 = K.win(t, 14.2, 19.6, 0.4, 0.3);
    if (a3 > 0) {
      title(['3', 'They can’t *book or pay*.'], a3);
      g.save(); g.globalAlpha = a3;
      K.windowCard(X, Y, w, K.site('noor', 'warm'), 1);
      K.marker(X + 762 * sc, Y + 504 * sc, 250, 130, K.ease(K.seg(t, 15.4, 16)));
      K.tag('Booking + iDEAL, 24/7', X + 20, Y + 760, K.OR, K.back(K.seg(t, 16.2, 16.6)));
      K.notification(540, 250, 'New booking · Sat 10:30', 'Studio Noor · paid with iDEAL', K.ease(K.seg(t, 17.2, 17.6)), 'B');
      g.restore();
    }
    K.endCard(t, 19.3, 'Want us to check *yours*?');
  }
};
