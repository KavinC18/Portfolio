/* ============================================
   Kavin — Portfolio v3
   Particles / 3D Tilt / Drawing (in Skills) 
   No custom cursor
   ============================================ */

(function () {
  'use strict';

  /* ===========================================
     1. PARTICLE SYSTEM
     =========================================== */
  const pCanvas = document.getElementById('particle-canvas');
  const pCtx = pCanvas.getContext('2d');
  let particles = [];
  const COUNT = 70;
  const CONNECT = 120;
  let mouseX = -999, mouseY = -999;

  function resize() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x = Math.random() * pCanvas.width;
      this.y = Math.random() * pCanvas.height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r = Math.random() * 1.5 + 0.5;
      this.a = Math.random() * 0.25 + 0.08;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > pCanvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > pCanvas.height) this.vy *= -1;
      const dx = this.x - mouseX, dy = this.y - mouseY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 140) {
        const f = (140 - d) / 140 * 0.015;
        this.vx += dx / d * f;
        this.vy += dy / d * f;
      }
      const sp = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (sp > 1) { this.vx *= 1 / sp; this.vy *= 1 / sp; }
    }
    draw() {
      pCtx.beginPath();
      pCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(108,99,255,${this.a})`;
      pCtx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  (function loop() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT) {
          pCtx.beginPath();
          pCtx.moveTo(particles[i].x, particles[i].y);
          pCtx.lineTo(particles[j].x, particles[j].y);
          pCtx.strokeStyle = `rgba(108,99,255,${0.05 * (1 - d / CONNECT)})`;
          pCtx.lineWidth = 0.5;
          pCtx.stroke();
        }
      }
    }
    // Mouse lines
    particles.forEach(p => {
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 160) {
        pCtx.beginPath();
        pCtx.moveTo(p.x, p.y);
        pCtx.lineTo(mouseX, mouseY);
        pCtx.strokeStyle = `rgba(0,212,255,${0.1 * (1 - d / 160)})`;
        pCtx.lineWidth = 0.5;
        pCtx.stroke();
      }
    });
    requestAnimationFrame(loop);
  })();



  /* ===========================================
     3. TYPING ANIMATION
     =========================================== */
  const typedEl = document.getElementById('hero-typed');
  const phrases = ['REST APIs.', 'Spring Boot apps.', 'scalable backends.', 'MySQL databases.', 'AI systems.'];
  let pi = 0, ci = 0, deleting = false;

  function typeLoop() {
    const word = phrases[pi];
    if (!deleting) {
      typedEl.textContent = word.slice(0, ci + 1); ci++;
      if (ci === word.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
      setTimeout(typeLoop, 85);
    } else {
      typedEl.textContent = word.slice(0, ci - 1); ci--;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
      setTimeout(typeLoop, 35);
    }
  }
  setTimeout(typeLoop, 800);

  /* ===========================================
     4. NAVBAR
     =========================================== */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  }));

  // Active nav
  const sections = document.querySelectorAll('.section, .hero');
  const allNavLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
    allNavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  }, { passive: true });

  /* ===========================================
     5. SCROLL REVEAL
     =========================================== */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.anim-reveal').forEach(el => revealObs.observe(el));

  /* ===========================================
     6. STAT COUNTERS
     =========================================== */
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const dur = 1500, start = performance.now();
        (function up(now) {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * target);
          if (p < 1) requestAnimationFrame(up);
          else el.textContent = target + '+';
        })(start);
        statObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => statObs.observe(el));

  /* ===========================================
     7. 3D TILT ON CARDS
     =========================================== */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    });
  });

})();
