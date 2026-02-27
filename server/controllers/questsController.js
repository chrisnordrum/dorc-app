"use strict";
const { getData } = require("../models/db");

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
