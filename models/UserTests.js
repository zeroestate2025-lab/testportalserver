const mongoose = require("mongoose");

const userTestSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  status: {
    type: String,
    enum: ["waiting", "active", "completed"],
    default: "waiting",
  },
  startTime: Date,
  endTime: Date,
});

module.exports = mongoose.model("UserTest", userTestSchema);
