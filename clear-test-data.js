// Clears all test data from NeDB databases
const Datastore = require('@seald-io/nedb')
const path = require('path')

const dbDir = path.join(__dirname, 'server', 'data')

async function clearAll() {
  const collections = ['users', 'bookings', 'reviews', 'contacts']
  for (const name of collections) {
    const db = new Datastore({ filename: path.join(dbDir, `${name}.db`), autoload: true })
    const removed = await db.removeAsync({}, { multi: true })
    console.log(`Cleared ${removed} records from ${name}.db`)
  }
  console.log('✅ All test data cleared. Ready for real users!')
  process.exit(0)
}

clearAll().catch(e => { console.error(e); process.exit(1) })
