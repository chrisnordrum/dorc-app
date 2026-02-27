"use strict";

const express = require("express");
const router = express.Router();

// Controller: Get all quests
const { getQuests } = require("../controllers/questsController");

router.get("/", getQuests);

module.exports = router;
