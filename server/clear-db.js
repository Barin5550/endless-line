const Datastore = require('@seald-io/nedb')
const path = require('path')
const dir = path.join(__dirname, 'data')

const collections = ['users', 'bookings', 'reviews', 'contacts']
let done = 0

collections.forEach(name => {
  const db = new Datastore({ filename: path.join(dir, name + '.db'), autoload: true })
  db.removeAsync({}, { multi: true }).then(r => {
    console.log('Cleared', r, 'records from', name + '.db')
    done++
    if (done === collections.length) {
      console.log('Done! Database is clean for real users.')
      process.exit(0)
    }
  })
})
