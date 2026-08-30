"use strict";

const mongoose = require("mongoose");
const { timeZoneValidator } = require("../utils/timezone");

/**
 * Model: QuestCompletion
 *
 * One document per quest completed per day. This is the append-only history
 * that `streak` and `lastCompletedQuest` are derived from.
 */
const questCompletionSchema = new mongoose.Schema(
  {
    questId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quest",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The calendar day in the user's local timezone, as "YYYY-MM-DD".
    // Stored as a string rather than a Date so that a quest completed at 11pm
    // counts toward today, not tomorrow in UTC.
    // The regular expression /^\d{4}-\d{2}-\d{2}$/ enforces that completedOn is a string formatted as "YYYY-MM-DD".
    // For example, "2023-03-15" is valid; "03/15/2023" or "2023/03/15" is not.
    completedOn: {
      type: String,
      required: true,
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        "completedOn must be formatted YYYY-MM-DD",
      ],
    },
    // Snapshot of the quest's xpReward at completion time, so that later
    // edits to the quest do not rewrite the user's earned XP.
    xpAwarded: {
      type: Number,
      required: true,
      min: 0,
    },
    // The IANA zone used to derive completedOn from createdAt, e.g.
    // "Asia/Taipei". Snapshotted per completion so that a user relocating
    // cannot retroactively shift the day their past completions counted
    // toward. Never read User.timezone when interpreting an old completion.
    timezone: {
      type: String,
      required: true,
      default: "UTC",
      validate: timeZoneValidator,
    },
  },
  { timestamps: true },
);

// A quest can only be completed once per day. Enforced here rather than in the
// controller so a double-submit cannot double-award XP.
questCompletionSchema.index({ questId: 1, completedOn: 1 }, { unique: true });

// Supports "this user's history, most recent first" for streak calculation.
questCompletionSchema.index({ userId: 1, completedOn: -1 });

questCompletionSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const QuestCompletion = mongoose.model(
  "QuestCompletion",
  questCompletionSchema,
);

module.exports = QuestCompletion;
