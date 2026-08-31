"use strict";

const express = require("express");
const router = express.Router();

// Controller: Get all quests, save a quest, update a quest, delete a quest
const {
  getQuests,
  saveQuest,
  updateQuest,
  deleteQuest,
} = require("../controllers/questsController");

const authMiddleware = require("../middleware/auth");

router.get("/", getQuests);
router.post("/", saveQuest);
router.patch("/:id", authMiddleware, updateQuest);
router.delete("/:id", authMiddleware, deleteQuest);

module.exports = router;
