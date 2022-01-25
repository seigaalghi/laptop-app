const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth-controller");
const { createProfile, getProfile } = require("../controllers/profile-controller");
const { isLogin } = require("../middlewares/auth");
const passport = require("../config/passport");
const { googleCallback, facebookCallback } = require("../controllers/auth-controller");

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/v1/auth/google" }),
  googleCallback
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/api/v1/auth/facebook" }),
  facebookCallback
);

router.post("/register", register);
router.post("/login", login);
router.post("/profile", isLogin, createProfile);
router.get("/profile", isLogin, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
