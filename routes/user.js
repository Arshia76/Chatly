const express = require('express');
const {
  searchUser,
  updateUserController,
  changePasswordController,
  updateUserAvatarController,
} = require('../controllers/user');
const { authorize } = require('../middleware/authorize');
const {
  updateUserSchema,
  updatePasswordSchema,
} = require('../validators/user');
const validator = require('../middleware/validator');
const router = express.Router();

router.get('/search', authorize, searchUser);

router.put(
  '/update/:userId',
  authorize,
  validator(updateUserSchema),
  updateUserController
);

router.put('/update/avatar/:userId', authorize, updateUserAvatarController);

router.put(
  '/update/password/:userId',
  authorize,
  validator(updatePasswordSchema),
  changePasswordController
);

module.exports = router;
