/**
 * KAVIN — LUXURY EDITORIAL MOTION PORTFOLIO
 * Motion design, scrollytelling, 3D avatar parallax & interactive utilities
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. SCROLL PROGRESS TRACKER (Sofi Reference: "scroll down 0%")
     ========================================================================== */
  const heroScrollBar = document.getElementById('hero-scroll-bar');
  const heroScrollPercent = document.getElementById('hero-scroll-percent');
  const header = document.getElementById('header');

  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? Math.min(Math.max(scrollTop / scrollHeight, 0), 1) : 0;
    const percentage = Math.round(progress * 100);

    if (heroScrollBar) {
      heroScrollBar.style.width = percentage + '%';
    }
    if (heroScrollPercent) {
      heroScrollPercent.textContent = percentage + '%';
    }

    if (header) {
      header.classList.toggle('scrolled', scrollTop > 50);
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ==========================================================================
     2. GENTLE SCROLLYTELLING PARALLAX ON AVATAR (Luxury Calm Motion)
     ========================================================================== */
  const avatarMedia = document.getElementById('avatar-media');

  function updateAvatarMotion() {
    if (!avatarMedia) return;
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY < window.innerHeight * 1.5) {
      // Gentle decoupled scrollytelling parallax translation
      avatarMedia.style.transform = `translate3d(0, ${scrollY * 0.08}px, 0)`;
    }
  }

  window.addEventListener('scroll', updateAvatarMotion, { passive: true });

  /* ==========================================================================
     3. DYNAMIC SPECIALIZATION TYPING ANIMATION
     ========================================================================== */
  const typedEl = document.getElementById('hero-typed');
  const specializations = [
    'Spring Boot & REST APIs',
    'High-Throughput Microservices',
    'Scalable MySQL Relational Databases',
    'Clean Layered Architecture',
    'Queueing Simulation & Erlang-C',
    'Applied Deep Learning & NLP'
  ];

  let specIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeTick() {
    if (!typedEl) return;
    const currentWord = specializations[specIndex];

    if (!isDeleting) {
      typedEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeTick, 2400); // pause at full word
        return;
      }
      setTimeout(typeTick, 65);
    } else {
      typedEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        specIndex = (specIndex + 1) % specializations.length;
        setTimeout(typeTick, 350);
        return;
      }
      setTimeout(typeTick, 30);
    }
  }

  setTimeout(typeTick, 1000);

  /* ==========================================================================
     4. INTERSECTION OBSERVER FOR SCROLL REVEALS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.anim-reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     5. STAT NUMERICAL COUNTER ANIMATION
     ========================================================================== */
  const metricElements = document.querySelectorAll('[data-target]');
  const metricObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1600;
        const startTime = performance.now();

        function countFrame(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentCount = Math.floor(easeProgress * targetValue);

          el.textContent = currentCount;

          if (progress < 1) {
            requestAnimationFrame(countFrame);
          } else {
            el.textContent = targetValue;
          }
        }

        requestAnimationFrame(countFrame);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  metricElements.forEach(el => metricObserver.observe(el));

  /* ==========================================================================
     6. CARD MOUSE SPOTLIGHT GLOW EFFECT
     ========================================================================== */
  const spotlightCards = document.querySelectorAll('[data-spotlight]');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--spotlight-x', `${x}px`);
      card.style.setProperty('--spotlight-y', `${y}px`);
    });
  });

  /* ==========================================================================
     7. EMAIL COPY TO CLIPBOARD & TOAST ALERT
     ========================================================================== */
  const copyBtn = document.getElementById('btn-copy-email');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    toast.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = '727823tuit106@skct.edu.in';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        showToast('Email address copied to clipboard!');
      } catch (err) {
        showToast('Direct email: 727823tuit106@skct.edu.in');
      }
    });
  }

  /* ==========================================================================
     8. NAVIGATION ACTIVE HIGHLIGHT & MOBILE DRAWER
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active navigation tracking
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    desktopNavItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === '#' + currentSectionId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }, { passive: true });

  /* ==========================================================================
     9. BACK TO TOP SMOOTH SCROLL
     ========================================================================== */
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
