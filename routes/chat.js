// routes/chat.js
const express = require("express");
const Message = require("../models/Message");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Send a message
router.post("/messages", verifyToken, async (req, res) => {
  const { content } = req.body;

  const message = new Message({
    sender: req.userId,
    content,
  });

  try {
    await message.save();
    res
      .status(201)
      .json({ message: "Message sent successfully!", data: message });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

// Get messages (optional)
router.get("/messages", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find().populate("sender", "username");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
});

module.exports = router;
