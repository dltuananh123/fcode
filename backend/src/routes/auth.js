const express = require("express");
const router = express.Router();
const { register, login, updateProfile } = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.put("/profile", verifyToken, updateProfile);

module.exports = router;
