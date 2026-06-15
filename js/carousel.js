(function () {
  const cards = Array.from(document.querySelectorAll('.cov-card'));
  const total = cards.length;
  let current = 0;
  let isAnimating = false;

  function getConfig() {
    const w = window.innerWidth;
    if (w >= 1200) return { cardW: 420, cardH: 560, sideOffset: 340, sideScale: 0.72, sideRotY: 42, farOffset: 600, farScale: 0.48, farRotY: 55, visible: 2 };
    if (w >= 900)  return { cardW: 360, cardH: 490, sideOffset: 280, sideScale: 0.70, sideRotY: 40, farOffset: 480, farScale: 0.46, farRotY: 52, visible: 2 };
    if (w >= 600)  return { cardW: 300, cardH: 420, sideOffset: 220, sideScale: 0.68, sideRotY: 36, farOffset: 380, farScale: 0.44, farRotY: 50, visible: 1 };
    if (w >= 380)  return { cardW: 260, cardH: 380, sideOffset: 280, sideScale: 0.60, sideRotY: 0, farOffset: 380, farScale: 0.40, farRotY: 0, visible: 0 };
    return              { cardW: 230, cardH: 340, sideOffset: 260, sideScale: 0.55, sideRotY: 0, farOffset: 340, farScale: 0.36, farRotY: 0, visible: 0 };
  }

  function mod(n, m) { return ((n % m) + m) % m; }

  function applyTransforms(animate) {
    const cfg = getConfig();
    const stage = document.getElementById('covStage');
    stage.style.height = (cfg.cardH * 1.18) + 'px';

    cards.forEach((card, i) => {
      const offset = mod(i - current, total);
      const neg = offset > total / 2 ? offset - total : offset;
      const abs = Math.abs(neg);

      let tx, ry, scale, opacity, blur, zIndex, pointerEvents, visibility;

      if (neg === 0) {
        tx = 0; ry = 0; scale = 1; opacity = 1; blur = 0; zIndex = 10;
        pointerEvents = 'all'; visibility = 'visible';
      } else if (neg === 1 || neg === -1) {
        const sign = Math.sign(neg);
        tx = sign * cfg.sideOffset; ry = sign * -cfg.sideRotY; scale = cfg.sideScale;
        opacity = cfg.visible >= 1 ? 0.72 : 0;
        blur = cfg.visible >= 1 ? 1.5 : 0;
        zIndex = 6;
        pointerEvents = cfg.visible >= 1 ? 'all' : 'none';
        visibility = cfg.visible >= 1 ? 'visible' : 'hidden';
      } else if (neg === 2 || neg === -2) {
        const sign = Math.sign(neg);
        tx = sign * cfg.farOffset; ry = sign * -cfg.farRotY; scale = cfg.farScale;
        opacity = cfg.visible >= 2 ? 0.35 : 0;
        blur = cfg.visible >= 2 ? 4 : 0;
        zIndex = 3;
        pointerEvents = cfg.visible >= 2 ? 'all' : 'none';
        visibility = cfg.visible >= 2 ? 'visible' : 'hidden';
      } else {
        const sign = neg > 0 ? 1 : -1;
        tx = sign * (cfg.farOffset + 120); ry = sign * -cfg.farRotY; scale = cfg.farScale * 0.7;
        opacity = 0; blur = 8; zIndex = 1; pointerEvents = 'none'; visibility = 'hidden';
      }

      const dur = animate ? '0.72s' : '0s';
      card.style.transition = animate
        ? `transform ${dur} cubic-bezier(0.34,0.9,0.34,1), opacity ${dur} ease, filter ${dur} ease, z-index 0s, visibility 0s`
        : 'none';
      card.style.transform = `translateX(${tx}px) rotateY(${ry}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
      card.style.zIndex = zIndex;
      card.style.pointerEvents = pointerEvents;
      card.style.visibility = visibility;
      card.classList.toggle('is-active', neg === 0);

      const shadow = card.querySelector('.cov-card-inner');
      if (shadow) {
        shadow.style.boxShadow = neg === 0
          ? '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.07)'
          : '0 20px 40px rgba(0,0,0,0.5)';
      }
    });

    updatePagination();
  }

  function navigate(dir) {
    if (isAnimating) return;
    isAnimating = true;
    current = mod(current + dir, total);
    applyTransforms(true);
    setTimeout(() => { isAnimating = false; }, 750);
  }

  function goTo(index) {
    if (isAnimating || index === current) return;
    isAnimating = true;
    current = mod(index, total);
    applyTransforms(true);
    setTimeout(() => { isAnimating = false; }, 750);
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      const offset = mod(i - current, total);
      const neg = offset > total / 2 ? offset - total : offset;
      if (neg !== 0) goTo(i);
    });
  });

  document.getElementById('covPrev').addEventListener('click', () => navigate(-1));
  document.getElementById('covNext').addEventListener('click', () => navigate(1));

  const pagination = document.getElementById('covPagination');

  function buildPagination() {
    pagination.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'cov-dot';
      dot.setAttribute('aria-label', `Go to model ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      pagination.appendChild(dot);
    }
  }

  function updatePagination() {
    document.querySelectorAll('.cov-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  buildPagination();

  let touchStartX = 0, touchStartY = 0;
  const scene = document.getElementById('covScene');

  scene.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  scene.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 40 && dy < 60) {
      navigate(dx > 0 ? 1 : -1);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  applyTransforms(false);
  window.addEventListener('resize', () => applyTransforms(false));
})();