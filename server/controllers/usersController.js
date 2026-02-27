"use strict";
const { getData } = require("../models/db");

/**
 * Controller: Get all users
 *
 * Handles GET requests to fetch all users from the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - Array of users on success, or an error message on failure
 */
const getUsers = async (req, res) => {
  try {
    const data = await getData();
    res.status(200).json(data.users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get users" });
  }
};

module.exports = {
  getUsers,
};
