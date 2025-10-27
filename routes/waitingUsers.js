const express = require("express");
const router = express.Router();
const UserTest = require("../models/UserTests");

// ✅ Get count of waiting users
router.get("/count", async (req, res) => {
  try {
    const count = await UserTest.countDocuments({ status: "waiting" });
    res.json({ count });
  } catch (error) {
    console.error("❌ Error fetching waiting users count:", error);
    res.status(500).json({ error: "Failed to fetch waiting users count" });
  }
});

// ✅ Get full list of waiting users
router.get("/", async (req, res) => {
  try {
    const users = await UserTest.find({ status: "waiting" }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching waiting users list:", error);
    res.status(500).json({ error: "Failed to fetch waiting users list" });
  }
});

module.exports = router;
