const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
  {
    readBy: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    sender: { type: mongoose.Types.ObjectId, ref: 'User' },
    content: { type: mongoose.Schema.Types.Mixed },
    chat: { type: mongoose.Types.ObjectId, ref: 'Chat' },
    time: { type: String },
    type: { type: String },
    replyTo: { type: mongoose.Types.ObjectId, ref: 'Message' },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Message || mongoose.model('Message', MessageSchema);
