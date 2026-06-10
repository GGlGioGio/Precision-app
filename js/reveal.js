const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.perf-feature, .milestone, .gallery-item, .stat-item').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});
