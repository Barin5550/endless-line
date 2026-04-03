# 🗺️ ПУТЕВОДИТЕЛЬ ПО ПРОЕКТУ — Endless Line
### Информационно-бронировочная система туристического агентства
#### Автор: Баринов Николай | Группа: ПО2410

---

## 📁 СТРУКТУРА ПРОЕКТА

```
WEB.Global/
├── 📄 index.html          ← Главная страница (Hero, поиск, направления)
├── 📄 tours.html          ← Каталог туров (фильтры, карточки, избранное)
├── 📄 hotels.html         ← Каталог отелей
├── 📄 deals.html          ← Горящие предложения со счётчиком
├── 📄 map.html            ← Интерактивная карта мира (D3.js)
├── 📄 about.html          ← О компании (команда, статистика)
├── 📄 contacts.html       ← Контактная форма
├── 📄 faq.html            ← FAQ с поиском и фильтрами
├── 📄 react-tours.html    ← ⚛️ REACT SPA (критерий React)
├── 📄 404.html            ← Кастомная страница ошибки
├── 📄 jobs.html           ← Страница вакансий
├── 📄 visa.html           ← Информация о визах
├── 📄 insurance.html      ← Страхование
├── 📄 refund.html         ← Политика возврата
├── 📄 press.html          ← Пресс-центр
│
├── 🔧 nav.js              ← Общая навигация и футер (все страницы)
├── 🔧 auth.js             ← Авторизация, профиль, избранное, бронирование
├── 🔧 main.js             ← Общий скрипт (прокрутка, анимации)
├── 🔧 translations.js     ← Мультиязычность (RU / EN / DE)
├── 🔧 tours-page.js       ← Логика каталога туров
├── 🔧 index-page.js       ← Логика главной страницы
├── 🔧 deals-page.js       ← Логика страницы акций
├── 🔧 map-page.js         ← Логика интерактивной карты
├── 🔧 map-data.js         ← Данные по 15+ странам для карты
│
├── 🎨 variables.css       ← CSS-переменные (цвета, шрифты, отступы)
├── 🎨 shared.css          ← Общие стили (хедер, футер, кнопки, модалки)
├── 🎨 index-page.css      ← Стили главной страницы
├── 🎨 tours-page.css      ← Стили каталога туров
├── 🎨 deals-page.css      ← Стили страницы акций
├── 🎨 map-page.css        ← Стили карты
├── 🎨 about-page.css      ← Стили страницы "О нас"
├── 🎨 support-pages.css   ← Стили вспомогательных страниц
├── 🎨 auth.css            ← Стили модальных окон
│
├── 🖥️ api/                ← Сервер Node.js + Express
│   ├── index.js           ← Главный файл сервера (Health, Static, Middleware)
│   ├── db.js              ← Подключение NeDB (NoSQL база данных)
│   ├── routes/
│   │   ├── auth.js        ← POST /api/auth/register, POST /api/auth/login
│   │   ├── bookings.js    ← GET/POST/PATCH /api/bookings (CRUD)
│   │   ├── reviews.js     ← GET/POST/DELETE /api/reviews (CRUD)
│   │   ├── contacts.js    ← POST /api/contacts
│   │   ├── favorites.js   ← GET/POST/DELETE /api/favorites (CRUD)
│   │   └── jobs.js        ← GET/POST /api/jobs
│   └── middleware/
│       └── auth.js        ← JWT-верификация токенов
│
├── 📚 README.md           ← Документация с API-описанием
├── 📦 package.json        ← Зависимости Node.js
├── 🚀 vercel.json         ← Конфиг деплоя на Vercel
└── 🚀 start.bat           ←快速 запуск (npm install + node server)
```

---

## 🎯 ГДЕ НАЙТИ КАЖДЫЙ КРИТЕРИЙ

### ✅ Критерий 1: Функциональность HTML/CSS/JS

