const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require("../controllers/auth-controller");
const { createProfile, getProfile } = require("../controllers/profile-controller");
const { isLogin } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/profile", isLogin, createProfile);
router.get("/profile", isLogin, getProfile);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

module.exports = router;
