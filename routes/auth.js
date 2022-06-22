const express = require('express');
const router = express.Router();
const {
  LoginController,
  RegisterController,
  UserController,
} = require('../controllers/auth');
const { loginSchema, registerSchema } = require('../validators/auth');
const validator = require('../middleware/validator');
const { authorize } = require('../middleware/authorize');

router.post('/login', validator(loginSchema), LoginController);

router.post('/register', validator(registerSchema), RegisterController);

router.get('/user', authorize, UserController);

module.exports = router;
