// Создание константы User из модели user для дальнейшего
// использования в функциях
const User = require('../models/user');

// Импорты констант статусов ответа сервера из файла constants.js
const { OK_STATUS_CODE } = require('../utils/constants');
const { HTTP_CREATED_STATUS_CODE } = require('../utils/constants');
const { HTTP_BAD_REQUEST_STATUS_CODE } = require('../utils/constants');
const { NOT_FOUND_PAGE_STATUS_CODE } = require('../utils/constants');
const { SERVER_ERROR_STATUS_CODE } = require('../utils/constants');

// Получение пользователей из базы данных mongodb
module.exports.getUsers = (_, res) => {
  User.find({})
  // Когда пользователи успешно найдены, получаем 200 статус ответа от сервера
    .then((users) => res.send(users))
  // Если произошла ошибка при поиске пользователей, отправляется ответ ошибки сервера
    .catch(() => res.status(SERVER_ERROR_STATUS_CODE).send({
      message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
    }));
};

// Пользователь по его id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    // Когда пользователь успешно найдены по _id, получаем 200 статус ответа от сервера
    .then((user) => res.status(OK_STATUS_CODE).send(user))
    // Если произошла ошибка при поиске пользователя по _id, отрабатываем ошибки
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message: 'При поиске пользователя были переданы некорректные данные',
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_PAGE_STATUS_CODE).send({
          message: 'Пользователь c указанным _id не найден',
        });
      }

      return res.status(SERVER_ERROR_STATUS_CODE).send({
        message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
      });
    });
};

// Создание пользователя
module.exports.createNewUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
  // Когда пользователь успешно создан, получаем 200 статус ответа от сервера
    .then((user) => res.status(HTTP_CREATED_STATUS_CODE).send(user))
  // Если произошла ошибка при создании пользователя, отрабатываем ошибки
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message:
            'При создании пользователя были переданы некорректные данные',
        });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({
          message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
        });
      }
    });
};

// Редактирование аватара пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    // Когда аватар пользователя успешно обновлён, получаем 200 статус ответа от сервера
    .then((user) => res.status(OK_STATUS_CODE).send(user))
    // Когда при попытке обновить аватар пользователя произошла ошибка, отрабатываем ошибки
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_PAGE_STATUS_CODE).send({
          message: 'Данный пользователь не был найден',
        });
      }

      if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(
          (error) => error.message,
        );
        return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message:
            'При обновлении аватара были переданы некорректные данные',
          validationErrors,
        });
      }

      return res.status(SERVER_ERROR_STATUS_CODE).send({
        message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
      });
    });
};

// Редактирование профиля пользователя
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    // Когда данные пользователя успешно обновлёны, получаем 200 статус ответа от сервера
    .then((user) => res.status(OK_STATUS_CODE).send(user))
    // Когда при попытке обновить данные пользователя произошла ошибка, отрабатываем ошибки
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_PAGE_STATUS_CODE).send({
          message: 'Данный пользователь не найден',
        });
      }

      if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(
          (error) => error.message,
        );
        return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message:
            'При обновлении профиля были переданы некорректные данные',
          validationErrors,
        });
      }

      return res.status(SERVER_ERROR_STATUS_CODE).send({
        message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
      });
    });
};
