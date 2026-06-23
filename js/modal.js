function openModal(id) {
  const m = modelData[id];
  if (!m) return;

  const images = (m.images && m.images.length) ? m.images : [m.image];
  let currentImg = 0;

  const specsHtml = m.specs.map(s =>
    `<div class="spec-row"><span class="spec-label">${s.label}</span><span class="spec-value">${s.value}</span></div>`
  ).join('');

  const dotsHtml = images.map((_, i) =>
    `<button class="mg-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Image ${i + 1}"></button>`
  ).join('');

  const showNav = images.length > 1 ? '' : ' style="display:none"';

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-hero modal-gallery">
      <div class="mg-track" id="mgTrack">
        ${images.map((src, i) => `<div class="mg-slide${i === 0 ? ' active' : ''}"><img src="${src}" alt="${m.name} ${i + 1}"></div>`).join('')}
      </div>
      <button class="mg-arrow mg-prev" id="mgPrev" aria-label="Previous image"${showNav}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button class="mg-arrow mg-next" id="mgNext" aria-label="Next image"${showNav}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="mg-dots" id="mgDots"${showNav}>${dotsHtml}</div>
      <div class="modal-hero-overlay">
        <span class="modal-cat">${m.category}</span>
        <h2 class="modal-name">${m.name}</h2>
        <span class="modal-tagline">${m.tagline}</span>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-desc-col">
        <h3>Overview</h3>
        <p>${m.description}</p>
        <div class="modal-price">${m.price}</div>
        <a href="#contact" class="btn-primary" id="modalBookBtn">Book a Test Drive</a>
      </div>
      <div class="modal-specs-col">
        <h3>Specifications</h3>
        <div class="specs-list">${specsHtml}</div>
      </div>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';

  const slides = document.querySelectorAll('.mg-slide');
  const dots = document.querySelectorAll('.mg-dot');

  function goToImg(index) {
    slides[currentImg].classList.remove('active');
    if (dots[currentImg]) dots[currentImg].classList.remove('active');
    currentImg = ((index % images.length) + images.length) % images.length;
    slides[currentImg].classList.add('active');
    if (dots[currentImg]) dots[currentImg].classList.add('active');
  }

  const prevBtn = document.getElementById('mgPrev');
  const nextBtn = document.getElementById('mgNext');
  if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); goToImg(currentImg - 1); });
  if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); goToImg(currentImg + 1); });

  dots.forEach(dot => {
    dot.addEventListener('click', e => { e.stopPropagation(); goToImg(parseInt(dot.dataset.index)); });
  });

  let touchStartX = 0, touchStartY = 0;
  const track = document.getElementById('mgTrack');
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 40 && dy < 60) goToImg(currentImg + (dx > 0 ? 1 : -1));
  });

  const bookBtn = document.getElementById('modalBookBtn');
  if (bookBtn) bookBtn.addEventListener('click', closeModal);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

document.addEventListener('click', e => {
  const btn = e.target.closest('.cov-details-btn');
  if (!btn) return;
  const modelId = btn.dataset.model;
  if (modelId === 'Panamera Turbo S E-Hybrid') {
    window.location.href = 'Car_Models/panamera-turbo-s-e-hybrid.html';
    return;
  }
  if (modelId === 'Taycan Turbo S') {
    window.location.href = 'Car_Models/taycan-turbo-s.html';
    return;
  }
  if (modelId === '911 GT3 (992.2)') {
    window.location.href = 'Car_Models/911_GT3_(992.2).html';
    return;
  }
  openModal(modelId);
});