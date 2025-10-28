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

// ✅ Get all users (any status)
router.get("/", async (req, res) => {
  try {
    const users = await UserTest.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users list:", error);
    res.status(500).json({ error: "Failed to fetch users list" });
  }
});

// ✅ Delete the last waiting user (most recent)
router.delete("/last", async (req, res) => {
  try {
    const lastUser = await UserTest.findOne({ status: "waiting" }).sort({ createdAt: -1 });

    if (!lastUser) {
      return res.status(404).json({ message: "No waiting users to delete." });
    }

    await UserTest.findByIdAndDelete(lastUser._id);
    res.json({ message: `Deleted last waiting user: ${lastUser.fullName}` });
  } catch (error) {
    console.error("❌ Error deleting last waiting user:", error);
    res.status(500).json({ error: "Failed to delete last waiting user." });
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const UserTest = require("../models/UserTests");

// // ✅ Get count of waiting users
// router.get("/count", async (req, res) => {
//   try {
//     const count = await UserTest.countDocuments({ status: "waiting" });
//     res.json({ count });
//   } catch (error) {
//     console.error("❌ Error fetching waiting users count:", error);
//     res.status(500).json({ error: "Failed to fetch waiting users count" });
//   }
// });

// // // ✅ Get full list of waiting users
// // router.get("/", async (req, res) => {
// //   try {
// //     const users = await UserTest.find({ status: "waiting" }).sort({ createdAt: -1 });
// //     res.json(users);
// //   } catch (error) {
// //     console.error("❌ Error fetching waiting users list:", error);
// //     res.status(500).json({ error: "Failed to fetch waiting users list" });
// //   }
// // });

// // ✅ Get all users (any status)
// router.get("/", async (req, res) => {
//   try {
//     const users = await UserTest.find().sort({ createdAt: -1 });
//     res.json(users);
//   } catch (error) {
//     console.error("❌ Error fetching users list:", error);
//     res.status(500).json({ error: "Failed to fetch users list" });
//   }
// });



// // ✅ Delete the last waiting user (most recent)
// router.delete("/last", async (req, res) => {
//   try {
//     const lastUser = await UserTest.findOne({ status: "waiting" }).sort({ createdAt: -1 });

//     if (!lastUser) {
//       return res.status(404).json({ message: "No waiting users to delete." });
//     }

//     await UserTest.findByIdAndDelete(lastUser._id);
//     res.json({ message: `Deleted last waiting user: ${lastUser.fullName}` });
//   } catch (error) {
//     console.error("❌ Error deleting last waiting user:", error);
//     res.status(500).json({ error: "Failed to delete last waiting user." });
//   }
// });


// module.exports = router;
