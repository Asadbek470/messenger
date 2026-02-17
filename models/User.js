const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true },
  firstName: String,
  lastName: String,
  password: String, // 2FA пароль
  verificationCode: String,
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
