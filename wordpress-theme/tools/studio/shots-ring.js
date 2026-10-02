/* The Ace 360 ring, face-on on black (blended with "screen" on the page).
   Orthographic: ring centre radius 1 → 384.6 px of 1000 (= 153.8 in a 400 viewBox). */
(function () {
  var S = STUDIO, T = S.T, C = S.C;
  S.SHOTS['ring-hero'] = function () {
    var s = new T.Scene(); s.background = new T.Color('#000000');
    var c = S.cv(1024, 512), g = c.getContext('2d');
    var gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#fff3e6'); gr.addColorStop(0.45, '#7a4a2a'); gr.addColorStop(0.55, '#140c08'); gr.addColorStop(1, '#000');
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    g.filter = 'blur(8px)'; [[80, 60, 300, 90, '#ffffff'], [600, 40, 260, 70, '#ffd2a8'], [880, 120, 100, 160, '#ff8a3a'], [300, 330, 240, 26, '#ff6a00']].forEach(function (b) { g.fillStyle = b[4]; g.fillRect(b[0], b[1], b[2], b[3]); });
    var et = new T.CanvasTexture(c); et.mapping = T.EquirectangularReflectionMapping; et.encoding = T.sRGBEncoding;
    s.environment = new T.PMREMGenerator(S.R).fromEquirectangular(et).texture;
    s.userData.alpha = true;
    var chrome = new T.MeshPhysicalMaterial({ color: C('#d9d3cc'), metalness: 1, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.25 });
    var ring = new T.Mesh(new T.TorusGeometry(1, 0.12, 96, 360), chrome); s.add(ring);
    // the notch from the logo, on top
    var notch = new T.Mesh(new T.BoxGeometry(0.2, 0.2, 0.2), chrome); notch.position.set(0, 1, 0.02); s.add(notch);
    var key = new T.DirectionalLight(0xffffff, 2.2); key.position.set(-3, 4, 5); s.add(key);
    var warm = new T.PointLight(C('#ff7a1a'), 6, 6, 2); warm.position.set(1.6, -1.4, 1.2); s.add(warm);
    var rim = new T.DirectionalLight(C('#ffb070'), 1.2); rim.position.set(3, -2, -2); s.add(rim);
    var cam = new T.OrthographicCamera(-1.3, 1.3, 1.3, -1.3, 0.1, 20); cam.position.set(0, 0, 6); cam.lookAt(0, 0, 0);
    return [s, cam];
  };
})();
