const rateLimiter = require('express-rate-limit');

// Ограничитель запросов
const limiter = rateLimiter({
  max: 120,
  windowMS: 70000,
  message: 'Превышено количество запросов на сервер. Попробуйте повторить чуть позже',
});

module.exports = limiter;
