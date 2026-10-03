/* Ace 360: page interactions outside the 3D film.
   Reveal-on-scroll, phone clips that play in view, zoomable images, and on blog pages:
   reading progress, table of contents, tickable checklists, tabs, the quiz, filters and search, sharing.
   Everything works without it; this only adds behaviour. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nl = function () { return document.documentElement.getAttribute('data-lang') !== 'en'; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var io = 'IntersectionObserver' in window;

  /* ---------- reveal on scroll ---------- */
  var rev = $$('.reveal');
  if (rev.length) {
    if (!io || reduce) rev.forEach(function (e) { e.classList.add('is-in'); });
    else {
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (e, i) {
          if (!e.isIntersecting) return;
          var el = e.target; setTimeout(function () { el.classList.add('is-in'); }, (i % 4) * 90);
          ro.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      rev.forEach(function (e) { ro.observe(e); });
    }
  }

  /* ---------- phone clips: play while visible, tap to pause ---------- */
  var clips = $$('video[data-clip]');
  clips.forEach(function (v) {
    var fig = v.closest('.clip'), user = false;
    var btn = fig && fig.querySelector('[data-clip-toggle]');
    var play = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); if (fig) fig.classList.remove('is-paused'); };
    var pause = function () { v.pause(); if (fig) fig.classList.add('is-paused'); };
    if (btn) btn.addEventListener('click', function () { user = true; if (v.paused) play(); else pause(); });
    v.addEventListener('click', function () { user = true; if (v.paused) play(); else pause(); });
    if (reduce) { v.removeAttribute('autoplay'); if (fig) fig.classList.add('is-paused'); return; }
    if (!io) { v.preload = 'auto'; play(); return; }
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { if (!user) { v.preload = 'auto'; play(); } }
        else if (!v.paused) { v.pause(); if (!user && fig) fig.classList.remove('is-paused'); }
      });
    }, { threshold: 0.35 }).observe(v);
  });

  /* ---------- zoomable images (figure.shot, .zoom) ---------- */
  var zooms = $$('.shot img, img[data-zoom]');
  if (zooms.length) {
    var box = document.createElement('div');
    box.className = 'lightbox'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<button type="button" class="lightbox-x" aria-label="Close">×</button><img alt=""><p class="lightbox-cap"></p>';
    document.body.appendChild(box);
    var close = function () { box.hidden = true; document.documentElement.classList.remove('has-lightbox'); };
    box.addEventListener('click', function (e) { if (e.target === box || e.target.classList.contains('lightbox-x')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) close(); });
    zooms.forEach(function (img) {
      img.setAttribute('tabindex', '0'); img.style.cursor = 'zoom-in';
      var open = function () {
        $('img', box).src = img.currentSrc || img.src; $('img', box).alt = img.alt;
        var cap = img.closest('figure') && img.closest('figure').querySelector('figcaption');
        $('.lightbox-cap', box).textContent = cap ? cap.textContent : '';
        box.hidden = false; document.documentElement.classList.add('has-lightbox'); $('.lightbox-x', box).focus();
      };
      img.addEventListener('click', open);
      img.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    });
  }

  /* ---------- tilt on hover ---------- */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(1000px) rotateY(' + (x * 6).toFixed(2) + 'deg) rotateX(' + (-y * 6).toFixed(2) + 'deg)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* =================== blog posts =================== */
  var post = $('[data-post]');
  if (post) {
    var body = $('.post-body', post);
    // reading progress
    var bar = $('.read-progress span');
    if (bar && body) {
      var prog = function () {
        var r = body.getBoundingClientRect(), h = r.height - window.innerHeight * 0.6;
        bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, -r.top / Math.max(1, h))) + ')';
      };
      window.addEventListener('scroll', prog, { passive: true }); prog();
    }
    // table of contents from the h2s
    var toc = $('[data-toc]', post), hs = body ? $$('h2', body) : [];
    if (toc && hs.length > 2) {
      var ol = document.createElement('ol');
      hs.forEach(function (h, i) {
        if (!h.id) h.id = 's' + (i + 1) + '-' + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
        var li = document.createElement('li'), a = document.createElement('a');
        a.href = '#' + h.id; a.textContent = h.textContent; li.appendChild(a); ol.appendChild(li);
      });
      toc.appendChild(ol); toc.hidden = false;
      if (io) {
        var links = $$('a', ol), seen = {};
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
          var cur = null; hs.forEach(function (h) { if (h.getBoundingClientRect().top < window.innerHeight * 0.35) cur = h.id; });
          links.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + cur); });
        }, { rootMargin: '0px 0px -60% 0px' }).observe(hs[0]);
        window.addEventListener('scroll', function () {
          var cur = null; hs.forEach(function (h) { if (h.getBoundingClientRect().top < window.innerHeight * 0.35) cur = h.id; });
          links.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + cur); });
        }, { passive: true });
      }
    }
    // checklists: tick items, keep them for next time, show progress
    $$('ul.checklist', post).forEach(function (ul, n) {
      var key = 'ace360-check-' + (post.getAttribute('data-post') || '') + '-' + n, saved = {};
      try { saved = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) {}
      var items = $$('li', ul), meter = document.createElement('p');
      meter.className = 'checklist-meter';
      var update = function () {
        var done = items.filter(function (li) { return li.classList.contains('is-done'); }).length;
        meter.innerHTML = '<span style="--p:' + (done / items.length) + '"></span><b>' + done + ' / ' + items.length + '</b> ' + (nl() ? 'afgevinkt' : 'done');
        try { var s = {}; items.forEach(function (li, i) { if (li.classList.contains('is-done')) s[i] = 1; }); localStorage.setItem(key, JSON.stringify(s)); } catch (e) {}
      };
      items.forEach(function (li, i) {
        li.setAttribute('role', 'checkbox'); li.setAttribute('tabindex', '0');
        if (saved[i]) li.classList.add('is-done');
        li.setAttribute('aria-checked', String(li.classList.contains('is-done')));
        var toggle = function () { li.classList.toggle('is-done'); li.setAttribute('aria-checked', String(li.classList.contains('is-done'))); update(); };
        li.addEventListener('click', function (e) { if (e.target.tagName !== 'A') toggle(); });
        li.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } });
      });
      ul.parentNode.insertBefore(meter, ul); update();
    });
    // tabs: <div class="tabs"><section data-tab="Label">…</section>…</div>
    $$('.tabs', post).forEach(function (t) {
      var panes = $$(':scope > section[data-tab]', t); if (!panes.length) return;
      var bar = document.createElement('div'); bar.className = 'tab-bar'; bar.setAttribute('role', 'tablist');
      panes.forEach(function (p, i) {
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = p.getAttribute('data-tab');
        b.addEventListener('click', function () {
          panes.forEach(function (q, j) { q.hidden = j !== i; }); $$('button', bar).forEach(function (x, j) { x.setAttribute('aria-selected', String(j === i)); });
        });
        bar.appendChild(b); p.hidden = i !== 0; b.setAttribute('aria-selected', String(i === 0));
      });
      t.insertBefore(bar, t.firstChild); t.classList.add('is-ready');
    });
    // quiz: <div class="quiz" data-quiz> questions with data-a/data-b scores, results with data-result
    $$('[data-quiz]', post).forEach(function (q) {
      var qs = $$('.quiz-q', q), res = $$('.quiz-result', q), step = 0, score = { a: 0, b: 0 };
      var show = function () {
        qs.forEach(function (x, i) { x.hidden = i !== step; });
        res.forEach(function (r) { r.hidden = true; });
        if (step >= qs.length) { var w = score.a >= score.b ? 'a' : 'b'; res.forEach(function (r) { r.hidden = r.getAttribute('data-result') !== w; }); }
        var dots = $('.quiz-dots', q); if (dots) dots.style.setProperty('--p', Math.min(1, step / qs.length));
      };
      $$('button[data-pick]', q).forEach(function (b) { b.addEventListener('click', function () { score[b.getAttribute('data-pick')]++; step++; show(); }); });
      $$('[data-quiz-again]', q).forEach(function (b) { b.addEventListener('click', function () { step = 0; score = { a: 0, b: 0 }; show(); }); });
      q.classList.add('is-ready'); show();
    });
    // share
    $$('[data-share-copy]', post).forEach(function (b) {
      b.addEventListener('click', function () {
        var done = function () { var t = b.textContent; b.textContent = nl() ? 'Gekopieerd ✓' : 'Copied ✓'; setTimeout(function () { b.textContent = t; }, 1800); };
        if (navigator.clipboard) navigator.clipboard.writeText(location.href.split('#')[0]).then(done, done); else done();
      });
    });
  }

  /* =================== blog index: filter and search =================== */
  var idx = $('[data-blog-index]');
  if (idx) {
    var cards = $$('[data-card]', idx), chips = $$('[data-cat]', idx), search = $('[data-blog-search]', idx), none = $('[data-blog-none]', idx);
    var cat = 'all';
    var apply = function () {
      var q = (search && search.value || '').trim().toLowerCase(), shown = 0;
      cards.forEach(function (c) {
        var ok = (cat === 'all' || c.getAttribute('data-card') === cat) && (!q || c.textContent.toLowerCase().indexOf(q) !== -1);
        c.hidden = !ok; if (ok) shown++;
      });
      idx.classList.toggle('is-filtered', cat !== 'all' || !!q);
      if (none) none.hidden = shown > 0;
    };
    chips.forEach(function (ch) {
      ch.addEventListener('click', function () {
        cat = ch.getAttribute('data-cat');
        chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === ch)); });
        apply();
      });
    });
    if (search) search.addEventListener('input', apply);
  }
})();
