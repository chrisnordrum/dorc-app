"use strict";
const { getData } = require("../models/db");

/**
 * Controller: Get all badges
 * 
 * Handles GET requests to fetch all badges from the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - Array of badges on success, or an error message on failure
 */
const getBadges = async (req, res) => {
  try {
    const data = await getData();
    res.status(200).json(data.badges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get badges" });
  }
};

module.exports = {
  getBadges,
};
