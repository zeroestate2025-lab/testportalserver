// ============================================================
// 📘 QUESTIONS ROUTES
// Supports CRUD + TXT Upload (Theory Questions)
// ============================================================

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Question = require("../models/question");
const verifyToken = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");
const TestControl = require("../models/testControl");

const router = express.Router();

// 🟢 Multer setup for uploads
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  verifyToken,
  requireRole("admin"),
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("🟢 Upload API hit");

      if (!req.file) {
        console.log("❌ No file received");
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log("📂 Uploaded file:", req.file);

      const filePath = req.file.path;
      const fileContent = fs.readFileSync(filePath, "utf8");
      console.log("📜 File content read successfully");

      const lines = fileContent.split(/\n/).map((line) => line.trim()).filter(Boolean);
      const questions = [];

      for (let line of lines) {
        const cleanQuestion = line.replace(/^\d+[\)\.\-]?\s*/, "").trim();
        if (cleanQuestion.length > 0) {
          questions.push({
            questionType: "Theory",
            questionText: cleanQuestion,
            correctAnswer: "",
          });
        }
      }

      console.log("✅ Parsed Questions Count:", questions.length);

      fs.unlinkSync(filePath);

      if (questions.length === 0) {
        return res.status(400).json({ error: "No valid questions found in file." });
      }

      await Question.insertMany(questions);

      res.json({
        message: `✅ ${questions.length} theory questions uploaded successfully!`,
        count: questions.length,
      });
    } catch (err) {
      console.error("❌ Error uploading TXT file:", err);
      res.status(500).json({ error: err.message || "Server error while uploading TXT file." });
    }
  }
);


/**
 * ✅ CREATE QUESTION (Admin)
 */
router.post("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const { questionType, questionText, options, correctAnswer } = req.body;

    if (!questionText) {
      return res.status(400).json({ error: "Question text is required" });
    }

    const newQuestion = new Question({
      questionType: questionType || "MCQ",
      questionText,
      options: questionType === "MCQ" ? options : [],
      correctAnswer: correctAnswer || "",
    });

    await newQuestion.save();
    res.status(201).json({
      message: "✅ Question added successfully",
      question: newQuestion,
    });
  } catch (err) {
    console.error("❌ Error adding question:", err);
    res.status(500).json({ error: "Server error while adding question" });
  }
});

/**
 * ✅ CONTROLLED QUESTION FETCH (Admin defines start + limit)
 */
// ✅ Get questions only if test is active (controlled by admin)
router.get("/", async (req, res) => {
  try {
    const testControl = await TestControl.findOne();

    if (!testControl || !testControl.isActive) {
      return res.status(200).json({
        error: "Test not active. Please wait for admin to start the test.",
      });
    }

    const questionLimit = testControl.questionLimit || 10;
    const timeLimit = testControl.timeLimit || 30;

    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .limit(questionLimit);

    res.json({
      isActive: testControl.isActive,
      questionLimit,
      timeLimit,
      questions,
    });
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    res.status(500).json({ error: "Server error fetching questions" });
  }
});


/**
 * ✅ UPDATE QUESTION (Admin)
 */
router.put("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { questionType, questionText, options, correctAnswer } = req.body;

    const updatedFields = {
      questionType: questionType || "MCQ",
      questionText,
      options: questionType === "MCQ" ? options : [],
      correctAnswer: questionType === "MCQ" ? correctAnswer : "",
    };

    const updatedQuestion = await Question.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({
      message: "✅ Question updated successfully",
      question: updatedQuestion,
    });
  } catch (err) {
    console.error("❌ Error updating question:", err);
    res.status(500).json({ error: "Server error while updating question" });
  }
});

/**
 * ✅ DELETE QUESTION (Admin)
 */
router.delete("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({ message: "🗑️ Question deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting question:", err);
    res.status(500).json({ error: "Server error while deleting question" });
  }
});

module.exports = router;
