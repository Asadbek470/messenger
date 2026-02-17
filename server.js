require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use("/api/auth", authRoutes);

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
