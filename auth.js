/* auth.js — Authentication, Booking & Payment system
   Endless Line — полная система авторизации и бронирования */

const API = 'http://localhost:5000/api';

/* ── AUTH STATE ─────────────────────────────────────────── */
function getToken() { return localStorage.getItem('el_token'); }
function getUser() { try { return JSON.parse(localStorage.getItem('el_user')); } catch { return null; } }
function isLoggedIn() { return !!getToken(); }

function saveAuth(token, user) {
  localStorage.setItem('el_token', token);
  localStorage.setItem('el_user', JSON.stringify(user));
  updateHeaderAuth();
}

function logout() {
  localStorage.removeItem('el_token');
  localStorage.removeItem('el_user');
  updateHeaderAuth();
  showToast('Вы вышли из аккаунта', 'success');
}

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() };
}

/* ── HELPERS ───────────────────────────────────────────── */
function showFormError(formEl, msg) {
  clearFormError(formEl);
  const err = document.createElement('div');
  err.className = 'form-error-msg';
  err.innerHTML = `<span class="form-error-icon">⚠️</span> ${msg}`;
  const firstField = formEl.querySelector('.auth-field');
  if (firstField) firstField.before(err);
  else formEl.prepend(err);
}

function clearFormError(formEl) {
  formEl?.querySelectorAll('.form-error-msg').forEach(e => e.remove());
}

function showFieldError(inputEl, msg) {
  clearFieldError(inputEl);
  inputEl.classList.add('input-error');
  const err = document.createElement('div');
  err.className = 'field-error-msg';
  err.textContent = msg;
  inputEl.parentElement.appendChild(err);
}

function clearFieldError(inputEl) {
  inputEl.classList.remove('input-error');
  inputEl.parentElement?.querySelector('.field-error-msg')?.remove();
}

// Extract error from server response
function getError(data) {
  return data?.message || data?.error || data?.msg || 'Неизвестная ошибка';
}

// Safe fetch with connection error handling
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return { res, data, ok: res.ok };
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      return { res: null, data: null, ok: false, connectionError: true };
    }
    return { res: null, data: null, ok: false, connectionError: true };
  }
}

/* ── UPDATE HEADER ──────────────────────────────────────── */
function updateHeaderAuth() {
  const loginBtn = document.getElementById('btn-login');
  const userArea = document.getElementById('user-area');
  if (!loginBtn || !userArea) return;

  if (isLoggedIn()) {
    const user = getUser();
    loginBtn.style.display = 'none';
    userArea.style.display = 'flex';
    userArea.innerHTML = `
      <button class="user-avatar-btn" onclick="toggleUserMenu()">
        <span class="user-avatar-circle">${(user?.name || 'U')[0].toUpperCase()}</span>
        <span class="user-name-text">${user?.name || 'Пользователь'}</span>
      </button>
      <div class="user-dropdown" id="user-dropdown">
        <div class="ud-header">
          <div class="ud-name">${user?.name}</div>
          <div class="ud-email">${user?.email}</div>
        </div>
        <div class="ud-divider"></div>
        <button class="ud-item" onclick="openProfileModal()">👤 Мой профиль</button>
        <button class="ud-item" onclick="openBookingsModal()">📋 Мои бронирования</button>
        <button class="ud-item" onclick="openReviewModal()">⭐ Оставить отзыв</button>
        <div class="ud-divider"></div>
        <button class="ud-item ud-logout" onclick="logout()">🚪 Выйти</button>
      </div>
    `;
  } else {
    loginBtn.style.display = '';
    userArea.style.display = 'none';
    userArea.innerHTML = '';
  }
}

function toggleUserMenu() {
  const dd = document.getElementById('user-dropdown');
  if (dd) dd.classList.toggle('open');
}

document.addEventListener('click', (e) => {
  const dd = document.getElementById('user-dropdown');
  if (dd && dd.classList.contains('open') && !e.target.closest('.user-avatar-btn') && !e.target.closest('.user-dropdown')) {
    dd.classList.remove('open');
  }
});

