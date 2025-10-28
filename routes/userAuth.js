const express = require("express");
const router = express.Router();
const UserTest = require("../models/UserTests");

// ✅ Register candidate (store in MongoDB as waiting)
router.post("/register", async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: "Full name and email are required" });
    }

    // Avoid duplicate waiting entries
    let existing = await UserTest.findOne({ email, status: "waiting" });
    if (existing) {
      return res.json({ message: "Already waiting", userId: existing._id });
    }

    const newUser = new UserTest({
      fullName,
      email,
      status: "waiting",
    });

    await newUser.save();
    res.status(200).json({
      message: "User registered successfully. Waiting for admin to start the test.",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Check user test status
router.get("/status/:id", async (req, res) => {
  try {
    const user = await UserTest.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ status: user.status });
  } catch (error) {
    console.error("❌ Error checking user status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Activate all waiting users (when admin starts test)
router.put("/activate-all", async (req, res) => {
  try {
    const result = await UserTest.updateMany(
      { status: "waiting" },
      { $set: { status: "active", startTime: new Date() } }
    );
    res.json({
      message: `✅ Activated ${result.modifiedCount} waiting users.`,
    });
  } catch (error) {
    console.error("❌ Error activating users:", error);
    res.status(500).json({ error: "Failed to activate users." });
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const UserTest = require("../models/UserTests");

// // ✅ Register candidate (store in MongoDB as waiting)
// router.post("/register", async (req, res) => {
//   try {
//     const { fullName, email } = req.body;

//     if (!fullName || !email) {
//       return res.status(400).json({ error: "Full name and email are required" });
//     }

//     // Avoid duplicate waiting entries
//     let existing = await UserTest.findOne({ email, status: "waiting" });
//     if (existing) {
//       return res.json({ message: "Already waiting", userId: existing._id });
//     }

//     const newUser = new UserTest({
//       fullName,
//       email,
//       status: "waiting",
//     });

//     await newUser.save();
//     res.status(200).json({
//       message: "User registered successfully. Waiting for admin to start the test.",
//       userId: newUser._id,
//     });
//   } catch (error) {
//     console.error("❌ Error registering user:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // ✅ Check user test status
// router.get("/status/:id", async (req, res) => {
//   try {
//     const user = await UserTest.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json({ status: user.status });
//   } catch (error) {
//     console.error("❌ Error checking user status:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // ✅ Update all waiting users to active when admin starts the test
// router.put("/activate-all", async (req, res) => {
//   try {
//     const result = await UserTest.updateMany(
//       { status: "waiting" },
//       { $set: { status: "active", startTime: new Date() } }
//     );
//     res.json({
//       message: `✅ Activated ${result.modifiedCount} waiting users.`,
//     });
//   } catch (error) {
//     console.error("❌ Error activating users:", error);
//     res.status(500).json({ error: "Failed to activate users." });
//   }
// });


// module.exports = router;
