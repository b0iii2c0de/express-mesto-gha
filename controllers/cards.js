// Создание константы Card из модели card для дальнейшего
// использования в функциях
const Card = require('../models/card');

// Импорты констант статусов ответа сервера из файла constants.js
const { HTTP_CREATED_STATUS_CODE } = require('../utils/constants');

// Импорты ошибок из файла errors
const AccessDeniedError = require('../errors/AccessDeniedError');
const InvalidDataError = require('../errors/InvalidDataError');
const NotFoundPageError = require('../errors/NotFoundPageError');

// Получение массива карточек
function getCards(_, res, next) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

// Создание новой карточки
function createNewCard(req, res, next) {
  const { name, link } = req.body;
  const { userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(HTTP_CREATED_STATUS_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new InvalidDataError(
            'Передача некорректных данных, при попытке добавления новой карточки на страницу.',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Лайк карточки
function addLikeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundPageError('Карточка с данным ID не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new InvalidDataError(
            'Передача некорректных данных при попытке поставить лайк.',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Снятие лайка с карточки
function removeLikeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundPageError('Карточка c передаваемым ID не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new InvalidDataError(
            'Передача некорректных данных при попытке удаления лайка с карточки.',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Удаление карточки из массива
function deleteCard(req, res, next) {
  const { id: cardId } = req.params;
  const { userId } = req.user;

  Card.findById({
    _id: cardId,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundPageError('Карточка c передаваемым ID не найдена');
      }

      const { owner: cardOwnerId } = card;

      if (cardOwnerId.valueOf() !== userId) {
        throw new AccessDeniedError('Нет прав доступа');
      }

      return Card.findByIdAndDelete(cardId);
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFoundPageError('Данная карточка была удалена');
      }

      res.send({ data: deletedCard });
    })
    .catch(next);
}

module.exports = {
  getCards,
  createNewCard,
  addLikeCard,
  removeLikeCard,
  deleteCard,
};