/* ── AUTH MODAL ─────────────────────────────────────────── */
function openAuthModal(mode = 'login') {
  closeAllModals();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'auth-modal';
  overlay.innerHTML = `
    <div class="modal auth-modal">
      <button class="modal-close" onclick="closeAllModals()">×</button>
      <div class="auth-logo">✈️ Endless Line</div>
      <div class="auth-tabs">
        <button class="auth-tab ${mode === 'login' ? 'active' : ''}" onclick="switchAuthTab('login')">Войти</button>
        <button class="auth-tab ${mode === 'register' ? 'active' : ''}" onclick="switchAuthTab('register')">Регистрация</button>
      </div>

      <form id="login-form" class="auth-form" style="display:${mode === 'login' ? 'block' : 'none'}" onsubmit="handleLogin(event)">
        <div class="auth-field">
          <label>Email</label>
          <input type="email" id="login-email" class="s-input" placeholder="Введите email" required
            oninput="clearFieldError(this)">
        </div>
        <div class="auth-field">
          <label>Пароль</label>
          <input type="password" id="login-pass" class="s-input" placeholder="Пароль" required
            oninput="clearFieldError(this)">
        </div>
        <div id="login-error-area"></div>
        <button type="submit" class="btn-primary auth-submit" id="login-btn">
          <span class="btn-text">Войти</span>
        </button>
        <p class="auth-switch">Нет аккаунта? <a href="#" onclick="switchAuthTab('register');return false">Зарегистрируйтесь</a></p>
      </form>

      <form id="register-form" class="auth-form" style="display:${mode === 'register' ? 'block' : 'none'}" onsubmit="handleRegister(event)">
        <div class="auth-field">
          <label>Имя *</label>
          <input type="text" id="reg-name" class="s-input" placeholder="Имя и фамилия" required minlength="2"
            oninput="clearFieldError(this)">
        </div>
        <div class="auth-field">
          <label>Email *</label>
          <input type="email" id="reg-email" class="s-input" placeholder="Введите email" required
            oninput="clearFieldError(this)">
        </div>
        <div class="auth-field">
          <label>Телефон</label>
          <input type="tel" id="reg-phone" class="s-input" placeholder="+7 (777) 123-45-67"
            oninput="formatPhone(this)">
        </div>
        <div class="auth-field">
          <label>Пароль *</label>
          <input type="password" id="reg-pass" class="s-input" placeholder="Пароль (мин. 6 символов)" required minlength="6"
            oninput="clearFieldError(this);checkPassStrength(this)">
          <div class="pass-strength" id="pass-strength"></div>
        </div>
        <div class="auth-field">
          <label>Повторите пароль *</label>
          <input type="password" id="reg-pass2" class="s-input" placeholder="Повторите пароль" required
            oninput="clearFieldError(this)">
        </div>
        <div id="register-error-area"></div>
        <button type="submit" class="btn-primary auth-submit" id="reg-btn">
          <span class="btn-text">Зарегистрироваться</span>
        </button>
        <p class="auth-switch">Уже есть аккаунт? <a href="#" onclick="switchAuthTab('login');return false">Войдите</a></p>
      </form>
    </div>
  `;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAllModals(); });
  document.body.appendChild(overlay);
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.style.display = 'none');
  document.querySelectorAll('.form-error-msg').forEach(e => e.remove());
  document.querySelectorAll('.auth-error-box').forEach(e => e.remove());
  if (tab === 'login') {
    document.querySelector('.auth-tab:first-child')?.classList.add('active');
    document.getElementById('login-form').style.display = 'block';
  } else {
    document.querySelector('.auth-tab:last-child')?.classList.add('active');
    document.getElementById('register-form').style.display = 'block';
  }
}

function formatPhone(el) {
  let v = el.value.replace(/[^\d+]/g, '');
  if (v.length > 0 && !v.startsWith('+')) v = '+' + v;
  el.value = v;
}

function checkPassStrength(el) {
  const bar = document.getElementById('pass-strength');
  if (!bar) return;
  const val = el.value;
  let str = 0;
  if (val.length >= 6) str++;
  if (val.length >= 10) str++;
  if (/[A-Z]/.test(val)) str++;
  if (/\d/.test(val)) str++;
  if (/[^a-zA-Z0-9]/.test(val)) str++;
  const labels = ['', 'Слабый', 'Средний', 'Хороший', 'Сильный', 'Отличный'];
  const colors = ['', '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#16a34a'];
  if (val.length === 0) { bar.innerHTML = ''; return; }
  bar.innerHTML = `<div class="pass-bar" style="width:${str*20}%;background:${colors[str]}"></div><span style="color:${colors[str]}">${labels[str]}</span>`;
}

function showAuthError(areaId, msg) {
  const area = document.getElementById(areaId);
  if (!area) return;
  area.innerHTML = `<div class="auth-error-box"><span class="form-error-icon">❌</span> ${msg}</div>`;
}

function clearAuthError(areaId) {
  const area = document.getElementById(areaId);
  if (area) area.innerHTML = '';
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('login-btn');
  const emailEl = document.getElementById('login-email');
  const passEl = document.getElementById('login-pass');
  clearAuthError('login-error-area');

  // Client validation
  if (!emailEl.value.trim()) { showFieldError(emailEl, 'Введите email'); return; }
  if (!passEl.value) { showFieldError(passEl, 'Введите пароль'); return; }

  btn.innerHTML = '<span class="spinner"></span> Входим...';
  btn.disabled = true;

  const { res, data, ok, connectionError } = await safeFetch(API + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: emailEl.value.trim(), password: passEl.value })
  });

  if (connectionError) {
    showAuthError('login-error-area', 'Сервер недоступен. Убедитесь, что сервер запущен на порту 5000.<br><code>cd server && node server.js</code>');
    btn.innerHTML = '<span class="btn-text">Войти</span>'; btn.disabled = false;
    return;
  }

  if (!ok) {
    const errMsg = getError(data);
    showAuthError('login-error-area', errMsg);
    if (errMsg.toLowerCase().includes('email') || errMsg.toLowerCase().includes('пароль')) {
      emailEl.classList.add('input-error');
      passEl.classList.add('input-error');
    }
    btn.innerHTML = '<span class="btn-text">Войти</span>'; btn.disabled = false;
    return;
  }

  saveAuth(data.token, data.user);
  closeAllModals();
  showToast(`Добро пожаловать, ${data.user.name}!`, 'success');
}

