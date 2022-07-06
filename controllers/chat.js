const ChatModel = require('../models/Chat');
const UserModel = require('../models/User');
const mongoose = require('mongoose');

const getAllChatsController = async (req, res) => {
  try {
    ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .populate('unreadMessages')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserModel.populate(results, {
          path: 'latestMessage.sender',
          select: 'username avatar email',
        });
        const filteredData = results.map((data) => {
          const users = data.users.filter((user) => {
            return user._id.toString() !== req.user._id.toString();
          });
          data.users = users;
          const unreadMessages = data.unreadMessages.filter(
            (data, index, array) => {
              return array.indexOf(data) === index;
            }
          );
          data.unreadMessages = unreadMessages;
          return data;
        });

        res.status(200).send(filteredData);
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

const createChatController = async (req, res) => {
  try {
    const body = req.body;
    const { userId } = body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'لطفا کاربر را انتخاب کنید.',
      });
    }

    let isChat = await ChatModel.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    isChat = await UserModel.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'username avatar',
    });

    if (isChat.length > 0) {
      return res.status(200).json(isChat);
    } else {
      var chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        const createdChat = await ChatModel.create(chatData);
        const FullChat = await ChatModel.findOne({
          _id: createdChat._id,
        }).populate('users', '-password');
        return res.status(200).json(FullChat);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'خطا در ایجاد چت',
          error,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

const createGroupChatController = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({
        success: false,
        message: 'لطفا تمام خانه ها را تکمیل نمایید',
      });
    }

    var users = req.body.users.map(
      (user) => (user.id = mongoose.Types.ObjectId(user.id))
    );

    if (users.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'چت گروهی شامل حداقل 3 نفر می‌باشد',
      });
    }

    users.push(req.user);

    console.log(users);

    const groupChat = await ChatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    return res.status(200).json(fullGroupChat);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

const renameGroupChatController = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
      return res.status(400).json({
        success: false,
        message: 'لطفا اطلاعات را به صورت کامل وارد کنید.',
      });
    }

    const chat = await ChatModel.findById(chatId);

    if (chat.groupAdmin._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'فقط ادمین می‌تواند اعضا را به گروه اضافه کند.',
      });
    }

    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      return res.status(400).json({
        success: false,
        message: 'چت پیدا نشد',
      });
    } else {
      return res.json(updatedChat);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

const removeFromGroupChatController = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'لطفا اطلاعات را به صورت کامل وارد کنید.',
      });
    }

    // check if the requester is admin

    const chat = await ChatModel.findById(chatId);

    if (chat.groupAdmin._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'فقط ادمین می‌تواند اعضا را از گروه حذف کند.',
      });
    }

    const removed = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!removed) {
      return res.status(400).json({
        success: false,
        message: 'کاربری با چنین شناسه موجود نمی‌باشد.',
      });
    } else {
      return res.status(200).json(removed);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

const addToGroupChatController = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'لطفا اطلاعات را به صورت کامل وارد کنید.',
      });
    }

    // check if the requester is admin

    const chat = await ChatModel.findById(chatId);

    if (chat.groupAdmin._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'فقط ادمین می‌تواند اعضا را به گروه اضافه کند.',
      });
    }

    if (chat.users.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'کاربر در چت موجود می‌باشد.',
      });
    }

    const added = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!added) {
      return res.status(400).json({
        success: false,
        message: 'کاربر پیدا نشد.',
      });
    } else {
      return res.json(added);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

const removeUnreadMessagesController = async (req, res) => {
  try {
    if (!req.body.chatId) {
      return res.status(400).json({
        message: 'لطفا چت را انتخاب کنید',
      });
    }

    const chat = await ChatModel.findByIdAndUpdate(
      req.body.chatId,
      {
        unreadMessages: [],
      },
      {
        new: true,
      }
    );

    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

const increaseUnreadMessagesController = async (req, res) => {
  try {
    if (!req.body.chatId) {
      return res.status(400).json({
        message: 'لطفا چت را انتخاب کنید',
      });
    }

    if (!req.body.message) {
      return res.status(400).json({
        message: 'لطفا پیام را وارد کنید',
      });
    }

    console.log(req.body.chatId, '-------------------');
    console.log(req.body.message._id, '-------------------');

    const updatedChat = await ChatModel.findByIdAndUpdate(
      req.body.chatId,
      {
        $push: { unreadMessages: req.body.message._id },
      },
      {
        new: true,
      }
    );
    console.log(updatedChat, '-------------------');

    return res.status(200).json(updatedChat);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

module.exports = {
  createChatController,
  getAllChatsController,
  createGroupChatController,
  renameGroupChatController,
  addToGroupChatController,
  removeFromGroupChatController,
  removeUnreadMessagesController,
  increaseUnreadMessagesController,
};
