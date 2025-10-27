const express = require("express");
const router = express.Router();
const TestResult = require("../models/testResult");
const verifyToken = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");

/**
 * ✅ POST /api/tests — Save user test result
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, answers } = req.body;

    if (!name || !email || !answers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate score for MCQs
    let correctAnswers = 0;
    answers.forEach((ans) => {
      if (ans.userAnswer === ans.correctAnswer) correctAnswers++;
    });

    const totalQuestions = answers.length;
    const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);

    const newResult = new TestResult({
      name,
      email,
      totalQuestions,
      correctAnswers,
      scorePercent,
      submittedAnswers: answers,
      status: "Validation Pending", // ✅ explicitly added
    });

    await newResult.save();
    res
      .status(201)
      .json({ message: "✅ Result saved successfully", scorePercent });
  } catch (error) {
    console.error("Error saving test result:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * ✅ GET /api/tests — Fetch all test results (Admin)
 */
router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const results = await TestResult.find().sort({ submittedAt: -1 });
    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * ✅ GET /api/tests/:id — Fetch a specific test result (Admin)
 */
router.get("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const test = await TestResult.findById(id);

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    res.json(test);
  } catch (err) {
    console.error("Error fetching test:", err);
    res.status(500).json({ error: "Server error fetching test result" });
  }
});

/**
 * ✅ PUT /api/tests/:id/validate — Admin validates test
 */
router.put("/:id/validate", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { marks, totalMarks, scorePercent } = req.body;

    const test = await TestResult.findById(id);
    if (!test) return res.status(404).json({ error: "Test not found" });

    // Update validation fields
    test.adminMarks = marks;
    test.correctAnswers = totalMarks;
    test.scorePercent = scorePercent;
    test.status = "Validated";

    await test.save();

    res.json({ message: "✅ Validation updated successfully", test });
  } catch (err) {
    console.error("Error validating test:", err);
    res.status(500).json({ error: "Server error during validation" });
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const TestResult = require("../models/testResult");
// const verifyToken = require("../middleware/auth");
// const { requireRole } = require("../middleware/roleCheck");


// // ✅ POST /api/tests — save user test result
// router.post("/", async (req, res) => {
//   try {
//     const { name, email, answers } = req.body;

//     if (!name || !email || !answers) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Calculate score
//     let correctAnswers = 0;
//     answers.forEach((ans) => {
//       if (ans.userAnswer === ans.correctAnswer) correctAnswers++;
//     });

//     const totalQuestions = answers.length;
//     const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);

//     const newResult = new TestResult({
//       name,
//       email,
//       totalQuestions,
//       correctAnswers,
//       scorePercent,
//       submittedAnswers: answers,
//     });

//     await newResult.save();
//     res.status(201).json({ message: "Result saved successfully", scorePercent });
//   } catch (error) {
//     console.error("Error saving test result:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // ✅ GET /api/tests — fetch all results (for admin)
// router.get("/", async (req, res) => {
//   try {
//     const results = await TestResult.find().sort({ submittedAt: -1 });
//     res.json(results);
//   } catch (error) {
//     console.error("Error fetching results:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // ✅ Validate test result by admin
// router.put("/:id/validate", verifyToken, requireRole("admin"), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { marks, totalMarks, scorePercent } = req.body;

//     const test = await Test.findById(id);
//     if (!test) return res.status(404).json({ error: "Test not found" });

//     test.adminMarks = marks;
//     test.correctAnswers = totalMarks;
//     test.scorePercent = scorePercent;
//     test.status = "Validated";

//     await test.save();
//     res.json({ message: "✅ Validation updated successfully", test });
//   } catch (err) {
//     console.error("Error validating test:", err);
//     res.status(500).json({ error: "Server error during validation" });
//   }
// });
// // ✅ Get all tests (Admin view)
// router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
//   try {
//     const tests = await Test.find().sort({ submittedAt: -1 });
//     res.json(tests);
//   } catch (err) {
//     console.error("Error fetching tests:", err);
//     res.status(500).json({ error: "Server error fetching test results" });
//   }
// });

// // ✅ GET specific test result by ID
// router.get("/:id", verifyToken, requireRole("admin"), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const test = await Test.findById(id);

//     if (!test) {
//       return res.status(404).json({ error: "Test not found" });
//     }

//     res.json(test);
//   } catch (err) {
//     console.error("Error fetching test:", err);
//     res.status(500).json({ error: "Server error fetching test result" });
//   }
// });


// module.exports = router;
