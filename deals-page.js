/* deals-page.js */
document.addEventListener('DOMContentLoaded', () => {
  initTimer();
  initCategoryFilter();
});

function initTimer() {
  // Persistent target: stored in localStorage so timer doesn't reset on reload
  const KEY = 'el_deals_target';
  let target = parseInt(localStorage.getItem(KEY) || '0');
  const now = Date.now();
  // If no target or target already passed, set new one 24h from now
  if (!target || target < now) {
    target = now + 24 * 3600 * 1000;
    localStorage.setItem(KEY, target);
  }
  function update() {
    const diff = Math.max(0, target - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => n.toString().padStart(2, '0');
    const hEl = document.getElementById('timer-h');
    const mEl = document.getElementById('timer-m');
    const sEl = document.getElementById('timer-s');
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
    if (diff === 0) {
      // Reset timer for next 24h
      const newTarget = Date.now() + 24 * 3600 * 1000;
      localStorage.setItem(KEY, newTarget);
      target = newTarget;
    }
  }
  update();
  setInterval(update, 1000);
}

function initCategoryFilter() {
  const cats = document.querySelectorAll('.deals-cat');
  cats.forEach(cat => {
    cat.addEventListener('click', () => {
      cats.forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
      filterDeals(cat.getAttribute('data-cat'));
    });
  });
}

function filterDeals(category) {
  const cards = document.querySelectorAll('[id^="dcard-"]');
  cards.forEach(card => {
    const categories = (card.getAttribute('data-cat') || '').split(' ');
    if (category === 'all' || categories.includes(category)) {
      card.style.display = '';
      card.style.animation = 'fadeSlideIn 0.3s ease';
    } else {
      card.style.display = 'none';
    }
  });
}

function bookDeal(dest) {
  const deals = {
    'Мальдивы': { price: 550000, nights: 14, hotel: 'Soneva Fushi 5★' },
    'Таиланд':  { price: 248000, nights: 10, hotel: 'Banyan Tree Phuket 5★' },
    'Египет':   { price: 155000, nights: 7,  hotel: 'Rixos Sharm El Sheikh 5★' },
    'Турция':   { price: 245000, nights: 7,  hotel: 'Calista Luxury Resort 5★' },
    'Япония':   { price: 378000, nights: 8,  hotel: 'The Ritz-Carlton Kyoto 5★' },
    'Греция':   { price: 265000, nights: 10, hotel: 'Grecotel Caramel 5★' },
    'Австрия':  { price: 480000, nights: 7,  hotel: 'Grand Hotel Europa 5★' },
    'Дубай':    { price: 680000, nights: 5,  hotel: 'Burj Al Arab 7★' },
  };
  const d = deals[dest] || { price: 250000, nights: 7, hotel: '' };
  openBookingModal(`Горящий тур: ${dest}`, d.price, d.nights, dest, d.hotel);
}

function handleNewsletterDeals(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type=email]')?.value;
  if (email) {
    showToast(`✅ Вы подписаны! Будем слать горящие туры на ${email}`, 'success');
    e.target.reset();
  }
}
