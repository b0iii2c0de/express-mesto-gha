// Создание константы Card из модели card для дальнейшего
// использования в функциях
const Card = require('../models/card');

// Импорты констант статусов ответа сервера из файла constants.js
const { OK_STATUS_CODE } = require('../utils/constants');
const { HTTP_CREATED_STATUS_CODE } = require('../utils/constants');
const { HTTP_BAD_REQUEST_STATUS_CODE } = require('../utils/constants');
const { NOT_FOUND_PAGE_STATUS_CODE } = require('../utils/constants');
const { SERVER_ERROR_STATUS_CODE } = require('../utils/constants');

// Получение массива карточек
module.exports.getCards = (req, res) => {
  Card.find({})
  // Когда карточки успешно найдены, получаем 200 статус ответа от сервера
    .then((cards) => res.status(OK_STATUS_CODE).send(cards))
  // Если произошла ошибка при поиске карточек, отправляется ответ ошибка сервера
    .catch(() => res.status(SERVER_ERROR_STATUS_CODE).send({
      message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
    }));
};

// Создание новой карточки
module.exports.createNewCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
  // Когда карточка успешно создана, получаем 200 статус ответа от сервера
    .then((card) => res.status(HTTP_CREATED_STATUS_CODE).send(card))
  // Если произошла ошибка при создании карточки, отрабатываем ошибки
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message:
            'При создании новой карточки были переданы некорректные данные',
        });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({
          message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
        });
      }
    });
};

// Лайк карточки
module.exports.addLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    // Когда лайк успешно поставлен, получаем 200 статус ответа от сервера
    .then((card) => res.status(OK_STATUS_CODE).send(card))
    // Если произошла ошибка при постановке лайка, отрабатываем ошибки
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_PAGE_STATUS_CODE)
          .send({ message: 'Карточка c передаваемым id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message: 'При попытке поставить лайк на карточку переданы некорректные данные',
        });
      }
      return res.status(SERVER_ERROR_STATUS_CODE).send({
        message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
      });
    });
};

// Снятие лайка с карточки
module.exports.removeLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    // Когда лайк успешно снят, получаем 200 статус ответа от сервера
    .then((card) => res.status(OK_STATUS_CODE).send(card))
    // Если произошла ошибка при снятии лайка, отрабатываем ошибки
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_PAGE_STATUS_CODE)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message:
            'При попытке снять лайк с карточки переданы некорректные данные',
        });
      }
      return res.status(SERVER_ERROR_STATUS_CODE).send({
        message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
      });
    });
};

// Удаление карточки из массива
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  // Когда карточка успешно удалена, получаем 200 статус ответа от сервера
  // Если карточки не существует, отрабатываем ошибку
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_PAGE_STATUS_CODE)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(OK_STATUS_CODE).send(card);
    })
    // Если произошла ошибка при удалении карточки, отрабатываем ошибки
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message: 'При попытке удалить карточку переданы некорректные данные',
        });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({
          message: 'На сервере произошла ошибка, статус ответа сервера - 500.',
        });
      }
    });
};
