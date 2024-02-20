const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateLoggedUserValidator,
} = require("../utils/validator/userValidator");
const Authservices = require("../services/authService");

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImages,
  resizeImage,
  changePassword,
  getLoggedUserData,
  updateLoggedPassword,
  upadateLoggedUserData,
  deleteLoggedUser,
} = require("../services/userServices");
const router = express.Router();
router.get("/getMe", Authservices.protect, getLoggedUserData, getUser);
router.put("/changeMyPass", Authservices.protect, updateLoggedPassword);
router.delete("/deleteLoggedUser", Authservices.protect, deleteLoggedUser);

router.put("/changepassword/:id", changeUserPasswordValidator, changePassword);
router.put(
  "/updateMe",
  Authservices.protect,
  updateLoggedUserValidator,
  upadateLoggedUserData
);
router
  .route("/")
  .get(getAllUsers)
  .post(uploadUserImages, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImages, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
module.exports = router;
