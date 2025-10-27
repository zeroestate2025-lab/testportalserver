const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: ["MCQ", "Theory"],
    required: true,
    default: "MCQ",
  },
  questionText: {
    type: String,
    required: [true, "Question text is required"],
  },
  options: {
    type: [String],
    default: [],
  },
  correctAnswer: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Question", questionSchema);

// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema({
//   questionText: { type: String, required: true },
//   options: [{ type: String, required: true }],
//   correctAnswer: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Question", questionSchema);
