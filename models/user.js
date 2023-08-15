const mongoose = require('mongoose');

// Пакет validator - это библиотека для проверки и валидации данных в Node.js.
// Он предоставляет набор функций, которые облегчают проверку различных типов данных,
// таких как строки, числа, URL-адреса, электронные адреса и другие.
const validator = require('validator');

// Cоздание схемы пользователя
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено обязательно'],
      minlength: [2, 'Минимальное количество символов для поля "name" - 2'],
      maxlength: [
        30,
        'Максимальное количество символов для поля "name" - 30',
      ],
    },
    about: {
      type: String,
      required: [true, 'Поле "about" должно быть заполнено'],
      minlength: [
        2,
        'Минимальное количество символов для поля "about" - 2',
      ],
      maxlength: [
        30,
        'Максимальное количество символов для поля "about" - 30',
      ],
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (url) => validator.isURL(url),
        message:
          'Введенный URL адрес некорректный, введите корректный URL',
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);