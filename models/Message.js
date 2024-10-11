// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    group: { type: Boolean, default: false },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Receiver for direct messages
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // Group ID for group messages
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
