/* Shots: restaurants (Zout & Zuur, Jollof House), charities (Voedselbrug, Youth Rise, Bright Wells), The PR Kiosk, SIDWALK apparel. */
(function () {
  var S = STUDIO, T = S.T, C = S.C, SH = S.SHOTS;

  function plate(r, color) {
    return S.latheMesh([[0, 0], [r * 0.62, 0], [r * 0.66, 0.03], [r * 0.7, 0.05], [r, 0.11], [r * 1.02, 0.12], [r * 0.99, 0.13], [r * 0.7, 0.07], [0, 0.065]], new T.MeshPhysicalMaterial({ color: C(color || '#f4f1ec'), roughness: 0.18, clearcoat: 1 }));
  }
  function disc(r, c, y, dome, rough) {
    var g = new T.CircleGeometry(r, 96); g.rotateX(-Math.PI / 2);
    if (dome) { var p = g.attributes.position; for (var i = 0; i < p.count; i++) { var d = Math.sqrt(p.getX(i) * p.getX(i) + p.getZ(i) * p.getZ(i)) / r; p.setY(i, (1 - d * d) * dome); } g.computeVertexNormals(); }
    var m = S.mesh(g, new T.MeshPhysicalMaterial({ map: S.tex(c), roughness: rough == null ? 0.5 : rough, clearcoat: 0.3, transparent: true })); m.position.y = y; return m;
  }
  function tableStage(bg, woodA, woodB) {
    var wm = new T.MeshStandardMaterial({ map: S.tex(S.woodTex(woodA, woodB, 1024, 1024, 14)), roughness: 0.55 }); wm.map.wrapS = wm.map.wrapT = T.RepeatWrapping; wm.map.repeat.set(2, 2);
    return S.stage({ bg: bg, warm: true, key: 1.6, keyPos: [-3, 8, 2], floorMat: wm, fogNear: 8, fogFar: 16 });
  }

  /* ---------- Zout & Zuur: burrata, blood orange, basil, olive oil — on dark walnut ---------- */
  SH['zout-hero'] = function () {
    var s = tableStage('#141414', '#3a2a1e', '#120a06');
    var p = plate(1.25, '#e9e4dc'); s.add(p);
    // blood orange slices
    var r = S.rnd(5);
    for (var i = 0; i < 6; i++) {
      var c = S.cv(256, 256), g = c.getContext('2d');
      g.fillStyle = '#f2c38a'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill();
      for (var k = 0; k < 10; k++) { g.fillStyle = k % 2 ? '#b8202e' : '#9a1424'; g.beginPath(); g.moveTo(128, 128); g.arc(128, 128, 112, k * 0.628 + 0.03, (k + 1) * 0.628 - 0.03); g.closePath(); g.fill(); }
      S.speckle(c, 300, ['#e04050', '#6a0a14'], 1, 4, 30 + i);
      var a = i / 6 * Math.PI * 2 + 0.3, sl = disc(0.33, c, 0.075 + i * 0.004, 0.01, 0.25); sl.position.x = Math.cos(a) * 0.72; sl.position.z = Math.sin(a) * 0.72; s.add(sl);
    }
    // burrata: soft, glossy, slightly torn
    var bg = new T.SphereGeometry(0.48, 96, 64); bg.scale(1, 0.62, 1); S.displace(bg, 0.06, 2.5);
    var bc = S.cv(512, 256), bx = bc.getContext('2d'); bx.fillStyle = '#f6f2ea'; bx.fillRect(0, 0, 512, 256); S.speckle(bc, 400, ['#ffffff', '#e8e0d0'], 2, 8, 3);
    var bur = S.mesh(bg, new T.MeshPhysicalMaterial({ map: S.tex(bc), roughness: 0.3, clearcoat: 0.8, sheen: 0.5 })); bur.position.y = 0.22; s.add(bur);
    // basil leaves + oil drops + pepper
    var lg = new T.SphereGeometry(0.11, 24, 12); lg.scale(1, 0.12, 0.55);
    for (var j = 0; j < 9; j++) { var lf = S.mesh(lg, new T.MeshPhysicalMaterial({ color: C(j % 3 ? '#2f6b2a' : '#3f8a35'), roughness: 0.35, clearcoat: 0.6 })); var a2 = r() * 6.28, d2 = 0.2 + r() * 0.75; lf.position.set(Math.cos(a2) * d2, 0.12 + (d2 < 0.45 ? 0.24 : 0), Math.sin(a2) * d2); lf.rotation.set(r() * 0.4, r() * 6, r() * 0.4); s.add(lf); }
    var oil = new T.MeshPhysicalMaterial({ color: C('#c9a227'), roughness: 0.02, transmission: 0.6, clearcoat: 1, thickness: 0.05 });
    for (var o = 0; o < 14; o++) { var dg = new T.SphereGeometry(0.03 + r() * 0.04, 16, 8); dg.scale(1, 0.25, 1); var dr = S.mesh(dg, oil); var a3 = r() * 6.28, d3 = 0.5 + r() * 0.5; dr.position.set(Math.cos(a3) * d3, 0.085, Math.sin(a3) * d3); s.add(dr); }
    var fork = S.mesh(new T.BoxGeometry(0.08, 0.02, 1.5), S.metal('#c8c9cc', 0.2)); fork.position.set(1.7, 0.01, 0.1); fork.rotation.y = 0.2; s.add(fork);
    return [s, S.camera(1, 1, [0.1, 4.6, 1.7], [0.25, 0, 0.05], 34)];
  };

  /* ---------- Jollof House: party jollof, fried plantain, grilled chicken ---------- */
  SH['jollof-hero'] = function () {
    var s = tableStage('#2a1406', '#7a4a26', '#3a1e0c');
    var p = plate(1.3, '#f6f1e8'); s.add(p);
    var rc = S.cv(1024, 1024), rg = rc.getContext('2d'), r = S.rnd(8);
    rg.fillStyle = '#c4421a'; rg.fillRect(0, 0, 1024, 1024);
    for (var i = 0; i < 9000; i++) { var x = r() * 1024, y = r() * 1024, a = r() * 3.14; rg.save(); rg.translate(x, y); rg.rotate(a); var t = r(); rg.fillStyle = t < 0.4 ? '#d8582a' : t < 0.7 ? '#e8743a' : t < 0.9 ? '#b8361a' : '#f2a060'; rg.beginPath(); rg.ellipse(0, 0, 9, 3.4, 0, 0, 7); rg.fill(); rg.restore(); }
    for (var k = 0; k < 120; k++) { rg.fillStyle = r() > 0.5 ? '#3a8a2a' : '#e8c040'; rg.fillRect(r() * 1024, r() * 1024, 10, 8); }   // peas, sweetcorn
    var rice = disc(0.78, rc, 0.07, 0.22, 0.55); rice.position.set(-0.3, 0, 0.05); s.add(rice);
    // plantain slices
    for (var j = 0; j < 7; j++) {
      var c = S.cv(256, 256), g = c.getContext('2d'); var gr = g.createRadialGradient(128, 128, 20, 128, 128, 128); gr.addColorStop(0, '#f2b24a'); gr.addColorStop(0.7, '#d9822a'); gr.addColorStop(1, '#7a3a10'); g.fillStyle = gr; g.beginPath(); g.ellipse(128, 128, 126, 80, 0, 0, 7); g.fill(); S.speckle(c, 200, ['#5a2a08', '#f6c870'], 1, 4, j);
      var pl = disc(0.2, c, 0.1 + j * 0.006, 0.03, 0.3); var a4 = -0.6 + j * 0.24; pl.position.set(0.55 + Math.cos(a4) * 0.35, 0.02 + j * 0.006, Math.sin(a4) * 0.6); pl.rotation.y = a4; s.add(pl);
    }
    // chicken thigh: browned, glossy
    var cg = new T.SphereGeometry(0.32, 64, 32); cg.scale(1.25, 0.5, 0.9); S.displace(cg, 0.08, 3);
    var cc = S.cv(512, 256), cx = cc.getContext('2d'); cx.fillStyle = '#8a3a14'; cx.fillRect(0, 0, 512, 256); S.speckle(cc, 1500, ['#4a1a06', '#c86a2a', '#2a0a02', '#e09040'], 2, 9, 12);
    var ch = S.mesh(cg, new T.MeshPhysicalMaterial({ map: S.tex(cc), roughness: 0.35, clearcoat: 0.7 })); ch.position.set(0.65, 0.2, 0.55); ch.rotation.y = 0.5; s.add(ch);
    // salad: tomato + onion rings + lettuce
    var tg = new T.SphereGeometry(0.11, 24, 12); tg.scale(1, 0.4, 1);
    [[0.75, -0.55], [0.95, -0.35]].forEach(function (pp) { var tm = S.mesh(tg, new T.MeshPhysicalMaterial({ color: C('#d8241e'), roughness: 0.2, clearcoat: 1 })); tm.position.set(pp[0], 0.13, pp[1]); s.add(tm); });
    var lg = new T.SphereGeometry(0.18, 24, 12); lg.scale(1, 0.15, 0.7); S.displace(lg, 0.04, 6);
    var lt = S.mesh(lg, S.matte('#7cbf4a', 0.6)); lt.position.set(0.55, 0.11, -0.7); s.add(lt);
    var napkin = S.mesh(new T.BoxGeometry(1.0, 0.02, 1.0), new T.MeshStandardMaterial({ map: (function () { var c = S.cv(512, 512), g = c.getContext('2d'); g.fillStyle = '#f2c94c'; g.fillRect(0, 0, 512, 512); g.fillStyle = '#2b6a3a'; for (var a = 0; a < 512; a += 64) { g.fillRect(a, 0, 20, 512); g.fillRect(0, a, 512, 20); } g.fillStyle = '#c92a2a'; for (var b = 32; b < 512; b += 64) { g.fillRect(b, 0, 8, 512); } return S.tex(c); })(), roughness: 0.9 }));
    napkin.position.set(-1.75, 0.01, -0.85); napkin.rotation.y = 0.4; s.add(napkin);
    return [s, S.camera(1, 1, [0.1, 4.6, 1.6], [0.15, 0, 0.05], 36)];
  };

  /* ---------- Stichting Voedselbrug: a wooden crate of fresh food ---------- */
  SH['voedselbrug-hero'] = function () {
    var s = S.stage({ bg: '#f6e6d6', warm: true, key: 1.6 });
    var crate = new T.Group(), wood = new T.MeshStandardMaterial({ map: S.tex(S.woodTex('#c9a070', '#7a5530', 1024, 256, 5)), roughness: 0.85 });
    var W = 2.2, D = 1.4, H = 0.7;
    for (var i = 0; i < 3; i++) {
      var y = 0.12 + i * 0.24;
      [[0, y, D / 2, W, 0.16, 0.05], [0, y, -D / 2, W, 0.16, 0.05], [W / 2, y, 0, 0.05, 0.16, D], [-W / 2, y, 0, 0.05, 0.16, D]].forEach(function (b) { var m = S.mesh(new T.BoxGeometry(b[3], b[4], b[5]), wood); m.position.set(b[0], b[1], b[2]); crate.add(m); });
    }
    var bottom = S.mesh(new T.BoxGeometry(W, 0.04, D), wood); bottom.position.y = 0.04; crate.add(bottom);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) { var post = S.mesh(new T.BoxGeometry(0.08, H, 0.08), wood); post.position.set(c[0] * (W / 2 - 0.04), H / 2, c[1] * (D / 2 - 0.04)); crate.add(post); });
    s.add(crate);
    var r = S.rnd(17);
    function fruit(color, rad, x, z, y, sq) { var g = new T.SphereGeometry(rad, 40, 24); g.scale(1, sq || 0.92, 1); S.displace(g, rad * 0.06, 4 / rad * 0.1); var m = S.mesh(g, new T.MeshPhysicalMaterial({ color: C(color), roughness: 0.3, clearcoat: 0.6 })); m.position.set(x, y, z); s.add(m); return m; }
    for (var a = 0; a < 7; a++) fruit(['#d8241e', '#c81e18', '#e0352a'][a % 3], 0.17, -0.8 + (a % 4) * 0.28, -0.35 + Math.floor(a / 4) * 0.32, 0.62 + r() * 0.05);
    for (var b = 0; b < 6; b++) fruit(b % 2 ? '#8ab83a' : '#c8202a', 0.19, 0.0 + (b % 3) * 0.34, -0.38 + Math.floor(b / 3) * 0.36, 0.64 + r() * 0.05);
    for (var o = 0; o < 4; o++) fruit('#f08a1a', 0.2, 0.75 + (o % 2) * 0.36, -0.3 + Math.floor(o / 2) * 0.38, 0.65);
    // carrots with tops
    for (var k = 0; k < 5; k++) {
      var cg = new T.ConeGeometry(0.07, 0.75, 20); var cm = S.mesh(cg, new T.MeshPhysicalMaterial({ color: C('#ee7a1a'), roughness: 0.45, clearcoat: 0.3 }));
      cm.rotation.z = Math.PI / 2 + 0.2; cm.rotation.y = -0.3 + k * 0.08; cm.position.set(-0.55 + k * 0.05, 0.82 + k * 0.03, 0.42 - k * 0.06); s.add(cm);
      var top = S.mesh(new T.ConeGeometry(0.06, 0.4, 8), S.matte('#3f8a35', 0.7)); top.rotation.z = -Math.PI / 2 + 0.3; top.position.set(-0.05 + k * 0.05, 0.86 + k * 0.03, 0.42 - k * 0.06); s.add(top);
    }
    // bread loaf + jar
    var lg = new T.SphereGeometry(0.4, 48, 24); lg.scale(1.2, 0.55, 0.7); S.displace(lg, 0.03, 3);
    var loaf = S.mesh(lg, new T.MeshStandardMaterial({ color: C('#b8692c'), roughness: 0.8 })); loaf.position.set(0.7, 0.82, 0.35); loaf.rotation.y = 0.3; s.add(loaf);
    var jar = S.jar({ r: 0.2, h: 0.4, mat: S.glass('#ffe0a0', { att: '#e8a030', attD: 0.3 }), lidMat: S.plastic('#c81e18', 0.3) }); jar.position.set(1.55, 0, 0.75); s.add(jar);
    var tin = S.mesh(new T.CylinderGeometry(0.2, 0.2, 0.42, 48), new T.MeshStandardMaterial({ map: S.label({ bg: '#2b6a3a', ink: '#ffffff', brand: 'Bonen', brandSize: 160, brandFont: S.SANS, brandWeight: 800, brandY: 0.55, h: 600 }), metalness: 0.3, roughness: 0.35 })); tin.position.set(-1.6, 0.21, 0.7); s.add(tin);
    return [s, S.camera(1, 1, [0.3, 3.3, 4.4], [0.05, 0.45, 0.1], 32)];
  };

  /* ---------- Youth Rise: books, a notebook, a pencil — learning together ---------- */
  function book(w, h, d, cover, title, spineInk) {
    var c = S.cv(1024, 160), g = c.getContext('2d'); g.fillStyle = cover; g.fillRect(0, 0, 1024, 160); g.fillStyle = spineInk || '#ffffff'; g.font = '700 74px ' + S.SANS; g.textAlign = 'center'; g.fillText(title, 512, 108);
    var pages = S.cv(256, 64), pg = pages.getContext('2d'); pg.fillStyle = '#f4efe4'; pg.fillRect(0, 0, 256, 64); pg.fillStyle = 'rgba(0,0,0,0.12)'; for (var y = 0; y < 64; y += 3) pg.fillRect(0, y, 256, 1);
    var coverM = S.matte(cover, 0.6), spine = new T.MeshStandardMaterial({ map: S.tex(c), roughness: 0.6 }), pageM = new T.MeshStandardMaterial({ map: S.tex(pages), roughness: 0.9 });
    return S.mesh(new T.BoxGeometry(w, h, d), [pageM, pageM, coverM, coverM, spine, pageM]);
  }
  SH['youthrise-hero'] = function () {
    var s = S.stage({ bg: '#e0e7ff', key: 1.6, keyPos: [-4, 7, 5] });
    var stack = [['#4338ca', 'MATHS 3', 0.16], ['#facc15', 'ENGLISH', 0.14], ['#1e1b4b', 'CV & INTERVIEWS', 0.12], ['#f97316', 'CODING BASICS', 0.18]];
    var y = 0;
    stack.forEach(function (b, i) { var m = book(2.0 - i * 0.12, b[2], 1.4 - i * 0.06, b[0], b[1], b[0] === '#facc15' ? '#1e1b4b' : '#ffffff'); m.position.set(-0.4 + (i % 2) * 0.08, y + b[2] / 2, -0.2); m.rotation.y = (i % 2 ? 0.08 : -0.06); s.add(m); y += b[2]; });
    var nc = S.cv(1024, 700), ng = nc.getContext('2d'); ng.fillStyle = '#fffdf5'; ng.fillRect(0, 0, 1024, 700);
    ng.fillStyle = 'rgba(80,90,200,0.2)'; for (var l = 80; l < 700; l += 48) ng.fillRect(0, l, 1024, 2);
    ng.fillStyle = '#1e1b4b'; ng.font = 'italic 600 46px ' + S.SERIF; ng.fillText('Goals this term', 60, 70);
    ['1. Finish my CV with Mo', '2. Apply for 3 internships', '3. Practice the interview', '4. Pass maths resit ✓'].forEach(function (t, i) { ng.font = 'italic 400 40px ' + S.SERIF; ng.fillText(t, 60, 160 + i * 96); });
    var nb = S.printedBox(1.6, 1.1, 0.04, S.tex(nc), S.matte('#fffdf5', 0.9), 0.01); nb.rotation.x = -Math.PI / 2; nb.position.set(1.25, 0.02, 0.6); nb.rotation.z = -0.2; s.add(nb);
    var pen = S.mesh(new T.CylinderGeometry(0.03, 0.03, 1.1, 6), S.plastic('#facc15', 0.4)); pen.rotation.z = Math.PI / 2; pen.rotation.y = 0.7; pen.position.set(1.1, 0.07, 1.25); s.add(pen);
    var tip = S.mesh(new T.ConeGeometry(0.03, 0.12, 6), S.matte('#e9cfa0', 0.7)); tip.rotation.z = -Math.PI / 2; tip.rotation.y = 0.7; tip.position.set(1.1 + Math.cos(0.7) * 0.6, 0.07, 1.25 - Math.sin(0.7) * 0.6); s.add(tip);
    return [s, S.camera(1, 1, [0.6, 3.0, 5.0], [0.3, 0.35, 0.15], 32)];
  };

  /* ---------- Bright Wells: a glass of clean water and a jerrycan ---------- */
  SH['ngo-hero'] = function () {
    var s = S.stage({ bg: '#cfe9e4', key: 1.8, keyPos: [-4, 6, 3], bright: true });
    var gl = S.latheMesh([[0, 0], [0.42, 0], [0.45, 0.02], [0.5, 1.4], [0.47, 1.4], [0.42, 0.06], [0, 0.06]], S.glass('#ffffff', { thick: 0.08 }));
    s.add(gl);
    var water = S.latheMesh([[0, 0.06], [0.42, 0.06], [0.465, 1.05], [0, 1.05]], S.glass('#9fd8e6', { trans: 0.9, att: '#2a9ab8', attD: 0.45, rough: 0.02, thick: 0.9 }));
    s.add(water);
    var can = S.roundBox(1.0, 1.2, 0.6, 0.1, S.plastic('#f59e0b', 0.35)); can.position.set(1.15, 0.6, -0.45); can.rotation.y = -0.4; s.add(can);
    var cap = S.mesh(new T.CylinderGeometry(0.1, 0.1, 0.12, 32), S.plastic('#0f766e', 0.3)); cap.position.set(1.0, 1.26, -0.4); s.add(cap);
    var lbl = S.cv(512, 256), lg = lbl.getContext('2d'); lg.fillStyle = '#ffffff'; lg.fillRect(0, 0, 512, 256); lg.fillStyle = '#0f766e'; lg.font = '800 64px ' + S.SANS; lg.textAlign = 'center'; lg.fillText('BRIGHT WELLS', 256, 120); lg.font = '500 34px ' + S.SANS; lg.fillText('clean water · 2026', 256, 180);
    var lp = new T.Mesh(new T.PlaneGeometry(0.62, 0.31), new T.MeshStandardMaterial({ map: S.tex(lbl), roughness: 0.5 })); lp.position.set(0, 0, 0.31); var cg = new T.Group(); cg.add(lp); cg.position.copy(can.position); cg.rotation.y = can.rotation.y; s.add(cg);
    var r = S.rnd(3); for (var i = 0; i < 9; i++) { var dg = new T.SphereGeometry(0.04 + r() * 0.05, 24, 12); dg.scale(1, 0.4, 1); var d = S.mesh(dg, S.glass('#dff4f8', { thick: 0.05 })); d.position.set(-0.9 + r() * 0.6, 0.015, 0.3 + r() * 0.6); s.add(d); }
    return [s, S.camera(1, 1, [0.1, 1.6, 5.0], [0.35, 0.65, 0], 30)];
  };

  /* ---------- The PR Kiosk: a stack of the morning's papers ---------- */
  function paper(head, sub, seed, kicker) {
    var c = S.cv(1024, 1400), g = c.getContext('2d'), r = S.rnd(seed);
    g.fillStyle = '#f4f1ea'; g.fillRect(0, 0, 1024, 1400);
    g.fillStyle = '#111111'; g.textAlign = 'center'; g.font = '700 108px ' + S.SERIF; g.fillText(kicker || 'The Daily Ledger', 512, 120);
    g.fillRect(40, 150, 944, 4); g.fillRect(40, 162, 944, 1);
    g.textAlign = 'left'; g.font = '700 88px ' + S.SERIF; head.forEach(function (l, i) { g.fillText(l, 50, 280 + i * 96); });
    g.font = 'italic 400 40px ' + S.SERIF; g.fillStyle = '#333'; g.fillText(sub, 50, 290 + head.length * 96);
    var gr = g.createLinearGradient(0, 0, 0, 400); gr.addColorStop(0, '#9aa0a8'); gr.addColorStop(1, '#5a606a'); g.fillStyle = gr; g.fillRect(520, 400 + head.length * 40, 450, 330);
    g.fillStyle = 'rgba(17,17,17,0.55)';
    for (var col = 0; col < 2; col++) for (var y = 420 + head.length * 40; y < 1340; y += 22) { var x0 = 50 + col * 0; if (col === 1 && y < 760 + head.length * 40) continue; var w = (col ? 450 : 440) - r() * 60; g.fillRect(col ? 520 : 50, y, w, 9); }
    return S.tex(c);
  }
  SH['prkiosk-hero'] = function () {
    var s = S.stage({ bg: '#ece6da', key: 1.6, keyPos: [-3, 8, 4] });
    var heads = [[['Local bakery', 'doubles orders', 'after relaunch'], 'How a small family business won back its street', 3, 'The Daily Ledger'], [['Startup raises', '€2.4M for', 'green logistics'], 'Utrecht team plans 40 new jobs', 7, 'Business Today'], [['Charity gala', 'raises record', 'for clean water'], 'Bright Wells hits its 2026 target early', 11, 'City Post']];
    heads.forEach(function (h, i) {
      var m = new T.Mesh(new T.BoxGeometry(1.7, 0.03, 2.3), [S.matte('#e8e3d8'), S.matte('#e8e3d8'), new T.MeshStandardMaterial({ map: paper(h[0], h[1], h[2], h[3]), roughness: 0.85 }), S.matte('#e8e3d8'), S.matte('#e8e3d8'), S.matte('#e8e3d8')]);
      var t = m.material[2].map; t.center.set(0.5, 0.5); t.rotation = 0;
      m.castShadow = true; m.receiveShadow = true;
      m.position.set(-0.6 + i * 0.55, 0.02 + i * 0.035, -0.1 + i * 0.25); m.rotation.y = 0.25 - i * 0.22; s.add(m);
    });
    var cup2 = S.latheMesh([[0, 0], [0.26, 0], [0.32, 0.6], [0.3, 0.6], [0.24, 0.04], [0, 0.04]], S.plastic('#ffffff', 0.4)); cup2.position.set(1.45, 0, -0.75); s.add(cup2);
    var sleeve = S.mesh(new T.CylinderGeometry(0.315, 0.29, 0.22, 48, 1, true), S.matte('#d62839', 0.6)); sleeve.position.set(1.45, 0.32, -0.75); s.add(sleeve);
    return [s, S.camera(1, 1, [0.2, 4.2, 2.6], [0.1, 0, 0.1], 36)];
  };

  /* ---------- SIDWALK: heavyweight streetwear, flat-lay on concrete ---------- */
  function concrete() { var c = S.cv(1024, 1024), g = c.getContext('2d'); g.fillStyle = '#8f8f8c'; g.fillRect(0, 0, 1024, 1024); S.speckle(c, 26000, ['#7a7a77', '#a3a3a0', '#6a6a68', '#b4b4b0'], 1, 3, 2); var m = new T.MeshStandardMaterial({ map: S.tex(c), roughness: 0.95 }); m.map.wrapS = m.map.wrapT = T.RepeatWrapping; m.map.repeat.set(2, 2); return m; }
  function garment(kind, color, print) {
    var c = S.cv(1024, 1024), g = c.getContext('2d');
    g.clearRect(0, 0, 1024, 1024);
    g.fillStyle = color; g.beginPath();
    if (kind === 'tee' || kind === 'hoodie') {
      var hood = kind === 'hoodie';
      g.moveTo(330, 140); g.quadraticCurveTo(512, hood ? 250 : 210, 694, 140);   // neckline
      g.lineTo(930, 260); g.lineTo(hood ? 980 : 860, hood ? 820 : 470); g.lineTo(hood ? 880 : 760, hood ? 840 : 500); g.lineTo(760, 360);
      g.lineTo(760, 940); g.lineTo(264, 940); g.lineTo(264, 360); g.lineTo(hood ? 144 : 264, hood ? 840 : 500); g.lineTo(hood ? 44 : 164, hood ? 820 : 470); g.lineTo(94, 260); g.closePath();
    } else if (kind === 'cargo') {
      g.moveTo(300, 80); g.lineTo(724, 80); g.lineTo(780, 960); g.lineTo(560, 960); g.lineTo(512, 360); g.lineTo(464, 960); g.lineTo(244, 960); g.closePath();
    }
    g.fill();
    g.save(); g.clip();
    var sh = g.createLinearGradient(0, 0, 1024, 1024); sh.addColorStop(0, 'rgba(255,255,255,0.08)'); sh.addColorStop(1, 'rgba(0,0,0,0.18)'); g.fillStyle = sh; g.fillRect(0, 0, 1024, 1024);
    g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 26; g.lineCap = 'round';
    for (var f = 0; f < 5; f++) { g.beginPath(); g.moveTo(300 + f * 90, 400 + f * 70); g.quadraticCurveTo(520, 520 + f * 40, 760 - f * 30, 470 + f * 90); g.globalAlpha = 0.35; g.stroke(); }
    g.globalAlpha = 1;
    S.speckle(c, 9000, ['rgba(255,255,255,0.25)', 'rgba(0,0,0,0.25)'], 0.5, 1.5, 6);
    if (kind === 'hoodie') { g.fillStyle = 'rgba(0,0,0,0.25)'; g.beginPath(); g.ellipse(512, 150, 190, 120, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(330, 620, 364, 190); }
    if (kind === 'cargo') { g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(260, 520, 130, 160); g.fillRect(634, 520, 130, 160); g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(300, 80, 424, 40); }
    if (print) { g.fillStyle = print; g.textAlign = 'center'; g.font = '900 ' + (kind === 'hoodie' ? 96 : 110) + 'px ' + S.SANS; g.fillText('SIDWALK', 512, kind === 'hoodie' ? 470 : 420); g.font = '600 30px ' + S.SANS; g.fillText('DROP 01 — AMSTERDAM', 512, kind === 'hoodie' ? 520 : 470); }
    g.restore();
    var t = S.tex(c);
    var m = new T.MeshStandardMaterial({ map: t, transparent: true, alphaTest: 0.5, roughness: 0.95, side: T.DoubleSide });
    var mesh = new T.Mesh(new T.PlaneGeometry(2.2, 2.2, 40, 40), m);
    var p = mesh.geometry.attributes.position; for (var i = 0; i < p.count; i++) p.setZ(i, (S.fbm(p.getX(i) * 1.5, p.getY(i) * 1.5, 1) - 0.5) * 0.08);
    mesh.geometry.computeVertexNormals();
    mesh.rotation.x = -Math.PI / 2; mesh.position.y = 0.06; mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.customDepthMaterial = new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking, map: t, alphaTest: 0.5 });
    return mesh;
  }
  function cap() {
    var grp = new T.Group(), m = S.matte('#151515', 0.9);
    var dome = new T.SphereGeometry(0.62, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2); dome.scale(1, 0.75, 1.05); grp.add(S.mesh(dome, m));
    var brim = S.mesh(new T.CylinderGeometry(0.62, 0.62, 0.03, 64, 1, false, -Math.PI / 2 - 0.9, 1.8), m); brim.scale.set(1.15, 1, 1.5); brim.position.set(0, 0.02, 0.15); grp.add(brim);
    var btn = S.mesh(new T.SphereGeometry(0.05, 16, 8), m); btn.position.y = 0.47; grp.add(btn);
    var lc = S.cv(512, 256), lg = lc.getContext('2d'); lg.fillStyle = '#f2f2f2'; lg.font = '900 120px ' + S.SANS; lg.textAlign = 'center'; lg.fillText('SW', 256, 170);
    var logo = new T.Mesh(new T.PlaneGeometry(0.4, 0.2), new T.MeshStandardMaterial({ map: S.tex(lc), transparent: true, roughness: 0.8 })); logo.position.set(0, 0.25, 0.6); logo.rotation.x = -0.35; grp.add(logo);
    return grp;
  }
  var streetStage = function () { return S.stage({ bg: '#2a2a2a', key: 1.8, keyPos: [-3, 8, 3], floorMat: concrete(), fogNear: 6, fogFar: 14 }); };
  SH['sidwalk-1'] = function () { var s = streetStage(); s.add(garment('tee', '#f2f0ea', '#111111')); return [s, S.camera(1, 1, [0, 3.2, 0.3], [0, 0, 0], 40)]; };
  SH['sidwalk-2'] = function () { var s = streetStage(); s.add(garment('hoodie', '#1a1a1a', '#f2f2f2')); return [s, S.camera(1, 1, [0, 3.2, 0.3], [0, 0, 0], 40)]; };
  SH['sidwalk-3'] = function () { var s = streetStage(); s.add(garment('cargo', '#4a4a3a')); return [s, S.camera(1, 1, [0, 3.2, 0.3], [0, 0, 0], 40)]; };
  SH['sidwalk-4'] = function () { var s = streetStage(); var c = cap(); c.rotation.y = 0.6; s.add(c); return [s, S.camera(1, 1, [0.6, 2.6, 3.2], [0, 0.25, 0.1], 34)]; };
})();
