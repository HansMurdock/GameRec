/* ══════════════════════════════════
   login.js — GameRec Login Page
   ══════════════════════════════════ */

const RAWG_KEY = '5e3cc8c620f640a995fa3b40e5f6c93b'; // Ganti dengan API key RAWG kamu
const BASE_URL = 'https://api.rawg.io/api';

function apiUrl(path, params = {}) {
  const p = new URLSearchParams({ key: RAWG_KEY, ...params });
  return `${BASE_URL}/${path}?${p}`;
}

// ── GAME SLUGS untuk deco cards & background ──
const bgSlug   = 'elden-ring';
const decoSlugs = ['baldurs-gate-3', 'hades', 'sekiro-shadows-die-twice'];

// ── LOAD IMAGES ──────────────────────────────
async function fetchGameImg(slug) {
  try {
    const res = await fetch(apiUrl(`games/${slug}`));
    if (!res.ok) return null;
    const d = await res.json();
    return d.background_image || null;
  } catch { return null; }
}

async function initImages() {
  // Background panel
  const bgSrc = await fetchGameImg(bgSlug);
  if (bgSrc) {
    const el = document.getElementById('visual-bg-img');
    el.onload = () => el.classList.add('loaded');
    el.src = bgSrc;
  }

  // Decorative floating cards
  for (let i = 0; i < decoSlugs.length; i++) {
    const src = await fetchGameImg(decoSlugs[i]);
    if (!src) continue;
    const el = document.getElementById(`deco-img-${i + 1}`);
    if (!el) continue;
    el.onload = () => el.classList.add('loaded');
    el.src = src;
  }
}

// ── TAB SWITCHER (Login ↔ Register) ──────────
let activeTab = 'login';

function switchTab(tab) {
  activeTab = tab;

  document.querySelectorAll('.auth-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });

  const loginForm   = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (tab === 'login') {
    loginForm.style.display    = 'block';
    registerForm.style.display = 'none';
    document.getElementById('form-title').textContent    = 'Welcome back';
    document.getElementById('form-subtitle').textContent = 'Sign in to your GameRec account to continue.';
    document.getElementById('switch-text').innerHTML     = "Don't have an account? <a href='#' onclick=\"switchTab('register');return false;\">Create one</a>";
  } else {
    loginForm.style.display    = 'none';
    registerForm.style.display = 'block';
    document.getElementById('form-title').textContent    = 'Create account';
    document.getElementById('form-subtitle').textContent = 'Join thousands of gamers. Free forever.';
    document.getElementById('switch-text').innerHTML     = "Already have an account? <a href='#' onclick=\"switchTab('login');return false;\">Sign in</a>";
  }

  clearMessages();
}

// ── TOGGLE PASSWORD VISIBILITY ─────────────
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.innerHTML = isHidden
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

// ── PASSWORD STRENGTH ─────────────────────
function checkStrength(val) {
  const meter  = document.getElementById('strength-meter');
  const label  = document.getElementById('strength-label');
  const bars   = document.querySelectorAll('.strength-bar');

  if (!val) { meter.classList.remove('show'); return; }
  meter.classList.add('show');

  let score = 0;
  if (val.length >= 8)          score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { color: '#ff5555', text: 'Weak' },
    { color: '#ffa040', text: 'Fair' },
    { color: '#80c8ff', text: 'Good' },
    { color: '#00e676', text: 'Strong' },
  ];

  bars.forEach((bar, i) => {
    bar.style.background = i < score ? levels[score - 1].color : '';
  });
  label.textContent = levels[score - 1]?.text || '';
  label.style.color = levels[score - 1]?.color || 'var(--text3)';
}

// ── VALIDATION ────────────────────────────
function showError(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (input) input.classList.add('invalid');
  if (err)   { err.textContent = msg; err.classList.add('show'); }
}
function clearError(inputId, errId) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (input) input.classList.remove('invalid');
  if (err)   err.classList.remove('show');
}
function clearMessages() {
  document.querySelectorAll('.form-msg').forEach(m => m.classList.remove('error', 'success'));
  document.querySelectorAll('.form-input').forEach(i => i.classList.remove('invalid'));
  document.querySelectorAll('.input-error').forEach(e => e.classList.remove('show'));
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── LOGIN SUBMIT ──────────────────────────
function handleLogin(e) {
  e.preventDefault();
  clearMessages();

  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  let valid = true;

  if (!validateEmail(email)) {
    showError('login-email', 'login-email-err', 'Please enter a valid email address.');
    valid = false;
  }
  if (password.length < 6) {
    showError('login-password', 'login-pass-err', 'Password must be at least 6 characters.');
    valid = false;
  }
  if (!valid) return;

  const btn = document.getElementById('login-btn');
  btn.classList.add('loading');
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin .7s linear infinite"><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg> Signing in...`;

  // Simulate API call
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.innerHTML = `Sign In <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;

    const msg = document.getElementById('login-msg');
    msg.textContent = '✓ Signed in successfully! Redirecting...';
    msg.classList.add('success');

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1200);
  }, 1500);
}

// ── REGISTER SUBMIT ───────────────────────
function handleRegister(e) {
  e.preventDefault();
  clearMessages();

  const firstName = document.getElementById('reg-firstname').value.trim();
  const lastName  = document.getElementById('reg-lastname').value.trim();
  const username  = document.getElementById('reg-username').value.trim();
  const email     = document.getElementById('reg-email').value.trim();
  const password  = document.getElementById('reg-password').value;
  const confirm   = document.getElementById('reg-confirm').value;
  let valid = true;

  if (!firstName) { showError('reg-firstname', 'reg-firstname-err', 'Required.'); valid = false; }
  if (!lastName)  { showError('reg-lastname',  'reg-lastname-err',  'Required.'); valid = false; }
  if (username.length < 3) { showError('reg-username', 'reg-username-err', 'Min 3 characters.'); valid = false; }
  if (!validateEmail(email)) { showError('reg-email', 'reg-email-err', 'Enter a valid email.'); valid = false; }
  if (password.length < 8)  { showError('reg-password', 'reg-pass-err', 'Min 8 characters.'); valid = false; }
  if (password !== confirm)  { showError('reg-confirm', 'reg-confirm-err', 'Passwords do not match.'); valid = false; }

  const terms = document.getElementById('reg-terms');
  if (!terms.checked) {
    const msg = document.getElementById('register-msg');
    msg.textContent = 'Please accept the Terms of Service to continue.';
    msg.classList.add('error');
    valid = false;
  }

  if (!valid) return;

  const btn = document.getElementById('register-btn');
  btn.classList.add('loading');
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin .7s linear infinite"><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg> Creating account...`;

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.innerHTML = `Create Account <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;

    const msg = document.getElementById('register-msg');
    msg.textContent = `✓ Account created! Welcome to GameRec, ${firstName}!`;
    msg.classList.add('success');

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1500);
  }, 1800);
}

// ── REALTIME INPUT CLEAR ERRORS ───────────
function initInputListeners() {
  // Login
  document.getElementById('login-email')?.addEventListener('input', () => clearError('login-email', 'login-email-err'));
  document.getElementById('login-password')?.addEventListener('input', () => clearError('login-password', 'login-pass-err'));

  // Register
  ['reg-firstname','reg-lastname','reg-username','reg-email','reg-password','reg-confirm'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      clearError(id, id + '-err');
      if (id === 'reg-password') {
        checkStrength(document.getElementById('reg-password').value);
      }
    });
  });
}

// ── SPIN KEYFRAME ─────────────────────────
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

// ── INIT ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initImages();
  initInputListeners();
});