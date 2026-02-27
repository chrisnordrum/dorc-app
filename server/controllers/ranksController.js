"use strict";
const { getData } = require("../models/db");

const getRanks = async (req, res) => {
  try {
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
