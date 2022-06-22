const express = require('express');
const {
  createChatController,
  getAllChatsController,
  createGroupChatController,
  renameGroupChatController,
  removeFromGroupChatController,
  addToGroupChatController,
  increaseUnreadMessagesController,
  removeUnreadMessagesController,
} = require('../controllers/chat');
const { authorize } = require('../middleware/authorize');
const router = express.Router();

router.get('/', authorize, getAllChatsController);

router.post('/create', authorize, createChatController);

router.post('/group/create', authorize, createGroupChatController);

router.put('/group/rename', authorize, renameGroupChatController);

router.put('/group/remove', authorize, removeFromGroupChatController);

router.put('/group/add', authorize, addToGroupChatController);

router.put(
  '/increase/UnreadMessages',
  authorize,
  increaseUnreadMessagesController
);

router.put('/remove/unreadMessages', authorize, removeUnreadMessagesController);

module.exports = router;
