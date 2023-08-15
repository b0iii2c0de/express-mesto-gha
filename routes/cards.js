const router = require('express').Router();

const {
  getCards,
  createNewCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
} = require('../controllers/cards');

// Маршрут всех карточек:
router.get('/', getCards);
// Маршрут для новой карточки:
router.post('/', createNewCard);
// Маршрут для удаления карточки:
router.delete('/:cardId', deleteCard);
// Маршрут для постановки лайка на карточку:
router.put('/:cardId/likes', addLikeCard);
// Маршрут для снятия лайка с карточки:
router.delete('/:cardId/likes', removeLikeCard);

module.exports = router;
