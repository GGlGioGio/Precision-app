const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
  const sections = ['home', 'models', 'performance', 'heritage', 'gallery', 'contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link, .nav-cta').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});
