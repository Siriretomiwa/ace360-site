/* Product photo studio: builds small three.js scenes and returns JPEG data URLs. */
(function () {
  var T = THREE;
  var R = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  R.outputEncoding = T.sRGBEncoding;
  R.toneMapping = T.ACESFilmicToneMapping;
  R.toneMappingExposure = 0.92;
  R.shadowMap.enabled = true;
  R.shadowMap.type = T.PCFSoftShadowMap;
  R.setPixelRatio(1);
  document.body.appendChild(R.domElement);
  var pmrem = new T.PMREMGenerator(R);

  function C(hex) { return new T.Color(hex).convertSRGBToLinear(); }
  function cv(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function tex(c, rep) { var t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep, rep); } return t; }
  var SANS = '"Inter", system-ui, sans-serif', SERIF = 'Georgia, "Times New Roman", serif';
  function rnd(seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  /* ---------- environment and stage ---------- */
  function envMap(warm, bright) {
    var c = cv(1024, 512), g = c.getContext('2d');
    var gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.48, warm ? '#f3ece4' : '#eceef1'); gr.addColorStop(0.55, bright ? '#e8e2da' : '#9a9aa0'); gr.addColorStop(1, bright ? '#bdb6ac' : '#3a3a40');
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    g.filter = 'blur(10px)';
    [[120, 80, 260, 140, '#ffffff'], [520, 60, 220, 110, '#ffffff'], [820, 120, 140, 160, warm ? '#ffe2c4' : '#f4f6ff'], [300, 290, 200, 30, '#ffffff']].forEach(function (b) { g.fillStyle = b[4]; g.fillRect(b[0], b[1], b[2], b[3]); });
    var t = new T.CanvasTexture(c); t.mapping = T.EquirectangularReflectionMapping; t.encoding = T.sRGBEncoding;
    return pmrem.fromEquirectangular(t).texture;
  }
  var ENV = { cool: null, warm: null, bright: null };

  function stage(o) {
    o = o || {};
    var s = new T.Scene();
    var bg = new T.Color(o.bg || '#f2efe9');
    // seamless backdrop: the exact brand colour, with soft contact shadows on an invisible floor
    s.background = new T.Color(o.bg || '#f2efe9');
    s.environment = o.bright ? (ENV.bright || (ENV.bright = envMap(true, true))) : o.warm ? (ENV.warm || (ENV.warm = envMap(true))) : (ENV.cool || (ENV.cool = envMap(false)));
    var floorMat = o.floorMat || new T.ShadowMaterial({ opacity: o.shadow == null ? 0.32 : o.shadow, color: new T.Color(o.shadowColor || '#2a1a10') });
    var floor = new T.Mesh(new T.PlaneGeometry(80, 80), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; s.add(floor);
    if (o.floorMat) s.fog = new T.Fog(new T.Color(o.bg), o.fogNear || 9, o.fogFar || 22);
    var hemi = new T.HemisphereLight(0xffffff, C(o.ground || '#d8d2c8'), o.hemi == null ? 0.45 : o.hemi); s.add(hemi);
    var key = new T.DirectionalLight(C(o.keyColor || '#ffffff'), o.key == null ? 1.5 : o.key);
    var kp = o.keyPos || [-4, 7, 4]; key.position.set(kp[0], kp[1], kp[2]);
    key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    var sc = o.shadowSize || 4; key.shadow.camera.left = -sc; key.shadow.camera.right = sc; key.shadow.camera.top = sc; key.shadow.camera.bottom = -sc;
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 30; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 4;
    s.add(key);
    var rim = new T.DirectionalLight(0xffffff, o.rim == null ? 0.6 : o.rim); rim.position.set(5, 3, -4); s.add(rim);
    s.userData = { key: key, floor: floor };
    return s;
  }
  function camera(w, h, pos, look, fov) {
    var c = new T.PerspectiveCamera(fov || 30, w / h, 0.05, 100);
    c.position.set(pos[0], pos[1], pos[2]); c.lookAt(look[0], look[1], look[2]);
    return c;
  }
  function shoot(scene, cam, w, h, q) {
    R.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
    R.render(scene, cam);
    return R.domElement.toDataURL('image/jpeg', q || 0.86);
  }

  /* ---------- materials ---------- */
  function glass(color, o) {
    o = o || {};
    return new T.MeshPhysicalMaterial({ color: C(color || '#ffffff'), metalness: 0, roughness: o.rough == null ? 0.06 : o.rough, transmission: o.trans == null ? 0.96 : o.trans, thickness: o.thick || 0.25, ior: 1.5, envMapIntensity: 1.2, clearcoat: 1, clearcoatRoughness: 0.05, transparent: false, attenuationColor: C(o.att || color || '#ffffff'), attenuationDistance: o.attD || 1.2 });
  }
  function plastic(color, rough) { return new T.MeshPhysicalMaterial({ color: C(color), roughness: rough == null ? 0.3 : rough, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.2 }); }
  function metal(color, rough) { return new T.MeshStandardMaterial({ color: C(color), roughness: rough == null ? 0.22 : rough, metalness: 1 }); }
  function matte(color, rough) { return new T.MeshStandardMaterial({ color: C(color), roughness: rough == null ? 0.85 : rough, metalness: 0 }); }
  function textured(c, rough, extra) { var m = new T.MeshStandardMaterial(Object.assign({ map: tex(c), roughness: rough == null ? 0.6 : rough, metalness: 0 }, extra || {})); return m; }
  function shadowy(m) { m.castShadow = true; m.receiveShadow = true; return m; }
  function mesh(g, m) { return shadowy(new T.Mesh(g, m)); }

  /* ---------- labels ---------- */
  // label texture: wraps around a cylinder; the printed panel sits in the middle (u = 0.5 faces the camera)
  function label(o) {
    var w = 2048, h = o.h || 900, c = cv(w, h), g = c.getContext('2d');
    g.fillStyle = o.bg || '#ffffff'; g.fillRect(0, 0, w, h);
    var cx = w / 2, ink = o.ink || '#1a1a1a';
    g.textAlign = 'center'; g.fillStyle = ink;
    if (o.brand) { g.font = (o.brandWeight || 400) + ' ' + (o.brandSize || 120) + 'px ' + (o.brandFont || SERIF); g.fillText(o.brand, cx, h * (o.brandY || 0.3)); }
    if (o.rule) { g.fillStyle = o.accent || ink; g.fillRect(cx - 60, h * 0.37, 120, 6); g.fillStyle = ink; }
    (o.lines || []).forEach(function (l, i) { g.font = (l[2] || 500) + ' ' + (l[1] || 60) + 'px ' + (l[3] || SANS); g.fillStyle = l[4] || ink; g.fillText(l[0], cx, h * (o.y0 || 0.5) + i * (o.gap || 90)); });
    if (o.foot) { g.font = '500 44px ' + SANS; g.fillStyle = o.footInk || ink; g.globalAlpha = 0.7; g.fillText(o.foot, cx, h * 0.9); g.globalAlpha = 1; }
    return tex(c);
  }
  function labelBand(r, hgt, y, map, rough) {
    var m = mesh(new T.CylinderGeometry(r, r, hgt, 96, 1, true, Math.PI, Math.PI * 2), new T.MeshStandardMaterial({ map: map, roughness: rough == null ? 0.45 : rough, metalness: 0 }));
    m.position.y = y; return m;
  }

  /* ---------- containers ---------- */
  function latheMesh(pts, m, segs) { return mesh(new T.LatheGeometry(pts.map(function (p) { return new T.Vector2(p[0], p[1]); }), segs || 96), m); }
  // a bottle: body radius r, body height h, shoulder curve to a neck
  function bottle(o) {
    var r = o.r, h = o.h, nr = o.neck || r * 0.32, nh = o.neckH || h * 0.12, sh = o.shoulder || r * 0.6;
    var pts = [[0, 0], [r * 0.9, 0], [r, r * 0.08], [r, h - sh]];
    for (var i = 1; i <= 8; i++) { var a = i / 8 * Math.PI / 2; pts.push([nr + (r - nr) * Math.cos(a), h - sh + sh * Math.sin(a)]); }
    pts.push([nr, h + nh], [nr * 0.9, h + nh], [0, h + nh]);
    var g = new T.Group();
    var body = latheMesh(pts, o.mat); g.add(body);
    if (o.liquid) { var lp = pts.slice(0, 4).map(function (p) { return [p[0] * 0.9, p[1] * 0.98 + 0.01]; }); lp[3][1] = (h - sh) * o.liquidFill; lp.push([0, lp[3][1]]); g.add(latheMesh(lp, o.liquid)); }
    if (o.label) g.add(labelBand(r * 1.004, o.labelH || h * 0.5, o.labelY || h * 0.42, o.label));
    var top = h + nh;
    if (o.cap === 'pump') {
      g.add(mesh(new T.CylinderGeometry(nr * 1.25, nr * 1.25, nh * 1.5, 48), o.capMat).translateY(top + nh * 0.5));
      g.add(mesh(new T.CylinderGeometry(nr * 0.35, nr * 0.35, nh * 2.2, 24), o.capMat).translateY(top + nh * 2.2));
      var head = mesh(new T.BoxGeometry(nr * 2.6, nh * 0.7, nr * 0.9), o.capMat); head.position.set(nr * 0.7, top + nh * 3.3, 0); g.add(head);
    } else if (o.cap === 'dropper') {
      g.add(mesh(new T.CylinderGeometry(nr * 1.2, nr * 1.2, nh * 1.6, 48), o.capMat).translateY(top + nh * 0.6));
      g.add(latheMesh([[0, 0], [nr * 0.95, 0], [nr * 1.05, nh * 0.6], [nr * 0.95, nh * 2.2], [nr * 0.5, nh * 2.8], [0, nh * 2.9]], o.bulbMat || matte('#1a1a1a', 0.5)).translateY(top + nh * 1.3));
    } else if (o.cap) {
      g.add(mesh(new T.CylinderGeometry(nr * 1.3, nr * 1.3, o.capH || nh * 2, 48), o.capMat).translateY(top + (o.capH || nh * 2) / 2 - nh * 0.3));
    }
    return g;
  }
  function jar(o) {
    var r = o.r, h = o.h, g = new T.Group();
    g.add(latheMesh([[0, 0], [r * 0.92, 0], [r, r * 0.1], [r, h * 0.92], [r * 0.95, h], [0, h]], o.mat));
    var lh = o.lidH || h * 0.42;
    g.add(latheMesh([[0, 0], [r * 1.02, 0], [r * 1.04, lh * 0.15], [r * 1.04, lh * 0.88], [r * 1.0, lh], [0, lh]], o.lidMat).translateY(h * 0.95));
    if (o.label) g.add(labelBand(r * 1.004, h * 0.6, h * 0.45, o.label));
    if (o.lidLabel) { var d = mesh(new T.CircleGeometry(r * 0.8, 64), new T.MeshStandardMaterial({ map: o.lidLabel, roughness: 0.4 })); d.rotation.x = -Math.PI / 2; d.position.y = h * 0.95 + lh + 0.002; g.add(d); }
    return g;
  }
  function tube(o) {
    // squeeze tube lying on its back: a cylinder whose far end flattens into a crimp
    var r = o.r, L = o.len, segs = 64, g = new T.CylinderGeometry(r, r, L, segs, 40, false);
    var p = g.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var y = p.getY(i), t = (y + L / 2) / L; // 0 at cap end, 1 at crimp
      var f = Math.max(0, (t - 0.45) / 0.55); f = f * f * (3 - 2 * f);
      p.setX(i, p.getX(i) * (1 + f * 0.35)); p.setZ(i, p.getZ(i) * (1 - f * 0.93));
    }
    g.computeVertexNormals();
    var grp = new T.Group();
    var body = mesh(g, o.mat); grp.add(body);
    var cap = mesh(new T.CylinderGeometry(r * 0.75, r * 0.82, L * 0.16, 48), o.capMat); cap.position.y = -L / 2 - L * 0.08; grp.add(cap);
    return grp;
  }
  function roundBox(w, h, d, r, m) {
    var s = new T.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    var g = new T.ExtrudeGeometry(s, { depth: d - r * 0.6, bevelEnabled: true, bevelThickness: r * 0.3, bevelSize: r * 0.3, bevelSegments: 4, curveSegments: 12 });
    g.translate(0, 0, -(d - r * 0.6) / 2); g.computeVertexNormals();
    return mesh(g, m);
  }
  // box with a texture on the front face only (+z)
  function printedBox(w, h, d, frontMap, sideMat, r) {
    var g = new T.Group();
    g.add(roundBox(w, h, d, r || 0.04, sideMat));
    var f = new T.Mesh(new T.PlaneGeometry(w - (r || 0.04) * 1.2, h - (r || 0.04) * 1.2), new T.MeshStandardMaterial({ map: frontMap, roughness: 0.55 }));
    f.position.z = d / 2 + 0.002; g.add(f);
    return g;
  }

  /* ---------- noise helpers ---------- */
  function hash(x, y, z) { var n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return n - Math.floor(n); }
  function vnoise(x, y, z) {
    var xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
    function s(t) { return t * t * (3 - 2 * t); }
    var u = s(xf), v = s(yf), w = s(zf), r = 0;
    var c000 = hash(xi, yi, zi), c100 = hash(xi + 1, yi, zi), c010 = hash(xi, yi + 1, zi), c110 = hash(xi + 1, yi + 1, zi);
    var c001 = hash(xi, yi, zi + 1), c101 = hash(xi + 1, yi, zi + 1), c011 = hash(xi, yi + 1, zi + 1), c111 = hash(xi + 1, yi + 1, zi + 1);
    var x00 = c000 + (c100 - c000) * u, x10 = c010 + (c110 - c010) * u, x01 = c001 + (c101 - c001) * u, x11 = c011 + (c111 - c011) * u;
    var y0 = x00 + (x10 - x00) * v, y1 = x01 + (x11 - x01) * v;
    return y0 + (y1 - y0) * w;
  }
  function fbm(x, y, z) { return vnoise(x, y, z) * 0.55 + vnoise(x * 2.1, y * 2.1, z * 2.1) * 0.28 + vnoise(x * 4.3, y * 4.3, z * 4.3) * 0.17; }
  function displace(g, amt, freq, fn) {
    var p = g.attributes.position, n = new T.Vector3();
    g.computeVertexNormals(); var nr = g.attributes.normal;
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      var d = (fbm(x * freq + 3, y * freq + 7, z * freq + 11) - 0.5) * amt + (fn ? fn(x, y, z) : 0);
      n.set(nr.getX(i), nr.getY(i), nr.getZ(i));
      p.setXYZ(i, x + n.x * d, y + n.y * d, z + n.z * d);
    }
    g.computeVertexNormals();
    return g;
  }

  /* ---------- surfaces painted on canvas ---------- */
  function speckle(c, n, colors, rmin, rmax, seed) {
    var g = c.getContext('2d'), r = rnd(seed || 7);
    for (var i = 0; i < n; i++) { g.fillStyle = colors[Math.floor(r() * colors.length)]; g.globalAlpha = 0.25 + r() * 0.6; g.beginPath(); g.arc(r() * c.width, r() * c.height, rmin + r() * (rmax - rmin), 0, Math.PI * 2); g.fill(); }
    g.globalAlpha = 1;
  }
  function woodTex(base, dark, w, h, seed) {
    var c = cv(w || 1024, h || 1024), g = c.getContext('2d'), r = rnd(seed || 3);
    g.fillStyle = base; g.fillRect(0, 0, c.width, c.height);
    for (var i = 0; i < 260; i++) { var y = r() * c.height; g.strokeStyle = dark; g.globalAlpha = 0.05 + r() * 0.12; g.lineWidth = 1 + r() * 3; g.beginPath(); g.moveTo(0, y); for (var x = 0; x <= c.width; x += 32) g.lineTo(x, y + Math.sin(x * 0.01 + i) * 6 + (r() - 0.5) * 2); g.stroke(); }
    g.globalAlpha = 1; return c;
  }
  function linenTex(base, seed) {
    var c = cv(1024, 1024), g = c.getContext('2d'), r = rnd(seed || 5);
    g.fillStyle = base; g.fillRect(0, 0, 1024, 1024);
    for (var i = 0; i < 1024; i += 2) { g.globalAlpha = 0.04 + r() * 0.05; g.fillStyle = r() > 0.5 ? '#ffffff' : '#000000'; g.fillRect(0, i, 1024, 1); g.fillRect(i, 0, 1, 1024); }
    g.globalAlpha = 1; return c;
  }

  window.STUDIO = { T: T, R: R, C: C, cv: cv, tex: tex, SANS: SANS, SERIF: SERIF, rnd: rnd, stage: stage, camera: camera, shoot: shoot,
    glass: glass, plastic: plastic, metal: metal, matte: matte, textured: textured, mesh: mesh, label: label, labelBand: labelBand,
    latheMesh: latheMesh, bottle: bottle, jar: jar, tube: tube, roundBox: roundBox, printedBox: printedBox,
    fbm: fbm, displace: displace, speckle: speckle, woodTex: woodTex, linenTex: linenTex, SHOTS: {} };
})();
