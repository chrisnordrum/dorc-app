"use strict";
const { getData } = require("../models/db");

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
