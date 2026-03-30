const mongoose = require("mongoose");

const profileImageSchema = new mongoose.Schema(
  { imageUrl: { type: String, required: true } },
  { timestamps: true }
);

module.exports = mongoose.model("ProfileImage", profileImageSchema);
