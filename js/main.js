/* ══════════════════════════════════════════════════════════════
   PLASTI ECOPLAS — main.js
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');
  document.body.classList.add('is-loading');

  /* ── 1. PRELOADER ─────────────────────────────────────────── */
  function initLoader() {
    var loader = document.getElementById('loader');
    var fill = document.querySelector('.loader-bar-fill');
    if (!loader) { startHeroEntrance(); return; }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { if (fill) fill.style.width = '100%'; });
    });

    var MIN_TIME = 2300; // impacto: nunca demasiado rápido
    var start = Date.now();

    function finish() {
      var elapsed = Date.now() - start;
      var wait = Math.max(MIN_TIME - elapsed, 0);
      setTimeout(function () {
        loader.classList.add('loader-exit');
        document.body.classList.remove('is-loading');
        startHeroEntrance();
        setTimeout(function () { loader.style.display = 'none'; }, 1200);
      }, wait);
    }

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish);
    setTimeout(finish, 4500); // salvaguarda
  }

  /* ── 2. HERO ENTRANCE + TÍTULO INTERACTIVO ───────────────── */
  function startHeroEntrance() {
    var badge = document.getElementById('hero-badge');
    var lines = document.querySelectorAll('.hero-title .line > span');
    var sub = document.getElementById('hero-sub');
    var ctas = document.getElementById('hero-ctas');
    var trust = document.getElementById('hero-trust');

    if (badge) { badge.style.transition = 'transform .8s var(--ease), opacity .8s ease'; requestAnimationFrame(function(){ badge.style.opacity = 1; badge.style.transform = 'translateY(0)'; }); }

    lines.forEach(function (el, i) {
      setTimeout(function () {
        el.style.transform = 'translateY(0) rotate(0)';
        el.style.opacity = 1;
      }, 260 + i * 150);
    });

    var afterLines = 260 + lines.length * 150 + 200;

    [sub, ctas, trust].forEach(function (el, i) {
      if (!el) return;
      el.style.transition = 'transform .9s var(--ease), opacity .9s ease';
      setTimeout(function () {
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, afterLines + i * 160);
    });

    // Efecto "máquina de escribir" con barrido de color en la palabra acento
    var accent = document.querySelector('.hero-title .accent');
    if (accent) {
      var text = accent.textContent;
      var BLUE = [0, 114, 184], GREEN = [109, 190, 69];
      var letters = text.split('');
      accent.textContent = '';
      accent.classList.add('is-split');
      accent.style.opacity = 1;
      var frag = document.createDocumentFragment();
      letters.forEach(function (ch, i) {
        var span = document.createElement('span');
        span.className = 'char';
        var t = letters.length > 1 ? i / (letters.length - 1) : 0;
        var r = Math.round(BLUE[0] + (GREEN[0] - BLUE[0]) * t);
        var g = Math.round(BLUE[1] + (GREEN[1] - BLUE[1]) * t);
        var b = Math.round(BLUE[2] + (GREEN[2] - BLUE[2]) * t);
        span.style.color = 'rgb(' + r + ',' + g + ',' + b + ')';
        span.style.opacity = '0';
        span.style.transform = 'translateY(14px)';
        span.style.transition = 'opacity .5s ease, transform .5s var(--ease)';
        span.textContent = ch === ' ' ? ' ' : ch;
        frag.appendChild(span);
      });
      accent.appendChild(frag);
      var charSpans = accent.querySelectorAll('.char');
      setTimeout(function () {
        charSpans.forEach(function (s, i) {
          setTimeout(function () { s.style.opacity = 1; s.style.transform = 'translateY(0)'; }, i * 42);
        });
      }, afterLines - 100);
    }
  }

  /* ── 3. NAVBAR: scroll state + menú móvil ────────────────── */
  function initNavbar() {
    var nav = document.getElementById('navbar');
    var hamburger = document.getElementById('hamburger');
    var mobMenu = document.getElementById('mob-menu');
    var scrim = document.querySelector('.nav-scrim');

    function onScroll() {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    function closeMenu() {
      hamburger.setAttribute('aria-expanded', 'false');
      mobMenu.classList.remove('open');
      if (scrim) scrim.classList.remove('open');
      document.body.style.overflow = '';
    }
    function openMenu() {
      hamburger.setAttribute('aria-expanded', 'true');
      mobMenu.classList.add('open');
      if (scrim) scrim.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    if (hamburger) {
      hamburger.addEventListener('click', function () {
        var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
        isOpen ? closeMenu() : openMenu();
      });
    }
    if (scrim) scrim.addEventListener('click', closeMenu);
    mobMenu && mobMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  /* ── 4. SCROLL REVEAL ─────────────────────────────────────── */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ── 5. MARQUEE ───────────────────────────────────────────── */
  function initMarquee() {
    var track = document.getElementById('marquee');
    if (!track) return;
    var items = [
      'Charolas', 'Tapas para Voladero', 'Techos para Gallos de Pelea',
      'Lámina Plastiteja', 'Fabricación Propia en Amecameca', 'Precios de Mayoreo'
    ];
    var html = '';
    for (var r = 0; r < 2; r++) {
      items.forEach(function (t) {
        html += '<span class="marquee-item"><i class="fa-solid fa-circle"></i>' + t + '</span>';
      });
    }
    track.innerHTML = html;
  }

  /* ── 6. CONTADORES ────────────────────────────────────────── */
  function initCounters() {
    var nums = document.querySelectorAll('.stat-num[data-count]');
    if (!nums.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1900;
        var t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = Math.floor(eased * target);
          el.textContent = val.toLocaleString('es-MX') + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString('es-MX') + suffix;
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ── 7. PARALLAX FONDOS (fixed con movimiento, compatible móvil) ─ */
  function initParallax() {
    var layers = document.querySelectorAll('.parallax-bg');
    if (!layers.length) return;
    var ticking = false;

    function update() {
      layers.forEach(function (el) {
        var rect = el.parentElement.getBoundingClientRect();
        var vh = window.innerHeight;
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var progress = (rect.top) / vh; // -1..1 aprox
        var speed = parseFloat(el.getAttribute('data-speed') || '18');
        var y = progress * speed;
        el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0) scale(1.08)';
      });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ── 8. PARTÍCULAS CANVAS ─────────────────────────────────── */
  function createParticles(canvas, opts) {
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var count = opts.count || 46;
    var colors = opts.colors || ['#6DBE45', '#0072B8', '#8FDD63'];
    var w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function make() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * (opts.maxR || 2.6) + .6,
        vy: -(Math.random() * .4 + .12),
        vx: (Math.random() - .5) * .25,
        c: colors[Math.floor(Math.random() * colors.length)],
        o: Math.random() * .5 + .25
      };
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < count; i++) particles.push(make());
    }

    var visible = true;
    var io = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    });
    io.observe(canvas);

    function tick() {
      if (visible && w) {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(function (p) {
          p.x += p.vx; p.y += p.vy;
          if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.c;
          ctx.globalAlpha = p.o;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(tick);
    }

    init();
    window.addEventListener('resize', init);
    requestAnimationFrame(tick);
  }

  function initAllParticles() {
    document.querySelectorAll('canvas[data-particles]').forEach(function (canvas) {
      var count = parseInt(canvas.getAttribute('data-count') || '40', 10);
      createParticles(canvas, { count: count });
    });
  }

  /* ── 9. AÑO FOOTER ────────────────────────────────────────── */
  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ── 10. FORMULARIO → WHATSAPP ────────────────────────────── */
  function initForm() {
    var form = document.getElementById('wa-form');
    if (!form) return;
    var WHATSAPP_NUMBER = '525512006895';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('f-name').value.trim();
      var interest = document.getElementById('f-interest').value;
      var msg = document.getElementById('f-msg').value.trim();

      if (!name || !msg) {
        form.reportValidity();
        return;
      }

      var text = 'Hola, soy ' + name + '. Me interesa: ' + interest + '.\n' + msg;
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ── 11. SECTION TITLES: subrayado interactivo al hacer scroll ─ */
  function initTitleInteractions() {
    document.querySelectorAll('.section-title, .why-quote').forEach(function (el) {
      el.classList.add('title-animated');
    });
  }

  /* ── INIT ─────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initMarquee();
    initNavbar();
    initReveal();
    initCounters();
    initParallax();
    initAllParticles();
    initYear();
    initForm();
    initTitleInteractions();
    initLoader();
  });
})();
