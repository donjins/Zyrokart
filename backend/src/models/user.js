const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Storing password as plain text (Not Recommended)
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.Users || mongoose.model("User", userSchema);
module.exports = User;
