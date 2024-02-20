const userModel = require("../models/userModel");
const factory = require("./handlerFactory");
const { v4: uuid4 } = require("uuid");
const { uploadSingleImage } = require("../middleware/uplaodImage");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apierror");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
exports.uploadUserImages = uploadSingleImage("profileImg");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuid4()}-${Date.now()}-profile.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/user/${filename}`);
    req.body.profileImg = filename;
  }

  next();
});
// @desc Get All brand
// @route get /api/v1/brands
// @acces public
exports.getAllUsers = factory.getAll(userModel);
// @desc Get sapacif User
// @route Post /api/v1/Users
// @acces puplic
exports.getUser = factory.getOne(userModel);

// @desc Create User
// @route Post /api/v1/Users
// @acces private
exports.createUser = factory.createOne(userModel);

// @desc Update category
// @route Post /api/v1/Users
// @acces private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      slug: slugify(name),
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    { new: true }
  );
  if (!document) {
    return next(new apiError(`No document for this Id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
exports.changePassword = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordchangedAt: Date.now(),
    },
    { new: true }
  );
  if (!document) {
    return next(new apiError(`No document for this Id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc Delete category
// @route Post /api/v1/Users
// @acces private
exports.deleteUser = factory.deleteOne(userModel);

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
exports.updateLoggedPassword = asyncHandler(async (req, res, next) => {
  const isCurrentPassword = await bcrypt.compare(
    req.body.password,
    req.user.password
  );
  //1)update user Password based on user payload
  if (isCurrentPassword) {
    return next(new apiError("This's Old password"));
  }
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordchangedAt: Date.now(),
    },
    { new: true }
  );
  const token = createToken(user._id);
  res.status(200).json({ data: user, massage: "Password Changed", token });
});
exports.upadateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await userModel.findOneAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email, phone: req.body.phone },
    { new: true }
  );
  res.status(200).json({ Massage: "Data is Updated", data: updatedUser });
});
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, { active: false });
  res.status(200).json({ massage: "Tha user is Deleted" });
});