async function handleRegister(e) {
  e.preventDefault();
  const nameEl = document.getElementById('reg-name');
  const emailEl = document.getElementById('reg-email');
  const passEl = document.getElementById('reg-pass');
  const pass2El = document.getElementById('reg-pass2');
  const btn = document.getElementById('reg-btn');
  clearAuthError('register-error-area');

  // Client-side validation with specific field errors
  let valid = true;
  if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
    showFieldError(nameEl, 'Имя должно быть минимум 2 символа'); valid = false;
  }
  if (!emailEl.value.trim() || !/^\S+@\S+\.\S+$/.test(emailEl.value)) {
    showFieldError(emailEl, 'Введите корректный email (пример: user@mail.com)'); valid = false;
  }
  if (passEl.value.length < 6) {
    showFieldError(passEl, 'Пароль должен быть минимум 6 символов'); valid = false;
  }
  if (passEl.value !== pass2El.value) {
    showFieldError(pass2El, 'Пароли не совпадают'); valid = false;
  }
  if (!valid) return;

  btn.innerHTML = '<span class="spinner"></span> Регистрация...';
  btn.disabled = true;

  const { res, data, ok, connectionError } = await safeFetch(API + '/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      phone: document.getElementById('reg-phone').value.trim(),
      password: passEl.value
    })
  });

  if (connectionError) {
    showAuthError('register-error-area', 'Сервер недоступен. Убедитесь, что сервер запущен на порту 5000.<br><code>cd server && node server.js</code>');
    btn.innerHTML = '<span class="btn-text">Зарегистрироваться</span>'; btn.disabled = false;
    return;
  }

  if (!ok) {
    const errMsg = getError(data);
    showAuthError('register-error-area', errMsg);
    // Highlight specific fields based on error
    if (errMsg.includes('email') || errMsg.includes('Email')) showFieldError(emailEl, errMsg);
    else if (errMsg.includes('пароль') || errMsg.includes('Пароль')) showFieldError(passEl, errMsg);
    else if (errMsg.includes('имя') || errMsg.includes('Имя')) showFieldError(nameEl, errMsg);
    btn.innerHTML = '<span class="btn-text">Зарегистрироваться</span>'; btn.disabled = false;
    return;
  }

  saveAuth(data.token, data.user);
  closeAllModals();
  showToast(`Аккаунт создан! Добро пожаловать, ${data.user.name}!`, 'success');
}

/* ── BOOKING MODAL ──────────────────────────────────────── */
function openBookingModal(tourName, price, nights, country, hotel) {
  closeAllModals();
  const user = getUser();
  const isGuest = !isLoggedIn();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'booking-modal';
  overlay.innerHTML = `
    <div class="modal booking-modal">
      <button class="modal-close" onclick="closeAllModals()">×</button>
      ${ isGuest ? `<div style="background:rgba(255,140,0,0.1);border:1px solid rgba(255,140,0,0.35);border-radius:10px;padding:10px 14px;margin-bottom:16px;font-size:0.82rem;color:#ffb020;display:flex;align-items:center;gap:8px"><span style="font-size:1.1rem">⚠️</span><span>Вы не вошли. Для оплаты нужна <a href="#" onclick="event.preventDefault();closeAllModals();openAuthModal('login')" style="color:var(--c-primary);font-weight:700">авторизация</a>.</span></div>` : ''}
      <h2 class="bm-title">Бронирование тура</h2>
      <div class="bm-tour-info">
        <div class="bm-tour-name">${tourName}</div>
        <div class="bm-tour-detail">${country}${nights ? ' · ' + nights + ' ночей' : ''} · ${hotel || ''}</div>
      </div>
      <form onsubmit="handleBooking(event)" id="booking-form">
        <input type="hidden" id="bk-tour" value="${tourName}">
        <input type="hidden" id="bk-price-base" value="${price}">
        <input type="hidden" id="bk-country" value="${country}">
        <input type="hidden" id="bk-nights" value="${nights || 7}">
        <input type="hidden" id="bk-is-guest" value="${isGuest ? '1' : '0'}">
        <div class="auth-field">
          <label>Имя</label>
          <input type="text" class="s-input" value="${user?.name || ''}" required id="bk-name" placeholder="Имя и фамилия">
        </div>
        ${isGuest ? `<div class="auth-field"><label>Email</label><input type="email" class="s-input" id="bk-guest-email" placeholder="Ваш email для подтверждения" required></div>` : ''}
        <div class="bm-row">
          <div class="auth-field">
            <label>Дата заезда</label>
            <input type="date" class="s-input" id="bk-date-from" required>
          </div>
          <div class="auth-field">
            <label>Туристы</label>
            <select class="s-input" id="bk-passengers" onchange="updateBookingPrice()">
              <option value="1">1 турист</option>
              <option value="2" selected>2 туриста</option>
              <option value="3">3 туриста</option>
              <option value="4">4 туриста</option>
              <option value="5">5 туристов</option>
            </select>
          </div>
        </div>
        <div class="auth-field">
          <label>Питание</label>
          <select class="s-input" id="bk-meal">
            <option value="bb">Завтраки (BB)</option>
            <option value="hb">Полупансион (HB)</option>
            <option value="fb">Полный пансион (FB)</option>
            <option value="ai" selected>Всё включено (AI)</option>
          </select>
        </div>
        <div class="auth-field">
          <label>Пожелания</label>
          <textarea class="s-input" id="bk-notes" rows="2" placeholder="Доп. кровать, вид на море и т.д."></textarea>
        </div>
        <div class="bm-price-block">
          <div class="bm-price-label">Итого к оплате:</div>
          <div class="bm-price-value" id="bk-total">${(price * 2).toLocaleString('ru-RU')} ₸</div>
        </div>
        <div id="booking-error-area"></div>
        <button type="submit" class="btn-primary auth-submit" id="bk-submit-btn">Перейти к оплате →</button>
      </form>
    </div>
  `;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAllModals(); });
  document.body.appendChild(overlay);

  const d = new Date(); d.setDate(d.getDate() + 14);
  document.getElementById('bk-date-from').value = d.toISOString().split('T')[0];
}

