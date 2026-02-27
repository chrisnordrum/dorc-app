"use strict";

const express = require("express");
const router = express.Router();

// Controller: Get all users
const { getUsers } = require("../controllers/usersController");

router.get("/", getUsers);

module.exports = router;
