/* ── Per-tour image map (tour name → image) ───────────────── */
const TOUR_NAME_IMAGES = {
  /* Turkey */
  'Стамбул 7 ночей':          'assets/tour_istanbul.png',
  'Анталья all-inclusive':    'assets/tour_antalya.png',
  'Каппадокия тур':           'assets/tour_turkey_cappadocia.png',
  'Бодрум пляжный':           'assets/tour_bodrum.png',

  /* UAE */
  'Дубай 5 ночей':            'assets/tour_dubai_city.png',
  'ОАЭ люкс-тур':             'assets/hotel_dubai_tower.png',
  'Абу-Даби + Дубай':         'assets/tour_abudhabi.png',
  'Дубай семейный':           'assets/tour_dubai_family.png',

  /* Egypt */
  'Хургада 7 ночей':          'assets/tour_hurghada.png',
  'Шарм-эль-Шейх':            'assets/hotel_sharm_reef.png',
  'Каир + Луксор':            'assets/tour_egypt_cairo.png',
  'Марса-Алам':               'assets/city_egypt_redsea.png',

  /* Greece */
  'Санторини 7 ночей':        'assets/tour_santorini.png',
  'Афины + острова':          'assets/tour_greece_athens.png',
  'Крит all-inclusive':       'assets/tour_crete.png',

  /* Italy */
  'Рим 5 ночей':              'assets/tour_italy_rome.png',
  'Северная Италия':          'assets/tour_venice.png',
  'Рим + Неаполь':            'assets/hotel_italy_coast.png',

  /* France */
  'Париж 5 ночей':            'assets/tour_paris_day.png',
  'Лазурный берег':           'assets/tour_cote_azur.png',
  'Вся Франция':              'assets/hotel_france_chateau.png',

  /* Germany */
  'Берлин 5 ночей':           'assets/city_berlin.png',
  'Бавария':                  'assets/tour_bavaria.png',
  'Вся Германия':             'assets/city_berlin.png',

  /* Austria */
  'Вена 5 ночей':             'assets/city_vienna.png',
  'Зальцбург тур':            'assets/city_vienna.png',
  'Горнолыжная Австрия':      'assets/city_vienna.png',

  /* Spain */
  'Барселона 5 ночей':        'assets/hotel_barcelona_rooftop.png',
  'Испания целиком':          'assets/tour_spain_sevilla.png',
  'Канарские острова':        'assets/hotel_beach_resort.png',

  /* China */
  'Пекин 6 ночей':            'assets/city_beijing.png',
  'Пекин + Шанхай':           'assets/tour_china_greatwall.png',
  'Лучшее Китая':             'assets/tour_china_greatwall.png',

  /* Japan */
  'Токио 7 ночей':            'assets/tour_japan_tokyo.png',
  'Токио + Киото':            'assets/hotel_japan_ryokan.png',
  'Лучшее Японии':            'assets/city_japan.png',

  /* Thailand */
  'Пхукет 10 ночей':          'assets/tour_phuket.png',
  'Бангкок + Паттайя':        'assets/hotel_bangkok_river.png',
  'Острова Таиланда':         'assets/tour_phuket.png',
  'Самуи виллы':              'assets/tour_kohsamui.png',

  /* India */
  'Гоа 10 ночей':             'assets/hotel_beach_resort.png',
  'Золотой треугольник':      'assets/tour_egypt_cairo.png',
  'Керала':                   'assets/city_indonesia.png',

  /* Maldives */
  'Мальдивы 7 ночей':         'assets/hotel_water_villa.png',
  'Медовый месяц':            'assets/tour_maldives_honeymoon.png',
  'Мальдивы эконом':          'assets/city_maldives.png',
  'Подводный ресторан':       'assets/hotel_maldives_sunset.png',

  /* Brazil */
  'Рио-де-Жанейро 7 ночей':  'assets/tour_brazil_rio.png',
  'Бразилия экспедиция':      'assets/tour_brazil_rio.png',
  'Карнавал в Рио':           'assets/tour_brazil_rio.png',

  /* Portugal */
  'Лиссабон 5 ночей':         'assets/tour_portugal_lisbon.png',
  'Порту + Лиссабон':         'assets/tour_portugal_lisbon.png',
  'Алгарве all-inclusive':    'assets/hotel_beach_resort.png',

  /* Montenegro */
  'Будва 7 ночей':            'assets/city_montenegro.png',
  'Котор + Будва':            'assets/city_montenegro.png',
  'Святой Стефан люкс':       'assets/hotel_mediterranean.png',

  /* Morocco */
  'Марракеш 5 ночей':         'assets/tour_morocco_marrakech.png',
  'Имперские города':         'assets/tour_morocco_marrakech.png',
  'Сахара экспедиция':        'assets/tour_sahara.png',

  /* South Korea */
  'Сеул 6 ночей':             'assets/tour_korea_seoul.png',
  'Сеул + Чеджу':             'assets/tour_korea_seoul.png',
  'K-Pop тур':                'assets/tour_japan_tokyo.png',

  /* Vietnam */
  'Нячанг 10 ночей':          'assets/hotel_nha_trang.png',
  'Ханой + Халонг':           'assets/tour_halong_cruise.png',
  'Весь Вьетнам':             'assets/tour_vietnam_halong.png',

  /* Indonesia */
  'Бали 10 ночей':            'assets/tour_bali_temple.png',
  'Бали + Ломбок':            'assets/tour_indonesia_komodo.png',
  'Бали люкс виллы':          'assets/hotel_pool_villa.png',

  /* Sri Lanka */
  'Шри-Ланка 10 ночей':       'assets/tour_srilanka_temple.png',
  'Культурный тур':           'assets/tour_srilanka_temple.png',
  'Пляжный отдых':            'assets/hotel_beach_resort.png',

  /* USA */
  'Нью-Йорк 7 ночей':         'assets/tour_usa_newyork.png',
  'Калифорния':               'assets/city_usa.png',
  'Восточное побережье':      'assets/tour_usa_newyork.png',

  /* Mexico */
  'Канкун 7 ночей':           'assets/hotel_cancun_caribbean.png',
  'Ривьера-Майя':             'assets/hotel_cancun_caribbean.png',
  'Мексика Grand Tour':       'assets/tour_mexico_chichen.png',

  /* Australia */
  'Сидней 7 ночей':           'assets/tour_australia_sydney.png',
  'Восточное побережье':      'assets/tour_australia_sydney.png',
  'Барьерный Риф':            'assets/tour_hurghada.png',
};