function updateBookingPrice() {
  const base = parseInt(document.getElementById('bk-price-base')?.value || 0);
  const pass = parseInt(document.getElementById('bk-passengers')?.value || 1);
  const total = base * pass;
  const el = document.getElementById('bk-total');
  if (el) el.textContent = total.toLocaleString('ru-RU') + ' ₸';
}

function handleBooking(e) {
  e.preventDefault();
  const isGuest = document.getElementById('bk-is-guest')?.value === '1';
  const base = parseInt(document.getElementById('bk-price-base')?.value || 0);
  const pass = parseInt(document.getElementById('bk-passengers')?.value || 1);
  const total = base * pass;
  const tourName = document.getElementById('bk-tour')?.value;
  const country = document.getElementById('bk-country')?.value;
  const nights = parseInt(document.getElementById('bk-nights')?.value || 7);

  if (isGuest && !isLoggedIn()) {
    // Guest path: show login/register prompt before payment
    const guestEmail = document.getElementById('bk-guest-email')?.value;
    closeAllModals();
    showToast('Для оплаты необходимо войти в аккаунт', 'warning');
    setTimeout(() => openAuthModal('login'), 400);
    return;
  }

  openPaymentModal(total, tourName, country, pass, document.getElementById('bk-date-from')?.value, nights);
}

/* ── SAVED CARDS ─────────────────────────────────────────── */
function getSavedCards() {
  try { return JSON.parse(localStorage.getItem('el_saved_cards') || '[]'); } catch { return []; }
}

function saveCard(card) {
  const cards = getSavedCards();
  if (cards.some(c => c.number === card.number)) return;
  cards.push(card);
  localStorage.setItem('el_saved_cards', JSON.stringify(cards));
}

function deleteCard(index) {
  const cards = getSavedCards();
  cards.splice(index, 1);
  localStorage.setItem('el_saved_cards', JSON.stringify(cards));
  // Re-render saved cards in whichever modal is open
  renderSavedCardsInModal();
  // Re-render profile cards if profile is open
  renderProfileCards();
}

