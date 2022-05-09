const express = require('express');
const router = express.Router();
const { LoginController, RegisterController } = require('../controllers/auth');
const { loginSchema, registerSchema } = require('../validators/auth');
const validator = require('../middleware/validator');

router.post('/login', validator(loginSchema), LoginController);

router.post('/register', validator(registerSchema), RegisterController);

module.exports = router;
