// routes/group.js
const express = require("express");
const verifyToken = require("../middleware/auth");
const Group = require("../models/Group");
const router = express.Router();

// Create a group
router.post("/", verifyToken, async (req, res) => {
  const { name, members } = req.body;

  try {
    const group = new Group({
      name,
      members: [...members, req.userId], // Add creator to members
    });
    await group.save();
    res.status(201).json({ message: "Group created successfully!", group });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error creating group", error: error.message });
  }
});

// Get all groups
router.get("/", verifyToken, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.userId }).populate(
      "members",
      "username"
    );
    res.json(groups);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching groups", error: error.message });
  }
});

// Add member to group
router.post("/:groupId/members", verifyToken, async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const group = await Group.findByIdAndUpdate(
      groupId,
      {
        $addToSet: { members: userId }, // Use $addToSet to avoid duplicates
      },
      { new: true }
    );
    res.json({ message: "User added to group", group });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error adding user to group", error: error.message });
  }
});

module.exports = router;
