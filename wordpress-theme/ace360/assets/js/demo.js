/**
 * Ace 360 demo film: one project from first call to launch in 30 seconds.
 *
 * The scenes in template-parts/demo.php are animated by a single paused GSAP
 * timeline, so the player can play, pause, scrub and jump to chapters.
 * Chapters match the five process steps; the steps list next to the film
 * jumps to a chapter on click, and scrolling through the steps plays them.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-demo]');
  var gsap = window.gsap;
  if (!root || !gsap) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = root.querySelector('[data-demo-canvas]');
  var frame = root.querySelector('.demo-frame');
  var scenes = canvas.querySelectorAll('.dm-scene');
  var q = function (s) { return canvas.querySelectorAll(s); };
  var one = function (s) { return canvas.querySelector(s); };

  /* ---------- scale the 1280×720 canvas to the frame ---------- */
  function fit() { canvas.style.setProperty('--s', frame.clientWidth / 1280); }
  fit();
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(frame);
  else window.addEventListener('resize', fit);

  /* ---------- timeline ---------- */
  var CH = [0, 5, 10, 16, 23]; // chapter start times (s)
  var TOTAL = 30;
  var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

  // Scene visibility follows the playhead (see sync()), so seeking always shows the right scene.
  function sceneIn() {}
  function showScene(i) {
    scenes.forEach(function (sc, j) { sc.style.visibility = j === i ? 'visible' : 'hidden'; });
  }

  // 1 · First call (0–5)
  sceneIn(0, 0);
  tl.from(one('.dm-call'), { y: 40, autoAlpha: 0, duration: 0.8 }, 0.05)
    .from(one('.dm-notes'), { x: 60, autoAlpha: 0, duration: 0.8 }, 0.35)
    .from(q('.dm-note'), { x: 20, autoAlpha: 0, duration: 0.5, stagger: 0.75 }, 1.1);
  var timer = { s: 0 };
  tl.to(timer, {
    s: 1200, duration: 4.6, ease: 'none',
    onUpdate: function () {
      var t = Math.round(timer.s), m = Math.floor(t / 60), s = t % 60;
      var el = one('[data-demo-timer]');
      if (el) el.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
  }, 0.2);
  q('.dm-wave i').forEach(function (bar, i) {
    tl.to(bar, { scaleY: 1, duration: 0.25, repeat: 17, yoyo: true, ease: 'sine.inOut' }, 0.2 + (i % 7) * 0.06);
  });

  // 2 · Quote (5–10)
  sceneIn(1, CH[1]);
  tl.from(one('.dm-quote'), { y: 70, rotation: -2, autoAlpha: 0, duration: 0.9 }, CH[1] + 0.05)
    .from(q('.dm-q-row, .dm-q-total, .dm-q-date'), { autoAlpha: 0, y: 10, duration: 0.45, stagger: 0.35 }, CH[1] + 0.7)
    .from(q('.dm-q-cols > div'), { autoAlpha: 0, y: 10, duration: 0.45, stagger: 0.25 }, CH[1] + 2.6)
    .from(one('.dm-stamp'), { scale: 2.4, autoAlpha: 0, rotation: -30, duration: 0.5, ease: 'back.out(2)' }, CH[1] + 3.6);

  // 3 · Design (10–16)
  sceneIn(2, CH[2]);
  tl.from(one('.dm-design'), { y: 40, autoAlpha: 0, duration: 0.7 }, CH[2] + 0.05)
    .from(q('.dm-wire span'), { scaleX: 0, autoAlpha: 0, duration: 0.5, stagger: 0.14 }, CH[2] + 0.5)
    .to(one('.dm-design-done'), { autoAlpha: 1, duration: 0.8, ease: 'power2.inOut' }, CH[2] + 2.2)
    .from(q('.d-hero, .d-img, .d-cards span'), { y: 16, duration: 0.6, stagger: 0.1 }, CH[2] + 2.2)
    .from(one('.dm-pin.p1'), { scale: 0, autoAlpha: 0, duration: 0.45, ease: 'back.out(2)' }, CH[2] + 3.1)
    .to(one('.d-img'), { scale: 1.06, duration: 0.6, transformOrigin: '50% 50%' }, CH[2] + 3.7)
    .from(one('.dm-pin.p2'), { scale: 0, autoAlpha: 0, duration: 0.45, ease: 'back.out(2)' }, CH[2] + 3.9)
    .from(q('.dm-rounds span'), { y: 20, autoAlpha: 0, duration: 0.45, stagger: 0.5 }, CH[2] + 4.5);

  // 4 · Build (16–23)
  sceneIn(3, CH[3]);
  tl.from(one('.dm-code'), { x: -50, autoAlpha: 0, duration: 0.7 }, CH[3] + 0.05)
    .from(one('.dm-staging'), { x: 50, autoAlpha: 0, duration: 0.7 }, CH[3] + 0.2)
    .to(q('.dm-code pre span'), { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'steps(18)', stagger: 0.6 }, CH[3] + 0.8)
    .from(q('.dm-staging .b-nav, .dm-staging .b-hero, .dm-staging .b-form, .dm-staging .b-cards'), { y: 30, autoAlpha: 0, duration: 0.6, stagger: 1 }, CH[3] + 1.1)
    .from(q('.dm-checks span'), { y: 20, autoAlpha: 0, duration: 0.4, stagger: 0.45 }, CH[3] + 4.3);

  // 5 · Launch (23–30)
  sceneIn(4, CH[4]);
  tl.from(one('.dm-live'), { y: 40, autoAlpha: 0, duration: 0.7 }, CH[4] + 0.05)
    .from(one('.dm-live-pill'), { scale: 0, autoAlpha: 0, duration: 0.4, ease: 'back.out(3)' }, CH[4] + 1.2)
    .call(function () { setUrl(false); }, null, CH[4] + 0.01)
    .call(function () { setUrl(true); }, null, CH[4] + 1.15)
    .from(q('.dm-score'), { y: 30, autoAlpha: 0, duration: 0.5, stagger: 0.18 }, CH[4] + 1.6);
  q('.dm-score').forEach(function (el, i) {
    var target = parseInt(el.getAttribute('data-score'), 10);
    var arc = el.querySelector('.arc'), num = el.querySelector('b'), o = { v: 0 };
    tl.to(o, {
      v: target, duration: 1.4, ease: 'power2.out',
      onUpdate: function () { num.textContent = Math.round(o.v); arc.style.strokeDashoffset = 170 - (170 * o.v) / 100; }
    }, CH[4] + 1.9 + i * 0.18);
  });
  tl.from(one('.dm-toast.t1'), { y: 40, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.6)' }, CH[4] + 3.6)
    .from(one('.dm-toast.t2'), { y: 40, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.6)' }, CH[4] + 4.6)
    .to({}, { duration: 0.01 }, TOTAL);

  function setUrl(live) {
    var u = one('[data-demo-url]');
    if (u) u.textContent = live ? 'yourbrand.nl' : 'staging.yourbrand.nl';
  }

  /* ---------- player UI ---------- */
  var playBtn = root.querySelector('[data-demo-play]');
  var bigPlay = root.querySelector('[data-demo-bigplay]');
  var chBtns = root.querySelectorAll('[data-demo-chapter]');
  var timeEl = root.querySelector('[data-demo-time]');
  var labelEl = root.querySelector('[data-demo-label]');
  var steps = document.querySelectorAll('.steps .step');
  var stopAt = null; // when playing a single chapter
  var current = -1;

  function chapterAt(t) {
    for (var i = CH.length - 1; i >= 0; i--) if (t >= CH[i] - 0.001) return i;
    return 0;
  }
  function lang() { return document.documentElement.getAttribute('data-lang') === 'nl' ? 'nl' : 'en'; }
  function fmt(t) { t = Math.floor(t); return Math.floor(t / 60) + ':' + ((t % 60) < 10 ? '0' : '') + (t % 60); }

  function sync() {
    var t = tl.time();
    var c = chapterAt(t);
    showScene(c);
    chBtns.forEach(function (b, i) {
      var end = i + 1 < CH.length ? CH[i + 1] : TOTAL;
      var f = Math.min(1, Math.max(0, (t - CH[i]) / (end - CH[i])));
      b.querySelector('i').style.setProperty('--f', f);
      b.classList.toggle('on', i === c);
    });
    if (c !== current) {
      current = c;
      if (labelEl && chBtns[c]) labelEl.textContent = chBtns[c].getAttribute('data-label-' + lang());
      steps.forEach(function (s, i) {
        s.classList.toggle('is-on', i === c);
        s.classList.toggle('is-done', i < c);
      });
    }
    if (timeEl) timeEl.textContent = fmt(t) + ' / ' + fmt(TOTAL);
    if (stopAt !== null && t >= stopAt) { var at = stopAt; stopAt = null; pause(); tl.time(at, false); }
  }
  tl.eventCallback('onUpdate', sync);
  tl.eventCallback('onComplete', function () { pause(); });
  document.addEventListener('ace360:lang', function () { current = -1; sync(); });

  function play() {
    if (poster || tl.time() >= TOTAL - 0.05) tl.time(0);
    poster = false;
    root.classList.add('is-playing', 'has-played');
    tl.play();
  }
  function pause() { root.classList.remove('is-playing'); tl.pause(); }
  function seek(i, andPlay, onlyChapter) {
    var start = CH[i];
    stopAt = onlyChapter ? (i + 1 < CH.length ? CH[i + 1] - 0.15 : TOTAL) : null;
    if (reduce) {
      // no motion: show the finished state of the chapter
      poster = false;
      tl.time(Math.min(TOTAL, (i + 1 < CH.length ? CH[i + 1] : TOTAL) - 0.06), false);
      root.classList.add('has-played');
      sync();
      return;
    }
    poster = false;
    tl.time(start, false);
    sync();
    if (andPlay) play();
  }

  var userTouched = 0;
  function touch() { userTouched = Date.now(); }
  if (playBtn) playBtn.addEventListener('click', function () { touch(); stopAt = null; if (tl.isActive()) pause(); else play(); });
  if (bigPlay) bigPlay.addEventListener('click', function () { touch(); stopAt = null; reduce ? seek(4) : play(); });
  chBtns.forEach(function (b, i) { b.addEventListener('click', function () { touch(); seek(i, true, false); }); });
  document.querySelectorAll('[data-demo-goto]').forEach(function (b) {
    b.addEventListener('click', function () { touch(); seek(parseInt(b.getAttribute('data-demo-goto'), 10), true, true); });
  });
  var full = root.querySelector('[data-demo-full]');
  if (full) {
    full.addEventListener('click', function () {
      try {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (frame.requestFullscreen) frame.requestFullscreen().catch(function () {});
      } catch (e) {}
    });
  }
  canvas.addEventListener('click', function () { touch(); stopAt = null; if (tl.isActive()) pause(); else play(); });

  // Poster frame: chapter 1 almost finished, so the still frame reads well.
  // The first real play starts from the beginning.
  var poster = true;
  tl.time(CH[1] - 0.3, false);
  sync();

  /* ---------- autoplay in view, and scroll-driven chapters ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var seen = false;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio > 0.55) {
          if (!seen) { seen = true; if (poster) play(); }
        } else if (!e.isIntersecting && tl.isActive()) {
          pause();
        }
      });
    }, { threshold: [0, 0.55] }).observe(frame);
  }

  if (window.ScrollTrigger && steps.length) {
    steps.forEach(function (s, i) {
      window.ScrollTrigger.create({
        trigger: s,
        start: 'top 62%',
        end: 'bottom 62%',
        onEnter: function () { if (Date.now() - userTouched > 6000 && current !== i) seek(i, true, true); },
        onEnterBack: function () { if (Date.now() - userTouched > 6000 && current !== i) seek(i, true, true); }
      });
    });
  }

  window.ACE360_DEMO = { play: play, pause: pause, seek: seek };
})();
