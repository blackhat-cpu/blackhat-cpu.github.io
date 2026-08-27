// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal sections on scroll (respects prefers-reduced-motion via CSS)
const revealTargets = document.querySelectorAll('.section, .hero');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => io.observe(el));
