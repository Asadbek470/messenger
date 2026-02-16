const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, birthDate, about, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    birthDate,
    about,
    email,
    password: hashedPassword,
    userId: uuidv4()
  });

  await user.save();
  res.json({ message: "User created" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "SECRET_KEY");

  res.json({ token, userId: user.userId });
});

module.exports = router;
