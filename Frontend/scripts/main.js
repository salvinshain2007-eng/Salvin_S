// ─────────────────────────────────────────────────────────────────────────────
//  main.js — GSAP, Lenis Smooth Scroll, Custom Cursor, Animations
// ─────────────────────────────────────────────────────────────────────────────

// ── Lenis Smooth Scroll ────────────────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);



// ── Preloader ──────────────────────────────────────────────────────────────
const preloader = document.getElementById('preloader');
const preloaderBall = document.querySelector('.preloader-ball');

window.addEventListener('load', () => {
  gsap.to(preloaderBall, {
    rotation: 720,
    duration: 1,
    ease: 'power2.inOut',
    onComplete: () => {
      gsap.timeline()
        .to('.preloader-text', { opacity: 0, y: -20, duration: 0.4 })
        .to(preloader, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
            initAnimations();
          }
        }, '-=0.2');
    }
  });
});

// ── Sticky Navbar ──────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: (self) => {
    if (self.progress > 0) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });
}

// Smooth scroll nav links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) lenis.scrollTo(target, { offset: -80 });
    navLinks.classList.remove('open');
  });
});

// ── Main Animations (after preloader) ─────────────────────────────────────
function initAnimations() {
  // Hero entrance
  gsap.timeline({ delay: 0.2 })
    .from('.hero-badge', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' })
    .from('.hero-title', { opacity: 0, y: 50, duration: 0.8, ease: 'power3.out' }, '-=0.3')
    .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .from('.hero-cta', { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .from('.hero-scroll-hint', { opacity: 0, duration: 0.5 }, '-=0.1');

  // ── About Section ──────────────────────────────────────────────────────
  gsap.from('.about-image-wrapper', {
    scrollTrigger: { trigger: '#about', start: 'top 75%', toggleActions: 'play none none reverse' },
    x: -80, opacity: 0, duration: 1, ease: 'power3.out'
  });

  gsap.from('.about-content', {
    scrollTrigger: { trigger: '#about', start: 'top 75%', toggleActions: 'play none none reverse' },
    x: 80, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2
  });

  // Stats counter
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach((stat) => {
    const target = parseInt(stat.getAttribute('data-target'));
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            stat.textContent = Math.round(this.targets()[0].val);
          }
        });
      }
    });
  });

  // ── Team Section ───────────────────────────────────────────────────────
  gsap.from('.section-header', {
    scrollTrigger: { trigger: '#team', start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 50, opacity: 0, duration: 0.8, ease: 'power3.out'
  });

  gsap.from('.player-card', {
    scrollTrigger: { trigger: '#team', start: 'top 70%', toggleActions: 'play none none reverse' },
    y: 80, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out'
  });

  // ── Achievements Section ───────────────────────────────────────────────
  gsap.from('.timeline-item', {
    scrollTrigger: { trigger: '#achievements', start: 'top 75%', toggleActions: 'play none none reverse' },
    x: (i) => i % 2 === 0 ? -60 : 60,
    opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out'
  });

  gsap.from('.trophy-card', {
    scrollTrigger: { trigger: '.trophies-grid', start: 'top 80%', toggleActions: 'play none none reverse' },
    scale: 0.8, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)'
  });

  // ── Gallery Section ────────────────────────────────────────────────────
  gsap.from('.gallery-item', {
    scrollTrigger: { trigger: '#gallery', start: 'top 75%', toggleActions: 'play none none reverse' },
    scale: 0.85, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out'
  });

  // ── Fan Section ────────────────────────────────────────────────────────
  gsap.from('.fan-content', {
    scrollTrigger: { trigger: '#fan', start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 60, opacity: 0, duration: 1, ease: 'power3.out'
  });

  // ── Contact Section ────────────────────────────────────────────────────
  gsap.from('.contact-form-wrapper', {
    scrollTrigger: { trigger: '#contact', start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 60, opacity: 0, duration: 1, ease: 'power3.out'
  });

  gsap.from('.contact-info', {
    scrollTrigger: { trigger: '#contact', start: 'top 80%', toggleActions: 'play none none reverse' },
    x: -60, opacity: 0, duration: 1, ease: 'power3.out'
  });



  // ── Section Labels Reveal ──────────────────────────────────────────────
  gsap.utils.toArray('.section-label').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 0, x: -30, duration: 0.6, ease: 'power2.out'
    });
  });

  // Parallax on section backgrounds
  gsap.utils.toArray('.parallax-bg').forEach((bg) => {
    gsap.to(bg, {
      scrollTrigger: {
        trigger: bg.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: '20%',
      ease: 'none'
    });
  });
}

// ── Button Ripple Effect ───────────────────────────────────────────────────
document.querySelectorAll('.btn-ripple').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// ── Year counter in footer ─────────────────────────────────────────────────
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
