const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  user_type: {
    type: String,
    enum: ["CUSTOMER", "PROVIDER"],
    required: true,
  },
  business_phone: {
    type: String,
    required: true,
  },
  whatsapp_phone: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
  password: { type: String, required: true },
  referalSource: {
    type: String,
    enum: ["FRIEND", "NEWS", "SOCIAL", "AGENT", "OTHER"],
  },
  agent: {
    type: String,
  },
  agent_code: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
  },
  otpExpires: {
    type: Date,
  },
  resetPassword:{
    type:String,
  },
  deviceToken:{
    type: [String]
  }
});

module.exports = mongoose.model("User", userSchema);
