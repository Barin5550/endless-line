/* index-page.js — Main page logic */

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initTimer();
  initScrollAnimations();
  setDefaultDates();
});

/* ── SEARCH ─────────────────────────────────────────────── */
function initSearch() {
  // Tab switching — show/hide panels
  document.querySelectorAll('.search-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
      const panel = document.getElementById('panel-' + tabName);
      if (panel) panel.style.display = '';
    });
  });

  // Passenger controls
  let count = 2;
  const countEl = document.getElementById('pass-count');
  document.getElementById('pass-minus')?.addEventListener('click', () => {
    if (count > 1) { count--; if (countEl) countEl.textContent = count; }
  });
  document.getElementById('pass-plus')?.addEventListener('click', () => {
    if (count < 8) { count++; if (countEl) countEl.textContent = count; }
  });

  // Swap button
  document.getElementById('swap-btn')?.addEventListener('click', () => {
    const fromEl = document.getElementById('s-from');
    const toEl = document.getElementById('s-to');
    if (fromEl && toEl) {
      const tmp = fromEl.value;
      fromEl.value = toEl.value;
      toEl.value = tmp;
    }
  });
}

function setDefaultDates() {
  const today = new Date();
  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() + 7);
  const toDate = new Date(fromDate);
  toDate.setDate(fromDate.getDate() + 7);

  const fmt = d => d.toISOString().split('T')[0];
  const df = document.getElementById('s-date-from');
  const dt = document.getElementById('s-date-to');
  if (df) df.value = fmt(fromDate);
  if (dt) dt.value = fmt(toDate);
}

function doSearch() {
  const dest = document.getElementById('s-to')?.value || '';
  const from = document.getElementById('s-date-from')?.value || '';
  const to = document.getElementById('s-date-to')?.value || '';
  const pass = document.getElementById('pass-count')?.textContent || '2';

  if (!dest) {
    showToast('Укажите куда хотите поехать', 'error');
    document.getElementById('s-to')?.focus();
    return;
  }

  const params = new URLSearchParams({ dest, dateFrom: from, dateTo: to, pass });
  window.location.href = `tours.html?${params.toString()}`;
}

function quickSearch(dest) {
  const toEl = document.getElementById('s-to');
  if (toEl) toEl.value = dest;
  document.getElementById('s-to')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => doSearch(), 200);
}

function bookDeal(dest) {
  const deals = {
    'Мальдивы': { price: 485000, nights: 7, hotel: 'Soneva Fushi 5★' },
    'Таиланд':  { price: 295000, nights: 10, hotel: 'Banyan Tree Phuket 5★' },
    'Египет':   { price: 195000, nights: 7, hotel: 'Rixos Sharm El Sheikh 5★' },
    'Турция':   { price: 175000, nights: 7, hotel: 'Calista Luxury Resort 5★' },
  };
  const d = deals[dest] || { price: 250000, nights: 7, hotel: '' };
  openBookingModal(`Горящий тур: ${dest}`, d.price, d.nights, dest, d.hotel);
}

/* Hotel search */
function doHotelSearch() {
  const dest = document.getElementById('h-dest')?.value || '';
  if (!dest) {
    showToast('Укажите город или отель', 'error');
    document.getElementById('h-dest')?.focus();
    return;
  }
  showToast(`🏨 Ищем отели в "${dest}"...`, 'success');
  setTimeout(() => {
    window.location.href = `tours.html?dest=${encodeURIComponent(dest.toLowerCase())}&type=hotel`;
  }, 800);
}

let hotelGuests = 2;
function changeGuests(delta) {
  hotelGuests = Math.max(1, Math.min(8, hotelGuests + delta));
  const el = document.getElementById('h-guests');
  if (el) el.textContent = hotelGuests;
}

function swapFlights(btn) {
  const row = btn.closest('.search-row');
  const inputs = row.querySelectorAll('input[type=text]');
  if (inputs.length >= 2) {
    const tmp = inputs[0].value;
    inputs[0].value = inputs[1].value;
    inputs[1].value = tmp;
  }
}

