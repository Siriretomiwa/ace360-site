/* Reel 6 · What a premium website is made of: the page comes apart in four layers. */
window.REEL_SCENE = {
  duration: 20,
  cues: { cover: 1.7, beat: [2.6, 19.2], whoosh: [3.4, 12.6], tick: [4.8, 6.7, 8.6, 10.5], swell: [11.2], hit: [16.4] },
  draw: function (t, K) {
    var g = K.g;
    if (t < 3) {
      g.save(); g.globalAlpha = 1 - K.seg(t, 2.6, 3);
      K.kicker('Behind the screen', 90, 560, K.ease(K.seg(t, 0, 0.3)));
      K.headline(['What a premium', 'website is', '*made of*.'], 90, 690, 112, 0.05, t, 124);
      g.restore();
    }
    var L = [['Design', 'Looks like *you*, not a template.'], ['Speed', 'Loads in under a *second*.'], ['SEO', 'Google understands what you *sell*.'], ['Conversion', 'Book and pay in *one tap*.']];
    var a = K.win(t, 2.7, 16.6, 0.4, 0.4);
    if (a > 0) {
      var src = K.site('molen', 'warm'), w = 940, sh = w * 640 / 1024 / 4, X = 70;
      var spread = K.inOut(K.seg(t, 3.4, 4.4)) * (1 - K.inOut(K.seg(t, 12.6, 13.6)));
      var cur = Math.floor((t - 4.8) / 1.9); if (t < 4.8 || t > 12.4) cur = -1;
      var top = K.lerp(760, 610, spread), gap = K.lerp(0, 205, spread);
      g.save(); g.globalAlpha = a;
      if (spread < 0.05 && t < 5) { K.kicker('Your website', 90, 380, 1); K.rich('One page.', 90, 500, 74); }
      if (t > 13.6) { K.kicker('Together', 90, 380, K.ease(K.seg(t, 13.6, 14))); g.globalAlpha = a * K.ease(K.seg(t, 13.7, 14.2)); K.rich('= a website that *earns*.', 90, 500, 74); g.globalAlpha = a; }
      for (var i = 0; i < 4; i++) {
        var y = top + i * (sh + gap), dim = cur >= 0 && cur !== i ? 0.35 : 1, lift = cur === i ? 1 : 0;
        g.save(); g.globalAlpha = a * dim;
        g.translate(X + w / 2, y + sh / 2); g.rotate(spread * (i % 2 ? 0.015 : -0.015)); g.scale(1 + lift * 0.03, 1 + lift * 0.03); g.translate(-w / 2, -sh / 2);
        g.shadowColor = lift ? 'rgba(255,110,20,0.6)' : 'rgba(0,0,0,0.5)'; g.shadowBlur = lift ? 60 : 30; g.shadowOffsetY = 14;
        g.fillStyle = '#000'; K.rr(0, 0, w, sh, spread > 0.1 ? 14 : 0); g.fill(); g.shadowColor = 'transparent';
        g.save(); K.rr(0, 0, w, sh, spread > 0.1 ? 14 : 0); g.clip(); g.drawImage(src, 0, i * 160, 1024, 160, 0, 0, w, sh); g.restore();
        if (lift) { g.strokeStyle = K.OR; g.lineWidth = 4; K.rr(0, 0, w, sh, 14); g.stroke(); }
        g.restore();
        var lk = K.ease(K.seg(t, 4.8 + i * 1.9, 5.2 + i * 1.9)) * spread;
        if (lk > 0) { g.save(); g.globalAlpha = a * lk * (cur === i ? 1 : 0.55); K.kicker('0' + (i + 1) + ' · ' + L[i][0], X, y - 22, 1); g.restore(); }
      }
      if (cur >= 0) { g.save(); g.globalAlpha = a * K.ease(K.seg(t, 4.8 + cur * 1.9, 5.2 + cur * 1.9)); K.kicker('Layer ' + (cur + 1) + ' of 4', 90, 380, 1); K.rich(L[cur][1], 90, 500, 66); g.restore(); }
      g.restore();
    }
    K.endCard(t, 16.4, 'Built *properly*.');
  }
};