/* Country fallback */
const TOUR_COUNTRY_IMAGES = {
  turkey: 'assets/city_turkey.png', uae: 'assets/city_uae.png',
  egypt: 'assets/city_egypt.png', greece: 'assets/city_greece.png',
  italy: 'assets/city_italy.png', france: 'assets/city_france.png',
  germany: 'assets/city_berlin.png', austria: 'assets/city_vienna.png',
  spain: 'assets/city_spain.png', china: 'assets/city_beijing.png',
  japan: 'assets/city_japan.png', thailand: 'assets/city_thailand.png',
  india: 'assets/city_dubai.png', maldives: 'assets/city_maldives.png',
  brazil: 'assets/city_brazil.png', portugal: 'assets/city_portugal.png',
  montenegro: 'assets/city_montenegro.png', morocco: 'assets/city_morocco.png',
  southkorea: 'assets/city_southkorea.png', vietnam: 'assets/city_vietnam.png',
  indonesia: 'assets/city_indonesia.png', srilanka: 'assets/city_srilanka.png',
  usa: 'assets/city_usa.png', mexico: 'assets/city_mexico.png',
  australia: 'assets/city_australia.png',
};

function getTourImage(tour) {
  return TOUR_NAME_IMAGES[tour.name] || TOUR_COUNTRY_IMAGES[tour.countryId] || '';
}


const TOURS_DB = [];


// Generate tours from country data
function generateTours() {
  Object.entries(COUNTRY_DATA).forEach(([countryId, country]) => {
    country.tours.forEach((tour, i) => {
      TOURS_DB.push({
        id: `${countryId}-${i}`,
        countryId,
        country: country.name,
        flag: country.flag,
        name: tour.name,
        meta: tour.meta,
        price: tour.price,
        nights: tour.nights,
        stars: i === 0 ? 4 : i === 1 ? 5 : 4,
        meal: i === 0 ? 'bb' : i === 1 ? 'ai' : 'bb',
        region: getRegion(countryId),
        icon: country.attractions[0]?.emoji || '🌍',
        discount: Math.random() < 0.3 ? Math.floor(Math.random() * 25 + 10) : null,
        popular: Math.random() < 0.4,
      });
    });
  });
}

