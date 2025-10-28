const mongoose = require("mongoose");

const UserTestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["waiting", "writing-test", "finished"],
      default: "waiting",
    },
  },
  {
    timestamps: true, // ✅ adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("UserTest", UserTestSchema);

// const mongoose = require("mongoose");


// const userTestSchema = new mongoose.Schema({
//   fullName: String,
//   email: String,
//   status: {
//     type: String,
//     enum: ["waiting", "active", "completed"],
//     default: "waiting",
//   },
//   startTime: Date,
//   endTime: Date,
// });

// module.exports = mongoose.model("UserTest", userTestSchema);
