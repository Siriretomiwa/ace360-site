/**
 * ace360 stage: a white architectural model of a Dutch canal-house street,
 * fixed behind the front page and rendered with three.js.
 *
 * Every chapter (<section data-k="...">) is a keyframe: camera position, target,
 * which side the model sits on, and the build state of the centre house.
 * Scrolling blends between keyframes. Through the five process steps the centre
 * house is set out, drawn, massed, built under scaffolding and finished.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var canvas = document.getElementById('stage');
  function fail() { root.classList.add('no-webgl'); }
  if (!canvas || typeof window.THREE === 'undefined') { fail(); return; }

  var THREE = window.THREE;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { fail(); return; }
  if (!renderer.getContext()) { fail(); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0xffffff, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 120);

  /* ---------- materials: clay model, monochrome ---------- */
  var M = {
    clay: new THREE.MeshStandardMaterial({ color: 0xf6f6f4, roughness: 0.92, metalness: 0 }),
    clay2: new THREE.MeshStandardMaterial({ color: 0xebebe9, roughness: 0.92, metalness: 0 }),
    slab: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0 }),
    water: new THREE.MeshStandardMaterial({ color: 0xdfe2e6, roughness: 0.3, metalness: 0.05 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x1c1e21, roughness: 0.35, metalness: 0.1 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.6, metalness: 0 }),
    tree: new THREE.MeshStandardMaterial({ color: 0xf1f1ef, roughness: 0.9, metalness: 0, flatShading: true }),
    trunk: new THREE.MeshStandardMaterial({ color: 0xd2d2cf, roughness: 0.9, metalness: 0 }),
    line: new THREE.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.09 })
  };
  function shadowy(m) { m.castShadow = true; m.receiveShadow = true; return m; }

  /* ---------- base: slab, quay, canal, bridge ---------- */
  var world = new THREE.Group();
  scene.add(world);

  var slab = new THREE.Mesh(new THREE.BoxGeometry(19, 0.4, 10.5), M.slab);
  slab.position.set(0, -0.2, 0.7);
  slab.receiveShadow = true;
  world.add(slab);

  var shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.06 }));
  shadowFloor.rotation.x = -Math.PI / 2;
  shadowFloor.position.y = -0.41;
  shadowFloor.receiveShadow = true;
  world.add(shadowFloor);

  var water = new THREE.Mesh(new THREE.BoxGeometry(19, 0.06, 2.3), M.water);
  water.position.set(0, -0.02, 2.05);
  water.receiveShadow = true;
  world.add(water);
  [0.88, 3.22].forEach(function (z) {
    var curb = shadowy(new THREE.Mesh(new THREE.BoxGeometry(19, 0.08, 0.08), M.clay2));
    curb.position.set(0, 0.04, z);
    world.add(curb);
  });

  // arched bridge
  var arch = new THREE.Shape();
  var a0 = Math.atan2(0.25, 0.9);
  arch.moveTo(-1.45, 0); arch.lineTo(-1.45, 0.5); arch.lineTo(1.45, 0.5); arch.lineTo(1.45, 0); arch.lineTo(0.9, 0);
  arch.absarc(0, -0.25, Math.hypot(0.9, 0.25), a0, Math.PI - a0, false);
  arch.lineTo(-1.45, 0);
  var bridgeGeo = new THREE.ExtrudeGeometry(arch, { depth: 1.15, bevelEnabled: false, curveSegments: 20 });
  bridgeGeo.translate(0, 0, -0.575);
  var bridge = shadowy(new THREE.Mesh(bridgeGeo, M.clay));
  bridge.rotation.y = Math.PI / 2;
  bridge.position.set(3.4, 0, 2.05);
  world.add(bridge);

  // boat
  var boat = shadowy(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.16, 0.48), M.clay2));
  boat.position.set(-4.2, 0.08, 2.3);
  world.add(boat);
  var cabin = shadowy(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.34), M.clay));
  cabin.position.set(-4.35, 0.24, 2.3);
  world.add(cabin);

  // trees along the quay
  var trees = [];
  [-7.4, -4.9, -2.9, 2.5, 5.4, 7.6].forEach(function (x, i) {
    var t = new THREE.Group();
    var trunk = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.6, 6), M.trunk));
    trunk.position.y = 0.3;
    var crown = shadowy(new THREE.Mesh(new THREE.IcosahedronGeometry(0.3 + (i % 3) * 0.05, 0), M.tree));
    crown.position.y = 0.78;
    crown.rotation.set(i, i * 2, 0);
    t.add(trunk); t.add(crown);
    t.position.set(x, 0, 0.42);
    world.add(t);
    trees.push(t);
  });

  /* ---------- canal houses ---------- */
  var FH = 0.52; // floor height
  var DEPTH = 1.6;
  function gableShape(type, w, h) {
    var s = new THREE.Shape(), hw = w / 2;
    s.moveTo(-hw, 0);
    if (type === 'step') {
      s.lineTo(-hw, h * 0.3); s.lineTo(-hw * 0.66, h * 0.3); s.lineTo(-hw * 0.66, h * 0.62); s.lineTo(-hw * 0.34, h * 0.62);
      s.lineTo(-hw * 0.34, h); s.lineTo(hw * 0.34, h); s.lineTo(hw * 0.34, h * 0.62); s.lineTo(hw * 0.66, h * 0.62);
      s.lineTo(hw * 0.66, h * 0.3); s.lineTo(hw, h * 0.3);
    } else if (type === 'neck') {
      s.lineTo(-hw, h * 0.18); s.quadraticCurveTo(-hw * 0.5, h * 0.22, -hw * 0.45, h * 0.5);
      s.lineTo(-hw * 0.45, h * 0.85); s.lineTo(0, h); s.lineTo(hw * 0.45, h * 0.85); s.lineTo(hw * 0.45, h * 0.5);
      s.quadraticCurveTo(hw * 0.5, h * 0.22, hw, h * 0.18);
    } else if (type === 'bell') {
      s.lineTo(-hw, h * 0.12); s.quadraticCurveTo(-hw * 0.2, h * 0.2, -hw * 0.5, h * 0.62);
      s.quadraticCurveTo(-hw * 0.45, h * 1.02, 0, h); s.quadraticCurveTo(hw * 0.45, h * 1.02, hw * 0.5, h * 0.62);
      s.quadraticCurveTo(hw * 0.2, h * 0.2, hw, h * 0.12);
    } else if (type === 'flat') {
      s.lineTo(-hw, h * 0.35); s.lineTo(-hw - 0.05, h * 0.35); s.lineTo(-hw - 0.05, h * 0.45); s.lineTo(hw + 0.05, h * 0.45);
      s.lineTo(hw + 0.05, h * 0.35); s.lineTo(hw, h * 0.35);
    } else {
      s.lineTo(0, h);
    }
    s.lineTo(hw, 0);
    s.lineTo(-hw, 0);
    return s;
  }

  function addEdges(target, mesh, own) {
    var e = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 20), own ? M.line.clone() : M.line);
    e.position.copy(mesh.position);
    e.rotation.copy(mesh.rotation);
    target.add(e);
    return e;
  }

  function makeHouse(o, isCentre) {
    var g = new THREE.Group();
    var w = o.w, n = o.floors, gh = o.gableH || 0.9;
    var mat = isCentre ? M.clay.clone() : (o.alt ? M.clay2 : M.clay);
    var parts = { floors: [], gable: null, windows: [], edges: [], mat: mat, n: n, gh: gh };
    for (var i = 0; i < n; i++) {
      var f = shadowy(new THREE.Mesh(new THREE.BoxGeometry(w, FH, DEPTH), mat));
      f.position.set(0, i * FH + FH / 2, -DEPTH / 2);
      g.add(f);
      parts.floors.push(f);
      parts.edges.push(addEdges(g, f, isCentre));
      var count = w > 1.25 ? 3 : 2;
      for (var k = 0; k < count; k++) {
        var x = -w / 2 + (k + 0.5) * (w / count);
        var isDoor = i === 0 && k === 0;
        var ww = (w / count) * (isDoor ? 0.42 : 0.48);
        var wh = FH * (isDoor ? 0.78 : 0.56);
        var win = new THREE.Mesh(new THREE.BoxGeometry(ww, wh, 0.04), isDoor ? M.dark : M.glass);
        win.position.set(x, i * FH + (isDoor ? wh / 2 + 0.02 : FH * 0.52), 0.015);
        g.add(win);
        parts.windows.push(win);
      }
    }
    var gGeo = new THREE.ExtrudeGeometry(gableShape(o.gable, w, gh), { depth: DEPTH, bevelEnabled: false, curveSegments: 10 });
    gGeo.translate(0, 0, -DEPTH);
    var gable = shadowy(new THREE.Mesh(gGeo, mat));
    gable.position.y = n * FH;
    g.add(gable);
    parts.gable = gable;
    parts.edges.push(addEdges(g, gable, isCentre));
    var gw = new THREE.Mesh(new THREE.BoxGeometry(w * 0.2, gh * 0.24, 0.04), M.glass);
    gw.position.set(0, n * FH + gh * 0.3, 0.015);
    g.add(gw);
    parts.windows.push(gw);
    if (o.gable !== 'flat') {
      var beam = shadowy(new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.22), M.dark));
      beam.position.set(0, n * FH + gh * 0.72, 0.1);
      g.add(beam);
      parts.windows.push(beam);
    }
    g.userData = parts;
    return g;
  }

  var ROW = [
    { w: 1.15, floors: 4, gable: 'neck' }, { w: 1.4, floors: 3, gable: 'flat', alt: true }, { w: 1.0, floors: 5, gable: 'spout' },
    { w: 1.25, floors: 4, gable: 'bell', alt: true }, { w: 1.35, floors: 4, gable: 'step' }, { w: 1.05, floors: 4, gable: 'neck', alt: true },
    { w: 1.3, floors: 3, gable: 'bell' }, { w: 1.1, floors: 5, gable: 'step', alt: true }, { w: 1.45, floors: 3, gable: 'flat' }
  ];
  var CENTRE = 4, GAP = 0.04;
  var leftEdge = 0;
  for (var r = 0; r < CENTRE; r++) leftEdge -= ROW[r].w + GAP;
  leftEdge -= ROW[CENTRE].w / 2;
  var houses = [];
  var xi = leftEdge;
  ROW.forEach(function (o, i) {
    var h = makeHouse(o, i === CENTRE);
    h.position.set(xi + o.w / 2, 0, -1);
    xi += o.w + GAP;
    h.userData.delay = Math.abs(i - CENTRE) * 0.12 + 0.1;
    world.add(h);
    houses.push(h);
  });
  var centre = houses[CENTRE];
  var C = centre.userData;
  var cw = ROW[CENTRE].w;

  // plot outline + stakes
  var plotGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-cw / 2, 0.01, 0), new THREE.Vector3(cw / 2, 0.01, 0),
    new THREE.Vector3(cw / 2, 0.01, 0), new THREE.Vector3(cw / 2, 0.01, -DEPTH),
    new THREE.Vector3(cw / 2, 0.01, -DEPTH), new THREE.Vector3(-cw / 2, 0.01, -DEPTH),
    new THREE.Vector3(-cw / 2, 0.01, -DEPTH), new THREE.Vector3(-cw / 2, 0.01, 0)
  ]);
  var plotMat = new THREE.LineDashedMaterial({ color: 0x111111, dashSize: 0.08, gapSize: 0.06, transparent: true, opacity: 0 });
  var plot = new THREE.LineSegments(plotGeo, plotMat);
  plot.computeLineDistances();
  centre.add(plot);
  var stakes = [];
  [[-1, 0], [1, 0], [1, -1], [-1, -1]].forEach(function (p) {
    var st = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 6), M.dark));
    st.position.set(p[0] * cw / 2, 0.11, p[1] * DEPTH);
    centre.add(st);
    stakes.push(st);
  });

  // scaffolding in front of the centre house
  var sc = [];
  var scH = C.n * FH + 0.55, scW = cw + 0.3, zf = 0.24, zb = 0.06;
  for (var px = 0; px <= 3; px++) {
    var xx = -scW / 2 + (px * scW) / 3;
    sc.push(xx, 0, zf, xx, scH, zf, xx, 0, zb, xx, scH, zb);
  }
  for (var py = 1; py <= C.n + 1; py++) {
    var yy = Math.min(py * FH, scH);
    sc.push(-scW / 2, yy, zf, scW / 2, yy, zf, -scW / 2, yy, zb, scW / 2, yy, zb);
  }
  for (var pd = 0; pd < 3; pd++) {
    var xa = -scW / 2 + (pd * scW) / 3;
    sc.push(xa, pd * FH * 1.3, zf, xa + scW / 3, (pd + 1) * FH * 1.3, zf);
  }
  var scGeo = new THREE.BufferGeometry();
  scGeo.setAttribute('position', new THREE.Float32BufferAttribute(sc, 3));
  var scMat = new THREE.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0 });
  var scaffold = new THREE.LineSegments(scGeo, scMat);
  centre.add(scaffold);

  // launch flag on the gable
  var flag = new THREE.Group();
  var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.42, 6), M.dark);
  pole.position.y = 0.21;
  var cloth = shadowy(new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.14, 8, 1), new THREE.MeshStandardMaterial({ color: 0x111111, side: THREE.DoubleSide, roughness: 0.7 })));
  cloth.position.set(0.12, 0.34, 0);
  flag.add(pole); flag.add(cloth);
  flag.position.set(0, C.n * FH + C.gh, -0.2);
  centre.add(flag);
  var clothBase = cloth.geometry.attributes.position.array.slice();

  /* ---------- lights ---------- */
  var hemi = new THREE.HemisphereLight(0xffffff, 0xd9dce1, 0.85);
  scene.add(hemi);
  var sun = new THREE.DirectionalLight(0xffffff, 0.95);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -11; sun.shadow.camera.right = 11;
  sun.shadow.camera.top = 9; sun.shadow.camera.bottom = -9;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 40;
  sun.shadow.bias = -0.0006;
  sun.shadow.radius = 4;
  scene.add(sun);
  scene.add(sun.target);
  var fill = new THREE.DirectionalLight(0xffffff, 0.42);
  fill.position.set(-6, 4, 8);
  scene.add(fill);

  /* ---------- keyframes ---------- */
  var BASE = { cx: 0, cy: 3.2, cz: 9, tx: 0, ty: 1.2, tz: -1, side: 1, plot: 0, frame: 0, build: 1, solid: 1, scaffold: 0, glass: 1, flag: 0, sun: 0 };
  var SEQ = [
    ['hero', { cx: 7.6, cy: 5.4, cz: 13.8, tx: 0.9, ty: 1.1, tz: -0.6 }],
    ['services', { side: -1, cx: -8.6, cy: 6.8, cz: 12.6, tx: -1.4, ty: 0.9, tz: -0.4, sun: 0.15 }],
    ['estimate', { side: 1, cx: 2.6, cy: 13.5, cz: 9.6, tx: 0.4, ty: 0.2, tz: 0, sun: 0.25 }],
    ['process', { side: -1, cx: -4.2, cy: 3.8, cz: 10.4, tx: 0, ty: 1.3, tz: -1, sun: 0.1 }],
    ['s1', { side: 1, cx: 2.6, cy: 5.8, cz: 5.9, tx: 0, ty: 0.3, tz: -1.4, build: 0, glass: 0, plot: 1, frame: 0 }],
    ['s2', { side: -1, cx: -3.4, cy: 3.8, cz: 7.1, tx: 0, ty: 1.3, tz: -1, frame: 1, build: 0, glass: 0, plot: 1 }],
    ['s3', { side: 1, cx: 3.9, cy: 3.4, cz: 7.4, ty: 1.4, frame: 1, build: 1, solid: 0.3, glass: 0, plot: 1 }],
    ['s4', { side: -1, cx: -3.7, cy: 2.8, cz: 7.6, ty: 1.5, frame: 0.2, build: 1, solid: 1, scaffold: 1, glass: 0, plot: 0.4 }],
    ['s5', { side: 1, cx: 3.3, cy: 2.6, cz: 8.1, ty: 1.6, frame: 0, scaffold: 0, plot: 0, glass: 1, flag: 1, sun: 0.35 }],
    ['work', { side: -1, cx: -9.4, cy: 3.4, cz: 8.6, tx: -5.2, ty: 1.2, tz: -1, sun: 0.2 }],
    ['work-end', { side: -1, cx: 7.8, cy: 3.4, cz: 8.6, tx: 4.2, ty: 1.2, tz: -1, sun: 0.45 }],
    ['faq', { side: 0, cx: 0, cy: 14, cz: 12, tx: 0, ty: 0, tz: 0.4, sun: 0.5 }],
    ['contact', { side: 0, cx: 1.2, cy: 2.2, cz: 11, tx: 0, ty: 1.5, tz: -1, flag: 1, sun: 0.6 }]
  ];
  var KF = {};
  var prev = BASE;
  SEQ.forEach(function (s) { prev = Object.assign({}, prev, s[1]); KF[s[0]] = prev; });
  var S = Object.assign({}, BASE);

  var secs = Array.prototype.slice.call(document.querySelectorAll('[data-k]'));
  var anchors = [];
  function measure() {
    var vh = window.innerHeight;
    anchors = [];
    secs.forEach(function (s) {
      var key = s.dataset.k, k = KF[key];
      if (!k) return;
      var top = s.getBoundingClientRect().top + window.scrollY, h = s.offsetHeight;
      if (h > vh * 1.3) {
        anchors.push({ y: top, k: k });
        anchors.push({ y: top + h - vh, k: KF[key + '-end'] || k });
      } else {
        anchors.push({ y: top + (h - vh) / 2, k: k });
      }
    });
    anchors.sort(function (a, b) { return a.y - b.y; });
  }
  function smooth(x) { return x * x * (3 - 2 * x); }
  function sample(y) {
    if (!anchors.length) return;
    var a = anchors[0], b = anchors[0], t = 0, last = anchors[anchors.length - 1];
    if (y >= last.y) { a = b = last; }
    else if (y > anchors[0].y) {
      for (var i = 0; i < anchors.length - 1; i++) {
        if (y >= anchors[i].y && y < anchors[i + 1].y) {
          a = anchors[i]; b = anchors[i + 1];
          t = smooth((y - a.y) / Math.max(1, b.y - a.y));
          break;
        }
      }
    }
    for (var k in BASE) S[k] = a.k[k] + (b.k[k] - a.k[k]) * t;
  }

  /* ---------- sizing ---------- */
  var W = 1, H = 1;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setSize(W, H, false);
    var asp = W / H;
    camera.aspect = asp;
    camera.fov = asp < 1 ? 32 + (1 - asp) * 34 : 32;
    camera.updateProjectionMatrix();
    measure();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('load', measure);
  setTimeout(measure, 1500);
  if (window.ScrollTrigger) window.ScrollTrigger.addEventListener('refresh', measure);
  resize();
  window.ACE360_FILM = { measure: measure };

  /* ---------- pointer ---------- */
  var ptr = { x: 0, y: 0 }, eased = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    ptr.x = e.clientX / W - 0.5;
    ptr.y = e.clientY / H - 0.5;
  }, { passive: true });

  /* ---------- frame ---------- */
  var intro = { v: reduce ? 1 : 0 };
  if (gsap && !reduce) gsap.to(intro, { v: 1, duration: 2.6, delay: 0.1, ease: 'power2.out' });

  var clock = new THREE.Clock();
  var ys = window.scrollY;
  var target = new THREE.Vector3();
  function clamp01(x) { return Math.min(1, Math.max(0, x)); }
  function easeOut(x) { return 1 - Math.pow(1 - x, 3); }

  function frame() {
    var dt = Math.min(clock.getDelta(), 0.05);
    var time = clock.elapsedTime;
    ys += (window.scrollY - ys) * (reduce ? 1 : 1 - Math.exp(-dt * 7));
    sample(ys);
    eased.x += (ptr.x - eased.x) * 0.05;
    eased.y += (ptr.y - eased.y) * 0.05;
    var iv = intro.v;

    camera.position.set(S.cx + eased.x * 0.6, S.cy - eased.y * 0.3 + (1 - iv) * 1.5, S.cz + (1 - iv) * 3);
    target.set(S.tx, S.ty, S.tz);
    camera.lookAt(target);
    if (W > 980) camera.setViewOffset(W, H, -W * 0.19 * S.side, 0, W, H);
    else camera.setViewOffset(W, H, 0, H * 0.21, W, H);

    // neighbours and trees rise on load
    houses.forEach(function (h) {
      if (h === centre) return;
      var p = easeOut(clamp01(iv * 2.6 - h.userData.delay * 2));
      h.scale.set(1, Math.max(0.001, p), 1);
    });
    trees.forEach(function (t, i) {
      t.scale.setScalar(Math.max(0.001, easeOut(clamp01(iv * 2.6 - 0.8 - i * 0.08))));
    });

    // centre house build state
    var n = C.n;
    var build = S.build * easeOut(clamp01(iv * 2.6 - 0.2));
    C.floors.forEach(function (f, i) {
      var s = clamp01(build * (n + 1) - i);
      f.visible = s > 0.001;
      f.scale.y = Math.max(0.001, s);
      f.position.y = i * FH + (FH * s) / 2;
    });
    var gs = clamp01(build * (n + 1) - n);
    C.gable.visible = gs > 0.001;
    C.gable.scale.y = Math.max(0.001, gs);
    var ghost = S.solid < 0.99;
    C.mat.transparent = ghost;
    C.mat.opacity = S.solid;
    C.mat.depthWrite = S.solid > 0.6;
    C.floors.forEach(function (m) { m.castShadow = S.solid > 0.6; });
    C.gable.castShadow = S.solid > 0.6;
    var frameReveal = S.frame * iv;
    C.edges.forEach(function (e, i) {
      var reveal = clamp01(frameReveal * (n + 1) - Math.min(i, n));
      e.material.opacity = Math.max(0.09 * Math.min(build * (n + 1) - Math.min(i, n), 1), reveal * 0.85);
      e.visible = e.material.opacity > 0.01;
    });
    C.windows.forEach(function (w) {
      w.visible = S.glass > 0.02;
      w.scale.set(1, Math.max(0.001, S.glass), 1);
    });
    plotMat.opacity = S.plot * 0.9;
    plot.visible = S.plot > 0.02;
    stakes.forEach(function (st) { st.visible = S.plot > 0.3; });
    scMat.opacity = S.scaffold * 0.55;
    scaffold.visible = S.scaffold > 0.02;
    flag.visible = S.flag > 0.02;
    flag.scale.set(1, Math.max(0.001, S.flag), 1);
    if (!reduce && flag.visible) {
      var pos = cloth.geometry.attributes.position;
      for (var v = 0; v < pos.count; v++) {
        var bx = clothBase[v * 3];
        pos.array[v * 3 + 2] = Math.sin(time * 4 + bx * 20) * 0.08 * (bx + 0.12);
      }
      pos.needsUpdate = true;
    }

    if (!reduce) {
      boat.position.y = 0.08 + Math.sin(time * 1.2) * 0.012;
      cabin.position.y = boat.position.y + 0.16;
    }
    var a = -0.9 + S.sun * 1.4;
    sun.position.set(Math.sin(a) * 10, 9, -7 + Math.cos(a) * 2);
    sun.target.position.set(0, 0, 0.5);

    renderer.render(scene, camera);
  }

  var running = false;
  function loop() {
    if (document.hidden) { running = false; return; }
    frame();
    requestAnimationFrame(loop);
  }
  function start() { if (!running) { running = true; clock.getDelta(); requestAnimationFrame(loop); } }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
  start();
})();
