const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true,
      required: true,
    },
    name: { type: String, required: true, minLength: 3, maxLength: 50 },
    email: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 200,
      unique: true,
    },
    password: { type: String, required: true, minLength: 3, maxLength: 1024 },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