function getRegion(id) {
  const regions = {
    turkey: 'mena', uae: 'mena', egypt: 'mena', morocco: 'mena',
    greece: 'europe', italy: 'europe', france: 'europe',
    germany: 'europe', austria: 'europe', spain: 'europe',
    portugal: 'europe', montenegro: 'europe',
    china: 'asia', japan: 'asia', thailand: 'asia', india: 'asia',
    southkorea: 'asia', vietnam: 'asia', indonesia: 'asia', srilanka: 'asia',
    maldives: 'seas',
    brazil: 'americas', usa: 'americas', mexico: 'americas',
    australia: 'oceania'
  };
  return regions[id] || 'other';
}

let filteredTours = [];
let currentSort = 'popular';
let maxPrice = 700000;
let isListView = false;

document.addEventListener('DOMContentLoaded', () => {
  generateTours();
  filteredTours = [...TOURS_DB];
  renderTours();
  initFilters();
  initViewToggle();
  initSortSelect();
  checkURLFilters();
  loadFavorites();
});

function renderTours() {
  const grid = document.getElementById('tours-grid');
  const count = document.getElementById('tours-count');
  if (!grid) return;

  grid.className = `tours-grid${isListView ? ' list-view' : ''}`;
  count.textContent = `Показано ${filteredTours.length} туров`;

  if (filteredTours.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--c-text-2)">
        <div style="font-size:4rem;margin-bottom:16px">😕</div>
        <h3 style="color:var(--c-text);margin-bottom:8px">Туры не найдены</h3>
        <p>Попробуйте изменить параметры фильтрации</p>
        <button class="btn-primary" style="margin-top:16px;display:inline-flex" onclick="resetFilters()">Сбросить фильтры</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredTours.map(tour => buildTourCard(tour)).join('');
}

