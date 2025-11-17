const express = require("express");
const router = express.Router();
const UserTest = require("../models/UserTests");

/**
 * ✅ GET /api/waiting-users/count
 * Get total count of waiting users
 */
router.get("/count", async (req, res) => {
  try {
    const count = await UserTest.countDocuments({ status: "waiting" });
    res.json({ count });
  } catch (error) {
    console.error("❌ Error fetching waiting users count:", error);
    res.status(500).json({ error: "Failed to fetch waiting users count" });
  }
});

/**
 * ✅ GET /api/waiting-users
 * Get list of all users (any status)
 */
router.get("/", async (req, res) => {
  try {
    const users = await UserTest.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users list:", error);
    res.status(500).json({ error: "Failed to fetch users list" });
  }
});

/**
 * ✅ PUT /api/waiting-users/activate-all
 * Change all waiting users to "writing-test" when test starts
 */
router.put("/activate-all", async (req, res) => {
  try {
    const result = await UserTest.updateMany(
      { status: "waiting" },
      { $set: { status: "writing-test" } }
    );
    res.json({
      message: `✅ Activated ${result.modifiedCount} waiting users to "writing-test"`,
    });
  } catch (error) {
    console.error("❌ Error activating waiting users:", error);
    res.status(500).json({ error: "Failed to activate waiting users." });
  }
});

/**
 * ✅ PUT /api/waiting-users/finish/:email
 * Mark specific user as "finished" when they submit test
 */
router.put("/finish/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const updated = await UserTest.findOneAndUpdate(
      { email },
      { $set: { status: "finished" } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({ message: `✅ ${updated.fullName} marked as finished`, updated });
  } catch (error) {
    console.error("❌ Error marking user finished:", error);
    res.status(500).json({ error: "Failed to update user status." });
  }
});

// ⚠️ IMPORTANT: SPECIFIC ROUTES MUST COME BEFORE DYNAMIC ROUTES

/**
 * ✅ DELETE /api/waiting-users/all
 * Delete ALL waiting users (Clear all)
 * ⚠️ MUST be defined BEFORE /:id route
 */
router.delete("/delete-all-users", async (req, res) => {
  console.log("🔥 DELETE /delete-all-users route hit!");
  try {
    const result = await UserTest.deleteMany({});
    res.json({ 
      message: `🗑️ Successfully deleted ${result.deletedCount} user(s)`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error("❌ Error deleting all users:", error);
    res.status(500).json({ error: "Failed to delete all users." });
  }
});

/**
 * ✅ DELETE /api/waiting-users/last
 * Delete the most recent waiting user entry
 * ⚠️ MUST be defined BEFORE /:id route
 */
router.delete("/last", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {}; // If status provided, filter by it

    const lastUser = await UserTest.findOne(filter).sort({ createdAt: -1 });

    if (!lastUser) {
      return res.status(404).json({ message: "No matching users to delete." });
    }

    await UserTest.findByIdAndDelete(lastUser._id);
    res.json({ message: `🗑️ Deleted last ${status || "user"}: ${lastUser.fullName}` });
  } catch (error) {
    console.error("❌ Error deleting last user:", error);
    res.status(500).json({ error: "Failed to delete last user." });
  }
});

/**
 * ✅ DELETE /api/waiting-users/:id
 * Delete individual user by ID
 * ⚠️ MUST be defined AFTER specific routes like /all and /last
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await UserTest.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: `🗑️ Successfully deleted user: ${deletedUser.fullName}`,
      deletedUser 
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const UserTest = require("../models/UserTests");

// /**
//  * ✅ GET /api/waiting-users/count
//  * Get total count of waiting users
//  */
// router.get("/count", async (req, res) => {
//   try {
//     const count = await UserTest.countDocuments({ status: "waiting" });
//     res.json({ count });
//   } catch (error) {
//     console.error("❌ Error fetching waiting users count:", error);
//     res.status(500).json({ error: "Failed to fetch waiting users count" });
//   }
// });

// /**
//  * ✅ GET /api/waiting-users
//  * Get list of all users (any status)
//  */
// router.get("/", async (req, res) => {
//   try {
//     const users = await UserTest.find().sort({ createdAt: -1 });
//     res.json(users);
//   } catch (error) {
//     console.error("❌ Error fetching users list:", error);
//     res.status(500).json({ error: "Failed to fetch users list" });
//   }
// });

// /**
//  * ✅ PUT /api/waiting-users/activate-all
//  * Change all waiting users to "writing-test" when test starts
//  */
// router.put("/activate-all", async (req, res) => {
//   try {
//     const result = await UserTest.updateMany(
//       { status: "waiting" },
//       { $set: { status: "writing-test" } }
//     );
//     res.json({
//       message: `✅ Activated ${result.modifiedCount} waiting users to "writing-test"`,
//     });
//   } catch (error) {
//     console.error("❌ Error activating waiting users:", error);
//     res.status(500).json({ error: "Failed to activate waiting users." });
//   }
// });

