const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/chatController");

router.get("/", getMessages);

module.exports = router;
