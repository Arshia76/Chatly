const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authorize');
const {
  getAllMessagesController,
  sendMessageController,
  replyMessageController,
} = require('../controllers/message');

router.get('/messages/:chatId', authorize, getAllMessagesController);

router.post('/send', authorize, sendMessageController);

router.post('/reply/:messageId', authorize, replyMessageController);

module.exports = router;
