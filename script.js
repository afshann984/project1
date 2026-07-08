/**
 * AFSHANVERSE — script.js
 * Premium Animations & Interactivity
 * Author: Afshan | afshanverse.dev
 */

'use strict';

/* ================================================================
   1. LOADING SCREEN
   ================================================================ */
(function initLoader() {
  const screen  = document.getElementById('loadingScreen');
  const bar     = document.getElementById('loaderBar');
  const percent = document.getElementById('loaderPercent');

  if (!screen) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      bar.style.width = '100%';
      percent.textContent = '100%';
      setTimeout(() => {
        screen.classList.add('hide');
        document.body.style.overflow = 'auto';
        initAllAnimations();
      }, 400);
    } else {
      bar.style.width = progress + '%';
      percent.textContent = Math.floor(progress) + '%';
    }
  }, 80);

  document.body.style.overflow = 'hidden';
})();

/* ================================================================
   2. CUSTOM CURSOR + TRAIL
   ================================================================ */
function initCursor() {
  const dot   = document.getElementById('cursorDot');
  const ring  = document.getElementById('cursorRing');
  const trail = document.getElementById('cursorTrail');

  if (!dot || !ring || window.matchMedia('(max-width: 768px)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  const trailDots = [];
  const MAX_TRAIL = 10;

  // Create trail spans
  for (let i = 0; i < MAX_TRAIL; i++) {
    const span = document.createElement('span');
    trail.appendChild(span);
    trailDots.push({ el: span, x: 0, y: 0, alpha: (MAX_TRAIL - i) / MAX_TRAIL });
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    // Shift trail positions
    for (let i = MAX_TRAIL - 1; i > 0; i--) {
      trailDots[i].x = trailDots[i - 1].x;
      trailDots[i].y = trailDots[i - 1].y;
    }
    trailDots[0].x = mouseX;
    trailDots[0].y = mouseY;

    trailDots.forEach((td, i) => {
      td.el.style.left    = td.x + 'px';
      td.el.style.top     = td.y + 'px';
      td.el.style.opacity = td.alpha * 0.5;
      const size = 6 - i * 0.4;
      td.el.style.width  = size + 'px';
      td.el.style.height = size + 'px';
    });
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const interactives = document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card, .domain-card, .filter-btn, .soft-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ================================================================
   3. MOUSE GLOW
   ================================================================ */
function initMouseGlow() {
  const glow = document.getElementById('mouseGlow');
  if (!glow) return;

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

/* ================================================================
   4. PARTICLE CANVAS BACKGROUND
   ================================================================ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const PARTICLE_COUNT = Math.min(Math.floor(W * H / 15000), 80);
  const particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 2 + 0.5;
      const colors = ['rgba(0,212,255,', 'rgba(124,58,237,', 'rgba(168,85,247,', 'rgba(6,182,212,'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.6 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

/* ================================================================
   5. NAVIGATION — SCROLL & ACTIVE STATE
   ================================================================ */
function initNavigation() {
  const navbar  = document.getElementById('navbar');
  const ham     = document.getElementById('hamburger');
  const mobileM = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll: glassmorphism + active link
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  // Hamburger
  if (ham && mobileM) {
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('open');
      mobileM.classList.toggle('open');
      mobileM.setAttribute('aria-hidden', !open);
      ham.setAttribute('aria-expanded', open);
    });

    // Close mobile menu on link click
    mobileM.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        ham.classList.remove('open');
        mobileM.classList.remove('open');
        mobileM.setAttribute('aria-hidden', 'true');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ================================================================
   6. SCROLL PROGRESS INDICATOR
   ================================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total  = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = (window.scrollY / total) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ================================================================
   7. BACK TO TOP BUTTON
   ================================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================================================================
   8. TYPING ANIMATION
   ================================================================ */
function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const words = ['AI Engineer', 'Python Developer', 'Web Developer', 'Problem Solver', 'Builder', 'Innovator'];
  let wordIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = words[wordIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
}

/* ================================================================
   9. SCROLL REVEAL ANIMATIONS
   ================================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ================================================================
   10. ANIMATED COUNTERS
   ================================================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.count);
  const duration = 1800;
  const step     = target / (duration / 16);
  let current    = 0;

  const tick = () => {
    current += step;
    if (current >= target) {
      el.textContent = target + '+';
      return;
    }
    el.textContent = Math.floor(current);
    requestAnimationFrame(tick);
  };
  tick();
}

/* ================================================================
   11. SKILL BAR ANIMATIONS
   ================================================================ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
}

/* ================================================================
   12. PROJECT FILTER
   ================================================================ */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const categories = card.dataset.category || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          // Force reflow
          card.offsetHeight;
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ================================================================
   13. MAGNETIC BUTTON EFFECT
   ================================================================ */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic-btn');
  if (window.matchMedia('(max-width: 768px)').matches) return;

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect   = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const deltaX  = (e.clientX - centerX) * 0.25;
      const deltaY  = (e.clientY - centerY) * 0.25;
      btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ================================================================
   14. RIPPLE EFFECT
   ================================================================ */
function initRipple() {
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-send, .btn-resume-big, .btn-resume, .filter-btn').forEach(el => {
    el.addEventListener('click', function(e) {
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ================================================================
   15. CONTACT FORM VALIDATION
   ================================================================ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  function validate(id, errId, check, msg) {
    const val = document.getElementById(id)?.value.trim();
    const errEl = document.getElementById(errId);
    if (!check(val)) {
      errEl.textContent = msg;
      document.getElementById(id)?.classList.add('error');
      return false;
    }
    errEl.textContent = '';
    document.getElementById(id)?.classList.remove('error');
    return true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isValidName    = validate('contactName',    'nameError',    v => v.length >= 2,                           'Please enter your name (min 2 chars).');
    const isValidEmail   = validate('contactEmail',   'emailError',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),   'Please enter a valid email address.');
    const isValidSubject = validate('contactSubject', 'subjectError', v => v.length >= 3,                           'Please enter a subject (min 3 chars).');
    const isValidMessage = validate('contactMessage', 'messageError', v => v.length >= 10,                          'Please write a message (min 10 chars).');

    if (isValidName && isValidEmail && isValidSubject && isValidMessage) {
      const btn     = document.getElementById('btnSend');
      const btnText = btn.querySelector('.btn-text');
      const btnLoad = btn.querySelector('.btn-loading');
      btnText.hidden = true;
      btnLoad.hidden = false;
      btn.disabled = true;

      setTimeout(() => {
        success.hidden = false;
        form.reset();
        btnText.hidden = false;
        btnLoad.hidden = true;
        btn.disabled = false;
        setTimeout(() => { success.hidden = true; }, 5000);
      }, 1800);
    }
  });

  // Live validation on blur
  ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'].forEach(id => {
    document.getElementById(id)?.addEventListener('blur', () => {
      if (id === 'contactEmail') {
        validate('contactEmail', 'emailError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address.');
      }
    });
  });
}

/* ================================================================
   16. GITHUB CONTRIBUTION GRAPH (PLACEHOLDER)
   ================================================================ */
function initContribGraph() {
  const grid = document.getElementById('contribGraph');
  if (!grid) return;

  const weeks = 52;
  const days  = 7;
  const levels = ['', 'l1', 'l2', 'l3', 'l4'];

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const cell = document.createElement('div');
      cell.classList.add('contrib-cell');
      const rand = Math.random();
      if (rand > 0.7) cell.classList.add(levels[Math.floor(Math.random() * 4) + 1]);
      grid.appendChild(cell);
    }
  }
}

/* ================================================================
   17. HOVER LIFT (section cards)
   ================================================================ */
function initHoverLift() {
  const cards = document.querySelectorAll('.project-card, .cert-card, .edu-card, .stat-card, .domain-card, .achievement-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', function() {
      this.style.willChange = 'auto';
    });
  });
}

