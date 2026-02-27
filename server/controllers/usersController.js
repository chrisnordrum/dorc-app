"use strict";
const { getData } = require("../models/db");

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
