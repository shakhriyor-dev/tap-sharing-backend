const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Link", linkSchema);
