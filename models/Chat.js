const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema(
  {
    isGroupChat: {
      type: Boolean,
      default: false,
    },

    users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    chatName: {
      type: String,
    },
    groupAdmin: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    latestMessage: {
      type: mongoose.Types.ObjectId,
      ref: 'Message',
    },
    unreadMessages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
