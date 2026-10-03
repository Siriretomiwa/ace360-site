/* Relaunch 5 · Who we build for: quick cuts through the kinds of business we work with. */
(function () {
  var cache = {};
  function shot(K, kind) { if (!cache[kind]) { var c = K.mkc(1024, 640); K.P.paint(c, kind, ''); cache[kind] = c; } return cache[kind]; }
  var LIST = [['Bakeries', 'korrel', 1], ['Hair & beauty', 'noor', 1], ['Restaurants', 'zout', 1], ['Coffee roasters', 'molen', 1], ['Charities', 'voedselbrug', 1], ['Fashion stores', 'sidwalk', 0], ['Food & industry', 'culpromark', 0], ['Creators & platforms', 'crea8or', 0]];
  var T0 = 2.2, D = 1.3;
  var cues = { cover: 3.0, beat: [2.0, 15.2], whoosh: [], chime: [12.9], hit: [13.4] };
  LIST.forEach(function (x, i) { cues.whoosh.push(T0 + i * D - 0.05); });
  window.REEL_SCENE = {
    duration: 16.5, cues: cues,
    draw: function (t, K) {
      var g = K.g;
      if (t < 2.6) { g.save(); g.globalAlpha = 1 - K.seg(t, 2.2, 2.6); K.kicker('Our clients', 90, 680, K.ease(K.seg(t, 0, 0.3))); K.headline(['Who we', 'build *for*.'], 90, 840, 160, 0.05, t, 172); g.restore(); }
      var end = T0 + LIST.length * D;
      if (t >= T0 - 0.1 && t < end + 0.4) {
        var i = Math.min(LIST.length - 1, Math.floor((t - T0) / D)), lt = t - T0 - i * D, it = LIST[i];
        var a = K.ease(K.seg(lt, 0, 0.18)) * (i === LIST.length - 1 ? 1 - K.seg(t, end, end + 0.35) : 1);
        var src = it[2] ? K.site(it[1], 'warm') : shot(K, it[1]);
        g.save(); g.globalAlpha = a;
        K.text(('0' + (i + 1)).slice(-2) + ' / 0' + LIST.length, 90, 520, 30, K.ORL, 600, 'left', K.MONO);
        g.save(); g.translate((1 - K.ease(K.seg(lt, 0, 0.25))) * 60, 0); K.text(it[0], 90, 660, it[0].length > 15 ? 96 : 116, K.CREAM, 800); g.restore();
        K.windowCard(40, 790, 1000, src, 1, K.lerp(1.04, 1, K.ease(K.seg(lt, 0, 0.5))));
        // progress dots
        for (var d = 0; d < LIST.length; d++) { g.fillStyle = d <= i ? K.OR : 'rgba(255,255,255,0.2)'; K.rr(90 + d * 60, 1560, d === i ? 48 : 36, 8, 4); g.fill(); }
        g.restore();
      }
      var y = K.win(t, end + 0.2, 13.5, 0.35, 0.3);
      if (y > 0) { g.save(); g.globalAlpha = y; K.headline(['Your business', '*next*?'], 540, 900, 130, end + 0.25, t, 150, 'center'); g.restore(); }
      K.endCard(t, 13.4, 'Every kind of *business*.');
    }
  };
})();
