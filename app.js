const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const routes = require('./routes/router');

// Определение порта для работы бекенда
const { PORT = 3000 } = process.env;

// Создание экземпляра приложения Express.js
const app = express();

// Подключение helmet используется для применения helmet
// в качестве промежуточного обработчика (middleware) в приложении Express.js.
app.use(helmet());

// Отключение заголовка "x-powered-by"
app.disable('x-powered-by');

// Парсинг JSON-запросов
app.use(express.json());

// Установка значения для свойства user в объекте req
app.use((req, res, next) => {
  req.user = {
    _id: '64afce8fd1662107bfda7b13',
  };
  next();
});

// Подключение маршрутов приложения
app.use(routes);

// Подключение к базе данных Mongodb и таблице mestodb
mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('БД успешно подключена');
  })
  .catch(() => {
    console.log('Не удается подключиться к БД, проверьте подключение');
  });

// Запуск сервера на 3000 порту
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
