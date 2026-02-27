"use strict";
const { getData } = require("../models/db");

/**
 * Controller: Get all daily quotes
 *
 * Handles GET requests to fetch all daily quotes from the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - Array of daily quotes on success, or an error message on failure
 */
const getDailyQuotes = async (req, res) => {
  try {
    const data = await getData();

    // Reasons for not caching this response:
    // Allows immediate updates if any inappropriate content needs to be changed or removed.
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(data.dailyQuotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get daily quotes" });
  }
};

module.exports = {
  getDailyQuotes,
};
