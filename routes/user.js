const express = require('express');
const { searchUser } = require('../controllers/user');
const { authorize } = require('../middleware/authorize');
const router = express.Router();

router.get('/search', authorize, searchUser);

module.exports = router;
