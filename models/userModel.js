const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please provide a short description"],
      validate: [validator.isEmail, "Provide a valid Email"],
    },
    credit: {
      type: Number,
      default: 1,
    },
    paid: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["admin", "user", "blocked"],
      default: "user",
    },
    userPosition: {
      type: Number,
      required: [true, "please provide a user position"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
