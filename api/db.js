/**
 * ============================================================
 * ENDLESS LINE — База данных (api/db.js)
 * ============================================================
 * Использует NeDB — встроенную NoSQL базу данных для Node.js.
 * Данные хранятся в текстовых файлах (api/data/*.db).
 * На Vercel (продакшн) данные хранятся в /tmp (временная память).
 * API полностью совместимо с MongoDB.
 * ============================================================
 */

const Datastore = require('@seald-io/nedb') // NeDB — легковесная NoSQL БД
const path = require('path')                // Для кросс-платформенных путей к файлам

// ── ДИРЕКТОРИЯ ДЛЯ ФАЙЛОВ БД ─────────────────────────────────
// На Vercel файловая система read-only, поэтому используем /tmp
// Локально — папка api/data/ рядом с кодом
const dbDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'data')

// ── СОЗДАНИЕ КОЛЛЕКЦИЙ (аналог таблиц в SQL) ─────────────────
// autoload: true — NeDB загружает данные из файла при старте автоматически
const db = {
  users:     new Datastore({ filename: path.join(dbDir, 'users.db'),     autoload: true }), // 👤 Пользователи
  bookings:  new Datastore({ filename: path.join(dbDir, 'bookings.db'),  autoload: true }), // 📋 Бронирования
  reviews:   new Datastore({ filename: path.join(dbDir, 'reviews.db'),   autoload: true }), // ⭐ Отзывы
  contacts:  new Datastore({ filename: path.join(dbDir, 'contacts.db'),  autoload: true }), // 📬 Обращения
  favorites: new Datastore({ filename: path.join(dbDir, 'favorites.db'), autoload: true }), // ❤️  Избранное
  jobs:      new Datastore({ filename: path.join(dbDir, 'jobs.db'),      autoload: true }), // 💼 Вакансии
}

// ── ИНДЕКСЫ ──────────────────────────────────────────────────
// Индексы ускоряют поиск — как индекс в книге (ищем по полю быстрее)
// unique: true — запрещает дублирование значений
db.users.ensureIndex({ fieldName: 'email', unique: true })  // Один email = один аккаунт
db.bookings.ensureIndex({ fieldName: 'userId' })   // Быстрый поиск бронирований по пользователю
db.reviews.ensureIndex({ fieldName: 'userId' })    // Быстрый поиск отзывов по пользователю
db.contacts.ensureIndex({ fieldName: 'createdAt' }) // Сортировка обращений по дате
db.favorites.ensureIndex({ fieldName: 'userId' })  // Быстрый поиск избранного по пользователю
db.jobs.ensureIndex({ fieldName: 'createdAt' })    // Сортировка вакансий по дате

// ── ПРОМИСИФИКАЦИЯ ────────────────────────────────────────────
// NeDB изначально использует callbacks (устаревший стиль).
// Эта функция оборачивает каждый метод в Promise для async/await синтаксиса.
const promisify = (store) => ({
  /**
   * Найти один документ по условию
   * @param {Object} q - Условие поиска (аналог WHERE в SQL)
   * @example db.users.findOne({ email: 'test@mail.ru' })
   */
  findOne: (q) => store.findOneAsync(q),

  /**
   * Найти несколько документов
   * @param {Object} q    - Условие поиска
   * @param {Object} sort - Сортировка, например { createdAt: -1 } (новые первыми)
   * @example db.bookings.find({ userId: '123' }, { createdAt: -1 })
   */
  find: (q, sort) => sort ? store.findAsync(q).sort(sort) : store.findAsync(q),

  /**
   * Вставить новый документ
   * @param {Object} doc - Объект для сохранения (NeDB автоматически добавит _id)
   * @example db.users.insert({ email: 'a@b.com', password: 'hash', name: 'Иван' })
   */
  insert: (doc) => store.insertAsync(doc),

  /**
   * Обновить документ(ы)
   * @param {Object} q    - Условие поиска
   * @param {Object} upd  - Изменение (используй $set для частичного обновления)
   * @param {Object} opts - { multi: true } для обновления нескольких документов
   * @example db.bookings.update({ _id: '123' }, { $set: { status: 'confirmed' } })
   */
  update: (q, upd, opts = {}) => store.updateAsync(q, upd, opts),

  /**
   * Удалить документ(ы)
   * @param {Object} q    - Условие поиска
   * @param {Object} opts - { multi: true } для удаления нескольких
   * @example db.favorites.remove({ userId: '123', tourId: 'turkey-0' })
   */
  remove: (q, opts = {}) => store.removeAsync(q, opts),

  /**
   * Посчитать количество документов
   * @param {Object} q - Условие (пустой объект {} = все документы)
   * @example db.users.count({}) // → общее количество пользователей
   */
  count: (q) => store.countAsync(q),
})

// ── ЭКСПОРТ ───────────────────────────────────────────────────
// Экспортируем промисифицированные версии всех коллекций
// В маршрутах используется: const db = require('./db')
module.exports = {
  users:     promisify(db.users),     // API для работы с пользователями
  bookings:  promisify(db.bookings),  // API для работы с бронированиями
  reviews:   promisify(db.reviews),   // API для работы с отзывами
  contacts:  promisify(db.contacts),  // API для работы с обращениями
  favorites: promisify(db.favorites), // API для работы с избранным
  jobs:      promisify(db.jobs),      // API для работы с вакансиями
}
