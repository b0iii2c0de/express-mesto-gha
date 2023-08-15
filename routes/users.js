const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createNewUser,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

// Все пользователи
router.get('/', getUsers);
// Конкретный пользователь по его id
router.get('/:userId', getUserById);
// Создание нового пользователя
router.post('/', createNewUser);
// Редактирование аватара пользователя
router.patch('/me/avatar', updateAvatar);
// Редактирование данных о пользователе:
router.patch('/me', updateProfile);

module.exports = router;
