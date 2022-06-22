const MessageModel = require('../models/Message');
const ChatModel = require('../models/Chat');
const UserModel = require('../models/User');

const getAllMessagesController = async (req, res) => {
  try {
    const messages = await MessageModel.find({ chat: req.params.chatId })
      .populate('sender', 'username avatar email')
      .populate('chat')
      .populate('replyTo');
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

const sendMessageController = async (req, res) => {
  try {
    const { content, chatId, type, time } = req.body;

    if (!content || !chatId) {
      console.log('Invalid data passed into request');
      return res.status(400).json({
        success: false,
        message: 'محتوا را مشخص کنید',
      });
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
      type,
      time,
    };

    var message = await MessageModel.create(newMessage);

    message = await message.populate('sender', 'username avatar');
    message = await message.populate('chat');
    message = await UserModel.populate(message, {
      path: 'chat.users',
      select: 'username avatar email',
    });

    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

const replyMessageController = async (req, res) => {
  try {
    const { content, chatId, type, time } = req.body;
    const messageId = req.params.messageId;

    if (!content || !chatId) {
      console.log('Invalid data passed into request');
      return res.status(400).json({
        success: false,
        message: 'محتوا را مشخص کنید',
      });
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
      type,
      time,
      replyTo: messageId,
    };

    var message = await MessageModel.create(newMessage);

    message = await message.populate('sender', 'username avatar');
    message = await message.populate('chat');
    message = await message.populate('replyTo');
    message = await UserModel.populate(message, {
      path: 'chat.users',
      select: 'username avatar email',
    });

    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

module.exports = {
  getAllMessagesController,
  sendMessageController,
  replyMessageController,
};
