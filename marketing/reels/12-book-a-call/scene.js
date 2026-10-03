/* Relaunch 6 · Book a free call: the booking flow on a phone, in your own time zone. */
(function () {
  var scr = null;
  function ui(K, t) {
    var c = scr || (scr = K.mkc(360, 740)), x = c.getContext('2d'), SANS = K.SANS, MONO = K.MONO;
    function rr(a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
    function tx(s, a, b, sz, col, wt, al, fam) { x.font = (wt || 600) + ' ' + sz + 'px ' + (fam || SANS); x.fillStyle = col; x.textAlign = al || 'left'; x.fillText(s, a, b); }
    x.fillStyle = '#fbf8f3'; x.fillRect(0, 0, 360, 740);
    tx('9:41', 24, 30, 14, '#111', 700); tx('ace360services.nl', 180, 30, 11, '#888', 500, 'center', MONO);
    tx('● FREE · 20 MIN · NO STRINGS', 22, 78, 10, '#1a8f4e', 700, 'left', MONO);
    tx('Book a free call', 22, 116, 28, '#111', 800);
    tx('Times in your time zone: London', 22, 142, 11, '#777', 500, 'left', MONO);
    var dayPick = K.c01((t - 3.6) / 0.25), timePick = K.c01((t - 6.4) / 0.25), confirm = K.c01((t - 8.4) / 0.3);
    var days = [['MON', 5], ['TUE', 6], ['WED', 7], ['THU', 8], ['FRI', 9]];
    days.forEach(function (d, i) {
      var on = i === 1 && dayPick > 0.5; rr(22 + i * 64, 166, 56, 70, 12); x.fillStyle = on ? '#111' : '#fff'; x.fill(); x.strokeStyle = '#ddd'; x.lineWidth = 1; x.stroke();
      tx(d[0], 50 + i * 64, 190, 10, on ? '#bbb' : '#888', 600, 'center', MONO); tx(String(d[1]), 50 + i * 64, 222, 22, on ? '#fff' : '#111', 700, 'center');
    });
    var times = ['14:30', '15:00', '16:30', '17:00', '17:30'];
    times.forEach(function (s, i) {
      var on = i === 1 && timePick > 0.5, cx = 22 + (i % 3) * 106, cy = 258 + Math.floor(i / 3) * 56; rr(cx, cy, 96, 44, 10);
      x.fillStyle = on ? '#ff6a00' : '#fff'; x.fill(); x.strokeStyle = on ? '#ff6a00' : '#ddd'; x.stroke(); tx(s, cx + 48, cy + 28, 16, '#111', 650, 'center');
    });
    x.globalAlpha = K.c01((t - 6.9) / 0.3);
    x.fillStyle = 'rgba(0,0,0,0.08)'; x.fillRect(22, 382, 316, 1);
    tx('YOUR CALL', 22, 410, 10, '#888', 600, 'left', MONO); tx('Tuesday 6 October · 15:00', 22, 436, 17, '#111', 700);
    [['Name', 'Sam Taylor'], ['Email', 'sam@yourbrand.com']].forEach(function (f, i) { rr(22, 456 + i * 64, 316, 50, 10); x.fillStyle = '#fff'; x.fill(); x.strokeStyle = '#ddd'; x.stroke(); tx(f[0].toUpperCase(), 34, 474 + i * 64, 9, '#999', 600, 'left', MONO); tx(f[1], 34, 495 + i * 64, 14, '#222', 500); });
    rr(22, 600, 316, 52, 12); x.fillStyle = '#ff6a00'; x.fill(); tx('Confirm my call →', 180, 632, 16, '#111', 800, 'center');
    x.globalAlpha = 1;
    if (confirm > 0) {
      x.globalAlpha = confirm; x.fillStyle = 'rgba(251,248,243,0.97)'; x.fillRect(0, 50, 360, 690);
      x.beginPath(); x.arc(180, 300, 44, 0, 7); x.fillStyle = '#1a8f4e'; x.fill();
      x.strokeStyle = '#fff'; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(160, 300); x.lineTo(174, 314); x.lineTo(200, 286); x.stroke();
      tx('Your call is booked', 180, 390, 24, '#111', 800, 'center'); tx('Tuesday 6 October · 15:00', 180, 420, 15, '#555', 500, 'center'); tx('(your time, London)', 180, 442, 12, '#888', 500, 'center', MONO);
      rr(70, 480, 220, 44, 12); x.strokeStyle = '#ccc'; x.lineWidth = 1.5; x.stroke(); tx('Add to calendar', 180, 508, 14, '#111', 650, 'center');
      x.globalAlpha = 1;
    }
    return c;
  }
  window.REEL_SCENE = {
    duration: 16,
    cues: { cover: 1.6, beat: [2.2, 14.6], tick: [3.6, 6.4], click: [8.2], chime: [8.6, 11.0], whoosh: [2.3], hit: [12.4] },
    draw: function (t, K) {
      var g = K.g;
      if (t < 2.6) { g.save(); g.globalAlpha = 1 - K.seg(t, 2.2, 2.6); K.kicker('Free call', 90, 640, K.ease(K.seg(t, 0, 0.3))); K.headline(['20 minutes.', 'No strings.', 'Just *talk*.'], 90, 790, 140, 0.05, t, 156); g.restore(); }
      var a = K.win(t, 2.2, 12.5, 0.4, 0.35);
      if (a > 0) {
        g.save(); g.globalAlpha = a;
        var caps = [[2.2, 5.2, 'Step 1', 'Pick a *day*.'], [5.0, 8.0, 'Step 2', 'Pick a time in *your* time zone.'], [7.8, 10.8, 'Step 3', 'Done. We’ll *call* you.'], [10.6, 12.5, 'Confirmed', 'The invite is in your *inbox*.']];
        caps.forEach(function (c) { var k = K.win(t, c[0], c[1], 0.3, 0.25); if (k <= 0) return; g.save(); g.globalAlpha = a * k; K.kicker(c[2], 90, 360, 1); K.rich(c[3], 90, 470, c[3].length > 26 ? 64 : 80); g.restore(); });
        var e = K.ease(K.seg(t, 2.3, 3.0));
        K.phone(270, 600 + (1 - e) * 200, 540, ui(K, t), e, -0.02);
        K.notification(540, 250, 'Your call with Ace 360', 'Tue 6 Oct · 15:00 · invite attached', K.ease(K.seg(t, 11.0, 11.4)) * (1 - K.seg(t, 12.2, 12.5)), '@');
        g.restore();
      }
      K.endCard(t, 12.4, 'Let’s *talk*.');
    }
  };
})();
