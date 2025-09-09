const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  wallet: { type: Number, default: 0 }
});

// Prevent model overwrite in dev/serverless
module.exports = mongoose.models.User || mongoose.model("User", userSchema);

