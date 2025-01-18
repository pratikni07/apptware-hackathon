// Import the required modules
const express = require("express");
const router = express.Router();
const { login, signup, sendotp } = require("../controller/auth.controller");

const { auth } = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendotp);

module.exports = router;
