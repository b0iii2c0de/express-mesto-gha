// импорт ошибки 500
const { SERVER_ERROR_STATUS_CODE } = require('../utils/constants');

// Middleware для обработки ошибок
const errorHandler = (err, _, res, next) => {
  // Определяем статус ошибки
  const statusCode = err.statusCode || SERVER_ERROR_STATUS_CODE;

  // Определяем сообщение вывода об ошибке
  const message = statusCode === SERVER_ERROR_STATUS_CODE
    ? 'На сервере произошла ошибка'
    : err.message;

  res.status(statusCode).send({ message });

  next();
};

module.exports = errorHandler;