/* Flight search */
function doFlightSearch() {
  const from = document.getElementById('f-from')?.value || '';
  const to = document.getElementById('f-to')?.value || '';
  const dateGo = document.getElementById('f-date-go')?.value || '';
  const dateBack = document.getElementById('f-date-back')?.value || '';
  const cls = document.getElementById('f-class')?.value || 'economy';

  if (!to) { showToast('Укажите город назначения', 'error'); document.getElementById('f-to')?.focus(); return; }
  if (!dateGo) { showToast('Укажите дату вылета', 'error'); return; }

  showToast(`✈️ Ищем рейсы ${from} → ${to}...`, 'success');
  setTimeout(() => {
    showFlightResults(from, to, dateGo, dateBack, cls);
  }, 800);
}

function showFlightResults(from, to, dateGo, dateBack, cls) {
  const classNames = { economy: 'Эконом', business: 'Бизнес', first: 'Первый' };
  const classMultiplier = { economy: 1, business: 2.5, first: 4 };
  const basePrice = 45000 + Math.floor(Math.random() * 60000);
  const price = Math.round(basePrice * (classMultiplier[cls] || 1));

  const flights = [
    { airline: 'Air Astana', dep: '06:30', arr: '10:45', dur: '4ч 15м', stops: 'Прямой', price: price },
    { airline: 'Turkish Airlines', dep: '09:15', arr: '14:30', dur: '5ч 15м', stops: '1 пересадка', price: Math.round(price * 0.85) },
    { airline: 'FlyAris', dep: '14:00', arr: '18:20', dur: '4ч 20м', stops: 'Прямой', price: Math.round(price * 1.1) },
    { airline: 'Aeroflot', dep: '19:45', arr: '01:10', dur: '5ч 25м', stops: '1 пересадка', price: Math.round(price * 0.75) },
    { airline: 'Emirates', dep: '23:30', arr: '05:45', dur: '6ч 15м', stops: '1 пересадка', price: Math.round(price * 1.3) },
  ];

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `
    <div class="modal" style="max-width:600px">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      <h2 style="font-family:var(--f-heading);font-size:1.3rem;color:var(--c-text);margin-bottom:4px">✈️ Авиабилеты: ${from} → ${to}</h2>
      <p style="color:var(--c-text-3);font-size:0.85rem;margin-bottom:16px">${new Date(dateGo).toLocaleDateString('ru-RU')}${dateBack ? ' — ' + new Date(dateBack).toLocaleDateString('ru-RU') : ' (в одну сторону)'} · ${classNames[cls]}</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${flights.map(f => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--c-bg-2);border-radius:var(--r-md);border:1px solid var(--c-border);gap:12px">
            <div style="min-width:100px">
              <div style="font-weight:700;font-size:0.85rem;color:var(--c-text)">${f.airline}</div>
              <div style="font-size:0.75rem;color:var(--c-text-3)">${f.stops}</div>
            </div>
            <div style="text-align:center;flex:1">
              <div style="font-weight:700;color:var(--c-text)">${f.dep} — ${f.arr}</div>
              <div style="font-size:0.75rem;color:var(--c-text-3)">${f.dur}</div>
            </div>
            <div style="text-align:right;min-width:100px">
              <div style="font-weight:800;color:var(--c-primary)">${f.price.toLocaleString('ru-RU')} ₸</div>
              <button onclick="this.closest('.modal-overlay').remove();openBookingModal('Авиа: ${from} → ${to}', ${f.price}, 0, '${to}', '${f.airline}')" style="margin-top:4px;padding:4px 12px;border:none;background:var(--g-primary);color:#fff;border-radius:var(--r-sm);font-size:0.75rem;font-weight:700;cursor:pointer">Купить</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* Train search */
function doTrainSearch() {
  const from = document.getElementById('t-from')?.value || '';
  const to = document.getElementById('t-to')?.value || '';
  const date = document.getElementById('t-date')?.value || '';
  const pass = document.getElementById('t-pass')?.value || '2';

  if (!to) { showToast('Укажите город назначения', 'error'); document.getElementById('t-to')?.focus(); return; }
  if (!date) { showToast('Укажите дату поездки', 'error'); return; }

  showToast(`🚂 Ищем поезда ${from} → ${to}...`, 'success');
  setTimeout(() => {
    showTrainResults(from, to, date, pass);
  }, 800);
}

function showTrainResults(from, to, date, pass) {
  const basePrice = 5000 + Math.floor(Math.random() * 15000);
  const trains = [
    { num: '001Ц', type: 'Тальго', dep: '18:37', arr: '08:15', dur: '13ч 38м', cls: 'Люкс', price: Math.round(basePrice * 2.5) },
    { num: '001Ц', type: 'Тальго', dep: '18:37', arr: '08:15', dur: '13ч 38м', cls: 'Купе', price: basePrice },
    { num: '001Ц', type: 'Тальго', dep: '18:37', arr: '08:15', dur: '13ч 38м', cls: 'Плацкарт', price: Math.round(basePrice * 0.6) },
    { num: '037А', type: 'Скорый', dep: '22:10', arr: '14:50', dur: '16ч 40м', cls: 'Купе', price: Math.round(basePrice * 0.85) },
    { num: '037А', type: 'Скорый', dep: '22:10', arr: '14:50', dur: '16ч 40м', cls: 'Плацкарт', price: Math.round(basePrice * 0.5) },
  ];

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `
    <div class="modal" style="max-width:600px">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      <h2 style="font-family:var(--f-heading);font-size:1.3rem;color:var(--c-text);margin-bottom:4px">🚂 Ж/Д билеты: ${from} → ${to}</h2>
      <p style="color:var(--c-text-3);font-size:0.85rem;margin-bottom:16px">${new Date(date).toLocaleDateString('ru-RU')} · ${pass} пассажир(ов)</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${trains.map(t => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--c-bg-2);border-radius:var(--r-md);border:1px solid var(--c-border);gap:12px">
            <div style="min-width:80px">
              <div style="font-weight:700;font-size:0.85rem;color:var(--c-text)">№ ${t.num}</div>
              <div style="font-size:0.75rem;color:var(--c-text-3)">${t.type}</div>
            </div>
            <div style="text-align:center;flex:1">
              <div style="font-weight:700;color:var(--c-text)">${t.dep} — ${t.arr}</div>
              <div style="font-size:0.75rem;color:var(--c-text-3)">${t.dur}</div>
            </div>
            <div style="text-align:center;min-width:70px">
              <div style="font-size:0.8rem;font-weight:600;color:var(--c-text)">${t.cls}</div>
            </div>
            <div style="text-align:right;min-width:100px">
              <div style="font-weight:800;color:var(--c-primary)">${t.price.toLocaleString('ru-RU')} ₸</div>
              <button onclick="this.closest('.modal-overlay').remove();openBookingModal('ЖД: ${from} → ${to} (${t.cls})', ${t.price}, 0, '${to}', 'Поезд ${t.num}')" style="margin-top:4px;padding:4px 12px;border:none;background:var(--g-primary);color:#fff;border-radius:var(--r-sm);font-size:0.75rem;font-weight:700;cursor:pointer">Купить</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* Cruise search */
function doCruiseSearch() {
  const region = document.getElementById('cr-region')?.value || '';
  const month = document.getElementById('cr-month')?.value || '';
  const dur = document.getElementById('cr-dur')?.value || '7';
  const pass = document.getElementById('cr-pass')?.value || '2';

  showToast(`🚢 Ищем круизы: ${region}...`, 'success');
  setTimeout(() => {
    showCruiseResults(region, month, dur, pass);
  }, 800);
}

function showCruiseResults(region, month, dur, pass) {
  const cruises = {
    'Средиземное море': [
      { ship: 'MSC Grandiosa', route: 'Барселона → Марсель → Рим → Неаполь → Барселона', price: 380000 },
      { ship: 'Costa Smeralda', route: 'Рим → Палермо → Мальта → Барселона → Марсель → Рим', price: 420000 },
      { ship: 'Royal Caribbean Odyssey', route: 'Афины → Санторини → Дубровник → Венеция', price: 550000 },
    ],
    'Карибы': [
      { ship: 'Carnival Celebration', route: 'Майами → Козумель → Роатан → Коста-Майя → Майами', price: 450000 },
      { ship: 'Disney Fantasy', route: 'Порт Канаверал → Нассау → Кастауэй Кей → Порт Канаверал', price: 620000 },
      { ship: 'Norwegian Getaway', route: 'Майами → Ямайка → Каймановы о-ва → Мексика → Майами', price: 480000 },
    ],
    'Юго-Восточная Азия': [
      { ship: 'Genting Dream', route: 'Сингапур → Пенанг → Лангкави → Пхукет → Сингапур', price: 350000 },
      { ship: 'Celebrity Solstice', route: 'Гонконг → Вьетнам → Таиланд → Сингапур', price: 520000 },
    ],
    'Скандинавия': [
      { ship: 'Viking Sky', route: 'Копенгаген → Осло → Берген → Фьорды → Копенгаген', price: 480000 },
      { ship: 'Hurtigruten Fridtjof', route: 'Берген → Тромсё → Нордкап → Лофотены → Берген', price: 560000 },
    ],
    'Аляска': [
      { ship: 'Princess Ruby', route: 'Сиэтл → Джуно → Скагуэй → Глейшер Бей → Кетчикан → Сиэтл', price: 600000 },
      { ship: 'Holland America Westerdam', route: 'Ванкувер → Ситка → Ледник Хаббард → Джуно → Ванкувер', price: 550000 },
    ],
  };

  const list = cruises[region] || cruises['Средиземное море'];

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `
    <div class="modal" style="max-width:600px">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      <h2 style="font-family:var(--f-heading);font-size:1.3rem;color:var(--c-text);margin-bottom:4px">🚢 Круизы: ${region}</h2>
      <p style="color:var(--c-text-3);font-size:0.85rem;margin-bottom:16px">${month} · ${dur} ночей · ${pass} пассажир(ов)</p>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${list.map(c => `
          <div style="padding:16px;background:var(--c-bg-2);border-radius:var(--r-md);border:1px solid var(--c-border)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <div style="font-weight:700;color:var(--c-text)">${c.ship}</div>
              <div style="font-weight:800;color:var(--c-primary);font-size:1.1rem">${c.price.toLocaleString('ru-RU')} ₸</div>
            </div>
            <div style="font-size:0.85rem;color:var(--c-text-2);margin-bottom:10px">🗺 ${c.route}</div>
            <button onclick="this.closest('.modal-overlay').remove();openBookingModal('Круиз: ${c.ship}', ${c.price}, ${dur}, '${region}', '${c.ship}')" style="padding:8px 20px;border:none;background:var(--g-primary);color:#fff;border-radius:var(--r-sm);font-size:0.85rem;font-weight:700;cursor:pointer;width:100%">Забронировать круиз</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* Newsletter */
function handleNL(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type=email]')?.value;
  if (email) {
    // Try to save to server
    fetch('http://localhost:5000/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Подписка', email, message: 'Подписка на рассылку горящих туров' })
    }).catch(() => {});
    showToast(`✅ Вы подписаны! Ждите горящие туры на\n${email}`, 'success');
    e.target.reset();
  }
}

/* ── TIMER ────────────────────────────────────────────────── */
function initTimer() {
  function update() {
    const now = new Date();
    // Timer resets daily at midnight
    const midnight = new Date(now);
    midnight.setHours(23, 59, 59, 999);
    const diff = midnight - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => n.toString().padStart(2, '0');
    const hEl = document.getElementById('dt-h');
    const mEl = document.getElementById('dt-m');
    const sEl = document.getElementById('dt-s');
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
  }
  update();
  setInterval(update, 1000);
}

/* ── SCROLL ANIMATIONS ────────────────────────────────────── */
function initScrollAnimations() {
  // Stagger why-cards
  const whyCards = document.querySelectorAll('.why-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  whyCards.forEach(card => observer.observe(card));

  // Generic fade-up elements
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => fadeObs.observe(el));

  // Destination cards stagger
  const destCards = document.querySelectorAll('.dest-card');
  const destObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        destObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  destCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    destObs.observe(card);
  });
}
