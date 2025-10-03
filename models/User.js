const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  title: String,
  url: String,
  order: Number,
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // храним хэш
  name: String,
  bio: String,
  avatar: String,
  links: [linkSchema],
});

module.exports = mongoose.model("User", userSchema);
