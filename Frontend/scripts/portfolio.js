const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
  start: 'top -50',
  onUpdate: (self) => {
    if (self.progress > 0) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Smooth scroll nav links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) lenis.scrollTo(target, { offset: -80 });
  });
});

// Intro Animations
gsap.timeline({ delay: 0.2 })
  .from('.hero-badge', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
  .from('.hero-title', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
  .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
  .from('.btn-primary', { y: 20, opacity: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2');

// Details Grid Animations
gsap.from('.cv-section h2', {
  scrollTrigger: { trigger: '#cv-details', start: 'top 80%' },
  opacity: 0, x: -30, duration: 0.6, stagger: 0.2, ease: 'power2.out'
});

gsap.from('.timeline-item', {
  scrollTrigger: { trigger: '#cv-details', start: 'top 75%' },
  opacity: 0, x: -30, duration: 0.8, stagger: 0.15, ease: 'power3.out'
});

// Skill bars logic
gsap.utils.toArray('.skill-item').forEach(skill => {
  const bar = skill.querySelector('.skill-bar-fill');
  const percentText = skill.querySelector('.skill-percent');
  
  gsap.from(skill, {
    scrollTrigger: { trigger: skill, start: 'top 85%' },
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: 'power2.out'
  });

  if (bar) {
    gsap.from(bar, {
      scrollTrigger: { trigger: skill, start: 'top 85%' },
      scaleX: 0,
      duration: 1.2,
      delay: 0.3,
      ease: 'power3.out'
    });
  }
});

document.getElementById('current-year').textContent = new Date().getFullYear();