function detectCardType(number) {
  const n = number.replace(/\s/g, '');
  if (n.startsWith('4')) return 'visa';
  if (/^(222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(n)) return 'mir';
  if (n.startsWith('5') || n.startsWith('2')) return 'mc';
  return 'other';
}

function cardTypeBadge(type) {
  const map = { visa: 'Visa', mc: 'MC', mir: 'Мир', other: '••' };
  return `<span class="saved-card-logo-text saved-card-logo-${type}">${map[type] || '••'}</span>`;
}

function maskCard(number) {
  const n = number.replace(/\s/g, '');
  return '•••• •••• •••• ' + n.slice(-4);
}

function renderSavedCardsInModal() {
  const wrap = document.getElementById('saved-cards-wrap');
  if (!wrap) return;
  const cards = getSavedCards();
  if (cards.length === 0) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  const list = wrap.querySelector('.saved-card-list');
  if (!list) return;
  list.innerHTML = cards.map((c, i) => `
    <div class="saved-card-item" onclick="fillSavedCard(${i})" id="sc-item-${i}">
      ${cardTypeBadge(c.type)}
      <div class="saved-card-info">
        <div class="saved-card-number">${maskCard(c.number)}</div>
        <div class="saved-card-exp">до ${c.exp} · ${c.name}</div>
      </div>
      <button class="saved-card-del" onclick="event.stopPropagation();deleteCard(${i})" title="Удалить">🗑</button>
    </div>
  `).join('');
}

function fillSavedCard(index) {
  const cards = getSavedCards();
  const card = cards[index];
  if (!card) return;
  // Deselect all, select this
  document.querySelectorAll('.saved-card-item').forEach((el, i) => {
    el.classList.toggle('selected', i === index);
  });
  const cardEl = document.getElementById('pay-card');
  const expEl = document.getElementById('pay-exp');
  const nameEl = document.getElementById('pay-name');
  if (cardEl) { cardEl.value = card.number; clearFieldError(cardEl); }
  if (expEl) { expEl.value = card.exp; clearFieldError(expEl); }
  if (nameEl) { nameEl.value = card.name; }
  // Focus CVV
  document.getElementById('pay-cvv')?.focus();
}

function renderProfileCards() {
  const list = document.getElementById('profile-cards-list');
  if (!list) return;
  const cards = getSavedCards();
  if (cards.length === 0) {
    list.innerHTML = '<p style="color:var(--c-text-3);font-size:0.875rem;margin-bottom:12px">Нет сохранённых карт</p>';
    return;
  }
  list.innerHTML = cards.map((c, i) => `
    <div class="profile-card-item">
      ${cardTypeBadge(c.type)}
      <div class="profile-card-main">
        <div class="profile-card-num">${maskCard(c.number)}</div>
        <div class="profile-card-meta">до ${c.exp}</div>
      </div>
      <button class="saved-card-del" onclick="deleteCard(${i})" title="Удалить">🗑</button>
    </div>
  `).join('');
}

/* ── PAYMENT MODAL ──────────────────────────────────────── */
function openPaymentModal(amount, tourName, country, passengers, dateFrom, nights) {
  closeAllModals();
  const safetour = (tourName || '').replace(/'/g, "\\'");
  const safeCountry = (country || '').replace(/'/g, "\\'");
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'payment-modal';
  overlay.innerHTML = `
    <div class="modal payment-modal">
      <button class="modal-close" onclick="closeAllModals()">×</button>
      <div class="pm-header">
        <div class="pm-lock">🔒</div>
        <h2 class="bm-title">Безопасная оплата</h2>
        <p class="pm-subtitle">Данные защищены SSL-шифрованием</p>
      </div>
      <div class="pm-amount">
        <span>К оплате:</span>
        <strong>${amount.toLocaleString('ru-RU')} ₸</strong>
      </div>
      <form id="payment-form" onsubmit="processPayment(event)">
        <input type="hidden" id="pm-amount" value="${amount}">
        <input type="hidden" id="pm-tour" value="${safetour}">
        <input type="hidden" id="pm-country" value="${safeCountry}">
        <input type="hidden" id="pm-pass" value="${passengers}">
        <input type="hidden" id="pm-date" value="${dateFrom}">
        <input type="hidden" id="pm-nights" value="${nights || 7}">

        <!-- Saved cards -->
        <div class="saved-cards-section" id="saved-cards-wrap" style="display:none">
          <div class="saved-cards-title">Сохранённые карты</div>
          <div class="saved-card-list" id="saved-card-list"></div>
          <div class="or-divider"><span>или введите новую карту</span></div>
        </div>

        <div class="auth-field">
          <label>Номер карты</label>
          <div style="position:relative">
            <input type="text" class="s-input card-input" id="pay-card" placeholder="0000 0000 0000 0000" maxlength="19" required
              oninput="formatCardNumber(this);clearFieldError(this);updateCardTypeBadge(this)" autocomplete="cc-number">
            <span id="card-type-badge" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:0.7rem;font-weight:700;padding:2px 7px;border-radius:4px;pointer-events:none"></span>
          </div>
        </div>
        <div class="bm-row">
          <div class="auth-field">
            <label>Срок действия</label>
            <input type="text" class="s-input" id="pay-exp" placeholder="MM/YY" maxlength="5" required
              oninput="formatExpiry(this);clearFieldError(this)" autocomplete="cc-exp">
          </div>
          <div class="auth-field">
            <label>CVV</label>
            <input type="password" class="s-input" id="pay-cvv" placeholder="•••" maxlength="4" required autocomplete="cc-csc"
              oninput="clearFieldError(this)">
          </div>
        </div>
        <div class="auth-field">
          <label>Имя на карте</label>
          <input type="text" class="s-input" id="pay-name" placeholder="ИМЯ ФАМИЛИЯ" required style="text-transform:uppercase" autocomplete="cc-name">
        </div>
        <div class="save-card-row">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.875rem;color:var(--c-text-2)">
            <input type="checkbox" id="save-card-cb" style="width:16px;height:16px;accent-color:var(--c-primary)">
            Сохранить карту для следующих платежей
          </label>
        </div>
        <div class="pm-cards">
          <span class="pm-card-badge visa">VISA</span>
          <span class="pm-card-badge mc">MC</span>
          <span class="pm-card-badge mir">МИР</span>
        </div>
        <div id="payment-error-area"></div>
        <button type="submit" class="btn-primary auth-submit pm-pay-btn" id="pay-btn">
          Оплатить ${amount.toLocaleString('ru-RU')} ₸
        </button>
      </form>
    </div>
  `;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAllModals(); });
  document.body.appendChild(overlay);
  renderSavedCardsInModal();
}

function updateCardTypeBadge(el) {
  const badge = document.getElementById('card-type-badge');
  if (!badge) return;
  const type = detectCardType(el.value);
  if (!el.value.replace(/\s/g, '')) { badge.textContent = ''; badge.className = ''; return; }
  const labels = { visa: 'VISA', mc: 'MC', mir: 'МИР', other: '' };
  const bgMap = { visa: '#1A1F71', mc: '#EB001B', mir: '#006848', other: 'transparent' };
  badge.textContent = labels[type] || '';
  badge.style.background = bgMap[type] || 'transparent';
  badge.style.color = '#fff';
}

function formatCardNumber(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 16);
  el.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
  el.value = v;
}