function buildTourCard(tour) {
  const discountHTML = tour.discount ? `<div class="tour-badge tour-badge-sale">−${tour.discount}%</div>` : '';
  const hotHTML = tour.popular && !tour.discount ? `<div class="tour-badge">🔥 Топ</div>` : '';
  const oldPrice = tour.discount ? `<span class="tour-price-old">${Math.round(tour.price / (1 - tour.discount/100)).toLocaleString('ru-RU')} ₸</span>` : '';
  const mealLabel = { ai: '🍽 Всё включено', bb: '🥐 Завтраки', ro: '— Без питания' }[tour.meal] || '';
  const stars = '★'.repeat(tour.stars) + '☆'.repeat(5 - tour.stars);
  const imgSrc = getTourImage(tour);

  return `
    <div class="tour-card" id="tour-${tour.id}" onclick="openTourModal('${tour.id}')">
      <div class="tour-card-img">
        ${imgSrc
          ? `<img src="${imgSrc}" alt="${tour.country}" loading="lazy" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" onerror="this.style.display='none';this.nextElementSibling&&(this.nextElementSibling.style.display='')">`
          : `<div class="tour-card-img-inner">${tour.icon}</div>`
        }
        ${discountHTML}${hotHTML}
        <button class="tour-fav" onclick="event.stopPropagation();toggleFav(this,'${tour.id}','${tour.name.replace(/'/g,"\\'")}')" data-tour-id="${tour.id}" title="В избранное">🤍</button>
      </div>
      <div class="tour-card-body">
        <div class="tour-card-country">${tour.flag} ${tour.country}</div>
        <div class="tour-card-name">${tour.name}</div>
        <div class="tour-card-meta">
          <span class="tour-tag">📅 ${tour.nights} ночей</span>
          <span class="tour-tag">${stars}</span>
          <span class="tour-tag">${mealLabel}</span>
        </div>
        <div class="tour-card-footer">
          <div class="tour-price">
            ${oldPrice}
            <span class="tour-price-from">от</span>
            <span class="tour-price-val">${tour.price.toLocaleString('ru-RU')} ₸</span>
          </div>
          <button class="tour-book-btn" onclick="event.stopPropagation();bookTour('${tour.id}')">Бронировать</button>
        </div>
      </div>
    </div>
  `;
}


// Local favorites fallback (localStorage)
function getLocalFavs() { try { return JSON.parse(localStorage.getItem('el_favs') || '[]'); } catch { return []; } }
function setLocalFavs(arr) { localStorage.setItem('el_favs', JSON.stringify(arr)); }

async function toggleFav(btn, tourId, tourName) {
  const isActive = btn.classList.contains('active');
  btn.classList.toggle('active');
  btn.textContent = btn.classList.contains('active') ? '❤️' : '🤍';

  const token = localStorage.getItem('el_token');

  if (!isActive) {
    // Adding to favorites
    showToast('❤️ Добавлено в избранное!', 'success');
    if (token) {
      fetch('http://localhost:5000/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ tourId, tourName })
      }).catch(() => {});
    } else {
      const favs = getLocalFavs();
      if (!favs.includes(tourId)) { favs.push(tourId); setLocalFavs(favs); }
    }
  } else {
    // Removing from favorites
    showToast('Убрано из избранного', 'info');
    if (token) {
      fetch('http://localhost:5000/api/favorites/' + encodeURIComponent(tourId), {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      }).catch(() => {});
    } else {
      setLocalFavs(getLocalFavs().filter(id => id !== tourId));
    }
  }
}

async function loadFavorites() {
  const token = localStorage.getItem('el_token');
  let favIds = [];
  if (token) {
    try {
      const res = await fetch('http://localhost:5000/api/favorites', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) { const data = await res.json(); favIds = data.map(f => f.tourId); }
    } catch {}
  } else {
    favIds = getLocalFavs();
  }
  // Mark active fav buttons
  favIds.forEach(id => {
    const btn = document.querySelector(`.tour-fav[data-tour-id="${id}"]`);
    if (btn) { btn.classList.add('active'); btn.textContent = '❤️'; }
  });
}

function bookTour(id) {
  const tour = TOURS_DB.find(t => t.id === id);
  if (!tour) { showToast('Тур не найден', 'error'); return; }
  const country = COUNTRY_DATA[tour.countryId];
  openBookingModal(
    tour.name,
    tour.price,
    tour.nights,
    country?.name || tour.countryId,
    tour.hotel || ''
  );
}

function openTourModal(id) {
  const tour = TOURS_DB.find(t => t.id === id);
  if (!tour) return;
  const country = COUNTRY_DATA[tour.countryId];

  const attractionsHTML = (country?.attractions || []).slice(0, 4).map(a => `
    <div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--c-bg-3);border-radius:8px">
      <span style="font-size:1.4rem">${a.emoji}</span>
      <div>
        <div style="font-weight:600;font-size:0.875rem;color:var(--c-text)">${a.name}</div>
        <div style="font-size:0.75rem;color:var(--c-text-2)">${a.city}</div>
      </div>
    </div>
  `).join('');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `
    <div class="modal" style="max-width:620px;max-height:90vh;overflow-y:auto;padding:0">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()" style="z-index:10">×</button>
      <div style="background:${country?.heroGradient || 'var(--c-bg-3)'};height:200px;display:flex;align-items:center;justify-content:center;font-size:6rem;position:relative">
        ${tour.flag}
        <div style="position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(to top, var(--c-bg-card), transparent)"></div>
      </div>
      <div style="padding:24px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <span style="font-size:1.5rem">${tour.flag}</span>
          <div>
            <div style="font-family:var(--f-heading);font-size:1.4rem;font-weight:800;color:var(--c-text)">${tour.name}</div>
            <div style="font-size:0.82rem;color:var(--c-text-2)">${tour.meta}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px">
          <div style="background:var(--c-bg-3);border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:0.7rem;color:var(--c-text-3);text-transform:uppercase;letter-spacing:.05em">Ночей</div>
            <div style="font-weight:700;color:var(--c-text)">${tour.nights}</div>
          </div>
          <div style="background:var(--c-bg-3);border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:0.7rem;color:var(--c-text-3);text-transform:uppercase;letter-spacing:.05em">Отель</div>
            <div style="font-weight:700;color:var(--c-text)">${'★'.repeat(tour.stars)}</div>
          </div>
          <div style="background:var(--c-bg-3);border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:0.7rem;color:var(--c-text-3);text-transform:uppercase;letter-spacing:.05em">Цена</div>
            <div style="font-weight:700;color:var(--c-primary)">${tour.price.toLocaleString('ru-RU')} ₸</div>
          </div>
        </div>
        ${attractionsHTML.length ? `<div style="font-weight:700;color:var(--c-text);margin-bottom:10px">🏛 Что посмотреть</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px">${attractionsHTML}</div>` : ''}
        <div style="display:flex;gap:10px">
          <button class="btn-primary" style="flex:1;justify-content:center" onclick="this.closest('.modal-overlay').remove();bookTour('${tour.id}')">✈️ Забронировать за ${tour.price.toLocaleString('ru-RU')} ₸</button>
          <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Закрыть</button>
        </div>
      </div>
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function initFilters() {
  const priceSlider = document.getElementById('price-range');
  const maxLbl = document.getElementById('price-max-lbl');
  if (priceSlider) {
    priceSlider.addEventListener('input', () => {
      maxPrice = parseInt(priceSlider.value);
      maxLbl.textContent = maxPrice.toLocaleString('ru-RU') + ' ₸';
    });
  }
}

