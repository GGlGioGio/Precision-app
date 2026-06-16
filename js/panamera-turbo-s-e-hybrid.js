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

  function setLightboxImage(index, animate, direction) {
    const prevIndex = lightboxIndex;
    lightboxIndex = ((index % total) + total) % total;
    const src = images[lightboxIndex];
    const altSource = track.querySelectorAll('.mdp-hero-slide img')[lightboxIndex];

    lightboxCounter.textContent = String(lightboxIndex + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');

    if (!animate) {
      lightboxImg.src = src;
      lightboxImg.alt = altSource ? altSource.alt : '';
      return;
    }

    // Slide direction: 1 = next (slide left), -1 = prev (slide right)
    const dir = direction || 1;
    const wrap = lightboxImg.parentElement;

    // Create incoming image element
    const incoming = document.createElement('img');
    incoming.className = 'mdp-lightbox-img';
    incoming.src = src;
    incoming.alt = altSource ? altSource.alt : '';
    incoming.style.cssText = `
      position: absolute;
      max-width: 100%;
      max-height: 85vh;
      width: auto;
      height: auto;
      object-fit: contain;
      transform: translateX(${dir * 100}%);
      transition: transform 0.55s cubic-bezier(0.34, 0.9, 0.34, 1), opacity 0.55s ease;
      opacity: 0;
    `;
    wrap.appendChild(incoming);

    // Animate current image out
    lightboxImg.style.cssText = `
      max-width: 100%;
      max-height: 85vh;
      width: auto;
      height: auto;
      object-fit: contain;
      transition: transform 0.55s cubic-bezier(0.34, 0.9, 0.34, 1), opacity 0.55s ease;
      transform: translateX(0);
      opacity: 1;
    `;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lightboxImg.style.transform = `translateX(${dir * -100}%)`;
        lightboxImg.style.opacity = '0';
        incoming.style.transform = 'translateX(0)';
        incoming.style.opacity = '1';
      });
    });

    setTimeout(() => {
      lightboxImg.src = src;
      lightboxImg.alt = altSource ? altSource.alt : '';
      lightboxImg.style.cssText = '';
      if (incoming.parentElement) wrap.removeChild(incoming);
    }, 580);
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