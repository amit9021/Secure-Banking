const mongoose = require("mongoose");

const OtpModel = new mongoose.Schema({
  phone: { type: String, required: true },
  otp: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("otp", OtpModel);
