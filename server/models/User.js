"use strict";

const mongoose = require("mongoose");
const { timeZoneValidator } = require("../utils/timezone");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  googleId: { type: String, default: null },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  bio: { type: String, default: null },
  email_iv: { type: String, required: true },
  bio_iv: { type: String, default: null },
  // The user's *current* IANA time zone, used to derive the calendar day for
  // new quest completions. Past completions keep their own snapshot, so
  // changing this must never be used to reinterpret existing history.
  timezone: {
    type: String,
    default: "UTC",
    validate: timeZoneValidator,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
