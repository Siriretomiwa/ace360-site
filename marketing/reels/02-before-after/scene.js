/* Reel 2 · Before → After: a dated, insecure, slow site becomes a fast one that takes orders. */
window.REEL_SCENE = {
  duration: 19,
  cues: { cover: 1.7, beat: [8.4, 18.4], rest: [], tick: [2.4, 3.2, 4.0, 9.6, 10.4, 11.2], whoosh: [7.4], chime: [11.9], swell: [12.6], hit: [15.4] },
  draw: function (t, K) {
    var g = K.g, w = 1000, sc = w / 1024, X = 40, Y = 700;
    // hook + before
    if (t < 7.8) {
      var a = 1 - K.seg(t, 7.3, 7.8);
      g.save(); g.globalAlpha = a;
      K.kicker('Before', 90, 380, K.ease(K.seg(t, 0, 0.3)));
      K.headline(['This website was', '*costing* them customers.'], 90, 500, 74, 0.05, t, 90);
      K.windowCard(X, Y, w, K.screen('old'), K.ease(K.seg(t, 0.6, 1.1)), 1, 'rgba(255,60,60,0.25)');
      K.marker(X + 326 * sc, Y + 25 * sc, 120, 30, K.ease(K.seg(t, 2.4, 2.9)), K.RED);
      K.tag('Not secure', X + 326 * sc - 90, Y - 40, K.RED, K.back(K.seg(t, 2.4, 2.8)));
      K.marker(X + 775 * sc, Y + 320 * sc, 90, 90, K.ease(K.seg(t, 3.2, 3.7)), K.RED);
      K.tag('8.4 s to load', X + 775 * sc + 110, Y + 320 * sc + 140, K.RED, K.back(K.seg(t, 3.2, 3.6)), 'right');
      K.marker(X + 175 * sc, Y + 436 * sc, 170, 62, K.ease(K.seg(t, 4.0, 4.5)), K.RED);
      K.tag('Mobile score 23/100', X + 40, Y + 500 * sc + 120, K.RED, K.back(K.seg(t, 4.0, 4.4)));
      K.phone(700, 1190, 200, K.phoneScr('old'), K.ease(K.seg(t, 4.8, 5.3)), 0.08);
      g.restore();
    }
    // transition
    if (t > 7.2 && t < 8.8) {
      var k = K.win(t, 7.3, 8.8, 0.3, 0.4);
      g.save(); g.globalAlpha = k; K.rich('*3 weeks* later.', 540, 980, 96, K.CREAM, 'center'); g.restore();
    }
    // after
    if (t > 8.5 && t < 15.8) {
      var b = K.ease(K.seg(t, 8.5, 9)) * (1 - K.seg(t, 15.3, 15.8));
      g.save(); g.globalAlpha = b;
      K.kicker('After', 90, 380, 1);
      K.rich('Fast, safe and *selling*.', 90, 500, 74);
      K.windowCard(X, Y, w, K.site('korrel', 'warm'), 1, K.lerp(0.95, 1, K.ease(K.seg(t, 8.5, 9.3))), 'rgba(43,209,126,0.25)');
      K.tag('Secure', X + 300, Y - 40, K.GREEN, K.back(K.seg(t, 9.6, 10)));
      K.tag('Loads in 0.9 s', X + 980, Y + 380, K.GREEN, K.back(K.seg(t, 10.4, 10.8)), 'right');
      K.phone(720, 1170, 200, K.phoneSite('korrel', 'warm'), K.ease(K.seg(t, 10.8, 11.3)), 0.06);
      K.tag('Orders 24/7 with iDEAL', X + 20, Y + 700, K.GREEN, K.back(K.seg(t, 11.2, 11.6)));
      K.notification(540, 250, 'New order · €29.80', 'Bakkerij Korrel · iDEAL', K.win(t, 11.9, 15.3, 0.35, 0.3));
      g.restore();
      // the score
      var s = K.win(t, 12.6, 15.8, 0.4, 0.5);
      if (s > 0) {
        g.save(); g.globalAlpha = s; g.fillStyle = 'rgba(13,10,8,0.82)'; g.fillRect(0, 0, K.W, K.H);
        var f = K.inOut(K.seg(t, 12.9, 14.4)), v = Math.round(K.lerp(23, 98, f)), cx = 540, cy = 980, R = 230;
        g.lineWidth = 32; g.strokeStyle = 'rgba(255,255,255,0.08)'; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
        g.strokeStyle = v < 50 ? K.RED : v < 90 ? K.OR : K.GREEN; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * v / 100); g.stroke(); g.lineCap = 'butt';
        K.text(String(v), cx, cy + 50, 150, K.CREAM, 800, 'center');
        K.text('MOBILE SCORE', cx, cy - 125, 28, K.MUTED, 600, 'center', K.MONO);
        K.rich('From *23* to *98*.', 540, 1360, 64, K.CREAM, 'center');
        g.restore();
      }
    }
    K.endCard(t, 15.4, 'Ready for *your* after?');
  }
};
