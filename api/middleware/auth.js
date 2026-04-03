/**
 * ============================================================
 * ENDLESS LINE — JWT Middleware (api/middleware/auth.js)
 * ============================================================
 * Промежуточный обработчик (middleware) для защиты эндпоинтов.
 * Используется так:  router.get('/route', require('../middleware/auth'), handler)
 *
 * Схема работы:
 * 1. Клиент отправляет запрос с заголовком:
 *    Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 * 2. Middleware извлекает и проверяет токен
 * 3. Если токен валиден → добавляет req.userId и пропускает запрос
 * 4. Если токен невалиден / отсутствует → возвращает 401 Unauthorized
 * ============================================================
 */

const jwt = require('jsonwebtoken') // Библиотека для работы с JWT-токенами

/**
 * Express middleware для проверки JWT-авторизации
 * @param {import('express').Request}  req  - HTTP запрос (с headers.authorization)
 * @param {import('express').Response} res  - HTTP ответ
 * @param {Function}                   next - Вызов следующего middleware/handler
 */
module.exports = (req, res, next) => {
  // Получаем заголовок Authorization из запроса
  // Формат: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
  const authHeader = req.headers.authorization

  // Проверяем что заголовок существует и начинается с "Bearer "
  // Если нет — возвращаем 401 Unauthorized (не авторизован)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет авторизации. Войдите в аккаунт.' })
  }

  // Извлекаем сам токен — всё после "Bearer " (пробел включительно)
  // split(' ')[1] → берём второй элемент массива ['Bearer', 'eyJ...']
  const token = authHeader.split(' ')[1]

  try {
    // jwt.verify() — расшифровывает и ПРОВЕРЯЕТ токен:
    // 1. Что подпись совпадает с JWT_SECRET (токен не подделан)
    // 2. Что токен не истёк (expiresIn: '7d')
    // Если что-то не так — бросает исключение, которое ловит catch
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'endless_secret_2026')

    // Добавляем userId к запросу — теперь он доступен в следующих обработчиках
    // Маршруты используют его так: const user = await db.users.findOne({ _id: req.userId })
    req.userId = decoded.id

    // Передаём управление следующему обработчику (маршруту)
    next()
  } catch (err) {
    // jwt.verify() бросил ошибку:
    // - JsonWebTokenError: подпись не совпадает (токен подделан или от другого сервера)
    // - TokenExpiredError: прошло больше 7 дней
    // - NotBeforeError: токен ещё не активен (редко)
    res.status(401).json({ message: 'Токен недействителен или истёк' })
  }
}
