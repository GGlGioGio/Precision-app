(function () {
  const track = document.getElementById('mdpTrack');
  const counter = document.getElementById('mdpCounter');
  const dotsContainer = document.getElementById('mdpDots');
  const thumbsContainer = document.getElementById('mdpThumbs');
  const thumbs = thumbsContainer.querySelectorAll('.mdp-thumb');

  // Берём пути прямо из <img> в слайдере — так пути всегда совпадают с HTML
  const images = Array.from(
    track.querySelectorAll('.mdp-hero-slide img')
  ).map(img => img.src);

  const total = images.length;
  let current = 0;
  let isTransitioning = false;

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

  // FIX 1: убран goTo() — экран больше не прыгает вверх при клике на превью
  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      const idx = parseInt(t.dataset.index);
      openLightbox(idx);
    });
  });

  const lightbox = document.getElementById('mdpLightbox');
  const lightboxOverlay = document.getElementById('mdpLightboxOverlay');
  const lightboxImg = document.getElementById('mdpLightboxImg');
  const lightboxClose = document.getElementById('mdpLightboxClose');
  const lightboxPrev = document.getElementById('mdpLightboxPrev');
  const lightboxNext = document.getElementById('mdpLightboxNext');
  const lightboxCounter = document.getElementById('mdpLightboxCounter');

  let lightboxIndex = 0;
  let lightboxOpen = false;
  let scrollYBeforeLock = 0;
  let lbIsAnimating = false;

  // FIX 2: анимация без мерцания черным — два клона поверх реального img
  function setLightboxImage(index, animate, direction) {
    lightboxIndex = ((index % total) + total) % total;
    const src    = images[lightboxIndex];
    const slides = track.querySelectorAll('.mdp-hero-slide img');
    const alt    = slides[lightboxIndex] ? slides[lightboxIndex].alt : '';

    lightboxCounter.textContent =
      String(lightboxIndex + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');

    if (!animate) {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      return;
    }

    if (lbIsAnimating) return;
    lbIsAnimating = true;

    const dir  = direction || 1;
    const wrap = lightboxImg.parentElement;

    // Фиксируем размер контейнера чтобы не было layout shift
    const vw = wrap.offsetWidth  || 800;
    const vh = wrap.offsetHeight || 600;
    Object.assign(wrap.style, {
      position: 'relative',
      overflow: 'hidden',
      width:    vw + 'px',
      height:   vh + 'px',
    });

    const baseStyle = {
      position: 'absolute', inset: '0', margin: 'auto',
      maxWidth: '100%', maxHeight: '100%',
      width: 'auto', height: 'auto', objectFit: 'contain',
      transition: 'none', willChange: 'transform',
    };

    // Клон уходящего фото — вставляем под incoming, закрывает чёрный фон
    const outgoing = document.createElement('img');
    outgoing.src = lightboxImg.src;
    outgoing.alt = lightboxImg.alt;
    Object.assign(outgoing.style, { ...baseStyle, transform: 'translateX(0)' });
    wrap.insertBefore(outgoing, lightboxImg);

    // Скрываем реальный img (за клонами)
    lightboxImg.style.visibility = 'hidden';

    // Входящее фото — начинает за экраном
    const incoming = document.createElement('img');
    incoming.src = src;
    incoming.alt = alt;
    Object.assign(incoming.style, { ...baseStyle, transform: `translateX(${dir * 100}%)` });
    wrap.appendChild(incoming);

    // Запускаем анимацию
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ease = 'transform 0.6s cubic-bezier(0.34, 0.9, 0.34, 1)';
        outgoing.style.transition = ease;
        incoming.style.transition = ease;
        outgoing.style.transform  = `translateX(${dir * -100}%)`;
        incoming.style.transform  = 'translateX(0)';
      });
    });

    // Cleanup — меняем src реального img, убираем клоны
    setTimeout(() => {
      lightboxImg.src              = src;
      lightboxImg.alt              = alt;
      lightboxImg.style.visibility = '';
      if (outgoing.parentElement) wrap.removeChild(outgoing);
      if (incoming.parentElement) wrap.removeChild(incoming);
      wrap.style.cssText = '';
      lbIsAnimating = false;
    }, 660);
  }

function lockScroll() {
    document.body.classList.add('mdp-lightbox-active');
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.body.classList.remove('mdp-lightbox-active');
    document.body.style.overflow = '';
  }

  function openLightbox(index) {
    setLightboxImage(index, false);
    lightbox.classList.add('open');
    lightboxOpen = true;
    lockScroll();
  }

  function closeLightbox() {
    if (!lightboxOpen) return;
    lightbox.classList.remove('open');
    lightboxOpen = false;
    unlockScroll();
  }

  function lightboxGoTo(index) {
    const dir = index > lightboxIndex ? 1 : -1;
    setLightboxImage(index, true, dir);
  }

  track.querySelectorAll('.mdp-hero-slide img').forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => lightboxGoTo(lightboxIndex - 1));
  lightboxNext.addEventListener('click', () => lightboxGoTo(lightboxIndex + 1));

  document.addEventListener('keydown', e => {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxGoTo(lightboxIndex - 1);
    if (e.key === 'ArrowRight') lightboxGoTo(lightboxIndex + 1);
  });

  let lbTouchStartX = 0, lbTouchStartY = 0;

  lightbox.addEventListener('touchstart', e => {
    lbTouchStartX = e.touches[0].clientX;
    lbTouchStartY = e.touches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    if (!lightboxOpen) return;
    const dx = lbTouchStartX - e.changedTouches[0].clientX;
    const dy = Math.abs(lbTouchStartY - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 40 && dy < 60) lightboxGoTo(lightboxIndex + (dx > 0 ? 1 : -1));
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
    if (lightboxOpen) return;
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
    navbar.classList.toggle('scrolled', window.scrollY > 80);
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

  buildDots();
  updateUI();
})();