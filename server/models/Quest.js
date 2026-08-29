"use strict";

const mongoose = require("mongoose");

/**
 * Model: Quest
 *
 * The *definition* of a quest, owned by a single user. This document holds no
 * per-day state: whether a quest was finished on a given day lives in the
 * QuestCompletion collection, so that a quest can recur daily and its history
 * can be replayed to compute streaks.
 */
const questSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    xpReward: {
      type: Number,
      required: true,
      min: 1,
      max: 1000,
    },
    // Soft delete: retiring a quest must not orphan its past completions.
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// The client reads `quest.id`, so keep emitting `id` rather than `_id`.
// This block customizes how Quest documents are converted to JSON (such as when sending to the frontend).
// - `virtuals: true`: include Mongoose virtual properties in the output.
// - `versionKey: false`: remove the `__v` version field from the output.
// - `transform`: customize the JSON output so that `id` is set to the document's `_id` (the MongoDB ObjectId), and then remove the original `_id` field.
//   This makes the JSON response more user-friendly and conventional, e.g. `{ "id": "abcd123", ... }` instead of `{ "_id": "abcd123", ... }`.
questSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Quest = mongoose.model("Quest", questSchema);

module.exports = Quest;
