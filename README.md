# Endless Line — Travel Agency Web Application

> Курсовой проект | React + Node.js + MongoDB

## 🚀 Стек технологий

| Слой | Технология |
|------|-----------|
| Frontend | React 18 + Vite + React Router DOM |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcryptjs |
| External API | OpenWeatherMap |
| CSS | Vanilla CSS (без фреймворков) |

---

## 📁 Структура проекта

```
WEB.Global/
├── client/              ← React-приложение (порт 5173)
│   ├── src/
│   │   ├── components/  ← Header, Hero, Services, Destinations, BookingForm, etc.
│   │   ├── pages/       ← Home, Login, Register, Dashboard
│   │   ├── context/     ← AuthContext, LangContext
│   │   └── index.css
│   └── .env
│
├── server/              ← Node.js API (порт 5000)
│   ├── models/          ← User.js, Booking.js
│   ├── routes/          ← auth.js, bookings.js
│   ├── middleware/      ← auth.js (JWT)
│   ├── server.js
│   └── .env
│
├── index.html           ← Статичная версия (резервная)
└── styles.css
```

---

## ⚙️ Установка и запуск

### 1. Клонировать / открыть проект

```bash
cd c:\Проекты_Барина\WEB.Global
```

### 2. Установить клиент
```bash
cd client
npm install
```

### 3. Установить сервер
```bash
cd ../server
npm install
```

### 4. Настроить MongoDB Atlas

1. Зарегистрируйтесь на [mongodb.com/atlas](https://mongodb.com/atlas)
2. Создайте бесплатный кластер (M0 Free Tier)
3. Создайте пользователя БД и получите connection string
4. Откройте `server/.env` и замените строку:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/endlessline
```

### 5. Запустить сервер (терминал 1)
```bash
cd server
node server.js
# Сервер: http://localhost:5000
```

### 6. Запустить клиент (терминал 2)
```bash
cd client
npm run dev
# Клиент: http://localhost:5173
```

---

## 🔑 API маршруты

### Auth
| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| GET | `/api/auth/me` | Профиль (JWT) |

### Bookings (требует JWT)
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/bookings` | Список бронирований |
| POST | `/api/bookings` | Создать бронирование |
| DELETE | `/api/bookings/:id` | Отменить бронирование |

---

## 🌐 Страницы

| URL | Страница |
|-----|---------|
| `/` | Главная (Hero, Services, Destinations, Booking, FAQ, Contacts) |
| `/login` | Авторизация |
| `/register` | Регистрация |
| `/dashboard` | Мои бронирования (защищён JWT) |

---

## 🗺️ Внешние API

- **OpenWeatherMap** — погода в городе при наведении на карточку направления
  - API Key задаётся в `client/.env` → `VITE_WEATHER_API_KEY`

---

## 🗄️ Модели MongoDB

### User
```json
{ "name": "string", "email": "string (unique)", "password": "bcrypt hash", "createdAt": "date" }
```

### Booking
```json
{ "user": "ObjectId", "type": "train|cruise|air", "from": "string", "to": "string", "departDate": "date", "returnDate": "date", "passengers": "number", "status": "confirmed|pending|cancelled", "price": "number" }
```
