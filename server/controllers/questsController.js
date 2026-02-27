"use strict";
const { getData } = require("../models/db");

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
    const data = await getData();
    res.status(200).json(data.quests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get quests" });
  }
};

module.exports = {
  getQuests,
};
