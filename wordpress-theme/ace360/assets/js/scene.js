/**
 * Ace 360 background scene: a website that builds itself as you scroll.
 *
 * One three.js canvas is fixed behind the whole front page. It holds the parts
 * of a web page (nav bar, buttons, headline bars, image, cards, footer) plus
 * loose tiles, all as white clay with a few orange pieces. Each section with
 * data-bg="..." is a keyframe; scrolling blends every piece from one layout to
 * the next, with a small stagger so the pieces travel like a flock:
 *
 *   hero      pieces float, scattered, drifting slowly
 *   services  they gather into a turning ring
 *   quote     they stack into a bar chart (price)
 *   process   they snap together into a web page
 *   work      the page pulls apart into its layers
 *   faq       everything lines up into a calm grid wall
 *   contact   the finished page faces you, with an orange "live" dot
 */
(function () {
  'use strict';

  var canvas = document.getElementById('bg-stage');
  var root = document.documentElement;
  if (!canvas || typeof window.THREE === 'undefined') return;
  var THREE = window.THREE;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (e) { root.classList.add('no-webgl'); return; }
  if (!renderer.getContext()) { root.classList.add('no-webgl'); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0xffffff, 1);

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 16, 38);
  var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
  camera.position.set(0, 0, 14);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8dade, 0.62));
  var key = new THREE.DirectionalLight(0xffffff, 0.5);
  key.position.set(5, 8, 10);
  scene.add(key);
  var rim = new THREE.DirectionalLight(0xffffff, 0.22);
  rim.position.set(-8, -2, 4);
  scene.add(rim);

  /* ---------- materials ---------- */
  var MAT = {
    clay: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, metalness: 0, emissive: 0xffffff, emissiveIntensity: 0.12 }),
    soft: new THREE.MeshStandardMaterial({ color: 0xe9ebef, roughness: 0.85, metalness: 0, emissive: 0xe9ebef, emissiveIntensity: 0.08 }),
    ink: new THREE.MeshStandardMaterial({ color: 0x1b1b1d, roughness: 0.6, metalness: 0 }),
    orange: new THREE.MeshStandardMaterial({ color: 0xff5a00, roughness: 0.6, metalness: 0 })
  };

  /* ---------- rounded slab geometry ---------- */
  var geoCache = {};
  function slab(w, h, d) {
    var k = w + 'x' + h + 'x' + d;
    if (geoCache[k]) return geoCache[k];
    var r = Math.min(0.12, w / 4, h / 4);
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    var bev = Math.min(0.03, d / 3);
    var g = new THREE.ExtrudeGeometry(s, { depth: d - bev * 2, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 2, curveSegments: 6 });
    g.translate(0, 0, -(d - bev * 2) / 2);
    geoCache[k] = g;
    return g;
  }

  // thin ink outlines, like an architect's model, so white blocks read on a white page
  var edgeMat = new THREE.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.16 });
  var edgeCache = {};
  function withEdges(mesh, k) {
    if (!edgeCache[k]) edgeCache[k] = new THREE.EdgesGeometry(mesh.geometry, 30);
    mesh.add(new THREE.LineSegments(edgeCache[k], edgeMat));
    return mesh;
  }

  /* ---------- the parts of a web page (page coordinates, units) ---------- */
  var PAGE = [
    // x, y, w, h, depth, material, layer (for the exploded view)
    [0, 0, 6.4, 4.4, 0.12, 'clay', 0],      // page body
    [0, 1.85, 6.0, 0.36, 0.1, 'soft', 1],   // nav bar
    [-2.55, 1.85, 0.6, 0.18, 0.1, 'ink', 2],  // logo
    [0.9, 1.85, 0.45, 0.08, 0.08, 'ink', 2],  // nav links
    [1.5, 1.85, 0.45, 0.08, 0.08, 'ink', 2],
    [2.6, 1.85, 0.62, 0.24, 0.12, 'orange', 2], // nav CTA
    [-1.35, 1.12, 3.1, 0.34, 0.1, 'ink', 2],    // headline
    [-1.65, 0.68, 2.5, 0.34, 0.1, 'ink', 2],
    [-1.75, 0.27, 2.3, 0.09, 0.08, 'soft', 2],  // text lines
    [-1.95, 0.1, 1.9, 0.09, 0.08, 'soft', 2],
    [-2.35, -0.3, 1.0, 0.32, 0.14, 'orange', 3],// button
    [1.55, 0.72, 2.6, 1.6, 0.16, 'soft', 1],    // image
    [-2.05, -1.2, 1.85, 1.0, 0.14, 'clay', 2],  // cards
    [0, -1.2, 1.85, 1.0, 0.14, 'clay', 2],
    [2.05, -1.2, 1.85, 1.0, 0.14, 'clay', 2],
    [0, -1.98, 6.0, 0.18, 0.08, 'soft', 1]      // footer
  ];

  var small = window.innerWidth < 760;
  var LOOSE = small ? 22 : 40;
  var seed = 360;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function rr(a, b) { return a + rand() * (b - a); }

  var pieces = [];
  var world = new THREE.Group();
  scene.add(world);

  PAGE.forEach(function (p, i) {
    var m = new THREE.Mesh(slab(p[2], p[3], p[4]), MAT[p[5]]);
    if (p[5] !== 'ink') withEdges(m, p[2] + 'x' + p[3] + 'x' + p[4]);
    world.add(m);
    pieces.push({ mesh: m, page: { x: p[0], y: p[1], layer: p[6] }, w: p[2], h: p[3], kind: 'page', i: i, delay: rand() });
  });
  for (var j = 0; j < LOOSE; j++) {
    var kind = rand();
    var w = kind < 0.5 ? rr(0.35, 0.8) : rr(0.8, 1.6);
    var h = kind < 0.5 ? w : rr(0.2, 0.6);
    var mat = j % 9 === 0 ? 'orange' : j % 5 === 0 ? 'ink' : j % 2 ? 'clay' : 'soft';
    var mesh = new THREE.Mesh(slab(+w.toFixed(2), +h.toFixed(2), 0.14), MAT[mat]);
    if (mat !== 'ink') withEdges(mesh, w.toFixed(2) + 'x' + h.toFixed(2) + 'x0.14');
    world.add(mesh);
    pieces.push({ mesh: mesh, w: w, h: h, kind: 'loose', i: j, delay: rand() });
  }
  var N = pieces.length;

  // live dot for the contact layout
  var dot = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 16), MAT.orange);
  var halo = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.26, 40), new THREE.MeshBasicMaterial({ color: 0xff6a00, transparent: true, opacity: 0.5 }));
  world.add(dot); world.add(halo);

  /* ---------- layouts: one target transform per piece ---------- */
  function T(x, y, z, rx, ry, rz, s) { return { x: x, y: y, z: z, rx: rx || 0, ry: ry || 0, rz: rz || 0, s: s == null ? 1 : s }; }

  var L = {};

  // hero: scattered, mostly to the right and behind
  L.hero = pieces.map(function (p) {
    return T(rr(-2, 10), rr(-4.5, 4.5), rr(-8, 1), rr(-1, 1), rr(-1.2, 1.2), rr(-0.6, 0.6), p.kind === 'page' ? 0.7 : 1);
  });

  // services: a tilted turning ring
  L.services = pieces.map(function (p, i) {
    var a = (i / N) * Math.PI * 2;
    return T(Math.cos(a) * 5.2, Math.sin(a) * 1.6 + rr(-0.4, 0.4), Math.sin(a) * 4 - 3, 0.2, -a + Math.PI / 2, 0, 0.75);
  });

  // quote: a bar chart, tallest bar topped in orange
  var heights = [2, 3, 4, 5, 7, 9];
  var slots = [];
  heights.forEach(function (h, b) { for (var k = 0; k < h; k++) slots.push({ b: b, k: k }); });
  L.quote = pieces.map(function (p, i) {
    var s = slots[i % slots.length];
    var over = i >= slots.length;
    return T(-3.4 + s.b * 1.36, -2.4 + s.k * 0.44 + (over ? 7 : 0), over ? -8 : -1.5, 0, -0.35, 0, over ? 0.35 : 0.5);
  });

  // process: the page assembles; loose pieces become a soft field behind
  L.process = pieces.map(function (p, i) {
    if (p.kind === 'page') return T(p.page.x, p.page.y, i === 0 ? 0 : 0.14 + p.page.layer * 0.02, 0, 0, 0, 1);
    var col = i % 8, row = Math.floor(i / 8);
    return T(-8 + col * 2.3, -4 + row * 2.1, -7, 0, 0, 0, 0.6);
  });

  // work: exploded layers, page turned toward the copy
  L.work = pieces.map(function (p, i) {
    if (p.kind === 'page') return T(p.page.x, p.page.y, p.page.layer * 1.1 - 1, 0, 0, 0, 1);
    var a = (i / LOOSE) * Math.PI * 2;
    return T(Math.cos(a) * 6.5, Math.sin(a) * 3.8, -4, rr(-0.5, 0.5), rr(-0.5, 0.5), 0, 0.55);
  });

  // faq: a calm grid wall
  L.faq = pieces.map(function (p, i) {
    var cols = 10, col = i % cols, row = Math.floor(i / cols);
    return T(-9 + col * 2, 4 - row * 1.6, -9, 0, 0, 0, 0.7);
  });

  // contact: the finished page faces you; loose pieces settle in a low ring
  L.contact = pieces.map(function (p, i) {
    if (p.kind === 'page') return T(p.page.x, p.page.y, i === 0 ? 0 : 0.14 + p.page.layer * 0.02, 0, 0, 0, 1);
    var a = (i / LOOSE) * Math.PI * 2;
    return T(Math.cos(a) * 5.5, -3.2 + Math.sin(a) * 0.5, Math.sin(a) * 2.5 - 2, 0, a, 0, 0.5);
  });

  // where the whole group sits per layout (desktop pushes it right, away from the copy)
  var GROUP = {
    hero: { x: 0.5, y: 0, z: 0, ry: 0, rx: 0, s: 1 },
    services: { x: 4.8, y: 1.3, z: -2.5, ry: 0, rx: 0.05, s: 0.9 },
    quote: { x: 3.4, y: 2.5, z: -1, ry: 0.15, rx: 0, s: 0.78 },
    process: { x: 3.4, y: 0.4, z: -2, ry: -0.42, rx: 0.08, s: 0.9 },
    work: { x: 3.8, y: 1.2, z: -3, ry: -0.75, rx: 0.12, s: 0.8 },
    faq: { x: 4, y: 0, z: -3, ry: -0.35, rx: 0, s: 1 },
    contact: { x: 3.2, y: 0.8, z: -1.5, ry: -0.3, rx: 0.06, s: 0.85 }
  };

  /* ---------- scroll anchors ---------- */
  var secs = Array.prototype.slice.call(document.querySelectorAll('[data-bg]'));
  var anchors = [];
  function measure() {
    var vh = window.innerHeight;
    anchors = [];
    secs.forEach(function (s) {
      var k = s.getAttribute('data-bg');
      if (!L[k]) return;
      var r = s.getBoundingClientRect();
      var top = r.top + window.scrollY;
      anchors.push({ y: Math.max(0, top + Math.min(r.height, vh) * 0.5 - vh * 0.5), k: k });
    });
    anchors.sort(function (a, b) { return a.y - b.y; });
  }
  function smooth(x) { return x * x * (3 - 2 * x); }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  /* ---------- sizing ---------- */
  var W = 1, H = 1;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    small = W < 760;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.fov = W / H < 1 ? 34 + (1 - W / H) * 30 : 34;
    camera.updateProjectionMatrix();
    measure();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('load', measure);
  setTimeout(measure, 1200);
  if (window.ScrollTrigger) window.ScrollTrigger.addEventListener('refresh', measure);
  resize();

  /* ---------- pointer ---------- */
  var ptr = { x: 0, y: 0 }, ease = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    ptr.x = e.clientX / W - 0.5; ptr.y = e.clientY / H - 0.5;
  }, { passive: true });

  /* ---------- frame ---------- */
  var clock = new THREE.Clock();
  var ys = window.scrollY;
  var intro = reduce ? 1 : 0;

  function segment(y) {
    var a = anchors[0], b = anchors[0], t = 0;
    if (!a) return { a: 'hero', b: 'hero', t: 0 };
    var last = anchors[anchors.length - 1];
    if (y >= last.y) return { a: last.k, b: last.k, t: 0 };
    for (var i = 0; i < anchors.length - 1; i++) {
      if (y >= anchors[i].y && y < anchors[i + 1].y) {
        a = anchors[i]; b = anchors[i + 1];
        t = (y - a.y) / Math.max(1, b.y - a.y);
        break;
      }
    }
    return { a: a.k, b: b.k, t: t };
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function frame() {
    var dt = Math.min(clock.getDelta(), 0.05);
    var time = clock.elapsedTime;
    ys += (window.scrollY - ys) * (reduce ? 1 : 1 - Math.exp(-dt * 6));
    if (intro < 1) intro = Math.min(1, intro + dt / 1.8);
    var seg = segment(ys);
    var La = L[seg.a], Lb = L[seg.b], Ga = GROUP[seg.a], Gb = GROUP[seg.b];

    ease.x += (ptr.x - ease.x) * 0.04;
    ease.y += (ptr.y - ease.y) * 0.04;

    // group placement; on phones keep it centred and further back
    var gt = smooth(seg.t);
    var gx = small ? 0 : lerp(Ga.x, Gb.x, gt);
    world.position.set(gx, lerp(Ga.y, Gb.y, gt) + (small ? 1.2 : 0), lerp(Ga.z, Gb.z, gt) - (small ? 3 : 0));
    world.rotation.set(lerp(Ga.rx, Gb.rx, gt) + ease.y * 0.12, lerp(Ga.ry, Gb.ry, gt) + ease.x * 0.25 + (seg.a === 'services' || seg.b === 'services' ? time * 0.05 * (seg.a === 'services' ? 1 - gt : gt) : 0), 0);
    var gs = lerp(Ga.s, Gb.s, gt) * (small ? 0.8 : 1);
    world.scale.setScalar(gs);

    var ie = 1 - Math.pow(1 - intro, 3);
    for (var i = 0; i < N; i++) {
      var p = pieces[i], a = La[i], b = Lb[i];
      // stagger: each piece leaves a little earlier or later than its neighbours
      var lt = smooth(clamp01((seg.t - p.delay * 0.35) / 0.65));
      var drift = reduce ? 0 : Math.sin(time * 0.6 + i * 1.7) * 0.08;
      var floaty = seg.a === 'hero' ? (1 - lt) : seg.b === 'hero' ? lt : 0;
      var m = p.mesh;
      m.position.set(
        lerp(a.x, b.x, lt) + floaty * Math.sin(time * 0.3 + i) * 0.25,
        lerp(a.y, b.y, lt) + drift + floaty * Math.cos(time * 0.25 + i * 2) * 0.3,
        lerp(a.z, b.z, lt) - (1 - ie) * 6
      );
      m.rotation.set(
        lerp(a.rx, b.rx, lt) + floaty * time * 0.05,
        lerp(a.ry, b.ry, lt) + floaty * time * 0.07,
        lerp(a.rz, b.rz, lt)
      );
      m.scale.setScalar(Math.max(0.001, lerp(a.s, b.s, lt) * ie));
    }

    // live dot on the contact page
    var live = seg.b === 'contact' ? smooth(clamp01((seg.t - 0.5) * 2)) : seg.a === 'contact' ? 1 : 0;
    dot.visible = halo.visible = live > 0.01;
    dot.position.set(2.75, 1.42, 0.35);
    dot.scale.setScalar(Math.max(0.001, live));
    halo.position.copy(dot.position);
    var pulse = reduce ? 0.5 : (time * 0.8) % 1;
    halo.scale.setScalar(live * (1 + pulse * 2.2));
    halo.material.opacity = 0.5 * (1 - pulse) * live;

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