async function processPayment(e) {
  e.preventDefault();
  const btn = document.getElementById('pay-btn');
  const cardEl = document.getElementById('pay-card');
  const expEl = document.getElementById('pay-exp');
  const cvvEl = document.getElementById('pay-cvv');
  const card = cardEl.value.replace(/\s/g, '');

  clearAuthError('payment-error-area');

  // Validate card
  let valid = true;
  if (card.length < 16) { showFieldError(cardEl, 'Введите полный 16-значный номер карты'); valid = false; }
  const exp = expEl.value;
  if (!/^\d{2}\/\d{2}$/.test(exp)) { showFieldError(expEl, 'Формат: MM/YY'); valid = false; }
  else {
    const month = parseInt(exp.split('/')[0]);
    if (month < 1 || month > 12) { showFieldError(expEl, 'Месяц от 01 до 12'); valid = false; }
  }
  if (cvvEl.value.length < 3) { showFieldError(cvvEl, 'CVV — 3 цифры'); valid = false; }
  if (!valid) return;

  const amount = parseInt(document.getElementById('pm-amount').value);
  const tourName = document.getElementById('pm-tour').value;
  const country = document.getElementById('pm-country').value;
  const passengers = parseInt(document.getElementById('pm-pass').value);
  const dateFrom = document.getElementById('pm-date').value;
  const nights = parseInt(document.getElementById('pm-nights').value) || 7;
  const saveCardChecked = document.getElementById('save-card-cb')?.checked;
  const cardNameVal = document.getElementById('pay-name')?.value?.trim();
  const cardExpVal = expEl.value;
  const cardNumVal = cardEl.value.replace(/\s/g, '');

  btn.innerHTML = '<span class="spinner"></span> Обработка платежа...';
  btn.disabled = true;

  await new Promise(r => setTimeout(r, 2000));

  const returnDate = new Date(new Date(dateFrom).getTime() + nights * 86400000).toISOString().split('T')[0];

  const { data, ok, connectionError } = await safeFetch(API + '/bookings', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      type: 'air',
      from: 'Алматы',
      to: country || tourName,
      departDate: dateFrom,
      returnDate: returnDate,
      passengers: passengers
    })
  });

  if (saveCardChecked) {
    saveCard({ number: cardNumVal, exp: cardExpVal, name: cardNameVal, type: detectCardType(cardNumVal) });
  }

  if (connectionError) {
    // Offline mode — simulate success
    closeAllModals();
    openSuccessModal(tourName, amount, 'EL-' + Date.now());
    showToast('Бронирование создано (офлайн-режим)', 'warning');
    return;
  }

  if (!ok) {
    const errMsg = getError(data);
    showAuthError('payment-error-area', 'Ошибка бронирования: ' + errMsg);
    btn.innerHTML = `Оплатить ${amount.toLocaleString('ru-RU')} ₸`;
    btn.disabled = false;
    return;
  }

  closeAllModals();
  openSuccessModal(tourName, amount, data._id || 'EL-' + Date.now());
}

function openSuccessModal(tourName, amount, bookingId) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'success-modal';
  overlay.innerHTML = `
    <div class="modal success-modal">
      <div class="sm-icon">✅</div>
      <h2 class="sm-title">Бронирование подтверждено!</h2>
      <p class="sm-text">Ваш тур <strong>"${tourName}"</strong> успешно оплачен</p>
      <div class="sm-details">
        <div class="sm-row"><span>Номер брони:</span><strong>${bookingId}</strong></div>
        <div class="sm-row"><span>Сумма:</span><strong>${amount.toLocaleString('ru-RU')} ₸</strong></div>
        <div class="sm-row"><span>Статус:</span><strong style="color:var(--c-success)">Подтверждён</strong></div>
      </div>
      <p class="sm-note">📧 Подтверждение отправлено на вашу почту</p>
      <div style="display:flex;gap:10px">
        <button class="btn-primary auth-submit" style="flex:1" onclick="closeAllModals()">Отлично!</button>
        <button class="btn-secondary auth-submit" style="flex:1" onclick="closeAllModals();openBookingsModal()">Мои брони</button>
      </div>
    </div>
  `;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAllModals(); });
  document.body.appendChild(overlay);
  showToast('Бронирование успешно оплачено!', 'success');
}

