const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthDate: Date,
  about: String,
  email: { type: String, unique: true },
  password: String,
  userId: { type: String, unique: true },
  twoFactorSecret: String
});

module.exports = mongoose.model("User", userSchema);
