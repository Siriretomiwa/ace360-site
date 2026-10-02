/* Shots: skincare (Velours, Ébène, Glow Ritual) and bakery (Korrel). */
(function () {
  var S = STUDIO, T = S.T, C = S.C;
  var SH = S.SHOTS;

  /* ---------- Velours: nude, minimal, serif ---------- */
  function veloursLabel(name, kind, bg, ink) {
    return S.label({ bg: bg || '#efe4d8', ink: ink || '#3b2a22', brand: 'velours', brandSize: 132, brandY: 0.3, lines: [[name, 64, 500, S.SANS], [kind, 46, 400, S.SANS, '#7a6558']], y0: 0.58, gap: 82, foot: '200 ml · 6.7 fl oz' });
  }
  function veloursCleanser() { return S.bottle({ r: 0.42, h: 1.9, neck: 0.12, neckH: 0.14, shoulder: 0.26, mat: S.plastic('#f3ece4', 0.35), cap: 'pump', capMat: S.plastic('#3b2a22', 0.3), label: veloursLabel('Oat Milk', 'Gentle cleanser'), labelH: 1.05, labelY: 0.85 }); }
  function veloursSerum() { return S.bottle({ r: 0.3, h: 1.05, neck: 0.11, neckH: 0.1, shoulder: 0.2, mat: S.glass('#c99a6b', { att: '#b07040', attD: 0.6 }), liquid: S.glass('#d9a066', { trans: 0.6, rough: 0.1 }), liquidFill: 0.9, cap: 'dropper', capMat: S.metal('#c9a27a', 0.25), bulbMat: S.matte('#3b2a22', 0.5), label: veloursLabel('Niacinamide 10%', 'Serum', '#f7f1ea'), labelH: 0.55, labelY: 0.45 }); }
  function veloursCream() { return S.jar({ r: 0.46, h: 0.42, mat: S.glass('#f6efe7', { trans: 0.3, rough: 0.25 }), lidMat: S.plastic('#c9a58a', 0.3), label: veloursLabel('Barrier', 'Cream', '#f7f1ea') }); }

  SH['skincare-hero'] = function () {
    var s = S.stage({ bg: '#e9dccf', warm: true, keyPos: [-5, 8, 5], key: 2.4 });
    var a = veloursCleanser(); a.position.set(-0.75, 0, -0.2); a.rotation.y = 0.15; s.add(a);
    var b = veloursSerum(); b.position.set(0.35, 0, 0.25); s.add(b);
    var c = veloursCream(); c.position.set(1.2, 0, -0.1); s.add(c);
    // stone plinth under the cleanser
    var pl = S.mesh(new T.CylinderGeometry(0.75, 0.75, 0.22, 96), S.matte('#d8c7b6', 0.9)); pl.position.set(-0.75, 0.11, -0.2); s.add(pl); a.position.y = 0.22;
    return [s, S.camera(1, 1, [0.6, 1.9, 6.2], [0.15, 0.85, 0], 26)];
  };
  SH['skincare-1'] = function () { var s = S.stage({ bg: '#efe6dc', warm: true }); var a = veloursCleanser(); a.rotation.y = 0.1; s.add(a); return [s, S.camera(1, 1, [0.4, 1.6, 5.2], [0, 1.05, 0], 30)]; };
  SH['skincare-2'] = function () { var s = S.stage({ bg: '#e8d6c4', warm: true }); var a = veloursSerum(); s.add(a); return [s, S.camera(1, 1, [0.3, 1.0, 3.4], [0, 0.65, 0], 30)]; };
  SH['skincare-3'] = function () { var s = S.stage({ bg: '#f1e9e0', warm: true }); var a = veloursCream(); s.add(a); return [s, S.camera(1, 1, [0.2, 1.4, 3.0], [0, 0.4, 0], 30)]; };

  /* ---------- Ébène: deep brown, gold, warm ---------- */
  function ebeneLabel(name, kind) {
    return S.label({ bg: '#2a1a14', ink: '#e9c99a', brand: 'ÉBÈNE', brandSize: 110, brandWeight: 400, brandY: 0.3, lines: [[name, 60, 500, S.SANS, '#f6e9dc'], [kind, 44, 400, S.SANS, '#c4ab98']], y0: 0.58, gap: 80, foot: '30 ml · for melanin-rich skin', footInk: '#c4ab98' });
  }
  function ebeneSerum() { return S.bottle({ r: 0.3, h: 1.1, neck: 0.11, neckH: 0.1, shoulder: 0.18, mat: S.glass('#4a2a1a', { att: '#3a1e10', attD: 0.3, rough: 0.05 }), cap: 'dropper', capMat: S.metal('#d4a373', 0.2), bulbMat: S.matte('#1a110d', 0.5), label: ebeneLabel('Even Tone', 'Serum'), labelH: 0.6, labelY: 0.48 }); }
  function ebeneBalm() { return S.jar({ r: 0.5, h: 0.4, mat: S.plastic('#3a241b', 0.25), lidMat: S.metal('#d4a373', 0.25), label: ebeneLabel('Shea Barrier', 'Balm') }); }
  function ebeneTube() { var t = S.tube({ r: 0.2, len: 1.6, mat: new T.MeshPhysicalMaterial({ map: ebeneLabel('Gentle', 'Exfoliant'), roughness: 0.35, clearcoat: 0.5 }), capMat: S.metal('#d4a373', 0.25) }); t.rotation.z = Math.PI / 2; t.rotation.y = -0.4; t.position.y = 0.2; return t; }
  SH['ebene-hero'] = function () {
    var s = S.stage({ bg: '#3a261d', warm: true, keyColor: '#ffe6c8', key: 2.2, hemi: 0.5, ground: '#2a1a14', keyPos: [-4, 6, 4] });
    var a = ebeneSerum(); a.position.set(-0.6, 0, 0); s.add(a);
    var b = ebeneBalm(); b.position.set(0.55, 0, 0.35); s.add(b);
    var c = ebeneTube(); c.position.set(0.1, 0.2, 1.05); s.add(c);
    return [s, S.camera(1, 1, [0.4, 2.2, 5.6], [0, 0.55, 0.2], 26)];
  };
  SH['ebene-1'] = function () { var s = S.stage({ bg: '#4a2e22', warm: true, keyColor: '#ffe6c8', hemi: 0.5, key: 2.0, ground: '#2a1a14' }); s.add(ebeneSerum()); return [s, S.camera(1, 1, [0.3, 1.0, 3.4], [0, 0.65, 0], 30)]; };
  SH['ebene-2'] = function () { var s = S.stage({ bg: '#5a3a2a', warm: true, keyColor: '#ffe6c8', hemi: 0.5, key: 2.0, ground: '#2a1a14' }); s.add(ebeneBalm()); return [s, S.camera(1, 1, [0.2, 1.5, 3.0], [0, 0.35, 0], 30)]; };
  SH['ebene-3'] = function () { var s = S.stage({ bg: '#4a2e22', warm: true, keyColor: '#ffe6c8', hemi: 0.5, key: 2.0, ground: '#2a1a14' }); var t = ebeneTube(); t.rotation.y = -0.2; s.add(t); return [s, S.camera(1, 1, [0.2, 1.7, 3.2], [0, 0.2, 0], 30)]; };

  /* ---------- Glow Ritual: pink, lash serum + brow pencil ---------- */
  SH['glow-hero'] = function () {
    var s = S.stage({ bg: '#f6d5de', warm: true, key: 2.3, ground: '#e8b9c6' });
    var lbl = S.label({ bg: '#e64980', ink: '#ffffff', brand: 'glow ritual', brandSize: 120, brandY: 0.42, lines: [['LASH SERUM', 54, 700, S.SANS, '#ffe3ec']], y0: 0.72 });
    var pen = new T.Group();
    var body = S.mesh(new T.CylinderGeometry(0.11, 0.11, 1.6, 48), new T.MeshPhysicalMaterial({ map: lbl, roughness: 0.25, clearcoat: 1 })); pen.add(body);
    var cap = S.mesh(new T.CylinderGeometry(0.115, 0.115, 0.7, 48), S.metal('#e8c4a8', 0.18)); cap.position.y = 1.1; pen.add(cap);
    pen.rotation.z = Math.PI / 2; pen.rotation.y = 0.35; pen.position.set(-0.2, 0.11, 0.2); s.add(pen);
    var pen2 = new T.Group();
    var b2 = S.mesh(new T.CylinderGeometry(0.06, 0.06, 1.9, 6), S.plastic('#3b1f2b', 0.35)); pen2.add(b2);
    var tip = S.mesh(new T.ConeGeometry(0.06, 0.18, 6), S.matte('#5a3a2a', 0.8)); tip.position.y = 1.04; pen2.add(tip);
    var sp = S.mesh(new T.CylinderGeometry(0.05, 0.05, 0.22, 16), S.matte('#2a1a1f', 0.95)); sp.position.y = -1.06; pen2.add(sp);
    pen2.rotation.z = Math.PI / 2; pen2.rotation.y = -0.2; pen2.position.set(0.2, 0.06, -0.45); s.add(pen2);
    // compact mirror
    var comp = new T.Group();
    comp.add(S.mesh(new T.CylinderGeometry(0.55, 0.55, 0.12, 64), S.metal('#e8c4a8', 0.2)));
    var bc = S.cv(512, 512), bg2 = bc.getContext('2d'); bg2.fillStyle = '#e9849c'; bg2.fillRect(0, 0, 512, 512); S.speckle(bc, 3000, ['#f4a7b9', '#d96a86', '#fbd0da'], 1, 3, 4);
    bg2.strokeStyle = 'rgba(255,255,255,0.35)'; bg2.lineWidth = 6; for (var k = 0; k < 9; k++) { bg2.beginPath(); bg2.arc(256, 256, 30 + k * 26, 0, Math.PI * 2); bg2.stroke(); }
    var mir = S.mesh(new T.CircleGeometry(0.46, 64), new T.MeshStandardMaterial({ map: S.tex(bc), roughness: 0.75 })); mir.rotation.x = -Math.PI / 2; mir.position.y = 0.061; comp.add(mir);
    comp.position.set(1.35, 0.06, 0.3); s.add(comp);
    return [s, S.camera(1, 1, [0.2, 3.4, 4.0], [0.3, 0, 0], 30)];
  };

  /* ---------- Bakkerij Korrel: sourdough, croissants, apple pie on wood ---------- */
  function crustTex(base, dark, seed) {
    var c = S.cv(1024, 512), g = c.getContext('2d');
    var gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, dark); gr.addColorStop(0.5, base); gr.addColorStop(1, dark);
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    S.speckle(c, 2600, ['#5a2d10', '#8a4a1c', '#c98a4a', '#e8c08a'], 1, 5, seed || 9);
    return c;
  }
  // batard loaf: sculpted score, crust coloured per vertex (dark ridge, golden sides, pale flour)
  function sourdough(seed) {
    var g = new T.SphereGeometry(1, 160, 120);
    g.scale(1.45, 0.6, 0.82);
    S.displace(g, 0.05, 2.4);
    var p = g.attributes.position, col = [], top = 0.6, r = S.rnd(seed || 11);
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      if (y < -0.1) { y = -0.1 + (y + 0.1) * 0.12; p.setY(i, y); }
      var h = (y + 0.1) / (top + 0.1);                       // 0 bottom … 1 top
      var line = 0.22 * x - 0.05;                            // the score runs along the loaf, slightly diagonal
      var d = Math.abs(z - line), score = 0;
      if (h > 0.55 && d < 0.13 && Math.abs(x) < 1.15) { score = (0.13 - d) / 0.13; p.setY(i, y - score * 0.09); }
      var n = S.fbm(x * 3 + 5, y * 3, z * 3 + 9);
      var crust = new T.Color().setRGB(0.42 + n * 0.12, 0.2 + n * 0.07, 0.07 + n * 0.03).convertSRGBToLinear();     // deep caramel
      var side = new T.Color().setRGB(0.74 + n * 0.1, 0.48 + n * 0.08, 0.22 + n * 0.05).convertSRGBToLinear();       // golden
      var c = side.clone().lerp(crust, Math.min(1, Math.max(0, (h - 0.35) * 1.8)));
      if (score > 0) c.lerp(new T.Color(0.93, 0.8, 0.6).convertSRGBToLinear(), Math.min(1, score * 1.6));       // pale opened ear
      var flour = Math.max(0, S.fbm(x * 7, y * 7 + 2, z * 7) - 0.62) * 1.8 * (h > 0.3 ? 1 : 0.3);
      c.lerp(new T.Color(0.95, 0.92, 0.86).convertSRGBToLinear(), Math.min(0.45, flour));
      if (h < 0.08) c.multiplyScalar(0.8);
      col.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new T.Float32BufferAttribute(col, 3));
    g.computeVertexNormals();
    var m = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0 });
    var grp = new T.Group(), mesh = S.mesh(g, m); mesh.position.y = 0.1; grp.add(mesh);
    return grp;
  }
  function croissant(seed) {
    var grp = new T.Group(), N = 11, c = crustTex('#b8681f', '#6a3208', seed || 6);
    var m = new T.MeshPhysicalMaterial({ map: S.tex(c), roughness: 0.42, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.35 });
    for (var i = 0; i < N; i++) {
      var t = i / (N - 1), a = (t - 0.5) * 2.1, rad = 0.8;
      var size = 0.14 + Math.pow(Math.sin(t * Math.PI), 0.8) * 0.3;
      var g = new T.SphereGeometry(1, 48, 32); g.scale(size * 0.75, size * 0.8, size * 1.15);
      S.displace(g, 0.02, 6);
      var seg = S.mesh(g, m);
      seg.position.set(Math.sin(a) * rad, size * 0.55, Math.cos(a) * rad - rad);
      seg.rotation.y = a + Math.PI / 2; seg.rotation.z = (i % 2 ? 0.08 : -0.08);
      grp.add(seg);
    }
    return grp;
  }
  function applePie() {
    var grp = new T.Group();
    var dish = S.latheMesh([[0, 0], [0.95, 0], [1.12, 0.22], [1.18, 0.24], [1.16, 0.2], [0, 0.2]], S.plastic('#f2efe8', 0.25)); grp.add(dish);
    var c = S.cv(1024, 1024), g = c.getContext('2d');
    g.fillStyle = '#9a4a18'; g.fillRect(0, 0, 1024, 1024);
    S.speckle(c, 1400, ['#6a2a0a', '#c9772e', '#e8b060', '#5a2008'], 4, 16, 31);
    for (var k = 0; k < 7; k++) { // lattice
      var x = 120 + k * 130; g.fillStyle = '#c98a3e'; g.save(); g.shadowColor = 'rgba(60,20,0,0.5)'; g.shadowBlur = 14; g.fillRect(x, 0, 70, 1024); g.restore();
    }
    for (var k2 = 0; k2 < 7; k2++) { var y = 120 + k2 * 130; g.fillStyle = '#d0954a'; g.save(); g.shadowColor = 'rgba(60,20,0,0.5)'; g.shadowBlur = 14; g.fillRect(0, y, 1024, 70); g.restore(); }
    S.speckle(c, 2500, ['#f3d29a', '#a85a20', '#8a4512', '#e9b56a'], 1, 5, 32);
    var top = new T.CircleGeometry(1.02, 96); S.displace(top, 0.0, 1);
    var tm = S.mesh(top, new T.MeshStandardMaterial({ map: S.tex(c), roughness: 0.6 })); tm.rotation.x = -Math.PI / 2; tm.position.y = 0.24; grp.add(tm);
    var rim = S.mesh(new T.TorusGeometry(1.04, 0.07, 16, 96), new T.MeshStandardMaterial({ map: S.tex(crustTex('#d4954a', '#9a5a22', 33)), roughness: 0.6 })); rim.rotation.x = Math.PI / 2; rim.position.y = 0.25; grp.add(rim);
    return grp;
  }
  function board(w, d) {
    var b = S.roundBox(w, d, 0.12, 0.04, new T.MeshStandardMaterial({ map: S.tex(S.woodTex('#8a5a32', '#3a2210', 1024, 1024, 8)), roughness: 0.7 }));
    b.rotation.x = -Math.PI / 2; b.position.y = 0.06; return b;
  }
  var bakeStage = function () { return S.stage({ bg: '#ead9c0', warm: true, keyPos: [-5, 7, 3], key: 1.5, ground: '#b89a72' }); };
  SH['korrel-hero'] = function () {
    var s = bakeStage();
    s.add(board(4.2, 2.6));
    var l = sourdough(11); l.position.set(-0.75, 0.12, -0.05); l.rotation.y = 0.35; s.add(l);
    var c1 = croissant(6); c1.scale.setScalar(0.72); c1.position.set(1.05, 0.12, -0.35); c1.rotation.y = -0.5; s.add(c1);
    var c2 = croissant(12); c2.scale.setScalar(0.68); c2.position.set(1.15, 0.12, 0.65); c2.rotation.y = 2.2; s.add(c2);
    var linen = S.mesh(new T.PlaneGeometry(2.2, 1.6), new T.MeshStandardMaterial({ map: S.tex(S.linenTex('#e9e1d3', 4)), roughness: 0.95 })); linen.rotation.x = -Math.PI / 2; linen.rotation.z = 0.3; linen.position.set(-2.4, 0.004, 1.0); s.add(linen);
    return [s, S.camera(1, 1, [0.3, 3.6, 5.6], [0.1, 0.2, 0.1], 28)];
  };
  SH['korrel-1'] = function () { var s = bakeStage(); s.add(board(3.2, 2.4)); var l = sourdough(11); l.position.y = 0.12; l.rotation.y = 0.2; s.add(l); return [s, S.camera(1, 1, [0.3, 2.6, 4.4], [0, 0.35, 0], 30)]; };
  SH['korrel-2'] = function () { var s = bakeStage(); s.add(board(3.2, 2.4)); [[-0.5, -0.25, 0.4, 6], [0.55, 0.3, 2.6, 12], [-0.3, 0.75, 1.4, 17], [0.6, -0.6, -0.8, 23]].forEach(function (p) { var c = croissant(p[3]); c.scale.setScalar(0.55); c.position.set(p[0], 0.12, p[1]); c.rotation.y = p[2]; s.add(c); }); return [s, S.camera(1, 1, [0.2, 3.6, 3.6], [0, 0.1, 0.05], 30)]; };
  SH['korrel-3'] = function () { var s = bakeStage(); var p = applePie(); s.add(p); return [s, S.camera(1, 1, [0.2, 3.3, 2.9], [0, 0.15, 0], 30)]; };
})();