/* ── BOOKINGS LIST MODAL ────────────────────────────────── */
async function openBookingsModal() {
  if (!isLoggedIn()) { openAuthModal(); return; }
  closeAllModals();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'bookings-modal';
  overlay.innerHTML = `
    <div class="modal bookings-modal">
      <button class="modal-close" onclick="closeAllModals()">×</button>
      <h2 class="bm-title">📋 Мои бронирования</h2>
      <div id="bookings-list" class="bk-list"><div class="bk-loading"><span class="spinner" style="border-color:rgba(255,90,0,0.2);border-top-color:var(--c-primary)"></span> Загрузка...</div></div>
    </div>
  `;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAllModals(); });
  document.body.appendChild(overlay);

  const { data, ok, connectionError } = await safeFetch(API + '/bookings', { headers: authHeaders() });
  const list = document.getElementById('bookings-list');

  if (connectionError) {
    list.innerHTML = '<div class="bk-empty"><div class="auth-error-box"><span class="form-error-icon">🔌</span> Сервер недоступен. Запустите: <code>cd server && node server.js</code></div></div>';
    return;
  }
  if (!ok) {
    const errMsg = getError(data);
    list.innerHTML = `<div class="bk-empty"><div class="auth-error-box"><span class="form-error-icon">❌</span> ${errMsg}</div></div>`;
    return;
  }

  const bookings = Array.isArray(data) ? data : (data.bookings || []);
  if (bookings.length === 0) {
    list.innerHTML = '<div class="bk-empty"><p>🏖 У вас пока нет бронирований</p><button class="btn-primary" onclick="closeAllModals();window.location.href=\'tours.html\'" style="display:inline-flex;padding:10px 24px;border:none;border-radius:var(--r-sm);background:var(--g-primary);color:#fff;font-weight:700;cursor:pointer">Выбрать тур</button></div>';
    return;
  }

  list.innerHTML = bookings.map(b => `
    <div class="bk-card">
      <div class="bk-card-top">
        <div>
          <div class="bk-card-route">${b.from || '?'} → ${b.to || '?'}</div>
          <div class="bk-card-dates">${b.departDate ? new Date(b.departDate).toLocaleDateString('ru-RU') : '—'} — ${b.returnDate ? new Date(b.returnDate).toLocaleDateString('ru-RU') : '—'}</div>
        </div>
        <div class="bk-card-status status-${b.status}">${b.status === 'confirmed' ? '✅ Подтверждён' : b.status === 'pending' ? '⏳ Ожидание' : '❌ Отменён'}</div>
      </div>
      <div class="bk-card-bottom">
        <span>👥 ${b.passengers || 1} чел.</span>
        <span class="bk-card-price">${(b.price || 0).toLocaleString('ru-RU')} ₸</span>
        ${b.status !== 'cancelled' ? `<button class="bk-cancel-btn" onclick="cancelBooking('${b._id}')">Отменить</button>` : ''}
      </div>
    </div>
  `).join('');
}

async function cancelBooking(id) {
  if (!confirm('Вы уверены, что хотите отменить бронирование?')) return;
  const { ok, connectionError, data } = await safeFetch(API + '/bookings/' + id, { method: 'DELETE', headers: authHeaders() });
  if (connectionError) { showToast('Сервер недоступен', 'error'); return; }
  if (!ok) { showToast(getError(data), 'error'); return; }
  showToast('Бронирование отменено', 'success');
  openBookingsModal();
}