/* ================================================================
   18. FLOATING SECTION DIVIDERS — animated aurora line
   ================================================================ */
function initDividers() {
  const dividers = document.querySelectorAll('.divider-line');
  dividers.forEach(d => {
    d.style.animation = 'shimmer-line 3s linear infinite';
  });
}

/* ================================================================
   19. SMOOTH ANCHOR SCROLLING (enhanced)
   ================================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ================================================================
   20. LAZY IMAGE LOADING (native + observer fallback)
   ================================================================ */
function initLazyImages() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) return; // native

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        img.src = img.dataset.src || img.src;
        observer.unobserve(img);
      }
    });
  });
  imgs.forEach(img => observer.observe(img));
}

/* ================================================================
   21. KEYBOARD ACCESSIBILITY — skip to content, ESC to close menu
   ================================================================ */
function initKeyboardAccessibility() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const mobileM = document.getElementById('mobileMenu');
      const ham     = document.getElementById('hamburger');
      if (mobileM?.classList.contains('open')) {
        mobileM.classList.remove('open');
        ham.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
        mobileM.setAttribute('aria-hidden', 'true');
      }
    }
  });
}

/* ================================================================
   22. AURORA CSS KEYFRAME INJECTION
   ================================================================ */
function injectExtraStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer-line {
      0%   { background-position: -300px 0; }
      100% { background-position: 300px 0; }
    }
    .form-control-custom.error {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239,68,68,0.15);
    }
    .profile-wrapper:hover .profile-img {
      transform: scale(1.03);
    }
    .profile-img {
      transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
    }
  `;
  document.head.appendChild(style);
}

/* ================================================================
   23. IMAGE FALLBACK (if profile.jpg not placed yet)
   ================================================================ */
function initImageFallback() {
  const imgs = document.querySelectorAll('img');
  imgs.forEach(img => {
    img.addEventListener('error', function() {
      if (this.src.includes('profile.jpg') || this.src.includes('about.jpg')) {
        // Inject an SVG avatar placeholder with AI theme
        const wrap = this.parentElement;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 200 200');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.style.cssText = 'width:100%;height:100%;background:linear-gradient(135deg,#0a0f2e,#1a0533);';
        svg.innerHTML = `
          <defs>
            <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1"/>
              <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1"/>
            </linearGradient>
          </defs>
          <circle cx="100" cy="80" r="40" fill="url(#avatarGrad)" opacity="0.9"/>
          <ellipse cx="100" cy="160" rx="55" ry="38" fill="url(#avatarGrad)" opacity="0.7"/>
          <text x="100" y="195" text-anchor="middle" font-family="Caveat,cursive" font-size="14" fill="rgba(255,255,255,0.5)">Place image</text>
        `;
        this.style.display = 'none';
        wrap.insertBefore(svg, this);
      }
    }, { once: true });
  });
}

/* ================================================================
   INIT ALL — called after loader completes
   ================================================================ */
function initAllAnimations() {
  injectExtraStyles();
  initImageFallback();
  initCursor();
  initMouseGlow();
  initParticles();
  initNavigation();
  initScrollProgress();
  initBackToTop();
  initTyping();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initProjectFilter();
  initMagneticButtons();
  initRipple();
  initContactForm();
  initContribGraph();
  initHoverLift();
  initDividers();
  initSmoothScroll();
  initLazyImages();
  initKeyboardAccessibility();
  console.log('%c✨ AFSHANVERSE loaded', 'color:#00d4ff;font-size:16px;font-weight:bold;');
}
