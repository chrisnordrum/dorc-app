"use strict";
const { getData } = require("../models/db");

/**
 * Controller: Get daily quotes
 * 
 * Handles GET requests to fetch daily quotes from the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - Array of daily quotes on success, or an error message on failure
 */
const getDailyQuotes = async (req, res) => {
  try {
    const data = await getData();
    res.status(200).json(data.dailyQuotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get daily quotes" });
  }
};

module.exports = {
  getDailyQuotes,
};
