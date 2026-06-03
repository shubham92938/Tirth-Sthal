const express = require("express");
const router  = express.Router();
const {
  register, login, googleLogin,
  getProfile, updateProfile,
  logout, forgotPassword, resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register",              register);
router.post("/login",                 login);
router.post("/google",                googleLogin);
router.get( "/profile",    protect,   getProfile);
router.put( "/profile",    protect,   updateProfile);
router.post("/logout",     protect,   logout);
router.post("/forgot-password",       forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;