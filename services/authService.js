const crypto = require("crypto");
const apiError = require("../utils/apierror");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmial");
const { protectMiddlware } = require("../middleware/protectIMiddlware");
const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
// @desc Get SignUp
// @route get /api/v1/auth/signup
// @acces public
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const token = createToken(user._id);
  res.status(201).json({ date: user, token });
});
// @desc Get login
// @route get /api/v1/auth/login
// @acces public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new apiError("Incorrect emial or Password", 401));
  }
  const token = createToken(user._id);

  res.status(200).json({ date: user, token });
});
// make sure usr is logged in
exports.protect = protectMiddlware;
// @desc ausorazition

// ['admin',''manager]
exports.allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1)acces roles
    //2) acces registerd user(req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(new apiError("You are Not Allowed to access this Route"));
    }
    next();
  });
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1)get User By Email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new apiError("This Email doesn't exist", 404));
  // 2) if user exist, Generate hash reset reandom 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // Save Hashed password reset code into db
  user.passwordResetCode = hashResetCode;
  // Add expiration time for paasswrod reset code (10 min)
  user.passwordResetExpired = Date.now() + 10 * 60 * 1000;
  user.passwordVerfied = false;
  await user.save();
  // send reset code via emial
  const message = `Hi ${user.name},\n Your reset Password code from E-Shop account \n ${resetCode}\n Enter the Code`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset Code",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpired = undefined;
    user.passwordVerfied = undefined;
    await user.save();
    return next(new apiError("there is an error ", 500));
  }
  res
    .status(200)
    .json({ status: "Success", message: "reset Code sent to the Emial" });
});
exports.verifyPasswordResetcode = asyncHandler(async (req, res, next) => {
  //1)get user based on reset code
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await userModel.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpired: { $gt: Date.now() },
  });
  if (!user) {
    return next(new apiError("Reset Code invalid or expired", 401));
  }
  //2 save user
  user.passwordVerfied = true;
  await user.save();
  res.status(200).json({ status: " success" });
});
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1 Get User based on Email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new apiError("This Email doesn't exist", 404));
  // 2 Chdeck if userResetCode is Verfied
  if (!user.passwordVerfied) {
    return next(new apiError("Reset Code not Vareifed", 400));
  }
  //3 Save New passworrd
  user.password = req.body.newPassword;
  //4 make Varibiles ofChange Passrwrod is undefined
  user.passwordResetExpired = undefined;
  user.passwordVerfied = undefined;
  user.passwordResetCode = undefined;
  //4 Save the user in Db
  await user.save();
  // Gernerate Token
  const token = createToken(user._id);
  res.status(200).json({ Massager: "Passwrod Changed", token });
});