/* ── PROFILE MODAL ──────────────────────────────────────── */
async function openProfileModal() {
  if (!isLoggedIn()) { openAuthModal(); return; }
  closeAllModals();
  const user = getUser();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'profile-modal';
  overlay.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="closeAllModals()">×</button>
      <h2 class="bm-title">👤 Мой профиль</h2>
      <form onsubmit="saveProfile(event)" id="profile-form">
        <div class="auth-field">
          <label>Имя</label>
          <input type="text" class="s-input" id="prof-name" value="${user?.name || ''}" required>
        </div>
        <div class="auth-field">
          <label>Email</label>
          <input type="email" class="s-input" value="${user?.email || ''}" disabled style="opacity:0.6">
        </div>
        <div class="auth-field">
          <label>Телефон</label>
          <input type="tel" class="s-input" id="prof-phone" value="${user?.phone || ''}" placeholder="+7 (777) 123-45-67">
        </div>
        <div id="profile-error-area"></div>
        <button type="submit" class="btn-primary auth-submit" id="prof-save-btn">Сохранить</button>
      </form>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--c-border)">
        <h3 style="font-size:0.9rem;color:var(--c-text);margin-bottom:12px">💳 Сохранённые карты</h3>
        <div class="profile-cards-list" id="profile-cards-list"></div>
      </div>

      <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--c-border)">
        <h3 style="font-size:0.9rem;color:var(--c-text);margin-bottom:12px">Сменить пароль</h3>
        <form onsubmit="changePassword(event)">
          <div class="auth-field">
            <label>Текущий пароль</label>
            <input type="password" class="s-input" id="prof-old-pass" required>
          </div>
          <div class="auth-field">
            <label>Новый пароль</label>
            <input type="password" class="s-input" id="prof-new-pass" required minlength="6">
          </div>
          <div id="password-error-area"></div>
          <button type="submit" class="btn-secondary auth-submit" id="prof-pass-btn">Сменить пароль</button>
        </form>
      </div>
    </div>
  `;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAllModals(); });
  document.body.appendChild(overlay);
  renderProfileCards();
}

async function saveProfile(e) {
  e.preventDefault();
  const btn = document.getElementById('prof-save-btn');
  btn.innerHTML = '<span class="spinner"></span> Сохраняем...'; btn.disabled = true;
  clearAuthError('profile-error-area');

  const { data, ok, connectionError } = await safeFetch(API + '/auth/profile', {
    method: 'PUT', headers: authHeaders(),
    body: JSON.stringify({ name: document.getElementById('prof-name').value, phone: document.getElementById('prof-phone').value })
  });

  if (connectionError) { showAuthError('profile-error-area', 'Сервер недоступен'); btn.innerHTML = 'Сохранить'; btn.disabled = false; return; }
  if (!ok) { showAuthError('profile-error-area', getError(data)); btn.innerHTML = 'Сохранить'; btn.disabled = false; return; }

  const user = getUser();
  user.name = document.getElementById('prof-name').value;
  user.phone = document.getElementById('prof-phone').value;
  localStorage.setItem('el_user', JSON.stringify(user));
  updateHeaderAuth();
  showToast('Профиль обновлён!', 'success');
  closeAllModals();
}

async function changePassword(e) {
  e.preventDefault();
  const btn = document.getElementById('prof-pass-btn');
  btn.innerHTML = '<span class="spinner" style="border-color:rgba(0,0,0,0.1);border-top-color:var(--c-text)"></span> Меняем...'; btn.disabled = true;
  clearAuthError('password-error-area');

  const { data, ok, connectionError } = await safeFetch(API + '/auth/password', {
    method: 'PUT', headers: authHeaders(),
    body: JSON.stringify({ currentPassword: document.getElementById('prof-old-pass').value, newPassword: document.getElementById('prof-new-pass').value })
  });

  if (connectionError) { showAuthError('password-error-area', 'Сервер недоступен'); btn.innerHTML = 'Сменить пароль'; btn.disabled = false; return; }
  if (!ok) { showAuthError('password-error-area', getError(data)); btn.innerHTML = 'Сменить пароль'; btn.disabled = false; return; }

  showToast('Пароль изменён!', 'success');
  document.getElementById('prof-old-pass').value = '';
  document.getElementById('prof-new-pass').value = '';
  btn.innerHTML = 'Сменить пароль'; btn.disabled = false;
}

/* ── REVIEW MODAL ───────────────────────────────────────── */
function openReviewModal() {
  if (!isLoggedIn()) { openAuthModal(); return; }
  closeAllModals();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'review-modal';
  overlay.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="closeAllModals()">×</button>
      <h2 class="bm-title">⭐ Оставить отзыв</h2>
      <form onsubmit="submitReview(event)" id="review-form">
        <div class="auth-field">
          <label>Оценка</label>
          <div class="star-rating" id="star-rating">
            ${[1,2,3,4,5].map(i => `<span class="star-btn ${i <= 5 ? 'active' : ''}" data-val="${i}" onclick="setRating(${i})">★</span>`).join('')}
          </div>
          <input type="hidden" id="rv-rating" value="5">
        </div>
        <div class="auth-field">
          <label>Направление</label>
          <input type="text" class="s-input" id="rv-dest" placeholder="Турция, Дубай и т.д.">
        </div>
        <div class="auth-field">
          <label>Ваш отзыв</label>
          <textarea class="s-input" id="rv-text" rows="4" placeholder="Расскажите о вашем опыте (минимум 10 символов)" required minlength="10"></textarea>
        </div>
        <div id="review-error-area"></div>
        <button type="submit" class="btn-primary auth-submit" id="rv-btn">Отправить отзыв</button>
      </form>
    </div>
  `;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAllModals(); });
  document.body.appendChild(overlay);
}

function setRating(val) {
  document.getElementById('rv-rating').value = val;
  document.querySelectorAll('.star-btn').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.val) <= val);
  });
}

async function submitReview(e) {
  e.preventDefault();
  const btn = document.getElementById('rv-btn');
  btn.innerHTML = '<span class="spinner"></span> Отправляем...'; btn.disabled = true;
  clearAuthError('review-error-area');

  const { data, ok, connectionError } = await safeFetch(API + '/reviews', {
    method: 'POST', headers: authHeaders(),
    body: JSON.stringify({
      rating: parseInt(document.getElementById('rv-rating').value),
      text: document.getElementById('rv-text').value,
      destination: document.getElementById('rv-dest').value
    })
  });

  if (connectionError) { showAuthError('review-error-area', 'Сервер недоступен'); btn.innerHTML = 'Отправить отзыв'; btn.disabled = false; return; }
  if (!ok) { showAuthError('review-error-area', getError(data)); btn.innerHTML = 'Отправить отзыв'; btn.disabled = false; return; }

  showToast('Спасибо за отзыв!', 'success');
  closeAllModals();
}

/* ── UTILS ──────────────────────────────────────────────── */
function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
}

/* ── CONTACT FORM ──────────────────────────────────────── */
async function submitContactForm(e) {
  e.preventDefault();
  const btn = document.getElementById('cf-btn');
  const name = document.getElementById('cf-name')?.value;
  const email = document.getElementById('cf-email')?.value;
  const message = document.getElementById('cf-message')?.value;

  btn.innerHTML = '<span class="spinner"></span> Отправляем...'; btn.disabled = true;

  const { data, ok, connectionError } = await safeFetch(API + '/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  });

  if (connectionError) { showToast('Сервер недоступен. Попробуйте позже.', 'error'); }
  else if (!ok) { showToast(getError(data), 'error'); }
  else { showToast('📩 ' + getError(data), 'success'); document.getElementById('contact-form')?.reset(); }

  btn.textContent = 'Отправить сообщение'; btn.disabled = false;
}

/* ── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderAuth();

  // Wire up login button (uses data-action to avoid CSP issues with inline onclick)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="open-auth"]');
    if (btn) {
      e.preventDefault();
      openAuthModal('login');
    }
  });
});
