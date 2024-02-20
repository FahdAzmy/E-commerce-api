const express = require("express");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validator/authValidtor");
const {
  signup,
  login,
  forgotPassword,
  verifyPasswordResetcode,
  resetPassword,
} = require("../services/authService");
const router = express.Router();
router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyResetCode").post(verifyPasswordResetcode);
router.route("/resetPassword").put(resetPassword);

module.exports = router;
