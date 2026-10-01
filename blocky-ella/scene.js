// Blocky Ella: a blocky (Roblox-style) night-time bedroom scene, rendered frame by frame.
// window.renderAt(t) draws the scene at time t (seconds); every pose is a pure function of t,
// so frames can be rendered in any order and the result is always the same.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const W = 1920, H = 1080;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H);
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x141634);
const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 200);

// ---------- helpers ----------
const C = {
  skin: 0x7b4a2c, hair: 0x2e1a10, pj: 0xb9a3ee, star: 0xffd84a, cream: 0xfff3dc,
  wall: 0x3c3f8e, floor: 0x7d6cc0, bed: 0xf2a5c6, wood: 0xb57a4a,
};
const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0, ...opts });
function box(w, h, d, material, x = 0, y = 0, z = 0, parent = scene) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  parent.add(m);
  return m;
}
function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
function drawStar(g, x, y, r, fill) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
    g.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a));
  }
  g.closePath(); g.fillStyle = fill; g.fill();
}
const hex = (n) => '#' + n.toString(16).padStart(6, '0');
const smooth = (a, b, t) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
const lerp = (a, b, k) => a + (b - a) * k;
const lerpV = (a, b, k) => new THREE.Vector3(lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k));

// ---------- textures ----------
const studTex = (base, rep) => canvasTex(128, 128, (g, w) => {
  g.fillStyle = base; g.fillRect(0, 0, w, w);
  g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 3; g.strokeRect(0, 0, w, w);
  const grd = g.createRadialGradient(56, 56, 6, 64, 64, 34);
  grd.addColorStop(0, 'rgba(255,255,255,0.35)'); grd.addColorStop(1, 'rgba(0,0,0,0.12)');
  g.beginPath(); g.arc(64, 64, 32, 0, Math.PI * 2); g.fillStyle = grd; g.fill();
}, rep);
const pjTex = (rep, buttons) => canvasTex(256, 256, (g, w) => {
  g.fillStyle = hex(C.pj); g.fillRect(0, 0, w, w);
  [[50, 60], [190, 40], [120, 150], [40, 210], [210, 200]].forEach(([x, y]) => drawStar(g, x, y, 18, hex(C.star)));
  if (buttons) [70, 128, 186].forEach((y) => { g.beginPath(); g.arc(128, y, 9, 0, 7); g.fillStyle = '#fff6e6'; g.fill(); });
}, rep);

