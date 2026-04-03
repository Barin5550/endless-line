/* ============================================================
   nav.js — Общий заголовок, подвал и утилиты сайта

   Подключается на ВСЕХ страницах: <script src="nav.js"></script>
   Автоматически вставляет шапку и подвал через DOMContentLoaded.

   Функции:
     buildHeader(activePage) — HTML заголовка с навигацией
     buildFooter()           — HTML подвала с колонками ссылок
     initShared()            — инициализация интерактивных элементов
     showToast(msg, type)    — всплывающие уведомления
     updatePrices(currency)  — переключение валюты в ценах
     formatPrice(kzt)        — форматирование числа как цены в ₸

   Активная страница определяется через: <body data-page="home">
   Поддерживаемые значения: home, tours, map, hotels, deals, about
   ============================================================ */

/* ---------- HEADER HTML ---------- */
function buildHeader(activePage) {
  const nav = [
    { label: 'Главная',      href: 'index.html',   id: 'home',   i18n: 'nav.home' },
    { label: 'Туры',         href: 'tours.html',   id: 'tours',  i18n: 'nav.tours', hot: true },
    { label: 'Карта мира',   href: 'map.html',     id: 'map',    i18n: 'nav.map' },
    { label: 'Отели',        href: 'hotels.html',  id: 'hotels', i18n: 'nav.hotels' },
    { label: 'Акции',        href: 'deals.html',   id: 'deals',  i18n: 'nav.deals' },
    { label: 'О нас',        href: 'about.html',     id: 'about',  i18n: 'nav.about' },
    { label: '⚛️ React',    href: 'react-tours.html', id: 'react',  i18n: 'nav.react' },
  ];
  const navHTML = nav.map(n => `
    <li>
      <a href="${n.href}" class="nav-link${n.id === activePage ? ' active' : ''}" id="nav-${n.id}">
        <span data-i18n="${n.i18n}">${n.label}</span>${n.hot ? '<span class="hot-badge">HOT</span>' : ''}
      </a>
    </li>`).join('');

  return `
<div class="notif-bar" id="notif-bar">
  <span data-i18n="nav.notif">🔥 Горячие скидки до −40%! <a href="deals.html">Смотреть акции →</a></span>
  <button class="notif-close" onclick="document.getElementById('notif-bar').remove()">×</button>
</div>
<header class="site-header" id="site-header">
  <div class="header-inner">
    <a href="index.html" class="logo-link" id="logo-home">
      <img src="assets/logo.png" alt="Endless Line" class="logo-img">
      <div class="logo-text">
        <div class="logo-brand-row">
          <span class="logo-name">Endless</span>
          <span class="logo-name-accent">Line</span>
        </div>
        <span class="logo-tagline">Travel · 50+ стран</span>
      </div>
    </a>
    <nav class="main-nav" id="main-nav">
      <ul class="nav-list">${navHTML}</ul>
    </nav>
    <div class="header-right">
      <div class="lang-switcher" id="lang-switcher">
        <button class="lang-btn active" data-lang="ru">RU</button>
        <button class="lang-btn" data-lang="en">EN</button>
        <button class="lang-btn" data-lang="de">DE</button>
      </div>
      <a href="#!" onclick="return false" class="btn-login" id="btn-login" data-action="open-auth" data-i18n="nav.login">Войти</a>
      <div id="user-area"></div>
      <a href="tours.html" class="btn-header-cta" id="btn-header-cta" data-i18n="nav.find-tour">Найти тур</a>
    </div>
    <button class="mobile-toggle" id="mobile-toggle" aria-label="Меню">
      <span></span><span></span><span></span>
    </button>
  </div>
  <!-- Mobile Nav -->
  <nav class="mobile-nav" id="mobile-nav">${navHTML}</nav>
</header>`;
}

