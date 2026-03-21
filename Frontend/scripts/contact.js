// ─────────────────────────────────────────────────────────────────────────────
//  contact.js — Form Validation, Floating Labels & API Submit
// ─────────────────────────────────────────────────────────────────────────────

const BACKEND_URL = 'http://localhost:5000/contact';

const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

// ── Floating Labels ─────────────────────────────────────────────────────────
document.querySelectorAll('.form-group input, .form-group textarea').forEach((input) => {
  const label = input.nextElementSibling;
  // On focus / blur
  input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
  input.addEventListener('blur', () => {
    input.parentElement.classList.remove('focused');
    if (input.value.trim()) input.parentElement.classList.add('filled');
    else input.parentElement.classList.remove('filled');
    validateField(input);
  });
  input.addEventListener('input', () => {
    if (input.value.trim()) input.parentElement.classList.add('filled');
    else input.parentElement.classList.remove('filled');
    clearError(input);
  });
});

// ── Validation ──────────────────────────────────────────────────────────────
const validators = {
  name: (v) => {
    if (!v || v.trim().length < 2) return 'Name must be at least 2 characters.';
    if (v.trim().length > 100) return 'Name cannot exceed 100 characters.';
    return null;
  },
  age: (v) => {
    const n = parseInt(v);
    if (isNaN(n) || n < 10 || n > 100) return 'Age must be between 10 and 100.';
    return null;
  },
  email: (v) => {
    if (!v || !/^\S+@\S+\.\S+$/.test(v)) return 'Please enter a valid email address.';
    return null;
  },
  description: (v) => {
    if (!v || v.trim().length < 10) return 'Message must be at least 10 characters.';
    if (v.trim().length > 2000) return 'Message cannot exceed 2000 characters.';
    return null;
  }
};

function validateField(input) {
  const name = input.name;
  if (!validators[name]) return true;
  const error = validators[name](input.value);
  if (error) {
    showError(input, error);
    return false;
  }
  clearError(input);
  return true;
}

function showError(input, message) {
  const group = input.parentElement;
  group.classList.add('error');
  let errEl = group.querySelector('.field-error');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.classList.add('field-error');
    group.appendChild(errEl);
  }
  errEl.textContent = message;
}

function clearError(input) {
  const group = input.parentElement;
  group.classList.remove('error');
  const errEl = group.querySelector('.field-error');
  if (errEl) errEl.remove();
}

// ── Form Submit ─────────────────────────────────────────────────────────────
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = form.querySelectorAll('input, textarea');
    let isValid = true;
    fields.forEach((f) => { if (!validateField(f)) isValid = false; });

    if (!isValid) {
      showFormMessage('error', 'Please fix the errors above before submitting.');
      shakeForm();
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';
    hideFormMessage();

    const payload = {
      name: form.name_field.value.trim(),
      age: parseInt(form.age.value),
      email: form.email.value.trim(),
      description: form.description.value.trim()
    };

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showFormMessage('success', data.message || '🎉 Message sent successfully!');
        form.reset();
        document.querySelectorAll('.form-group').forEach((g) => g.classList.remove('filled', 'focused', 'error'));
        successAnimation();
      } else {
        const errors = data.errors ? data.errors.join(' ') : 'Submission failed. Please try again.';
        showFormMessage('error', errors);
      }
    } catch (err) {
      showFormMessage('error', 'Network error — please ensure the backend server is running.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
    }
  });
}

// ── UI Helpers ──────────────────────────────────────────────────────────────
function showFormMessage(type, text) {
  formMessage.className = `form-message ${type}`;
  formMessage.textContent = text;
  formMessage.style.display = 'block';
  gsap.fromTo(formMessage, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
}

function hideFormMessage() {
  formMessage.style.display = 'none';
}

function shakeForm() {
  gsap.fromTo(form, { x: -8 }, {
    x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)'
  });
}

function successAnimation() {
  gsap.timeline()
    .to(submitBtn, { scale: 1.1, duration: 0.2, ease: 'power2.out' })
    .to(submitBtn, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
}