function faceTex(eyesClosed) {
  return canvasTex(512, 512, (g) => {
    g.clearRect(0, 0, 512, 512);
    // rosy cheeks
    for (const x of [112, 400]) {
      const r = g.createRadialGradient(x, 330, 4, x, 330, 62);
      r.addColorStop(0, 'rgba(255,120,140,0.55)'); r.addColorStop(1, 'rgba(255,120,140,0)');
      g.fillStyle = r; g.fillRect(x - 70, 260, 140, 140);
    }
    g.lineCap = 'round';
    // eyebrows
    g.strokeStyle = '#2a140a'; g.lineWidth = 9;
    for (const x of [170, 342]) { g.beginPath(); g.arc(x, 210, 58, 1.2 * Math.PI, 1.8 * Math.PI); g.stroke(); }
    for (const [x, dir] of [[170, -1], [342, 1]]) {
      if (eyesClosed) {
        g.strokeStyle = '#2a140a'; g.lineWidth = 11;
        g.beginPath(); g.arc(x, 250, 40, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
        for (let k = 0; k < 3; k++) { const a = (0.3 + k * 0.2) * Math.PI; g.beginPath();
          g.moveTo(x + 40 * Math.cos(a), 250 + 40 * Math.sin(a)); g.lineTo(x + 54 * Math.cos(a), 250 + 54 * Math.sin(a)); g.stroke(); }
        continue;
      }
      g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(x, 262, 50, 60, 0, 0, 7); g.fill();
      g.fillStyle = '#5a2e12'; g.beginPath(); g.ellipse(x + dir * 2, 268, 40, 50, 0, 0, 7); g.fill();
      g.fillStyle = '#1c0d05'; g.beginPath(); g.ellipse(x + dir * 2, 272, 22, 28, 0, 0, 7); g.fill();
      g.fillStyle = '#ffffff';
      g.beginPath(); g.arc(x - 14, 248, 13, 0, 7); g.fill();
      g.beginPath(); g.arc(x + 14, 290, 6, 0, 7); g.fill();
      g.strokeStyle = '#1c0d05'; g.lineWidth = 8;
      g.beginPath(); g.ellipse(x, 262, 50, 60, 0, 1.05 * Math.PI, 1.95 * Math.PI); g.stroke();
      for (let k = 0; k < 3; k++) { // lashes on the outer corner
        const a = (dir < 0 ? 1.08 + k * 0.1 : 1.92 - k * 0.1) * Math.PI;
        g.beginPath(); g.moveTo(x + 50 * Math.cos(a), 262 + 60 * Math.sin(a));
        g.lineTo(x + 70 * Math.cos(a), 262 + 76 * Math.sin(a)); g.stroke();
      }
    }
    // smile
    g.fillStyle = '#7a2a2a';
    g.beginPath(); g.moveTo(206, 360); g.quadraticCurveTo(256, 430, 306, 360); g.quadraticCurveTo(256, 380, 206, 360); g.fill();
    g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(218, 364); g.quadraticCurveTo(256, 380, 294, 364);
    g.quadraticCurveTo(256, 392, 218, 364); g.fill();
  });
}

// ---------- room ----------
box(34, 0.5, 26, mat(0xffffff, { map: studTex(hex(C.floor), [34, 26]) }), 0, -0.25, 0);
const wallM = mat(C.wall);
// back wall with a window opening (x -6..0, y 4..10)
box(13, 16, 0.6, wallM, -12.5, 8, -9);
box(17, 16, 0.6, wallM, 8.5, 8, -9);
box(6, 4, 0.6, wallM, -3, 2, -9);
box(6, 6, 0.6, wallM, -3, 13, -9);
box(0.6, 16, 26, wallM, -17, 8, 4);
box(0.6, 16, 26, wallM, 17, 8, 4);
// skirting stripe
box(34, 0.6, 0.2, mat(C.cream), 0, 0.3, -8.65);
// window frame + cross bars
const frameM = mat(C.cream);
box(6.8, 0.45, 0.9, frameM, -3, 4, -9); box(6.8, 0.45, 0.9, frameM, -3, 10, -9);
box(0.45, 6.4, 0.9, frameM, -6.2, 7, -9); box(0.45, 6.4, 0.9, frameM, 0.2, 7, -9);
box(0.25, 6, 0.4, frameM, -3, 7, -9); box(6, 0.25, 0.4, frameM, -3, 7, -9);
box(7.4, 0.35, 1.6, frameM, -3, 3.75, -8.5); // sill

// outside: night sky + moon
const skyTex = canvasTex(1024, 512, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, '#0b0d2e'); gr.addColorStop(1, '#2a1f63'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 260; i++) { const r = rnd() * 2 + 0.6; g.globalAlpha = 0.4 + rnd() * 0.6;
    g.beginPath(); g.arc(rnd() * w, rnd() * h * 0.9, r, 0, 7); g.fillStyle = '#fffbe8'; g.fill(); }
  g.globalAlpha = 1;
});
const sky = new THREE.Mesh(new THREE.PlaneGeometry(160, 80), new THREE.MeshBasicMaterial({ map: skyTex }));
sky.position.set(-6, 14, -45); scene.add(sky);
const moonTex = canvasTex(512, 512, (g) => {
  const gl = g.createRadialGradient(256, 256, 60, 256, 256, 250);
  gl.addColorStop(0, 'rgba(255,240,200,0.55)'); gl.addColorStop(1, 'rgba(255,240,200,0)');
  g.fillStyle = gl; g.fillRect(0, 0, 512, 512);
  g.fillStyle = '#fff4d6'; g.beginPath(); g.arc(256, 256, 110, 0, 7); g.fill();
  g.globalCompositeOperation = 'destination-out';
  g.beginPath(); g.arc(306, 226, 100, 0, 7); g.fill();
});
const moon = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshBasicMaterial({ map: moonTex, transparent: true }));
moon.position.set(-7.5, 12.5, -44); scene.add(moon);
// soft twinkling stars just outside the window
const twinkles = [];
for (let i = 0; i < 14; i++) {
  const t = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({
    map: canvasTex(64, 64, (g) => drawStar(g, 32, 32, 30, '#ffe38a')), transparent: true }));
  t.position.set(-16 + ((i * 37) % 22), 6 + ((i * 53) % 16), -40);
  t.userData.phase = i * 1.7; scene.add(t); twinkles.push(t);
}

