const mongoose = require("mongoose");

const testControlSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: false },       // ✅ Start/Stop toggle
  questionLimit: { type: Number, default: 10 },      // ✅ Number of questions allowed
  timeLimit: { type: Number, default: 30 },          // ✅ Time in minutes
  startTime: { type: Date, default: null },          // ✅ When test starts
  endTime: { type: Date, default: null }             // ✅ When test ends
});

module.exports = mongoose.model("TestControl", testControlSchema);
