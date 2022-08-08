const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authorize');
const {
  getAllMessagesController,
  sendMessageController,
  replyMessageController,
  deleteMessageController,
} = require('../controllers/message');

router.get('/messages/:chatId', authorize, getAllMessagesController);

router.post('/send', authorize, sendMessageController);

router.post('/reply/:messageId', authorize, replyMessageController);

router.delete('/delete/:messageId', authorize, deleteMessageController);

module.exports = router;
