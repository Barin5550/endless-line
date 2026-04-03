/**
 * db.js — Слой работы с базой данных (NeDB)
 *
 * NeDB — встроенная файловая БД в стиле MongoDB.
 * Данные хранятся в папке api/data/*.db (один файл = одна коллекция).
 * На Vercel используется /tmp, т.к. файловая система там временная.
 *
 * Коллекции:
 *   users     — зарегистрированные пользователи
 *   bookings  — бронирования туров/авиа/поездов/круизов
 *   reviews   — отзывы пользователей
 *   contacts  — заявки из формы "Связаться с нами"
 *   favorites — сохранённые (избранные) туры пользователей
 *   jobs      — отклики на вакансии
 */
const Datastore = require('@seald-io/nedb')
const path = require('path')

// На Vercel файловая система только для чтения, кроме /tmp
const dbDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'data')

// Создаём хранилище для каждой коллекции (autoload = загрузить при старте)
const db = {
  users:     new Datastore({ filename: path.join(dbDir, 'users.db'),     autoload: true }),
  bookings:  new Datastore({ filename: path.join(dbDir, 'bookings.db'),  autoload: true }),
  reviews:   new Datastore({ filename: path.join(dbDir, 'reviews.db'),   autoload: true }),
  contacts:  new Datastore({ filename: path.join(dbDir, 'contacts.db'),  autoload: true }),
  favorites: new Datastore({ filename: path.join(dbDir, 'favorites.db'), autoload: true }),
  jobs:      new Datastore({ filename: path.join(dbDir, 'jobs.db'),      autoload: true }),
}

// Индексы для ускорения запросов
db.users.ensureIndex({ fieldName: 'email', unique: true }) // email уникален — нельзя зарегистрировать дважды
db.bookings.ensureIndex({ fieldName: 'userId' })           // быстрый поиск бронирований по пользователю
db.reviews.ensureIndex({ fieldName: 'userId' })            // быстрый поиск отзывов по пользователю
db.contacts.ensureIndex({ fieldName: 'createdAt' })        // сортировка по дате
db.favorites.ensureIndex({ fieldName: 'userId' })          // избранное пользователя
db.jobs.ensureIndex({ fieldName: 'createdAt' })            // отклики по дате

/**
 * promisify — оборачивает методы NeDB в Promise-интерфейс.
 * NeDB по умолчанию использует callbacks; Async-версии (findAsync, insertAsync и т.д.)
 * позволяют использовать await в роутах.
 *
 * @param {Datastore} store — экземпляр NeDB Datastore
 * @returns {Object} объект с методами findOne, find, insert, update, remove, count
 */
const promisify = (store) => ({
  findOne: (q)           => store.findOneAsync(q),
  find:    (q, sort)     => sort ? store.findAsync(q).sort(sort) : store.findAsync(q),
  insert:  (doc)         => store.insertAsync(doc),
  update:  (q, upd, opts = {}) => store.updateAsync(q, upd, opts),
  remove:  (q, opts = {})      => store.removeAsync(q, opts),
  count:   (q)           => store.countAsync(q),
})

// Экспортируем все коллекции с Promise-интерфейсом
module.exports = {
  users:     promisify(db.users),
  bookings:  promisify(db.bookings),
  reviews:   promisify(db.reviews),
  contacts:  promisify(db.contacts),
  favorites: promisify(db.favorites),
  jobs:      promisify(db.jobs),
}
