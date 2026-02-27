"use strict";

const express = require("express");
const router = express.Router();

const { getUser } = require("../controllers/user");

router.get("/", getUser);

module.exports = router;