// bed
const bed = new THREE.Group(); bed.position.set(8.5, 0, -3.5); scene.add(bed);
box(6.4, 1.4, 10, mat(C.wood), 0, 0.7, 0, bed);
box(6, 1, 9.6, mat(0xffffff), 0, 1.9, 0, bed);
box(6.2, 0.5, 6.4, mat(0xffffff, { map: pjTex([3, 3]) }), 0, 2.55, 1.6, bed);
box(4.2, 0.9, 2, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), 0, 2.8, -3.6, bed);
box(6.8, 5, 0.7, mat(C.bed), 0, 2.5, -5.2, bed);
box(1.2, 1.2, 0.3, mat(0xffffff, { emissive: 0xff7aa8, emissiveIntensity: 0.3 }), 0, 3.6, -4.8, bed);
// blocky teddy on the bed
const teddy = new THREE.Group(); teddy.position.set(-1.6, 3.2, -2.4); teddy.rotation.y = 0.5; bed.add(teddy);
const fur = mat(0xa86b3c);
box(1.2, 1.2, 0.9, fur, 0, 0, 0, teddy); box(1, 0.9, 0.9, fur, 0, 1.05, 0, teddy);
box(0.32, 0.32, 0.2, fur, -0.38, 1.6, 0, teddy); box(0.32, 0.32, 0.2, fur, 0.38, 1.6, 0, teddy);
box(0.4, 0.3, 0.2, mat(0xe8c19a), 0, 0.95, 0.5, teddy);
box(0.7, 0.2, 0.25, mat(0xd8323a), 0, 0.62, 0.42, teddy);

// nightstand + glowing moon night-light
box(2.4, 2.6, 2.4, mat(C.wood), 4, 1.3, -7.4);
const nl = box(0.9, 0.9, 0.9, mat(0xfff1b8, { emissive: 0xffc860, emissiveIntensity: 1.6 }), 4, 3.05, -7.4);
const nightLight = new THREE.PointLight(0xffb860, 32, 18, 1.6); nightLight.position.set(4, 3.6, -6.6); scene.add(nightLight);

// round rug + toy blocks (red, yellow, blue like the channel's block scenes)
const rug = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 0.12, 24), mat(0xf4a6c8));
rug.position.set(-1, 0.06, 0.5); rug.receiveShadow = true; scene.add(rug);
[[0xd8323a, 0], [0xf5c518, 1], [0x2f6fd8, 2]].forEach(([c, i]) => box(1.1, 1.1, 1.1, mat(c), 3.2, 0.55 + i * 1.1, 2.8).rotation.y = i * 0.25);
box(1.1, 1.1, 1.1, mat(0x3fbf6a), -5.5, 0.55, 3.5).rotation.y = 0.6;

// framed star picture on the wall
box(3, 3, 0.2, mat(C.cream), 9, 9.5, -8.6);
box(2.4, 2.4, 0.22, mat(0xffffff, { map: canvasTex(128, 128, (g) => {
  g.fillStyle = '#5b4bb0'; g.fillRect(0, 0, 128, 128); drawStar(g, 64, 64, 46, '#ffd84a'); }) }), 9, 9.5, -8.5);

