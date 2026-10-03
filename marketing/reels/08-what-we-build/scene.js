/* Relaunch 2 · What we build: five kinds of work, one quick look at each. */
(function () {
  var cache = {};
  function shot(K, kind) { if (!cache[kind]) { var c = K.mkc(1024, 640); K.P.paint(c, kind, ''); cache[kind] = c; } return cache[kind]; }
  function careCard(K) {
    if (cache.care) return cache.care;
    var c = K.mkc(1024, 640), x = c.getContext('2d');
    x.fillStyle = '#fbf8f3'; x.fillRect(0, 0, 1024, 640);
    x.fillStyle = '#111'; x.font = '700 44px ' + K.SANS; x.fillText('October care report', 60, 100);
    x.fillStyle = '#7a7470'; x.font = '500 26px ' + K.MONO; x.fillText('yourbrand.nl', 60, 146);
    [['Updates installed', '14 ✓'], ['Backups', 'Daily ✓'], ['Uptime', '99.98%'], ['Speed score', '98']].forEach(function (r, i) {
      var y = 210 + i * 86; x.fillStyle = 'rgba(0,0,0,0.08)'; x.fillRect(60, y, 904, 2);
      x.fillStyle = '#222'; x.font = '500 34px ' + K.SANS; x.fillText(r[0], 60, y + 56);
      x.fillStyle = '#1a8f4e'; x.font = '700 34px ' + K.SANS; x.textAlign = 'right'; x.fillText(r[1], 964, y + 56); x.textAlign = 'left';
    });
    x.fillStyle = '#111'; x.beginPath(); x.roundRect ? x.roundRect(60, 560 - 6, 904, 70, 16) : x.rect(60, 554, 904, 70); x.fill();
    x.fillStyle = '#ff6a00'; x.beginPath(); x.arc(104, 589, 20, 0, 7); x.fill();
    x.fillStyle = '#fff'; x.font = '600 28px ' + K.SANS; x.fillText('“New menu prices” · done in 2 hours', 140, 599);
    return (cache.care = c);
  }
  window.REEL_SCENE = {
    duration: 17,
    cues: { cover: 1.6, beat: [2.2, 15.6], whoosh: [2.3, 4.5, 6.7, 8.9, 11.1], chime: [13.2], hit: [13.6] },
    draw: function (t, K) {
      var g = K.g;
      if (t < 2.6) { g.save(); g.globalAlpha = 1 - K.seg(t, 2.2, 2.6); K.kicker('Ace 360', 90, 640, K.ease(K.seg(t, 0, 0.3))); K.headline(['What we', '*build*.'], 90, 800, 170, 0.05, t, 180); g.restore(); }
      var cats = [
        ['01', 'Websites', 'that tell your *story*.', function () { return K.site('korrel', 'warm'); }],
        ['02', 'Online stores', 'that *sell* around the clock.', function () { return shot(K, 'sidwalk'); }],
        ['03', 'Booking sites', 'that fill your *calendar*.', function () { return K.site('noor', 'warm'); }],
        ['04', 'Platforms', 'that *grow* with you.', function () { return shot(K, 'crea8or'); }],
        ['05', 'Care & growth', 'that keep it *fast*.', function () { return careCard(K); }]
      ];
      cats.forEach(function (c, i) {
        var a0 = 2.2 + i * 2.2, a1 = a0 + 2.3, k = K.win(t, a0, a1, 0.35, 0.3);
        if (i === 4) k = K.ease(K.seg(t, a0, a0 + 0.35)) * (1 - K.seg(t, 13.3, 13.6));
        if (k <= 0) return;
        g.save(); g.globalAlpha = k;
        K.text(c[0] + ' / 05', 90, 420, 30, K.ORL, 600, 'left', K.MONO);
        g.save(); g.translate((1 - k) * -40, 0); K.text(c[1], 90, 560, 112, K.CREAM, 800); g.restore();
        K.rich(c[2], 90, 660, 64, K.MUTED);
        var e = K.ease(K.seg(t, a0, a0 + 0.6));
        K.windowCard(40 + (1 - e) * 140, 800, 1000, c[3](), 1, K.lerp(0.94, 1, e));
        if (i === 2) K.phone(720, 1180, 250, K.phoneSite('noor', 'warm'), K.ease(K.seg(t, a0 + 0.6, a0 + 1.0)), 0.06);
        g.restore();
      });
      K.endCard(t, 13.6, 'Built to *earn*.');
    }
  };
})();
