// routes/chat.js
const express = require("express");
const Message = require("../models/Message");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Send a direct message to a user
router.post("/messages/direct", verifyToken, async (req, res) => {
  const { content, receiverId } = req.body;

  const message = new Message({
    sender: req.userId,
    content,
    receiver: receiverId, // Set the receiver
  });

  try {
    await message.save();
    res
      .status(201)
      .json({ message: "Direct message sent successfully!", data: message });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

// Send a group message
router.post("/messages/group", verifyToken, async (req, res) => {
  const { content, groupId } = req.body;

  const message = new Message({
    sender: req.userId,
    content,
    groupId, // Set the group
    group: true, // Indicate that this is a group message
  });

  try {
    await message.save();
    res
      .status(201)
      .json({ message: "Group message sent successfully!", data: message });
  } catch (error) {
    res.status(500).json({ message: "Error sending group message", error });
  }
});

// Get all messages (for both direct and group)
router.get("/messages", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("sender", "username")
      .populate("receiver", "username")
      .populate("groupId", "name");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
});

// Get messages for a specific group
router.get("/messages/group/:groupId", verifyToken, async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Message.find({ groupId }).populate(
      "sender",
      "username"
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching group messages", error });
  }
});

module.exports = router;
