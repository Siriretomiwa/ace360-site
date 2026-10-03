/* Thumbnail for Short 03 · The missed call. One still (render with --stills 0.5). Key text kept in the centre band
   (y 360–1500) so it survives the feed's crop; the signature ring + corner mark come from common.js. */
(function () {
  var scr = null;
  function screen(K) {
    var c = scr || (scr = K.mkc(360, 740)), x = c.getContext('2d');
    function rr(a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
    function tx(s, a, b, sz, col, wt, fam) { x.font = (wt || 600) + ' ' + sz + 'px ' + (fam || K.SANS); x.fillStyle = col; x.textAlign = 'center'; x.fillText(s, a, b); }
    var bg = x.createLinearGradient(0, 0, 0, 740); bg.addColorStop(0, '#2a1d24'); bg.addColorStop(1, '#120d10'); x.fillStyle = bg; x.fillRect(0, 0, 360, 740);
    x.fillStyle = '#000'; rr(128, 14, 104, 26, 13); x.fill();
    tx('Tuesday', 180, 110, 18, 'rgba(255,255,255,0.7)'); tx('11:00', 180, 190, 72, '#fff', 300);
    rr(18, 240, 324, 96, 20); x.fillStyle = 'rgba(255,255,255,0.93)'; x.fill();
    rr(32, 260, 56, 56, 14); x.fillStyle = '#ff4d4d'; x.fill(); tx('✆', 60, 300, 32, '#fff', 700);
    x.textAlign = 'left'; x.font = '800 20px ' + K.SANS; x.fillStyle = '#111'; x.fillText('Missed call', 102, 282);
    x.font = '500 15px ' + K.MONO; x.fillStyle = '#555'; x.fillText('+31 6 ·· ·· ·· 14', 102, 310);
    return c;
  }
  window.REEL_SCENE = {
    duration: 1, cues: {},
    draw: function (t, K) {
      var g = K.g;
      // headline
      K.text('THE', 540, 430, 120, K.CREAM, 900, 'center');
      K.font('400 italic', 230, K.SERIF); g.fillStyle = K.ORL; g.textAlign = 'center'; g.fillText('missed', 540, 640);
      K.text('CALL', 540, 800, 170, K.CREAM, 900, 'center');
      // the phone with a missed call, ringing waves behind it
      g.save(); g.strokeStyle = K.OR; g.lineWidth = 8;
      [0, 1, 2].forEach(function (i) { g.globalAlpha = 0.55 - i * 0.15; g.beginPath(); g.arc(540, 1250, 250 + i * 70, -0.5, 0.5); g.stroke(); g.beginPath(); g.arc(540, 1250, 250 + i * 70, Math.PI - 0.5, Math.PI + 0.5); g.stroke(); });
      g.restore();
      K.phone(395, 960, 290, screen(K), 1, -0.05);
      // red badge
      g.save(); g.translate(680, 1000); g.rotate(0.08); K.rr(-20, -46, 250, 92, 46); g.fillStyle = '#e8231f'; g.fill();
      K.text('1 missed', 105, 16, 46, '#fff', 800, 'center'); g.restore();
      // promise line
      K.rich('…and how her *website* could have answered it.', 540, 895, 44, K.MUTED, 'center');
    }
  };
})();
