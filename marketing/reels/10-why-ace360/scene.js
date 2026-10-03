/* Relaunch 4 · Why Ace 360: three promises. */
window.REEL_SCENE = {
  duration: 16.5,
  cues: { cover: 1.5, beat: [2.0, 15.0], whoosh: [2.1, 5.5, 8.9], chime: [4.2, 7.6, 11.4], hit: [12.6] },
  draw: function (t, K) {
    var g = K.g;
    if (t < 2.4) { g.save(); g.globalAlpha = 1 - K.seg(t, 2.0, 2.4); K.kicker('Why us', 90, 680, K.ease(K.seg(t, 0, 0.3))); K.headline(['Why', '*Ace 360*?'], 90, 840, 170, 0.05, t, 180); g.restore(); }
    var P = [[2.0, 5.6, 'Promise 1', ['One person,', 'start to *finish*.']], [5.4, 9.0, 'Promise 2', ['See it *before*', 'it’s built.']], [8.8, 12.6, 'Promise 3', ['Built to be *found*,', 'and to *earn*.']]];
    P.forEach(function (p, i) {
      var k = K.win(t, p[0], p[1], 0.35, 0.3); if (k <= 0) return;
      g.save(); g.globalAlpha = k;
      K.kicker(p[2], 90, 380, 1); K.headline(p[3], 90, 520, 96, p[0] + 0.05, t, 112);
      var e = K.ease(K.seg(t, p[0] + 0.3, p[0] + 0.9));
      if (i === 0) {
        // a call with the one person who does it all
        g.save(); g.globalAlpha = k * e; g.translate(0, (1 - e) * 60);
        K.rr(240, 760, 600, 760, 60); g.fillStyle = '#16120f'; g.fill(); g.strokeStyle = 'rgba(255,200,150,0.2)'; g.lineWidth = 2; g.stroke();
        g.beginPath(); g.arc(540, 960, 110, 0, 7); g.fillStyle = K.OR; g.fill(); K.text('A', 540, 1002, 120, '#111', 800, 'center');
        K.text('Ace 360 Services', 540, 1140, 48, K.CREAM, 700, 'center');
        var sec = Math.floor(K.c01((t - p[0] - 0.5) / 3) * 214); K.text('0' + Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2), 540, 1196, 36, K.MUTED, 600, 'center', K.MONO);
        for (var b = 0; b < 15; b++) { var hh = 20 + Math.abs(Math.sin(t * 9 + b * 1.3)) * 70; g.fillStyle = 'rgba(244,239,233,0.85)'; K.rr(392 + b * 20, 1290 - hh / 2, 10, hh, 5); g.fill(); }
        g.restore();
        ['Design', 'Build', 'Support'].forEach(function (s, j) { K.tag(s, 120 + j * 300, 1660, K.OR, K.back(K.seg(t, p[0] + 1.2 + j * 0.3, p[0] + 1.6 + j * 0.3))); });
      } else if (i === 1) {
        var src = K.site('adem', 'warm'), w = 1000, h = w * 640 / 1024, y = 780, wk = K.inOut(K.seg(t, p[0] + 1.0, p[0] + 2.2));
        g.save(); g.globalAlpha = k * e;
        K.rr(40, y, w, h, 26); g.fillStyle = '#f7f4ee'; g.fill();
        g.strokeStyle = '#3a3f4a'; g.lineWidth = 4; g.setLineDash([14, 10]);
        [[80, 830, 920, 50], [80, 920, 420, 200], [540, 920, 460, 200], [80, 1160, 280, 160], [400, 1160, 280, 160], [720, 1160, 280, 160]].forEach(function (r) { g.strokeRect(r[0], r[1], r[2], r[3]); });
        g.setLineDash([]);
        g.beginPath(); g.rect(40, 0, w * wk, K.H); g.clip(); K.windowCard(40, y, w, src, 1); g.restore();
        if (wk > 0 && wk < 1) { g.fillStyle = K.OR; g.fillRect(40 + w * wk - 4, y, 8, h); }
        K.tag('Two feedback rounds included', 90, 1500, K.OR, K.back(K.seg(t, p[0] + 2.3, p[0] + 2.7)));
      } else {
        var cx = 540, cy = 1090, r = 190, sc = Math.round(98 * K.ease(K.seg(t, p[0] + 0.6, p[0] + 2.0)));
        g.save(); g.globalAlpha = k * e;
        g.lineWidth = 34; g.strokeStyle = 'rgba(43,209,126,0.18)'; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke();
        g.strokeStyle = K.GREEN; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * sc / 100); g.stroke();
        K.text(String(sc), cx, cy + 50, 160, K.CREAM, 800, 'center'); K.text('SPEED SCORE', cx, cy + 110, 30, K.MUTED, 600, 'center', K.MONO);
        g.restore();
        ['Fast', 'Found on Google', 'Bookable 24/7'].forEach(function (s, j) { K.tag(s, [90, 300, 690][j], 1440, j === 0 ? K.GREEN : K.OR, K.back(K.seg(t, p[0] + 1.6 + j * 0.35, p[0] + 2.0 + j * 0.35))); });
      }
      g.restore();
    });
    K.endCard(t, 12.6, 'The *Ace 360* way.');
  }
};