// ---------- blocky Ella ----------
const ella = new THREE.Group(); scene.add(ella);
const body = new THREE.Group(); ella.add(body);
const pjM = mat(0xffffff, { map: pjTex([1, 1], false) });
const pjFront = mat(0xffffff, { map: pjTex([1, 1], true) });
const skinM = mat(C.skin, { roughness: 0.6 });
const legs = [-0.48, 0.48].map((x) => {
  const pivot = new THREE.Group(); pivot.position.set(x, 2, 0); body.add(pivot);
  box(0.92, 1.7, 0.92, pjM, 0, -0.85, 0, pivot);
  box(0.94, 0.32, 1.02, mat(0xffffff), 0, -1.84, 0.04, pivot);
  return pivot;
});
const torso = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2, 0.95), [pjM, pjM, pjM, pjM, pjFront, pjM]);
torso.position.y = 3; torso.castShadow = true; body.add(torso);
const arms = [-1.4, 1.4].map((x) => {
  const pivot = new THREE.Group(); pivot.position.set(x, 3.85, 0); body.add(pivot);
  box(0.86, 1.45, 0.86, pjM, 0, -0.62, 0, pivot);
  box(0.8, 0.55, 0.8, skinM, 0, -1.6, 0, pivot);
  return pivot;
});
const neck = new THREE.Group(); neck.position.y = 4.05; body.add(neck);
const head = new THREE.Mesh(new RoundedBoxGeometry(1.45, 1.35, 1.3, 4, 0.32), skinM);
head.position.y = 0.72; head.castShadow = true; neck.add(head);
const faceOpen = faceTex(false), faceClosed = faceTex(true);
const faceMat = new THREE.MeshStandardMaterial({ map: faceOpen, transparent: true, roughness: 0.6 });
const face = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), faceMat);
face.position.set(0, 0.68, 0.655); neck.add(face);
// hair: cap, braids at the front, two curly puffs with white bows, beads
const hairM = mat(C.hair, { roughness: 0.95, flatShading: true });
const cap = new THREE.Mesh(new RoundedBoxGeometry(1.56, 0.62, 1.42, 3, 0.25), hairM);
cap.position.set(0, 1.27, -0.04); cap.castShadow = true; neck.add(cap);
box(1.56, 0.9, 0.35, hairM, 0, 0.9, -0.55, neck);
for (let i = -2; i <= 2; i++) box(0.12, 0.08, 0.5, hairM, i * 0.26, 1.58, 0.35, neck);
[[-0.86, 1], [0.86, -1]].forEach(([x, side]) => {
  const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 1), hairM);
  puff.position.set(x, 1.62, -0.15); puff.castShadow = true; neck.add(puff);
  const bow = new THREE.Group(); bow.position.set(x * 1.02, 1.42, 0.38); bow.rotation.set(-0.2, -side * 0.35, side * 0.2); neck.add(bow);
  const bowM = mat(0xffffff, { roughness: 0.4 });
  box(0.5, 0.42, 0.12, bowM, -0.27, 0.02, 0, bow).rotation.z = 0.3;
  box(0.5, 0.42, 0.12, bowM, 0.27, 0.02, 0, bow).rotation.z = -0.3;
  box(0.2, 0.22, 0.18, bowM, 0, 0.02, 0.03, bow);
});
[0xff8fc0, 0xffd84a, 0xffffff].forEach((c, i) => {
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), mat(c, { roughness: 0.3 }));
  b.position.set(0.72, 1.05 - i * 0.15, 0.42); neck.add(b);
});

// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0x8c90ff, 0x2a1f4a, 1.1));
const moonLight = new THREE.DirectionalLight(0xc4ccff, 1.6);
moonLight.position.set(-8, 16, -20); moonLight.target.position.set(-2, 0, 0); scene.add(moonLight, moonLight.target);
moonLight.castShadow = true; moonLight.shadow.mapSize.set(1024, 1024);
Object.assign(moonLight.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 });
moonLight.shadow.bias = -0.0008;
const fill = new THREE.DirectionalLight(0xffe2c8, 0.9); fill.position.set(4, 10, 18); scene.add(fill);

// ---------- timeline ----------
const BPM = 72, SWAY = 2 * 60 / BPM;
const START = [0, 0, 1.5], WINDOW = [-3, 0, -6.3];
const angWalk = Math.atan2(WINDOW[0] - START[0], WINDOW[2] - START[2]);

function camAt(t) {
  const keys = [ // [time, position, target]
    [0, [0, 8, 24], [0, 3.5, -2]],
    [7, [3, 6.5, 14], [-1, 3.5, -3]],
    [10, [3.2, 6.4, 7], [-4, 6.8, -12]],
    [15, [2.6, 6.4, 6.2], [-4, 7, -12]],
    [19, [-1, 5.6, 2.2], [-3, 4.4, -6.3]],
    [40, [-0.2, 5.4, 0.8], [-3, 4.6, -6.3]],
  ];
  let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
  const [t0, p0, l0] = keys[i], [t1, p1, l1] = keys[i + 1];
  const k = smooth(t0, t1, t);
  camera.position.copy(lerpV(p0, p1, k));
  camera.lookAt(lerpV(l0, l1, k));
}

