const express = require("express");
const router = express.Router();

// Routes: Users, Quests, Ranks, Badges, Daily Quotes
const usersRoutes = require("./usersRoutes");
const questsRoutes = require("./questsRoutes");
const ranksRoutes = require("./ranksRoutes");
const badgesRoutes = require("./badgesRoutes");
const dailyQuotesRoutes = require("./dailyQuotesRoutes");

router.use("/users", usersRoutes);
router.use("/quests", questsRoutes);
router.use("/ranks", ranksRoutes);
router.use("/badges", badgesRoutes);
router.use("/dailyQuotes", dailyQuotesRoutes);

module.exports = router;
