// Сохранение статусов в константы
const OK_STATUS_CODE = 200;
const HTTP_CREATED_STATUS_CODE = 201;
const HTTP_BAD_REQUEST_STATUS_CODE = 400;
const NOT_FOUND_PAGE_STATUS_CODE = 404;
const SERVER_ERROR_STATUS_CODE = 500;

const { PORT = 3000 } = process.env;

// шаблон регулярного выражения
const regexUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// сгенерированный секретный ключ
const SECRET_KEY_DEV = '97875f93d46cc42dc2b1e9c33fe9b053cc0e6724df977c77d712adc104085f22';

module.exports = {
  SECRET_KEY_DEV,
  regexUrl,
  PORT,
  OK_STATUS_CODE,
  HTTP_CREATED_STATUS_CODE,
  HTTP_BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_PAGE_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
};