/* ---------- FOOTER HTML ---------- */
function buildFooter() {
  return `
<footer class="site-footer" id="site-footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="index.html" class="logo-link">
          <img src="assets/logo.png" alt="Endless Line" class="logo-img" style="height:40px">
          <div class="logo-text">
            <div class="logo-brand-row">
              <span class="logo-name">Endless</span>
              <span class="logo-name-accent">Line</span>
            </div>
            <span class="logo-tagline">Путешествие без границ</span>
          </div>
        </a>
        <p class="footer-tagline" data-i18n="footer.tagline">Туристический портал нового поколения. 500 000+ путешественников, 50+ стран, гарантия лучшей цены.</p>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:14px">
          <div style="display:flex;align-items:center;gap:7px;font-size:0.78rem;color:var(--c-text-3)">
            <span>📍</span> Алматы, Казахстан · с 2018 года
          </div>
          <div style="display:flex;align-items:center;gap:7px;font-size:0.78rem;color:var(--c-text-3)">
            <span>🏆</span> Лучший туристический портал КЗ 2023
          </div>
          <div style="display:flex;align-items:center;gap:7px;font-size:0.78rem;color:var(--c-text-3)">
            <span>⭐</span> Рейтинг 4.9 · 12 000+ отзывов
          </div>
        </div>
        <div class="footer-socials">
          <a href="#!" onclick="return false" class="footer-social-btn" aria-label="Instagram" id="f-instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="#!" onclick="return false" class="footer-social-btn" aria-label="Telegram" id="f-telegram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
          </a>
          <a href="#!" onclick="return false" class="footer-social-btn" aria-label="WhatsApp" id="f-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </a>
          <a href="#!" onclick="return false" class="footer-social-btn" aria-label="YouTube" id="f-youtube">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>
      </div>
      <div>
        <div class="footer-col-title" data-i18n="footer.col.directions">Направления</div>
        <ul class="footer-col-links">
          <li><a href="map.html">Карта мира</a></li>
          <li><a href="tours.html?region=europe">Европа</a></li>
          <li><a href="tours.html?region=asia">Азия</a></li>
          <li><a href="tours.html?region=mena">Ближний Восток</a></li>
          <li><a href="tours.html?region=americas">Америка</a></li>
          <li><a href="deals.html">Горящие туры</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title" data-i18n="footer.col.services">Услуги</div>
        <ul class="footer-col-links">
          <li><a href="tours.html">Туры</a></li>
          <li><a href="hotels.html">Отели</a></li>
          <li><a href="deals.html?type=avia">Авиа</a></li>
          <li><a href="deals.html?type=train">Поезда</a></li>
          <li><a href="deals.html?type=cruise">Круизы</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title" data-i18n="footer.col.company">Компания</div>
        <ul class="footer-col-links">
          <li><a href="about.html">О нас</a></li>
          <li><a href="about.html#team">Команда</a></li>
          <li><a href="about.html#partners">Партнёры</a></li>
          <li><a href="jobs.html">Вакансии</a></li>
          <li><a href="press.html">Пресс-центр</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title" data-i18n="footer.col.support">Поддержка</div>
        <ul class="footer-col-links">
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="refund.html">Политика возврата</a></li>
          <li><a href="insurance.html">Страхование</a></li>
          <li><a href="visa.html">Визовая помощь</a></li>
          <li><a href="contacts.html">Связаться с нами</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy" data-i18n="footer.copy">© 2026 Endless Line. Все права защищены.</p>
      <div class="footer-legal">
        <a href="refund.html">Политика конфиденциальности</a>
        <a href="refund.html">Пользовательское соглашение</a>
        <a href="faq.html">Cookies</a>
      </div>
    </div>
  </div>
</footer>`;

}

/* ---------- INJECT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Determine active page
  const page = document.body.getAttribute('data-page') || 'home';

  // Inject header at top
  const headerContainer = document.createElement('div');
  headerContainer.innerHTML = buildHeader(page);
  document.body.insertBefore(headerContainer, document.body.firstChild);

  // Inject footer at bottom
  const footerContainer = document.createElement('div');
  footerContainer.innerHTML = buildFooter();
  document.body.appendChild(footerContainer);

  // Inject back-to-top
  const btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.id = 'back-to-top';
  btt.innerHTML = '↑';
  btt.title = 'Наверх';
  btt.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btt);

  // Inject toast container
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.id = 'toast-container';
  document.body.appendChild(toastContainer);

  // Postpone init until DOM injected
  setTimeout(initShared, 0);
});

function initShared() {
  /* Header scroll effect */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* Mobile menu */
  const toggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      toggle.classList.toggle('open');
    });
  }

  /* Back to top */
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

  /* Lang switcher */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (typeof applyLang === 'function') {
        applyLang(lang);
      } else {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  /* Currency switcher (if present) */
  document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cur = btn.getAttribute('data-currency');
      updatePrices(cur);
    });
  });

  /* Passenger controls (generic) */
  document.querySelectorAll('[data-pass-minus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.passTarget);
      if (target) target.textContent = Math.max(1, parseInt(target.textContent) - 1);
    });
  });
  document.querySelectorAll('[data-pass-plus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.passTarget);
      if (target) target.textContent = Math.min(20, parseInt(target.textContent) + 1);
    });
  });
}

/* ---------- UTILITIES ---------- */
function showToast(msg, type = 'info', duration = 3500) {
  const tc = document.getElementById('toast-container');
  if (!tc) return;
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '💬'}</span><span class="toast-text">${msg}</span>`;
  tc.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

function updatePrices(currency) {
  document.querySelectorAll('.price-value').forEach(el => {
    const v = el.getAttribute('data-' + currency);
    if (v) {
      const symbols = { kzt: '₸', usd: '$', eur: '€' };
      const formatted = parseInt(v).toLocaleString('ru-RU');
      el.textContent = `${formatted} ${symbols[currency] || ''}`;
    }
  });
}

function formatPrice(kzt) {
  return parseInt(kzt).toLocaleString('ru-RU') + ' ₸';
}
