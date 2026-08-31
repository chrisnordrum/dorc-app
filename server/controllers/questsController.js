"use strict";
const { getData, saveData } = require("../models/db");
const mongoose = require("mongoose");
const Quest = require("../models/Quest");

// Fields a client is allowed to change. Anything else in the request body
// is ignored, so that a payload cannot reassign a quest to another user.
const ALLOWED_UPDATE_FIELDS = ["title", "description", "xpReward", "active"];

/**
 * Controller: Get all quests
 *
 * Handles GET requests to fetch all quests from the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - Array of quests on success, or an error message on failure
 */
const getQuests = async (req, res) => {
  try {
    // Reasons for not caching this response:
    // The quests are dynamic and change based on the user's progress.
    res.set("Cache-Control", "no-store");
    const data = await getData();
    res.status(200).json(data.quests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get quests" });
  }
};

/**
 * Controller: Save a quest
 *
 * Handles POST requests to save a quest to the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - The saved quest on success, or an error message on failure
 */
const saveQuest = async (req, res) => {
  try {
    const quest = req.body;
    if (
      !quest.title ||
      !quest.description ||
      !quest.xpReward ||
      //completed is a boolean, if doesn't exist, it's undefined.
      quest.completed === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const data = await getData();
    //assign a new id to the quest
    quest.id = data.quests.length + 1;
    //add the quest to the quests array
    data.quests.push(quest);
    //save the data to the database
    await saveData(data);
    //return the quest
    res.status(201).json(quest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save quest" });
  }
};

/**
 * Controller: Update a quest
 *
 * Handles PATCH requests to update one of the authenticated user's quests.
 * Only the fields present in the request body are changed.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - The updated quest on success, or an error message on failure
 */
const updateQuest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // An unparseable id would otherwise surface as a CastError 500.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid quest id" });
    }

    const updates = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No updatable fields provided" });
    }

    res.set("Cache-Control", "no-store");

    // Matching on userId as well as _id means another user's quest reads as
    // "not found" rather than "forbidden", which would confirm it exists.
    // runValidators is required: Mongoose skips schema validation on updates.
    const quest = await Quest.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!quest) {
      return res.status(404).json({ error: "Quest not found" });
    }

    res.status(200).json(quest);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to update quest" });
  }
};

/**
 * Controller: Delete a quest
 *
 * Handles DELETE requests to retire one of the authenticated user's quests.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - A confirmation message on success, or an error message on failure
 */
const deleteQuest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid quest id" });
    }

    res.set("Cache-Control", "no-store");

    // Soft delete. QuestCompletion documents reference this quest, so removing
    // it outright would orphan the user's history and corrupt their streak.
    // Requiring active: true makes a repeated delete a 404 rather than a
    // silent success.
    const quest = await Quest.findOneAndUpdate(
      { _id: id, userId, active: true },
      { $set: { active: false } },
      { new: true },
    );

    if (!quest) {
      return res.status(404).json({ error: "Quest not found" });
    }

    res.status(200).json({ message: "Quest deleted", id: quest.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete quest" });
  }
};

module.exports = {
  getQuests,
  saveQuest,
  updateQuest,
  deleteQuest,
};
