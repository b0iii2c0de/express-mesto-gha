// Создание константы User из модели user для дальнейшего
// использования в функциях
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Импорты констант статусов ответа сервера из файла constants.js
const { HTTP_CREATED_STATUS_CODE } = require('../utils/constants');

// Импорт секретного ключа из файла constants.js
const { SECRET_KEY_DEV } = require('../utils/constants');

// Импорты ошибок из файла errors
const DuplicateDataError = require('../errors/DuplicateDataError');
const InvalidDataError = require('../errors/InvalidDataError');
const NotFoundPageError = require('../errors/NotFoundPageError');

// Регистрация пользователя
function registration(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;

      return res.status(HTTP_CREATED_STATUS_CODE).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new DuplicateDataError(
            'Пользователь с данным электронным адресом уже зарегистрирован',
          ),
        );
      } else if (err.name === 'ValidationError') {
        next(
          new InvalidDataError(
            'Передача некорректных данные при регистрации пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Логин пользователя
function login(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      const token = jwt.sign({ userId }, SECRET_KEY_DEV, {
        expiresIn: '7d',
      });

      return res.send({ _id: token });
    })
    .catch((err) => {
      next(err);
    });
}

// Получение пользователей из базы данных mongodb
function getUsers(_, res, next) {
  User.find({})
    // Когда пользователи успешно найдены, получаем 200 статус ответа от сервера
    .then((users) => res.send({ users }))
    // Если произошла ошибка
    .catch(next);
}

// Пользователь по его id
function getUserById(req, res, next) {
  const { id } = req.params;

  User.findById(id)

    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundPageError('Пользователь c указанным id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Передача некорректного id'));
      } else {
        next(err);
      }
    });
}

// Пользователь
function getUserInfo(req, res, next) {
  const { userId } = req.user;

  User.findById(userId)
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundPageError('Пользователь c указанным id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Передача некорректного id'));
      } else {
        next(err);
      }
    });
}

// Редактирование аватара пользователя
function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundPageError('Пользователь c указанным id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new InvalidDataError(
            'Передача некорректных данных при попытке обновления аватара',
          ),
        );
      } else {
        next(err);
      }
    });
}

// редактирование данных пользователя
function updateProfile(req, res, next) {
  const { name, about } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundPageError('Пользователь c указанным id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new InvalidDataError(
            'Передача некорректных данных при попытке обновления профиля',
          ),
        );
      } else {
        next(err);
      }
    });
}

module.exports = {
  registration,
  login,
  getUsers,
  getUserById,
  getUserInfo,
  updateProfile,
  updateAvatar,
};