// /**
//  * ✅ PUT /api/waiting-users/finish/:email
//  * Mark specific user as "finished" when they submit test
//  */
// router.put("/finish/:email", async (req, res) => {
//   try {
//     const { email } = req.params;
//     const updated = await UserTest.findOneAndUpdate(
//       { email },
//       { $set: { status: "finished" } },
//       { new: true }
//     );

//     if (!updated) return res.status(404).json({ message: "User not found" });

//     res.json({ message: `✅ ${updated.fullName} marked as finished`, updated });
//   } catch (error) {
//     console.error("❌ Error marking user finished:", error);
//     res.status(500).json({ error: "Failed to update user status." });
//   }
// });

// /**
//  * ✅ DELETE /api/waiting-users/last
//  * Delete the most recent waiting user entry
//  */
// router.delete("/last", async (req, res) => {
//   try {
//     const { status } = req.query;
//     const filter = status ? { status } : {}; // If status provided, filter by it

//     const lastUser = await UserTest.findOne(filter).sort({ createdAt: -1 });

//     if (!lastUser) {
//       return res.status(404).json({ message: "No matching users to delete." });
//     }

//     await UserTest.findByIdAndDelete(lastUser._id);
//     res.json({ message: `🗑️ Deleted last ${status || "user"}: ${lastUser.fullName}` });
//   } catch (error) {
//     console.error("❌ Error deleting last user:", error);
//     res.status(500).json({ error: "Failed to delete last user." });
//   }
// });

// module.exports = router;

// // const express = require("express");
// // const router = express.Router();
// // const UserTest = require("../models/UserTests");

// // // ✅ Get count of waiting users
// // router.get("/count", async (req, res) => {
// //   try {
// //     const count = await UserTest.countDocuments({ status: "waiting" });
// //     res.json({ count });
// //   } catch (error) {
// //     console.error("❌ Error fetching waiting users count:", error);
// //     res.status(500).json({ error: "Failed to fetch waiting users count" });
// //   }
// // });

// // // ✅ Get all users (any status)
// // router.get("/", async (req, res) => {
// //   try {
// //     const users = await UserTest.find().sort({ createdAt: -1 });
// //     res.json(users);
// //   } catch (error) {
// //     console.error("❌ Error fetching users list:", error);
// //     res.status(500).json({ error: "Failed to fetch users list" });
// //   }
// // });

// // // ✅ Delete the last waiting user (most recent)
// // // ✅ Delete the last waiting user (most recent)
// // router.delete("/last", async (req, res) => {
// //   try {
// //     const lastUser = await UserTest.findOne({ status: "waiting" }).sort({ createdAt: -1 });

// //     if (!lastUser) {
// //       return res.status(404).json({ message: "No waiting users to delete." });
// //     }

// //     await UserTest.findByIdAndDelete(lastUser._id);
// //     res.json({ message: `🗑️ Deleted last waiting user: ${lastUser.fullName}` });
// //   } catch (error) {
// //     console.error("❌ Error deleting last waiting user:", error);
// //     res.status(500).json({ error: "Failed to delete last waiting user." });
// //   }
// // });

// // module.exports = router;

// // // const express = require("express");
// // // const router = express.Router();
// // // const UserTest = require("../models/UserTests");

// // // // ✅ Get count of waiting users
// // // router.get("/count", async (req, res) => {
// // //   try {
// // //     const count = await UserTest.countDocuments({ status: "waiting" });
// // //     res.json({ count });
// // //   } catch (error) {
// // //     console.error("❌ Error fetching waiting users count:", error);
// // //     res.status(500).json({ error: "Failed to fetch waiting users count" });
// // //   }
// // // });

// // // // // ✅ Get full list of waiting users
// // // // router.get("/", async (req, res) => {
// // // //   try {
// // // //     const users = await UserTest.find({ status: "waiting" }).sort({ createdAt: -1 });
// // // //     res.json(users);
// // // //   } catch (error) {
// // // //     console.error("❌ Error fetching waiting users list:", error);
// // // //     res.status(500).json({ error: "Failed to fetch waiting users list" });
// // // //   }
// // // // });

// // // // ✅ Get all users (any status)
// // // router.get("/", async (req, res) => {
// // //   try {
// // //     const users = await UserTest.find().sort({ createdAt: -1 });
// // //     res.json(users);
// // //   } catch (error) {
// // //     console.error("❌ Error fetching users list:", error);
// // //     res.status(500).json({ error: "Failed to fetch users list" });
// // //   }
// // // });



// // // // ✅ Delete the last waiting user (most recent)
// // // router.delete("/last", async (req, res) => {
// // //   try {
// // //     const lastUser = await UserTest.findOne({ status: "waiting" }).sort({ createdAt: -1 });

// // //     if (!lastUser) {
// // //       return res.status(404).json({ message: "No waiting users to delete." });
// // //     }

// // //     await UserTest.findByIdAndDelete(lastUser._id);
// // //     res.json({ message: `Deleted last waiting user: ${lastUser.fullName}` });
// // //   } catch (error) {
// // //     console.error("❌ Error deleting last waiting user:", error);
// // //     res.status(500).json({ error: "Failed to delete last waiting user." });
// // //   }
// // // });


// // // module.exports = router;
