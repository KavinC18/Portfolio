/* ============================================
   Kavin C — Portfolio Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Typing Animation ---- */
  const typedEl = document.getElementById('hero-typed');
  const phrases = [
    'REST APIs.',
    'Spring Boot apps.',
    'scalable backends.',
    'MySQL databases.',
    'AI systems.'
  ];
  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting   = false;
  const typeSpeed   = 80;
  const deleteSpeed = 40;
  const pauseEnd    = 2000;
  const pauseStart  = 500;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, pauseEnd);
        return;
      }
      setTimeout(typeLoop, typeSpeed);
    } else {
      typedEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeLoop, pauseStart);
        return;
      }
      setTimeout(typeLoop, deleteSpeed);
    }
  }
  setTimeout(typeLoop, 1000);

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ---- Mobile menu toggle ---- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('.section, .hero');
  const navLinksAll = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        currentId = section.getAttribute('id');
      }
    });
    navLinksAll.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---- Scroll-triggered entrance animations ---- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  /* ---- Animated stat counters ---- */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + '+';
    };
    requestAnimationFrame(update);
  }

  /* ---- Smooth parallax on mouse move for hero glows ---- */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const glow1 = document.querySelector('.hero-glow--1');
      const glow2 = document.querySelector('.hero-glow--2');
      if (glow1) glow1.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
      if (glow2) glow2.style.transform = `translate(${-x * 30}px, ${-y * 30}px)`;
    });
  }

});
