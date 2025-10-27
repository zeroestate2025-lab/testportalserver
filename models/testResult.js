const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, default: 0 },
    scorePercent: { type: Number, default: 0 },
    submittedAnswers: [
      {
        question: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
      },
    ],
    submittedAt: { type: Date, default: Date.now },
    adminMarks: { type: Object, default: {} },
    status: { type: String, default: "Validation Pending" },
  },
  { timestamps: true } // ✅ auto adds createdAt / updatedAt
);

module.exports = mongoose.model("TestResult", testResultSchema);

// const mongoose = require("mongoose");

// const testResultSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   totalQuestions: {
//     type: Number,
//     required: true,
//   },
//   correctAnswers: {
//     type: Number,
//     default: 0,
//   },
//   scorePercent: {
//     type: Number,
//     default: 0,
//   },
//   submittedAnswers: [
//     {
//       question: String,
//       userAnswer: String,
//       correctAnswer: String,
//       isCorrect: Boolean,
//     },
//   ],
//   submittedAt: {
//     type: Date,
//     default: Date.now,
//   },
//   adminMarks: { type: Object, default: {} },
//   status: { type: String, default: "Validation Pending" },

// });

// module.exports = mongoose.model("TestResult", testResultSchema);
