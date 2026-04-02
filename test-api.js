const http = require('http')

function testAPI(method, path, body, headers = {}) {
  return new Promise((resolve) => {
    const bodyStr = body ? JSON.stringify(body) : ''
    const options = {
      host: 'localhost', port: 5000, path, method,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr), ...headers }
    }
    const req = http.request(options, (r) => {
      let d = ''
      r.on('data', c => d += c)
      r.on('end', () => resolve({ status: r.statusCode, body: JSON.parse(d) }))
    })
    req.on('error', e => resolve({ status: 0, error: e.message }))
    if (bodyStr) req.write(bodyStr)
    req.end()
  })
}

async function run() {
  console.log('=== Testing Endless Line API ===\n')

  // Health check
  const health = await testAPI('GET', '/api/health', null)
  console.log('✅ Health:', health.body)

  // Stats (should be empty)
  const stats = await testAPI('GET', '/api/stats', null)
  console.log('✅ Stats:', stats.body)

  // Register
  const reg = await testAPI('POST', '/api/auth/register', {
    name: 'Иван Тестов', email: 'ivan@test.kz', password: 'mypassword123', phone: '+7 700 000 0000'
  })
  console.log(`\n${reg.status === 201 ? '✅' : '❌'} Register [${reg.status}]:`, reg.body.user || reg.body)

  // Duplicate register
  const reg2 = await testAPI('POST', '/api/auth/register', {
    name: 'Иван Тестов', email: 'ivan@test.kz', password: 'mypassword123'
  })
  console.log(`${reg2.status === 400 ? '✅' : '❌'} Duplicate register [${reg2.status}]:`, reg2.body.message)

  // Login with correct creds
  const login = await testAPI('POST', '/api/auth/login', { email: 'ivan@test.kz', password: 'mypassword123' })
  console.log(`${login.status === 200 ? '✅' : '❌'} Login [${login.status}]:`, login.body.user || login.body)

  // Login with wrong password
  const badLogin = await testAPI('POST', '/api/auth/login', { email: 'ivan@test.kz', password: 'wrongpass' })
  console.log(`${badLogin.status === 401 ? '✅' : '❌'} Bad login [${badLogin.status}]:`, badLogin.body.message)

  if (login.body.token) {
    const token = login.body.token
    // Get /me
    const me = await testAPI('GET', '/api/auth/me', null, { Authorization: `Bearer ${token}` })
    console.log(`\n${me.status === 200 ? '✅' : '❌'} /me [${me.status}]:`, me.body)

    // Update profile
    const profile = await testAPI('PUT', '/api/auth/profile', { name: 'Иван Обновлённый', phone: '+7 777 999 8877' }, { Authorization: `Bearer ${token}` })
    console.log(`${profile.status === 200 ? '✅' : '❌'} Update profile [${profile.status}]:`, profile.body)

    // Create booking
    const booking = await testAPI('POST', '/api/bookings', {
      type: 'train', from: 'Алматы', to: 'Астана', departDate: '2026-05-01', passengers: 2
    }, { Authorization: `Bearer ${token}` })
    console.log(`\n${booking.status === 201 ? '✅' : '❌'} Create booking [${booking.status}]:`, booking.body)

    // Get bookings
    const bookings = await testAPI('GET', '/api/bookings', null, { Authorization: `Bearer ${token}` })
    console.log(`${bookings.status === 200 ? '✅' : '❌'} Get bookings [${bookings.status}]: ${bookings.body.length} bookings`)

    // Post review
    const review = await testAPI('POST', '/api/reviews', {
      rating: 5, text: 'Отличный сервис! Всё прошло гладко.', destination: 'Астана'
    }, { Authorization: `Bearer ${token}` })
    console.log(`${review.status === 201 ? '✅' : '❌'} Create review [${review.status}]:`, review.body)

    // Get reviews (public)
    const reviews = await testAPI('GET', '/api/reviews', null)
    console.log(`${reviews.status === 200 ? '✅' : '❌'} Get reviews [${reviews.status}]: ${reviews.body.length} reviews`)

    // Contact form
    const contact = await testAPI('POST', '/api/contacts', {
      name: 'Иван Тестов', email: 'ivan@test.kz', message: 'Хочу узнать подробности тура.'
    })
    console.log(`${contact.status === 201 ? '✅' : '❌'} Contact form [${contact.status}]:`, contact.body.message)
  }

  // Stats after operations
  const stats2 = await testAPI('GET', '/api/stats', null)
  console.log('\n📊 Final stats:', stats2.body)

  console.log('\n=== All tests complete ===')
}

run().catch(console.error)
