"use strict";
const { getData } = require("../models/db");

/**
 * Controller: Get all badges
 * 
 * Handles GET requests to fetch all badges from the database.
 *
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
