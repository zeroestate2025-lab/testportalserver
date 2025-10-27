const express = require("express");
const router = express.Router();
const TestControl = require("../models/testControl");
const verifyToken = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");

// ✅ Get test control (public - users can check status)
router.get("/", async (req, res) => {
  try {
    let control = await TestControl.findOne();
    if (!control) {
      control = await TestControl.create({
        isActive: false,
        questionLimit: 10,
        timeLimit: 30,
      });
    }
    res.json(control);
  } catch (err) {
    console.error("Error fetching test control:", err);
    res.status(500).json({ error: "Server error while fetching test control" });
  }
});

// ✅ Update test control (Admin only)
router.put("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const { isActive, questionLimit, timeLimit } = req.body;

    let control = await TestControl.findOne();
    if (!control) control = new TestControl();

    if (isActive !== undefined) control.isActive = isActive;
    if (questionLimit !== undefined) control.questionLimit = questionLimit;
    if (timeLimit !== undefined) control.timeLimit = timeLimit;

    await control.save();

    res.json({ message: "✅ Test Control Updated", control });
  } catch (err) {
    console.error("Error updating test control:", err);
    res.status(500).json({ error: "Server error while updating test control" });
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const TestControl = require("../models/testControl");
// const verifyToken = require("../middleware/auth");
// const { requireRole } = require("../middleware/roleCheck");

// // ✅ Admin can update test control
// router.post("/update", verifyToken, requireRole("admin"), async (req, res) => {
//   try {
//     const { isActive, questionLimit, timeLimit } = req.body;

//     let control = await TestControl.findOne();
//     if (!control) control = new TestControl();

//     control.isActive = isActive;
//     control.questionLimit = questionLimit;
//     control.timeLimit = timeLimit;
//     await control.save();

//     res.json({ message: "✅ Test Control Updated", control });
//   } catch (err) {
//     console.error("Error updating test control:", err);
//     res.status(500).json({ error: "Server error while updating test control" });
//   }
// });

// // ✅ Fetch test control (public)
// router.get("/", async (req, res) => {
//   try {
//     const control = await TestControl.findOne();
//     res.json(control || {});
//   } catch (err) {
//     console.error("Error fetching test control:", err);
//     res.status(500).json({ error: "Server error while fetching test control" });
//   }
// });

// module.exports = router;
