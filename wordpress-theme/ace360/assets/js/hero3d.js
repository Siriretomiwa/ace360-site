/**
 * ace360 hero: a 360° ring of Delft-style tiles rendered with three.js.
 * - Tiles assemble on load, breathe in a slow wave and tilt toward the pointer.
 * - Scrolling through the hero turns the ring half a revolution and pulls the tiles apart.
 * - Renders only while the hero is on screen; respects prefers-reduced-motion.
 */
(function () {
  'use strict';

  var canvas = document.querySelector('[data-hero-canvas]');
  var hero = document.querySelector('[data-hero]');
  if (!canvas || !hero || typeof window.THREE === 'undefined') return;

  var THREE = window.THREE;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    hero.classList.add('no-webgl');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputEncoding = THREE.sRGBEncoding;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  /* ---------- Delft tile texture, drawn on a canvas ---------- */
  function makeTileTexture() {
    var s = 256;
    var c = document.createElement('canvas');
    c.width = c.height = s;
    var g = c.getContext('2d');
    var blue = '#2440c9';

    // glaze
    var grad = g.createRadialGradient(s * 0.45, s * 0.4, s * 0.1, s / 2, s / 2, s * 0.75);
    grad.addColorStop(0, '#fbfcff');
    grad.addColorStop(1, '#dfe5f4');
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);

    g.strokeStyle = blue;
    g.fillStyle = blue;
    g.lineCap = 'round';

    // frame
    g.lineWidth = 5;
    g.strokeRect(12, 12, s - 24, s - 24);

    // corner motifs (quarter circles, like a traditional "ossekop" corner)
    [[0, 0], [s, 0], [0, s], [s, s]].forEach(function (p) {
      g.beginPath();
      g.arc(p[0], p[1], 34, 0, Math.PI * 2);
      g.fill();
      g.lineWidth = 4;
      g.beginPath();
      g.arc(p[0], p[1], 52, 0, Math.PI * 2);
      g.stroke();
    });

    // central flower: eight petals around a ring
    g.save();
    g.translate(s / 2, s / 2);
    for (var i = 0; i < 8; i++) {
      g.rotate(Math.PI / 4);
      g.beginPath();
      g.ellipse(0, -40, 11, 26, 0, 0, Math.PI * 2);
      g.globalAlpha = i % 2 ? 0.55 : 1;
      g.fill();
    }
    g.globalAlpha = 1;
    g.lineWidth = 6;
    g.beginPath();
    g.arc(0, 0, 16, 0, Math.PI * 2);
    g.stroke();
    g.restore();

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    return tex;
  }

  /* ---------- Ring layout ---------- */
  var COLS = 26;
  var ROWS = 3;
  var RADIUS = 3;
  var SIZE = 0.66;
  var ROW_GAP = 0.74;

  // deterministic pseudo-random so the ring looks the same on every visit
  var seed = 360;
  function rand() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  var tiles = [];
  var accentIndex = -1;
  for (var r = 0; r < ROWS; r++) {
    for (var col = 0; col < COLS; col++) {
      var roll = rand();
      var isAccent = r === 1 && col === 4;
      if (roll < 0.07 && !isAccent) continue; // a few missing tiles keep it from looking machine-made
      var kind = isAccent ? 'accent' : roll < 0.27 ? 'solid' : 'glaze';
      tiles.push({
        theta: (col / COLS) * Math.PI * 2 + (r % 2 ? Math.PI / COLS : 0),
        y: (r - (ROWS - 1) / 2) * ROW_GAP,
        kind: kind,
        spread: 0.5 + rand(),
        spin: (rand() - 0.5) * 2,
        delay: rand() * 0.6 + (col / COLS) * 0.5
      });
    }
  }

  var geo = new THREE.BoxGeometry(SIZE, SIZE, 0.07);
  var glazeMat = new THREE.MeshStandardMaterial({ map: makeTileTexture(), roughness: 0.22, metalness: 0.02 });
  var solidMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(cssVar('--cobalt', '#2440c9')), roughness: 0.3, metalness: 0.35 });
  var accentMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(cssVar('--oranje', '#ff6b1a')), roughness: 0.3, metalness: 0.2, emissive: new THREE.Color('#ff6b1a'), emissiveIntensity: 0.15 });

  function countKind(k) { return tiles.filter(function (t) { return t.kind === k; }).length; }
  var meshes = {
    glaze: new THREE.InstancedMesh(geo, glazeMat, countKind('glaze')),
    solid: new THREE.InstancedMesh(geo, solidMat, countKind('solid')),
    accent: new THREE.InstancedMesh(geo, accentMat, countKind('accent'))
  };
  var counters = { glaze: 0, solid: 0, accent: 0 };
  tiles.forEach(function (t) {
    t.mesh = meshes[t.kind];
    t.slot = counters[t.kind]++;
  });

  var ring = new THREE.Group();
  Object.keys(meshes).forEach(function (k) {
    meshes[k].instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    ring.add(meshes[k]);
  });

  var rig = new THREE.Group(); // positioned per viewport
  var tilt = new THREE.Group(); // pointer tilt
  tilt.add(ring);
  rig.add(tilt);
  scene.add(rig);
  ring.rotation.x = 0.32;
  ring.rotation.z = -0.16;

  // lights
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1a2a80, 0.85));
  var key = new THREE.DirectionalLight(0xffffff, 1.25);
  key.position.set(4, 6, 8);
  scene.add(key);
  var rim = new THREE.PointLight(0xff6b1a, 0.9, 20);
  rim.position.set(-4, -2, 3);
  scene.add(rim);

  /* ---------- Layout per viewport ---------- */
  var width = 1;
  var height = 1;
  function layout() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    var visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
    var visW = visH * camera.aspect;
    var ringW = RADIUS * 2 + SIZE;

    if (width > 1024) {
      // ring sits right of the headline and bleeds off the right edge
      var scale = Math.min((visW * 0.42) / ringW, (visH * 0.75) / ringW);
      rig.scale.setScalar(scale);
      rig.position.set(visW / 2 - ringW * scale * 0.3, visH * 0.08, 0);
    } else {
      // phones and tablets: ring across the top, in the space above the headline
      var copy = hero.querySelector('.hero-copy');
      var space = copy ? copy.offsetTop : height * 0.4;
      var s2 = (visW * (width <= 760 ? 0.92 : 0.6)) / ringW;
      var cy = space * 0.56;
      rig.scale.setScalar(s2);
      rig.position.set(0, (0.5 - cy / height) * visH, 0);
    }
  }

  /* ---------- Pointer and scroll ---------- */
  var pointer = { x: 0, y: 0 };
  var eased = { x: 0, y: 0, p: 0 };
  window.addEventListener('pointermove', function (e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function scrollProgress() {
    var rect = hero.getBoundingClientRect();
    var p = -rect.top / Math.max(rect.height, 1);
    return Math.min(Math.max(p, 0), 1);
  }

  function updateColors() {
    solidMat.color.set(cssVar('--cobalt', '#2440c9'));
    accentMat.color.set(cssVar('--oranje', '#ff6b1a'));
  }

  /* ---------- Frame ---------- */
  var dummy = new THREE.Object3D();
  var clock = new THREE.Clock();
  var spin = 0;
  var start = reduced ? -10 : 0;
  var visible = true;
  var running = false;

  function easeOutBack(x) {
    var c1 = 1.4;
    var c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  function frame() {
    var dt = Math.min(clock.getDelta(), 0.05);
    var time = clock.elapsedTime;
    var elapsed = time - start;

    var p = scrollProgress();
    eased.p += (p - eased.p) * 0.08;
    eased.x += (pointer.x - eased.x) * 0.05;
    eased.y += (pointer.y - eased.y) * 0.05;

    if (!reduced) spin += dt * 0.14;
    ring.rotation.y = spin + eased.p * Math.PI;
    tilt.rotation.x = eased.y * 0.18;
    tilt.rotation.y = eased.x * 0.28;

    for (var i = 0; i < tiles.length; i++) {
      var t = tiles[i];
      var a = Math.min(Math.max((elapsed - t.delay) / 1.1, 0), 1);
      var grow = a <= 0 ? 0.0001 : easeOutBack(a);
      var wave = reduced ? 0 : Math.sin(time * 1.4 + t.theta * 3 + t.y * 2) * 0.06;
      var rad = RADIUS + wave + eased.p * 1.6 * t.spread + (1 - Math.min(a * 1.4, 1)) * 2.5;

      dummy.position.set(Math.sin(t.theta) * rad, t.y * (1 + eased.p * 0.5 * t.spread), Math.cos(t.theta) * rad);
      dummy.rotation.set(eased.p * t.spin * 1.5, t.theta, eased.p * t.spin);
      dummy.scale.setScalar(grow);
      dummy.updateMatrix();
      t.mesh.setMatrixAt(t.slot, dummy.matrix);
    }
    meshes.glaze.instanceMatrix.needsUpdate = true;
    meshes.solid.instanceMatrix.needsUpdate = true;
    meshes.accent.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
    if (visible) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  function run() {
    if (running) return;
    running = true;
    clock.getDelta();
    requestAnimationFrame(frame);
  }

  layout();
  if ('ResizeObserver' in window) {
    new ResizeObserver(layout).observe(hero);
  } else {
    window.addEventListener('resize', layout);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) run();
    }).observe(hero);
  }

  // follow light/dark changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateColors);
  new MutationObserver(updateColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && visible) run();
  });

  run();
})();