function poseAt(t) {
  // defaults
  body.position.set(0, 0, 0); body.rotation.set(0, 0, 0);
  legs.forEach((l) => l.rotation.set(0, 0, 0));
  arms.forEach((a) => a.rotation.set(0, 0, 0));
  neck.rotation.set(0, 0, 0);
  let blink = (t % 3.7) < 0.14;
  const breathe = 0.03 * Math.sin(t * 2.2);
  torso.scale.set(1, 1 + breathe * 0.3, 1);

  // position + facing
  const walkK = smooth(3, 8, t);
  ella.position.copy(lerpV(START, WINDOW, walkK));
  let yaw = 0;
  if (t < 3) yaw = 0;
  else if (t < 8) yaw = lerp(0, angWalk, smooth(3, 3.8, t));
  if (t >= 7.4) yaw = lerp(angWalk, -Math.PI, smooth(7.4, 8.6, t));
  if (t >= 17) yaw = lerp(-Math.PI, 0, smooth(17, 19, t));
  ella.rotation.y = yaw;

  // hello wave at the start
  if (t < 3) {
    const k = smooth(0.3, 0.9, t) * (1 - smooth(2.4, 3, t));
    arms[0].rotation.z = -2.5 * k + 0.25 * k * Math.sin(t * 5);
  }
  // walk cycle
  const walking = smooth(3, 3.5, t) * (1 - smooth(7.6, 8.2, t));
  if (walking > 0) {
    const s = Math.sin(t * 2 * Math.PI * 1.5);
    legs[0].rotation.x = 0.6 * s * walking; legs[1].rotation.x = -0.6 * s * walking;
    arms[0].rotation.x = -0.5 * s * walking; arms[1].rotation.x = 0.5 * s * walking;
    body.position.y = 0.08 * Math.abs(s) * walking;
  }
  // looking up at the moon, then waving to it
  if (t > 8 && t < 19) neck.rotation.x = -0.3 * smooth(8.5, 10, t) * (1 - smooth(16.5, 17.5, t));
  if (t > 13 && t < 17.5) {
    const k = smooth(13.2, 13.9, t) * (1 - smooth(16.6, 17.3, t));
    arms[1].rotation.z = 2.5 * k + 0.25 * k * Math.sin(t * 5);
  }
  // chorus sway to the beat, sleepy eyes on "Close your sleepy eyes"
  if (t > 18.5) {
    const k = smooth(18.5, 20, t);
    const ph = (t - 13.333) / SWAY * 2 * Math.PI;
    body.rotation.z = 0.07 * Math.sin(ph) * k;
    body.position.y = 0.06 * Math.abs(Math.sin(ph)) * k;
    arms[0].rotation.z = -0.25 * k - 0.12 * Math.sin(ph) * k;
    arms[1].rotation.z = 0.25 * k - 0.12 * Math.sin(ph) * k;
    neck.rotation.z = 0.08 * Math.sin(ph) * k;
    const sleepy = smooth(26.6, 27.4, t) * (1 - smooth(33, 33.6, t));
    if (sleepy > 0.5) blink = true;
    neck.rotation.x = 0.15 * sleepy;
    // hug yourself while sleepy
    arms[0].rotation.x = -1.2 * sleepy; arms[1].rotation.x = -1.2 * sleepy;
    arms[0].rotation.z += 0.5 * sleepy; arms[1].rotation.z -= 0.5 * sleepy;
    // goodbye wave
    const bye = smooth(36.2, 36.9, t);
    if (bye > 0) arms[0].rotation.z = lerp(arms[0].rotation.z, -2.5 + 0.25 * Math.sin(t * 5), bye);
  }
  faceMat.map = blink ? faceClosed : faceOpen;
}

window.renderAt = (t) => {
  poseAt(t);
  camAt(t);
  // keep the moon framed in the upper-right pane from whatever angle the camera is at
  const aim = new THREE.Vector3(-1.6, 8.2, -9).sub(camera.position);
  moon.position.copy(camera.position).addScaledVector(aim, (-44 - camera.position.z) / aim.z);
  twinkles.forEach((s) => { s.material.opacity = 0.55 + 0.45 * Math.sin(t * 1.3 + s.userData.phase); });
  nl.material.emissiveIntensity = 1.5 + 0.1 * Math.sin(t * 0.8);
  renderer.render(scene, camera);
};
window.sceneReady = true;
