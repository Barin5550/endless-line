const Datastore = require('@seald-io/nedb')
const path = require('path')

const dbDir = path.join(__dirname, 'data')

const db = {
  users: new Datastore({ filename: path.join(dbDir, 'users.db'), autoload: true }),
  bookings: new Datastore({ filename: path.join(dbDir, 'bookings.db'), autoload: true }),
  reviews: new Datastore({ filename: path.join(dbDir, 'reviews.db'), autoload: true }),
  contacts: new Datastore({ filename: path.join(dbDir, 'contacts.db'), autoload: true }),
}

// Indexes
db.users.ensureIndex({ fieldName: 'email', unique: true })
db.bookings.ensureIndex({ fieldName: 'userId' })
db.reviews.ensureIndex({ fieldName: 'userId' })
db.contacts.ensureIndex({ fieldName: 'createdAt' })

// Promisify helpers
const promisify = (store) => ({
  findOne: (q) => store.findOneAsync(q),
  find: (q, sort) => sort ? store.findAsync(q).sort(sort) : store.findAsync(q),
  insert: (doc) => store.insertAsync(doc),
  update: (q, upd, opts = {}) => store.updateAsync(q, upd, opts),
  remove: (q, opts = {}) => store.removeAsync(q, opts),
  count: (q) => store.countAsync(q),
})

module.exports = {
  users: promisify(db.users),
  bookings: promisify(db.bookings),
  reviews: promisify(db.reviews),
  contacts: promisify(db.contacts),
}