| Требование | Файл | Строки |
|---|---|---|
| HTML5 `DOCTYPE` и семантика | `index.html` | 1, 10–30 |
| `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` | `nav.js` (buildHeader) | 23–60 |
| Навигация между страницами | `nav.js` | 8–15 |
| CSS-переменные и дизайн-система | `variables.css` | 1–120 |
| Каскадность стилей | `shared.css` → `index-page.css` | все |
| JavaScript-интерактивность | `index-page.js`, `tours-page.js` | все |
| Обработка событий (click, submit) | `auth.js` | 116–121 |
| Изменение DOM динамически | `auth.js` → `updateHeaderAuth()` | 77–109 |
| Валидация форм | `auth.js` → `handleLogin()` | ~250 |
| Адаптивный дизайн (media queries) | `shared.css`, `index-page.css` | ~конец файлов |

---

### ✅ Критерий 5: Качество кода

| Требование | Файл | Как реализовано |
|---|---|---|
| Читаемые имена | `tours-page.js` | `buildTourCard()`, `loadFavorites()`, `generateTours()` |
| Функции делают одно дело | `auth.js` | каждая функция — одна задача |
| Комментарии в коде | все JS-файлы | `/* ── SECTION ── */` разделители |
| Структура по папкам | `api/routes/` | по одному файлу на ресурс |
| try/catch обработка ошибок | `auth.js` → `safeFetch()` | строки 63–74 |
| ESLint-style чистота | все файлы | единый стиль, нет мёртвого кода |

---

### ✅ Критерий 6: Технологии

#### ⚛️ React (8 баллов) → файл: `react-tours.html`

| Требование | Строки в react-tours.html | Описание |
|---|---|---|
| Функциональные компоненты | ~150–600 | `TourCard`, `SearchBar`, `CategoryFilter`, `TourDetail`, `FavoritesPage`, `BookingModal` |
| Props (передача данных) | ~220–260 | `<TourCard tour={t} isFav=... onBook=... onToggleFav=.../>` |
| useState | ~100–140 | `const [tours, setTours] = useState([])` и другие |
| useEffect | ~140–160 | `useEffect(() => { ... }, [search, category])` |
| useContext | ~80–95 | `AppContext` — глобальное состояние |
| useParams | ~420–440 | Для получения ID тура из URL |
| React Router | ~55–75 | `<Route path="/" />, <Route path="/tour/:id" />, <Route path="/favorites" />` |

#### 🖥️ Node.js + База данных (7 баллов) → папка: `api/`

| Требование | Файл | Строки | Описание |
|---|---|---|---|
| REST API GET | `api/routes/bookings.js` | 1–30 | Получение бронирований |
| REST API POST | `api/routes/auth.js` | 20–80 | Регистрация пользователя |
| REST API PUT/PATCH | `api/routes/bookings.js` | 60–90 | Обновление статуса |
| REST API DELETE | `api/routes/favorites.js` | 40–60 | Удаление из избранного |
| Подключение БД | `api/db.js` | 1–41 | NeDB — 6 коллекций |
| Запросы к БД | `api/db.js` | 24–31 | find, insert, update, remove |
| Хеширование паролей | `api/routes/auth.js` | ~35 | `bcrypt.hash(password, 12)` |
| JWT авторизация | `api/middleware/auth.js` | все | `jwt.verify(token, JWT_SECRET)` |

#### 🔧 Git (2 балла) → репозиторий: `github.com/Barin5550/endless-line`

Коммиты с понятными описаниями:
```
feat: add React SPA (react-tours.html)
feat: add Node.js/Express backend — auth, bookings...
fix: bug fixes — script load order, CSS animations...
feat: brighter globe, favorites in profile, fix i18n
```

#### 🌐 Деплой (3 балла)

- **Vercel**: https://endless-line.vercel.app
- Конфигурация: `vercel.json` (маршрутизация API + статика)

---

### ✅ Критерий 7: Тестирование (5 баллов)

**10 тест-кейсов** (протестированы в Chrome, Firefox, Edge):

| № | Что тестировалось | Результат |
|---|---|---|
| 1 | Регистрация нового пользователя | ✅ |
| 2 | Вход с неверным паролем | ✅ (ошибка) |
| 3 | Успешный вход | ✅ |
| 4 | Поиск тура по направлению | ✅ |
| 5 | Добавление в избранное | ✅ |
| 6 | Бронирование тура | ✅ |
| 7 | Фильтрация по категории | ✅ |
| 8 | Смена языка (RU/EN/DE) | ✅ |
| 9 | Страница 404 при неверном URL | ✅ |
| 10 | Интерактивная карта — выбор страны | ✅ |
| 11 | Оплата (PayStep модал) | ✅ |
| 12 | Форма обратной связи | ✅ |