function applyFilters() {
  const regions = [...document.querySelectorAll('.region-filter:checked')].map(cb => cb.value);
  const dur = document.querySelector('.dur-filter:checked')?.value || '';
  const stars = [...document.querySelectorAll('.stars-filter:checked')].map(cb => parseInt(cb.value));
  const meals = [...document.querySelectorAll('.meal-filter:checked')].map(cb => cb.value);
  maxPrice = parseInt(document.getElementById('price-range')?.value || 700000);

  filteredTours = TOURS_DB.filter(t => {
    if (regions.length && !regions.includes(t.region)) return false;
    if (t.price > maxPrice) return false;
    if (dur === 'short' && t.nights > 5) return false;
    if (dur === 'medium' && (t.nights < 6 || t.nights > 9)) return false;
    if (dur === 'long' && t.nights < 10) return false;
    if (stars.length && !stars.includes(t.stars)) return false;
    if (meals.length && !meals.includes(t.meal)) return false;
    return true;
  });

  applySortCurrent();
  renderTours();
  showToast(`Найдено ${filteredTours.length} туров`, 'success');
}

function resetFilters() {
  document.querySelectorAll('.region-filter, .stars-filter, .meal-filter').forEach(cb => cb.checked = false);
  document.querySelectorAll('.dur-filter').forEach(r => { if (!r.value) r.checked = true; });
  const slider = document.getElementById('price-range');
  if (slider) { slider.value = 700000; maxPrice = 700000; document.getElementById('price-max-lbl').textContent = '700 000 ₸'; }
  filteredTours = [...TOURS_DB];
  renderTours();
}

function searchTours() {
  const dest = document.getElementById('ts-dest')?.value?.toLowerCase() || '';
  filteredTours = TOURS_DB.filter(t => {
    if (dest && !t.country.toLowerCase().includes(dest) && !t.name.toLowerCase().includes(dest)) return false;
    return true;
  });
  renderTours();
  showToast(`Найдено ${filteredTours.length} туров`, 'info');
}

function initSortSelect() {
  const sel = document.getElementById('tours-sort');
  if (sel) {
    sel.addEventListener('change', () => {
      currentSort = sel.value;
      applySortCurrent();
      renderTours();
    });
  }
}

function applySortCurrent() {
  if (currentSort === 'price-asc') filteredTours.sort((a, b) => a.price - b.price);
  else if (currentSort === 'price-desc') filteredTours.sort((a, b) => b.price - a.price);
  else if (currentSort === 'nights') filteredTours.sort((a, b) => b.nights - a.nights);
  else filteredTours.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
}

function initViewToggle() {
  document.getElementById('view-grid')?.addEventListener('click', () => {
    isListView = false;
    document.getElementById('view-grid').classList.add('active');
    document.getElementById('view-list').classList.remove('active');
    renderTours();
  });
  document.getElementById('view-list')?.addEventListener('click', () => {
    isListView = true;
    document.getElementById('view-list').classList.add('active');
    document.getElementById('view-grid').classList.remove('active');
    renderTours();
  });
}

