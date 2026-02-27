"use strict";

const express = require("express");
const router = express.Router();

const { getQuests } = require("../controllers/quests");
const { getUser } = require("../controllers/user");
const { getRank } = require("../controllers/rank");
const { getBadges } = require("../controllers/badges");
const { getDailyQuote } = require("../controllers/dailyQuest");

router.get("/", getQuests);
// router.get("../controllers/user", getUser);
// router.get("../controllers/rank", getRank);
// router.get("../controllers/badges", getBadges);
// router.get("../controllers/dailyQuote", getDailyQuote);

module.exports = router;