**API тестирование через Postman:**
- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — авторизация, получение JWT
- `GET /api/bookings` (с токеном) — список бронирований
- `DELETE /api/favorites/:id` — удаление из избранного

---

### ✅ Критерий 8: Документация (5 баллов)

| Документ | Расположение | Содержание |
|---|---|---|
| README | `README.md` | Стек, установка, запуск, все API-эндпоинты |
| Путеводитель | `PROJECT_GUIDE.md` | Этот файл — карта всего проекта |
| Комментарии в коде | все JS-файлы | JSDoc + разделители секций |
| Отчёт | `Отчет/Баринов_КП_Endless_Line_ФИНАЛ_v2.docx` | 50+ страниц |
| Презентация | `Отчет/Endless_Line_v2.pptx` | 19 слайдов |

---

## 🔑 КЛЮЧЕВЫЕ ФУНКЦИИ — ГДЕ НАЙТИ

| Функция | Файл | Что делает |
|---|---|---|
| `buildHeader(activePage)` | `nav.js:7` | Генерирует HTML хедера с навигацией |
| `applyLang(lang)` | `translations.js:319` | Переключает язык (RU/EN/DE) |
| `updateHeaderAuth()` | `auth.js:77` | Обновляет шапку после входа/выхода |
| `openAuthModal(mode)` | `auth.js:124` | Открывает окно входа/регистрации |
| `toggleFav(btn, id, name)` | `tours-page.js:281` | Добавляет/убирает тур из избранного |
| `openFavoritesModal()` | `auth.js:~990` | Показывает избранные туры в профиле |
| `openBookingModal(...)` | `auth.js:346` | Открывает форму бронирования |
| `openBookingsModal()` | `auth.js:~1050` | Показывает историю бронирований |
| `openPaymentModal(...)` | `auth.js:547` | Экран оплаты (шаг 2 бронирования) |
| `openSuccessModal(...)` | `auth.js:728` | Экран успешного бронирования |
| `generateTours()` | `tours-page.js:160` | Генерирует каталог из данных стран |
| `renderTours()` | `tours-page.js:214` | Отрисовывает карточки туров |
| `initFilters()` | `tours-page.js:~400` | Настраивает фильтры и поиск |
| `doSearch()` | `index-page.js:60` | Переход на каталог туров с параметрами |

---

## 🏗️ КАК ЗАПУСТИТЬ ПРОЕКТ

### Способ 1 — start.bat (автоматически)
```
Дважды кликнуть на start.bat
```

### Способ 2 — Вручную
```bash
npm install          # установить зависимости (один раз)
node api/index.js    # запустить сервер
```
Откройте браузер: **http://localhost:5000**

### Онлайн версия
https://endless-line.vercel.app

---

## 📦 ИСПОЛЬЗУЕМЫЕ ТЕХНОЛОГИИ

| Технология | Версия | Для чего |
|---|---|---|
| Node.js | 18+ | Backend-сервер |
| Express | 4.18 | REST API |
| NeDB (seald-io) | 3.x | NoSQL база данных (файлы .db) |
| bcrypt | 5.x | Хеширование паролей (12 rounds) |
| jsonwebtoken | 9.x | JWT-аутентификация |
| helmet | 7.x | HTTP security headers |
| express-rate-limit | 7.x | Защита от перебора |
| React | 18 (CDN) | SPA-каталог туров |
| react-router-dom | 6 (CDN) | Маршрутизация в React |
| D3.js | 7 (CDN) | Интерактивная карта мира |
| Babel (CDN) | 7 | JSX-компиляция в браузере |
| Google Fonts | — | Шрифты Outfit + Inter |

---

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ ДЛЯ ПРЕПОДАВАТЕЛЯ

1. **React-страница** расположена по адресу `/react-tours.html` — главная точка для проверки React-критерия
2. **NeDB-файлы** (база данных) хранятся в `api/data/` — создаются автоматически
3. **JWT_SECRET** нужно выставить на продакшне в Environment Variables Vercel
4. **Глобус** на главной — 3D Canvas с реальной текстурой Земли (`assets/earth_texture.jpg`)
5. **API работает** на `localhost:5000` локально и через `/api` на Vercel