// Map of Russian/English country names to countryId
const DEST_ALIASES = {
  'турция': 'turkey', 'turkey': 'turkey', 'анталья': 'turkey', 'стамбул': 'turkey',
  'оаэ': 'uae', 'дубай': 'uae', 'dubai': 'uae', 'абу-даби': 'uae',
  'египет': 'egypt', 'egypt': 'egypt', 'хургада': 'egypt', 'шарм': 'egypt',
  'таиланд': 'thailand', 'thailand': 'thailand', 'пхукет': 'thailand', 'бангкок': 'thailand',
  'греция': 'greece', 'greece': 'greece', 'санторини': 'greece', 'афины': 'greece',
  'италия': 'italy', 'italy': 'italy', 'рим': 'italy', 'венеция': 'italy',
  'франция': 'france', 'france': 'france', 'париж': 'france',
  'германия': 'germany', 'germany': 'germany', 'берлин': 'germany',
  'австрия': 'austria', 'austria': 'austria', 'вена': 'austria',
  'испания': 'spain', 'spain': 'spain', 'барселона': 'spain',
  'китай': 'china', 'china': 'china', 'пекин': 'china', 'шанхай': 'china',
  'япония': 'japan', 'japan': 'japan', 'токио': 'japan', 'киото': 'japan',
  'мальдивы': 'maldives', 'maldives': 'maldives',
  'бразилия': 'brazil', 'brazil': 'brazil', 'рио': 'brazil',
  'португалия': 'portugal', 'portugal': 'portugal', 'лиссабон': 'portugal',
  'марокко': 'morocco', 'morocco': 'morocco', 'марракеш': 'morocco',
  'индия': 'india', 'india': 'india', 'гоа': 'india',
  'вьетнам': 'vietnam', 'vietnam': 'vietnam', 'нячанг': 'vietnam',
  'индонезия': 'indonesia', 'indonesia': 'indonesia', 'бали': 'indonesia',
  'корея': 'southkorea', 'korea': 'southkorea', 'сеул': 'southkorea',
  'шри-ланка': 'srilanka', 'srilanka': 'srilanka',
  'черногория': 'montenegro', 'montenegro': 'montenegro', 'будва': 'montenegro',
  'мексика': 'mexico', 'mexico': 'mexico', 'канкун': 'mexico',
  'австралия': 'australia', 'australia': 'australia',
  'сша': 'usa', 'usa': 'usa', 'нью-йорк': 'usa',
};

function checkURLFilters() {
  const params = new URLSearchParams(window.location.search);
  const dest   = params.get('dest');
  const region = params.get('region');
  const type   = params.get('type');
  const search = params.get('q') || params.get('search');

  if (dest) {
    // Show the search term in the input
    const inp = document.getElementById('ts-dest');
    if (inp) inp.value = dest;

    // Try alias map first (Турция → turkey), then countryId exact, then text search
    const alias = DEST_ALIASES[dest.toLowerCase()];
    let byId = alias ? TOURS_DB.filter(t => t.countryId === alias) : [];
    if (!byId.length) byId = TOURS_DB.filter(t => t.countryId === dest.toLowerCase());
    filteredTours = byId.length > 0 ? byId : TOURS_DB.filter(t =>
      t.country.toLowerCase().includes(dest.toLowerCase()) ||
      t.name.toLowerCase().includes(dest.toLowerCase())
    );
    renderTours();
    if (filteredTours.length > 0) {
      showToast(`🌍 Туры по запросу «${dest}»: ${filteredTours.length}`, 'info');
    } else {
      showToast(`По запросу «${dest}» туров не найдено. Показаны все туры.`, 'info');
      filteredTours = [...TOURS_DB];
      renderTours();
    }
  } else if (region) {
    filteredTours = TOURS_DB.filter(t => t.region === region);
    const cb = document.querySelector(`.region-filter[value="${region}"]`);
    if (cb) cb.checked = true;
    renderTours();
    const regionNames = { europe:'Европа', asia:'Азия', mena:'Ближний Восток', americas:'Америка', seas:'Острова', oceania:'Океания' };
    showToast(`🗺 ${regionNames[region] || region}`, 'info');
  } else if (type === 'hotel') {
    showToast('🏨 Показаны все туры с отелями', 'info');
    filteredTours = [...TOURS_DB];
    renderTours();
  } else if (type === 'flights') {
    showToast('✈️ Показаны туры с перелётом', 'info');
    filteredTours = [...TOURS_DB];
    renderTours();
  } else if (search) {
    const sLower = search.toLowerCase();
    const alias = DEST_ALIASES[sLower];
    filteredTours = alias
      ? TOURS_DB.filter(t => t.countryId === alias)
      : TOURS_DB.filter(t =>
          t.country.toLowerCase().includes(sLower) || t.name.toLowerCase().includes(sLower)
        );
    const inp = document.getElementById('ts-dest');
    if (inp) inp.value = search;
    renderTours();
    showToast(`🔍 Результаты: «${search}» — ${filteredTours.length} туров`, 'info');
  }
}

