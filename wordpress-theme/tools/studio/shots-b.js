/* Shots: coffee (Molen), yoga (Ademruimte), stays (Grachtzicht), weddings (Lens & Linen), salon (Studio Noor), bikes (Spaak). */
(function () {
  var S = STUDIO, T = S.T, C = S.C, SH = S.SHOTS;

  /* ---------- Molen Coffee: stand-up pouches, beans, a flat white ---------- */
  function bagFront(name, notes, color, ink) {
    var c = S.cv(800, 1100), g = c.getContext('2d');
    g.fillStyle = color; g.fillRect(0, 0, 800, 1100);
    g.fillStyle = 'rgba(0,0,0,0.06)'; for (var i = 0; i < 1100; i += 4) g.fillRect(0, i, 800, 1);
    g.textAlign = 'center'; g.fillStyle = ink;
    g.font = '900 120px ' + S.SANS; g.fillText('MOLEN', 400, 260);
    g.font = '600 34px ' + S.SANS; g.fillText('SMALL-BATCH ROASTERS', 400, 320);
    g.fillRect(340, 370, 120, 6);
    g.font = '700 74px ' + S.SANS; g.fillText(name, 400, 520);
    g.font = '500 40px ' + S.SANS; notes.forEach(function (n, k) { g.fillText(n, 400, 600 + k * 54); });
    g.font = '600 34px ' + S.SANS; g.fillText('250 g · whole bean', 400, 960);
    return S.tex(c);
  }
  function pouch(name, notes, color, ink) {
    var grp = new T.Group(), w = 1.2, h = 1.7, d = 0.42;
    var g = new T.BoxGeometry(w, h, d, 24, 24, 12), p = g.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i), t = (y + h / 2) / h;
      var pinch = Math.pow(Math.max(0, t - 0.55) / 0.45, 1.6);                // flattens toward the sealed top
      var belly = Math.sin(Math.PI * Math.min(1, t * 1.05)) * 0.12;
      p.setZ(i, z * (1 - pinch * 0.92) + Math.sign(z) * belly * (1 - pinch));
      p.setX(i, x * (1 + Math.sin(Math.PI * t) * 0.03));
    }
    g.computeVertexNormals();
    var side = new T.MeshPhysicalMaterial({ color: C(color), roughness: 0.55, clearcoat: 0.2 });
    var front = new T.MeshPhysicalMaterial({ map: bagFront(name, notes, color, ink), roughness: 0.5, clearcoat: 0.2 });
    var m = S.mesh(g, [side, side, side, side, front, side]); m.position.y = h / 2; grp.add(m);
    var seal = S.mesh(new T.BoxGeometry(w * 1.02, 0.12, 0.03), side); seal.position.y = h - 0.04; grp.add(seal);
    var valve = S.mesh(new T.CylinderGeometry(0.06, 0.06, 0.02, 24), S.plastic('#e8e2d6', 0.4)); valve.rotation.x = Math.PI / 2; valve.position.set(0, h * 0.87, 0.06); grp.add(valve);
    return grp;
  }
  function beans(n, area, seed) {
    var grp = new T.Group(), r = S.rnd(seed || 4);
    var c = S.cv(256, 256), g = c.getContext('2d'); g.fillStyle = '#3b2314'; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = '#1a0d06'; g.lineWidth = 10; g.beginPath(); g.moveTo(128, 20); g.bezierCurveTo(100, 100, 156, 160, 128, 236); g.stroke();
    var m = new T.MeshPhysicalMaterial({ map: S.tex(c), roughness: 0.35, clearcoat: 0.6 });
    var geo = new T.SphereGeometry(0.07, 20, 14); geo.scale(1, 0.62, 1.35);
    for (var i = 0; i < n; i++) { var b = S.mesh(geo, m); b.position.set((r() - 0.5) * area, 0.04 + r() * 0.03, (r() - 0.5) * area * 0.7); b.rotation.set(r() * 0.6, r() * 6.28, r() * 0.6); grp.add(b); }
    return grp;
  }
  function cup() {
    var grp = new T.Group();
    grp.add(S.latheMesh([[0, 0], [0.3, 0], [0.34, 0.04], [0.42, 0.42], [0.43, 0.46], [0.41, 0.46], [0.33, 0.06], [0, 0.06]], new T.MeshPhysicalMaterial({ color: C('#f4f1ec'), roughness: 0.2, clearcoat: 1 })));
    var c = S.cv(512, 512), g = c.getContext('2d');
    var gr = g.createRadialGradient(256, 256, 10, 256, 256, 256); gr.addColorStop(0, '#e9d3b6'); gr.addColorStop(0.55, '#c8945e'); gr.addColorStop(1, '#6b3a1a'); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = '#f6ead8'; g.lineWidth = 16; g.lineCap = 'round';                  // latte-art heart
    g.beginPath(); g.moveTo(256, 360); g.bezierCurveTo(120, 280, 150, 150, 256, 210); g.bezierCurveTo(362, 150, 392, 280, 256, 360); g.fillStyle = '#f6ead8'; g.fill();
    var top = S.mesh(new T.CircleGeometry(0.405, 64), new T.MeshPhysicalMaterial({ map: S.tex(c), roughness: 0.25, clearcoat: 0.8 })); top.rotation.x = -Math.PI / 2; top.position.y = 0.4; grp.add(top);
    var saucer = S.latheMesh([[0, 0], [0.6, 0], [0.72, 0.06], [0.7, 0.07], [0.58, 0.03], [0, 0.03]], new T.MeshPhysicalMaterial({ color: C('#f4f1ec'), roughness: 0.2, clearcoat: 1 }));
    var g2 = new T.Group(); g2.add(saucer); grp.position.y = 0.03; g2.add(grp); return g2;
  }
  var coffeeStage = function () { return S.stage({ bg: '#e9d8c6', warm: true, key: 1.6 }); };
  SH['molen-hero'] = function () {
    var s = coffeeStage();
    var a = pouch('Ethiopia Guji', ['peach · jasmine', 'bergamot'], '#d9480f', '#fff3e6'); a.position.set(-0.85, 0, -0.3); a.rotation.y = 0.25; s.add(a);
    var b = pouch('House Blend', ['chocolate · hazelnut'], '#24170f', '#f0d9c4'); b.position.set(0.45, 0, -0.75); b.rotation.y = -0.2; s.add(b);
    var c = cup(); c.position.set(0.95, 0, 0.55); s.add(c);
    var bs = beans(70, 1.6, 5); bs.position.set(-0.2, 0, 0.75); s.add(bs);
    return [s, S.camera(1, 1, [0.3, 2.4, 5.6], [0.05, 0.75, 0], 28)];
  };
  SH['molen-1'] = function () { var s = coffeeStage(); var a = pouch('Ethiopia Guji', ['peach · jasmine', 'bergamot'], '#d9480f', '#fff3e6'); a.rotation.y = 0.15; s.add(a); var bs = beans(40, 1.4, 7); bs.position.set(0, 0, 0.6); s.add(bs); return [s, S.camera(1, 1, [0.3, 1.6, 4.4], [0, 0.8, 0], 30)]; };
  SH['molen-2'] = function () { var s = coffeeStage(); var a = pouch('House Blend', ['chocolate · hazelnut'], '#24170f', '#f0d9c4'); a.rotation.y = -0.15; s.add(a); var bs = beans(40, 1.4, 9); bs.position.set(0, 0, 0.6); s.add(bs); return [s, S.camera(1, 1, [0.3, 1.6, 4.4], [0, 0.8, 0], 30)]; };
  SH['molen-3'] = function () { var s = coffeeStage(); var a = pouch('Ethiopia Guji', ['peach · jasmine'], '#d9480f', '#fff3e6'); a.position.set(-0.55, 0, 0); a.rotation.y = 0.2; s.add(a); var b = pouch('House Blend', ['chocolate'], '#24170f', '#f0d9c4'); b.position.set(0.6, 0, -0.2); b.rotation.y = -0.25; s.add(b); return [s, S.camera(1, 1, [0.2, 1.8, 5.2], [0, 0.8, 0], 30)]; };

  /* ---------- Ademruimte Yoga: rolled mats, cork blocks, strap ---------- */
  function mat(color, seed) {
    var grp = new T.Group(), r = 0.36, L = 2.2;
    var c = S.cv(512, 512), g = c.getContext('2d'); g.fillStyle = color; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = 'rgba(0,0,0,0.22)'; g.lineWidth = 5; g.beginPath();
    for (var a = 0; a < 26 * Math.PI; a += 0.05) { var rr = 6 + a * 2.9; var x = 256 + Math.cos(a) * rr, y = 256 + Math.sin(a) * rr; if (a === 0) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke();
    var body = new T.MeshStandardMaterial({ color: C(color), roughness: 0.9 });
    var end = new T.MeshStandardMaterial({ map: S.tex(c), roughness: 0.9 });
    var m = S.mesh(new T.CylinderGeometry(r, r, L, 64), [body, end, end]); m.rotation.z = Math.PI / 2; m.position.y = r; grp.add(m);
    var strap = S.mesh(new T.TorusGeometry(r + 0.012, 0.018, 8, 64), S.matte('#3a3a32', 0.8)); strap.rotation.y = Math.PI / 2; strap.position.set(0.55, r, 0); grp.add(strap);
    var strap2 = strap.clone(); strap2.position.x = -0.55; grp.add(strap2);
    return grp;
  }
  function block() {
    var c = S.cv(512, 512); var g = c.getContext('2d'); g.fillStyle = '#c49a6c'; g.fillRect(0, 0, 512, 512); S.speckle(c, 5000, ['#8a5e34', '#e2c09a', '#6e4626', '#b78656'], 1, 3, 13);
    return S.roundBox(1.2, 0.5, 0.8, 0.06, new T.MeshStandardMaterial({ map: S.tex(c), roughness: 0.95 }));
  }
  var yogaStage = function () { return S.stage({ bg: '#e3e9dc', key: 1.5, ground: '#b9c4ad' }); };
  SH['adem-hero'] = function () {
    var s = yogaStage();
    var a = mat('#7d9471'); a.position.set(-0.5, 0, -0.4); a.rotation.y = 0.15; s.add(a);
    var b = mat('#d9c7b0'); b.position.set(-0.3, 0, 0.42); b.rotation.y = 0.05; s.add(b);
    var bl = block(); bl.rotation.x = -Math.PI / 2; bl.position.set(1.45, 0.25, 0.2); bl.rotation.z = 0.3; s.add(bl);
    var bl2 = block(); bl2.rotation.x = -Math.PI / 2; bl2.position.set(1.4, 0.75, 0.15); bl2.rotation.z = 0.15; s.add(bl2);
    return [s, S.camera(1, 1, [0.6, 2.4, 6.0], [0.3, 0.45, 0], 28)];
  };
  SH['adem-1'] = function () { var s = yogaStage(); var a = mat('#7d9471'); a.rotation.y = 0.5; s.add(a); return [s, S.camera(1, 1, [0.4, 1.8, 4.2], [0, 0.35, 0], 30)]; };
  SH['adem-2'] = function () { var s = yogaStage(); var b1 = block(); b1.rotation.x = -Math.PI / 2; b1.position.y = 0.25; b1.rotation.z = 0.4; s.add(b1); var b2 = block(); b2.rotation.x = -Math.PI / 2; b2.position.y = 0.75; b2.rotation.z = 0.1; s.add(b2); return [s, S.camera(1, 1, [0.4, 2.2, 4.0], [0, 0.45, 0], 30)]; };
  SH['adem-3'] = function () { var s = yogaStage(); ['#7d9471', '#d9c7b0', '#2d3a2e'].forEach(function (cl, i) { var m = mat(cl); m.position.set(0, 0.72 * i * 0.94, 0); m.rotation.y = 0.35 + i * 0.05; if (i) m.position.y = i * 0.66; s.add(m); }); return [s, S.camera(1, 1, [0.5, 2.0, 5.2], [0, 0.85, 0], 30)]; };

  /* ---------- Grachtzicht Stays: a calm bedroom with a canal-side window ---------- */
  function bedroom(duvet, wall, seed) {
    var s = S.stage({ bg: wall, key: 1.4, keyPos: [-6, 5, 2], warm: true, hemi: 0.55 });
    var floorM = new T.MeshStandardMaterial({ map: S.tex(S.woodTex('#a77a52', '#5a3a20', 1024, 1024, 3)), roughness: 0.6 });
    floorM.map.wrapS = floorM.map.wrapT = T.RepeatWrapping; floorM.map.repeat.set(3, 3);
    var fl = S.mesh(new T.PlaneGeometry(14, 10), floorM); fl.rotation.x = -Math.PI / 2; fl.position.y = 0.001; s.add(fl);
    var wallM = S.matte(wall, 0.95);
    var back = S.mesh(new T.PlaneGeometry(14, 6), wallM); back.position.set(0, 3, -2.2); s.add(back);
    // window with soft daylight and a hint of canal houses' colours across the water
    var wc = S.cv(512, 640), wg = wc.getContext('2d');
    var sky = wg.createLinearGradient(0, 0, 0, 640); sky.addColorStop(0, '#dfeaf5'); sky.addColorStop(0.62, '#f4f6f8'); sky.addColorStop(0.63, '#8a6a4a'); sky.addColorStop(1, '#5a7a8a');
    wg.fillStyle = sky; wg.fillRect(0, 0, 512, 640);
    ['#7a3b2e', '#c8a46a', '#4a5a6a', '#a35a3a', '#e0d0b0'].forEach(function (cl, i) { wg.fillStyle = cl; wg.fillRect(i * 104, 300 + (i % 2) * 20, 100, 105 - (i % 2) * 20); });
    wg.fillStyle = 'rgba(255,255,255,0.6)'; wg.fillRect(0, 0, 512, 640);
    var win = new T.Mesh(new T.PlaneGeometry(1.6, 2.0), new T.MeshBasicMaterial({ map: S.tex(wc), toneMapped: false })); win.position.set(-2.1, 2.3, -2.19); s.add(win);
    var frameM = S.matte('#f2f0ec', 0.6);
    [[0, 1.0, 1.7, 0.08], [0, -1.0, 1.7, 0.08], [0, 0, 0.06, 2.0]].forEach(function (f) { var b = S.mesh(new T.BoxGeometry(f[2], f[3], 0.06), frameM); b.position.set(-2.1 + f[0], 2.3 + f[1], -2.17); s.add(b); });
    [-0.83, 0.83].forEach(function (x) { var b = S.mesh(new T.BoxGeometry(0.08, 2.1, 0.06), frameM); b.position.set(-2.1 + x, 2.3, -2.17); s.add(b); });
    // bed
    var head = S.roundBox(3.2, 1.3, 0.16, 0.06, S.matte('#b9a389', 0.9)); head.position.set(0.6, 1.05, -2.05); s.add(head);
    var base = S.roundBox(3.0, 0.4, 2.6, 0.06, S.matte('#8a6a4e', 0.8)); base.rotation.x = -Math.PI / 2; base.position.set(0.6, 0.25, -0.75); base.rotation.x = 0; base.position.set(0.6, 0.25, -0.75);
    var baseB = S.mesh(new T.BoxGeometry(3.0, 0.4, 2.6), S.matte('#8a6a4e', 0.8)); baseB.position.set(0.6, 0.2, -0.75); s.add(baseB);
    var matt = S.roundBox(2.9, 0.32, 2.5, 0.12, S.matte('#f7f5f1', 0.85)); matt.position.set(0.6, 0.56, -0.75); s.add(matt);
    var dg = new T.BoxGeometry(3.05, 0.14, 1.75, 30, 2, 20); S.displace(dg, 0.05, 2.2);
    var duv = S.mesh(dg, S.matte(duvet, 0.92)); duv.position.set(0.6, 0.78, -0.25); s.add(duv);
    [[-0.1, 0.25], [1.3, -0.2]].forEach(function (p, i) {
      var pg = new T.SphereGeometry(1, 40, 24); pg.scale(0.62, 0.17, 0.36); S.displace(pg, 0.03, 3);
      var pl = S.mesh(pg, S.matte(i ? '#efe9df' : '#ffffff', 0.9)); pl.position.set(p[0] + 0.0, 0.92, -1.62); pl.rotation.x = -0.45; pl.rotation.z = p[1] * 0.2; s.add(pl);
    });
    var throwG = new T.BoxGeometry(3.08, 0.05, 0.55, 30, 1, 6); S.displace(throwG, 0.03, 3);
    var thr = S.mesh(throwG, S.matte(seed === 2 ? '#c9774a' : '#3a4a5a', 0.95)); thr.position.set(0.6, 0.86, 0.35); s.add(thr);
    // side table + lamp
    var tbl = S.mesh(new T.CylinderGeometry(0.3, 0.3, 0.6, 40), S.matte('#5a3e2a', 0.6)); tbl.position.set(-1.45, 0.3, -1.55); s.add(tbl);
    var lampB = S.mesh(new T.SphereGeometry(0.16, 32, 20), S.plastic('#e8dccb', 0.3)); lampB.position.set(-1.45, 0.75, -1.55); s.add(lampB);
    var shade = S.mesh(new T.CylinderGeometry(0.2, 0.28, 0.3, 40, 1, true), new T.MeshStandardMaterial({ color: C('#fff6ea'), emissive: C('#ffcf96'), emissiveIntensity: 0.6, side: T.DoubleSide })); shade.position.set(-1.45, 1.05, -1.55); s.add(shade);
    var pt = new T.PointLight(C('#ffd2a0'), 0.8, 4, 2); pt.position.set(-1.45, 1.05, -1.4); s.add(pt);
    return s;
  }
  SH['gracht-hero'] = function () { var s = bedroom('#f4f1ec', '#e9e4dc', 1); return [s, S.camera(1, 1, [1.6, 2.1, 4.6], [0.1, 0.9, -1.1], 40)]; };
  SH['gracht-1'] = function () { var s = bedroom('#f4f1ec', '#dfe6ee', 1); return [s, S.camera(1, 1, [1.3, 2.0, 4.2], [0.2, 0.9, -1.0], 42)]; };
  SH['gracht-2'] = function () { var s = bedroom('#e9e2d6', '#efe7dc', 2); return [s, S.camera(1, 1, [1.3, 2.0, 4.2], [0.2, 0.9, -1.0], 42)]; };
  SH['gracht-3'] = function () { var s = bedroom('#ffffff', '#e4e8e1', 1); return [s, S.camera(1, 1, [-0.4, 2.0, 4.2], [0.2, 0.9, -1.0], 42)]; };

  /* ---------- Lens & Linen: rings on linen, a camera, a linen album ---------- */
  function rings() {
    var grp = new T.Group(), gold = S.metal('#e2b86a', 0.16);
    var r1 = S.mesh(new T.TorusGeometry(0.32, 0.055, 32, 96), gold); gold.envMapIntensity = 1.4; r1.rotation.x = Math.PI / 2 - 0.05; r1.position.set(-0.22, 0.055, 0.05); grp.add(r1);
    var r2 = S.mesh(new T.TorusGeometry(0.27, 0.035, 32, 96), S.metal('#ead2a8', 0.14)); r2.rotation.set(Math.PI / 2 - 0.9, 0.3, 0); r2.position.set(0.3, 0.2, -0.05); grp.add(r2);
    var gem = S.mesh(new T.OctahedronGeometry(0.085, 1), new T.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.4, roughness: 0.02, clearcoat: 1, flatShading: true }));
    gem.scale.set(1, 0.8, 1); var gp = new T.Vector3(0, 0.27 + 0.06, 0).applyEuler(r2.rotation).add(r2.position); gem.position.copy(gp); gem.rotation.copy(r2.rotation); grp.add(gem);
    return grp;
  }
  function linenFloor(color) { var m = new T.MeshStandardMaterial({ map: S.tex(S.linenTex(color, 9)), roughness: 0.95 }); m.map.wrapS = m.map.wrapT = T.RepeatWrapping; m.map.repeat.set(3, 3); return m; }
  function petals(n, seed) { var grp = new T.Group(), r = S.rnd(seed || 3); var g = new T.SphereGeometry(0.09, 16, 8); g.scale(1, 0.12, 0.7); for (var i = 0; i < n; i++) { var p = S.mesh(g, S.matte(r() > 0.5 ? '#f3d9d2' : '#ffffff', 0.7)); p.position.set((r() - 0.5) * 3, 0.01, (r() - 0.5) * 2); p.rotation.set(r() * 0.3, r() * 6, r() * 0.3); grp.add(p); } return grp; }
  function cameraBody() {
    var grp = new T.Group();
    var leather = S.cv(512, 512); var lg = leather.getContext('2d'); lg.fillStyle = '#1d1d1f'; lg.fillRect(0, 0, 512, 512); S.speckle(leather, 9000, ['#2c2c2f', '#121214'], 1, 2, 2);
    var body = S.roundBox(1.5, 0.95, 0.45, 0.07, new T.MeshStandardMaterial({ map: S.tex(leather), roughness: 0.8 })); body.position.y = 0.48; grp.add(body);
    var top = S.roundBox(1.5, 0.22, 0.46, 0.05, S.metal('#c9cbd0', 0.3)); top.position.y = 1.02; grp.add(top);
    var lens = S.mesh(new T.CylinderGeometry(0.3, 0.32, 0.5, 64), S.metal('#2a2a2c', 0.35)); lens.rotation.x = Math.PI / 2; lens.position.set(0.05, 0.48, 0.45); grp.add(lens);
    var ring = S.mesh(new T.TorusGeometry(0.3, 0.025, 12, 64), S.metal('#c9cbd0', 0.25)); ring.position.set(0.05, 0.48, 0.7); grp.add(ring);
    var glassF = S.mesh(new T.CircleGeometry(0.26, 64), new T.MeshPhysicalMaterial({ color: C('#1a2a3a'), roughness: 0, metalness: 0.2, clearcoat: 1, iridescence: 0.6 })); glassF.position.set(0.05, 0.48, 0.705); grp.add(glassF);
    var dial = S.mesh(new T.CylinderGeometry(0.12, 0.12, 0.08, 32), S.metal('#c9cbd0', 0.3)); dial.position.set(-0.45, 1.16, 0); grp.add(dial);
    var btn = S.mesh(new T.CylinderGeometry(0.06, 0.06, 0.06, 24), S.metal('#e2b86a', 0.2)); btn.position.set(0.5, 1.16, 0.05); grp.add(btn);
    return grp;
  }
  var weddingStage = function () { return S.stage({ bg: '#ebe5dd', warm: true, bright: true, key: 1.5, floorMat: linenFloor('#e9e2d8'), fogNear: 6, fogFar: 14 }); };
  SH['lens-hero'] = function () { var s = weddingStage(); var r = rings(); r.scale.setScalar(1.3); s.add(r); s.add(petals(26, 5)); var c = cameraBody(); c.position.set(1.9, 0, -1.0); c.rotation.y = -0.6; s.add(c); return [s, S.camera(1, 1, [0.4, 2.4, 3.6], [0.4, 0.2, -0.3], 32)]; };
  SH['lens-1'] = function () { var s = weddingStage(); var r = rings(); r.scale.setScalar(1.4); s.add(r); s.add(petals(18, 9)); return [s, S.camera(1, 1, [0.3, 1.8, 2.2], [0.05, 0.12, 0], 30)]; };
  SH['lens-2'] = function () { var s = weddingStage(); var c = cameraBody(); c.rotation.y = 0.5; s.add(c); return [s, S.camera(1, 1, [1.0, 1.8, 3.4], [0, 0.5, 0], 32)]; };
  SH['lens-3'] = function () {
    var s = weddingStage();
    var cover = S.cv(1024, 1024), cg = cover.getContext('2d'); cg.drawImage(S.linenTex('#cbbfae', 7), 0, 0); cg.fillStyle = '#5a4a3a'; cg.textAlign = 'center'; cg.font = 'italic 400 96px ' + S.SERIF; cg.fillText('Sanne & Daan', 512, 470); cg.font = '500 40px ' + S.SANS; cg.fillText('14 · 06 · 2026', 512, 560);
    var alb = S.printedBox(1.7, 1.7, 0.18, S.tex(cover), S.matte('#cbbfae', 0.9), 0.03); alb.rotation.x = -Math.PI / 2; alb.position.y = 0.09; alb.rotation.z = 0.25; s.add(alb);
    var r = rings(); r.scale.setScalar(0.6); r.position.set(1.15, 0, 0.75); s.add(r);
    return [s, S.camera(1, 1, [0.3, 3.0, 2.2], [0.2, 0.1, 0.1], 32)];
  };

  /* ---------- Studio Noor: salon products, scissors, comb ---------- */
  function scissors() {
    var grp = new T.Group(), steel = S.metal('#d8dadf', 0.12);
    function blade(sign) {
      var sh = new T.Shape(); sh.moveTo(0, 0); sh.lineTo(1.5, 0.05 * sign); sh.quadraticCurveTo(1.6, 0, 1.5, -0.03 * sign); sh.lineTo(0, -0.07 * sign); sh.lineTo(0, 0);
      var m = S.mesh(new T.ExtrudeGeometry(sh, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 2 }), steel);
      m.rotation.x = -Math.PI / 2; return m;
    }
    var a = blade(1); a.rotation.z = 0.08; grp.add(a); var b = blade(-1); b.rotation.z = -0.08; b.position.y = 0.03; grp.add(b);
    var r1 = S.mesh(new T.TorusGeometry(0.17, 0.035, 16, 48), steel); r1.rotation.x = Math.PI / 2; r1.position.set(-0.2, 0.02, 0.18); grp.add(r1);
    var r2 = S.mesh(new T.TorusGeometry(0.15, 0.035, 16, 48), steel); r2.rotation.x = Math.PI / 2; r2.position.set(-0.2, 0.04, -0.18); grp.add(r2);
    var pin = S.mesh(new T.CylinderGeometry(0.04, 0.04, 0.08, 24), S.metal('#b08c5a', 0.2)); pin.position.set(0.02, 0.03, 0); grp.add(pin);
    return grp;
  }
  function comb() {
    var sh = new T.Shape(); sh.moveTo(0, 0); sh.lineTo(1.6, 0); sh.lineTo(1.6, 0.16); sh.lineTo(0, 0.16); sh.lineTo(0, 0);
    for (var i = 0; i < 26; i++) { var h = new T.Path(), x = 0.06 + i * 0.058; h.moveTo(x, 0.06); h.lineTo(x + 0.03, 0.06); h.lineTo(x + 0.03, -0.0); }
    var grp = new T.Group(), m = S.plastic('#1d1a1f', 0.3);
    var spine = S.mesh(new T.BoxGeometry(1.6, 0.03, 0.12), m); spine.position.set(0.8, 0.015, 0); grp.add(spine);
    for (var k = 0; k < 28; k++) { var t = S.mesh(new T.BoxGeometry(0.025, 0.028, 0.22), m); t.position.set(0.04 + k * 0.057, 0.014, 0.16); grp.add(t); }
    return grp;
  }
  function salonBottle(name, kind, color, h) {
    return S.bottle({ r: 0.32, h: h || 1.5, neck: 0.1, neckH: 0.1, shoulder: 0.14, mat: S.plastic(color, 0.28), cap: 'pump', capMat: S.metal('#c9a27a', 0.25),
      label: S.label({ bg: color, ink: '#ffffff', brand: 'NOOR', brandSize: 120, brandFont: S.SERIF, brandY: 0.32, lines: [[name, 58, 600, S.SANS, '#ffffff'], [kind, 42, 400, S.SANS, 'rgba(255,255,255,0.8)']], y0: 0.58, gap: 76, foot: '300 ml', footInk: '#ffffff' }), labelH: 0.8, labelY: 0.7 });
  }
  SH['noor-hero'] = function () {
    var s = S.stage({ bg: '#efdcd3', warm: true, key: 1.6 });
    var a = salonBottle('Repair', 'Shampoo', '#b07c68', 1.55); a.position.set(-0.9, 0, -0.5); s.add(a);
    var b = salonBottle('Gloss', 'Conditioner', '#3b2a2e', 1.4); b.position.set(-0.2, 0, -0.75); s.add(b);
    var sc = scissors(); sc.position.set(0.25, 0.01, 0.55); sc.rotation.y = 0.5; s.add(sc);
    var cb = comb(); cb.position.set(0.4, 0, -0.1); cb.rotation.y = 0.25; s.add(cb);
    return [s, S.camera(1, 1, [0.6, 2.8, 4.8], [0.0, 0.5, -0.1], 30)];
  };

  /* ---------- Spaak: a city bike, side-on ---------- */
  function bike(frameColor) {
    var grp = new T.Group(), frame = S.plastic(frameColor, 0.25), black = S.matte('#18181a', 0.7), chrome = S.metal('#d0d3d8', 0.18);
    function wheel(x) {
      var w = new T.Group(); w.position.set(x, 0.68, 0);
      var tire = S.mesh(new T.TorusGeometry(0.66, 0.045, 16, 96), black); w.add(tire);
      var rim = S.mesh(new T.TorusGeometry(0.6, 0.018, 8, 96), chrome); w.add(rim);
      for (var i = 0; i < 32; i++) { var a = i / 32 * Math.PI * 2, sp = S.mesh(new T.CylinderGeometry(0.004, 0.004, 0.6, 4), chrome); sp.position.set(Math.cos(a) * 0.3, Math.sin(a) * 0.3, (i % 2 ? 0.02 : -0.02)); sp.rotation.z = a - Math.PI / 2; w.add(sp); }
      var hub = S.mesh(new T.CylinderGeometry(0.05, 0.05, 0.12, 24), chrome); hub.rotation.x = Math.PI / 2; w.add(hub);
      return w;
    }
    grp.add(wheel(-1.05)); grp.add(wheel(1.05));
    function tubeP(a, b, r, m) { var d = new T.Vector3().subVectors(b, a), t = S.mesh(new T.CylinderGeometry(r, r, d.length(), 20), m || frame); t.position.copy(a).addScaledVector(d, 0.5); t.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.clone().normalize()); grp.add(t); return t; }
    var V = function (x, y) { return new T.Vector3(x, y, 0); };
    var bb = V(-0.05, 0.62), seat = V(-0.38, 1.55), head = V(0.72, 1.45), rear = V(-1.05, 0.68), front = V(1.05, 0.68);
    tubeP(bb, seat, 0.035); tubeP(bb, head, 0.04); tubeP(V(-0.35, 1.45), V(0.7, 1.32), 0.032);
    tubeP(rear, bb, 0.022); tubeP(rear, V(-0.36, 1.42), 0.022); tubeP(head, front, 0.028); tubeP(head, V(0.66, 1.75), 0.03, chrome);
    tubeP(V(0.5, 1.82), V(0.95, 1.8), 0.022, chrome);
    var grip = S.mesh(new T.CylinderGeometry(0.035, 0.035, 0.22, 16), S.matte('#6b4a2e', 0.6)); grip.rotation.z = Math.PI / 2; grip.position.set(1.0, 1.8, 0); grp.add(grip);
    tubeP(seat, V(-0.42, 1.68), 0.02, chrome);
    var sad = new T.SphereGeometry(1, 24, 12); sad.scale(0.24, 0.06, 0.1); var sd = S.mesh(sad, S.matte('#6b4a2e', 0.5)); sd.position.set(-0.4, 1.73, 0); grp.add(sd);
    var crank = S.mesh(new T.CylinderGeometry(0.16, 0.16, 0.03, 40), chrome); crank.rotation.x = Math.PI / 2; crank.position.copy(bb).add(V(0, 0, 0.06)); grp.add(crank);
    var basket = S.mesh(new T.BoxGeometry(0.5, 0.32, 0.4), new T.MeshStandardMaterial({ color: C('#c49a6c'), roughness: 0.9, wireframe: false })); basket.position.set(1.12, 1.55, 0); grp.add(basket);
    return grp;
  }
  SH['spaak-hero'] = function () {
    var s = S.stage({ bg: '#e2ecd9', key: 1.6, keyPos: [-3, 7, 6] });
    var b = bike('#2f9e44'); b.rotation.y = -0.12; s.add(b);
    var kit = S.roundBox(0.9, 0.35, 0.5, 0.04, S.plastic('#13261b', 0.4)); kit.position.set(-1.9, 0.18, 0.9); kit.rotation.y = 0.4; s.add(kit);
    return [s, S.camera(1, 1, [0.6, 1.5, 6.2], [0.0, 0.95, 0], 30)];
  };
})();
