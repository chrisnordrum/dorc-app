"use strict";
const { getData } = require("../models/db");

/**
 * Controller: Get all ranks
 *
 * Handles GET requests to fetch all ranks from the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - Array of ranks on success, or an error message on failure
 */
const getRanks = async (req, res) => {
  try {
    // Reasons for not caching this response:
    // The ranks are dynamic and change based on the user's progress.
    res.set("Cache-Control", "no-store");
    const data = await getData();
    res.status(200).json(data.ranks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get ranks" });
  }
};

module.exports = {
  getRanks,
};
