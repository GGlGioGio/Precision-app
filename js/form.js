(function () {

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?([-\s\.]?[0-9]{1,9}){1,6}$/;

  function showError(field, msg) {
    const wrap = field.closest('.form-field');
    if (!wrap) return;
    let err = wrap.querySelector('.form-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error';
      wrap.appendChild(err);
    }
    err.textContent = msg;
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('input-error');
  }

  function clearError(field) {
    const wrap = field.closest('.form-field');
    if (!wrap) return;
    const err = wrap.querySelector('.form-error');
    if (err) err.textContent = '';
    field.removeAttribute('aria-invalid');
    field.classList.remove('input-error');
  }

  function attachLiveValidation(form) {
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () { clearError(el); });
      el.addEventListener('change', function () { clearError(el); });
    });
  }

  function validateField(field) {
    const value = field.value;
    const tag   = field.tagName.toLowerCase();

    // First Name
    if (field.closest('.form-field') &&
        field.closest('.form-field').querySelector('label') &&
        field.closest('.form-field').querySelector('label').textContent.trim() === 'First Name') {
      if (!value || !value.trim()) { showError(field, 'First name is required.'); return false; }
    }

    // Last Name
    if (field.closest('.form-field') &&
        field.closest('.form-field').querySelector('label') &&
        field.closest('.form-field').querySelector('label').textContent.trim() === 'Last Name') {
      if (!value || !value.trim()) { showError(field, 'Last name is required.'); return false; }
    }

    // Email
    if (field.type === 'email') {
      if (!value.trim()) { showError(field, 'Email address is required.'); return false; }
      if (!EMAIL_RE.test(value.trim())) { showError(field, 'Please enter a valid email address.'); return false; }
    }

    // Phone
    if (field.type === 'tel') {
      if (!value.trim()) { showError(field, 'Phone number is required.'); return false; }
      const digits = value.replace(/\D/g, '');
      if (digits.length < 6 || !PHONE_RE.test(value.trim())) {
        showError(field, 'Please enter a valid phone number.');
        return false;
      }
    }

    if (tag === 'select') {
      if (!value) { showError(field, 'Please select a model.'); return false; }
    }

    if (field.type === 'date') {
      if (!value) { showError(field, 'Please choose a preferred date.'); return false; }
    }

    if (tag === 'textarea') {
      if (value.length > 500) {
        showError(field, 'Message must be 500 characters or fewer.');
        return false;
      }
    }

    clearError(field);
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;

    const firstName = form.querySelector('.form-row .form-field:nth-child(1) input');
    const lastName  = form.querySelector('.form-row .form-field:nth-child(2) input');
    const email     = form.querySelector('input[type="email"]');
    const phone     = form.querySelector('input[type="tel"]');
    const model     = form.querySelector('select');
    const date      = form.querySelector('input[type="date"]');
    const message   = form.querySelector('textarea');

    const results = [
      validateField(firstName),
      validateField(lastName),
      validateField(email),
      validateField(phone),
      validateField(model),
      validateField(date)
    ];

    if (message) validateField(message);

    const allValid = results.every(Boolean);

    if (!allValid) {
      const firstErr = form.querySelector('.input-error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 4000);
    form.reset();

    form.querySelectorAll('.input-error').forEach(function (el) {
      el.classList.remove('input-error');
      el.removeAttribute('aria-invalid');
    });
    form.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = '';
    });
  }

  const form = document.getElementById('contactForm');
  if (form) {
    form.setAttribute('novalidate', '');
    attachLiveValidation(form);
    form.addEventListener('submit', handleSubmit);
  }

})();