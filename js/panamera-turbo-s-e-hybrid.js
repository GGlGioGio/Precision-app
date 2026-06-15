(function () {
  const images = [
    'Assets/images/2025_Porsche_Panamera_Turbo_S_E-Hybrid/2025_Porsche_Panamera_Turbo_S_E-Hybrid_Front.jpg',
    'Assets/images/2025_Porsche_Panamera_Turbo_S_E-Hybrid/2025_Porsche_Panamera_Turbo_S_E-Hybrid_Back.jpg',
    'Assets/images/2025_Porsche_Panamera_Turbo_S_E-Hybrid/2025_Porsche_Panamera_Turbo_S_E-Hybrid_Inside.jpg',
    'Assets/images/2025_Porsche_Panamera_Turbo_S_E-Hybrid/2025_Porsche_Panamera_Turbo_S_E-Hybrid_Right.jpg',
    'Assets/images/2025_Porsche_Panamera_Turbo_S_E-Hybrid/2025_Porsche_Panamera_Turbo_S_E-Hybrid_Saloon.jpg',
    'Assets/images/2025_Porsche_Panamera_Turbo_S_E-Hybrid/2025_Porsche_Panamera_Turbo_S_E-Hybrid_Tire.jpg',
    'Assets/images/2025_Porsche_Panamera_Turbo_S_E-Hybrid/2025_Porsche_Panamera_Turbo_S_E-Hybrid_Wheel.jpg',
    'Assets/images/2025_Porsche_Panamera_Turbo_S_E-Hybrid/2025_Porsche_Panamera_Turbo_S_E-Hybrid_Writing.jpg'
  ];

  const total = images.length;
  let current = 0;
  let isTransitioning = false;

  const track = document.getElementById('mdpTrack');
  const counter = document.getElementById('mdpCounter');
  const dotsContainer = document.getElementById('mdpDots');
  const thumbsContainer = document.getElementById('mdpThumbs');
  const thumbs = thumbsContainer.querySelectorAll('.mdp-thumb');

  track.style.transition = 'transform 0.8s cubic-bezier(0.34, 0.9, 0.34, 1)';

  const heroEl = document.getElementById('mdpHero');
  heroEl.style.touchAction = 'pan-y';

  function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'mdp-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Image ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(d);
    }
  }

  function updateUI() {
    const slideWidth = track.parentElement.offsetWidth || window.innerWidth;
    track.style.transform = 'translateX(-' + (current * slideWidth) + 'px)';
    counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    dotsContainer.querySelectorAll('.mdp-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
  }

  function goTo(index) {
    if (isTransitioning) return;
    current = ((index % total) + total) % total;
    isTransitioning = true;
    updateUI();
    setTimeout(() => { isTransitioning = false; }, 850);
  }

  document.getElementById('mdpPrev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('mdpNext').addEventListener('click', () => goTo(current + 1));

  thumbs.forEach(t => {
    t.addEventListener('click', () => goTo(parseInt(t.dataset.index)));
  });

  let touchStartX = 0, touchStartY = 0;

  heroEl.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  heroEl.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 40 && dy < 60) goTo(current + (dx > 0 ? 1 : -1));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    track.style.transition = 'none';
    updateUI();
    resizeTimer = setTimeout(() => {
      track.style.transition = 'transform 0.8s cubic-bezier(0.34, 0.9, 0.34, 1)';
    }, 100);
  });

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 0);
  });
  navbar.classList.add('scrolled');

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

  buildDots();
  updateUI();
})();