// Подключение маршрутизации Express.js
const router = require('express').Router();

// Импорт константы статуса 404 страница не найдена
const { NOT_FOUND_PAGE_STATUS_CODE } = require('../utils/constants');

// Подключение маршрутов пользователей
const userRoutes = require('./users');
// Подключение маршрутов карточек
const cardRoutes = require('./cards');

// Использование маршрутов пользователей "/users"
router.use('/users', userRoutes);
// Использование маршрутов карточек "/cards"
router.use('/cards', cardRoutes);

// Обработка запросов на несуществующие страницы
router.use('/*', (req, res) => {
  res
    .status(NOT_FOUND_PAGE_STATUS_CODE)
    .send({ message: `${NOT_FOUND_PAGE_STATUS_CODE}: Страница не найдена.` });
});

module.exports = router;
