const { check } = require("express-validator");
const slugify = require("slugify");
const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

const validatorMiddleware = require("../../middleware/validatorMiddlware");
const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id"),
  validatorMiddleware,
];
const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Userrequired")
    .isLength({ min: 3 })
    .withMessage("Too short Username")
    .isLength({ max: 32 })
    .withMessage("Too Long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 charcters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirm is incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Passwor Confirmation required"),
  check("profileImg").optional(),
  check("role").optional(),
  check("phone").isMobilePhone("ar-EG").optional(),
  validatorMiddleware,
];
changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),
  check("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];
const updateUserValidator = [
  check("id")
    .isMongoId()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Invalid Userid"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),
  check("role").optional(),
  check("phone").isMobilePhone("ar-EG").optional(),
  check("profileImg").optional(),
  validatorMiddleware,
];
const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid Userid"),
  validatorMiddleware,
];

const updateLoggedUserValidator = [
  check("email")
    .isEmail()
    .optional()
    .withMessage("Invalid Email Address")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),
  check("role").optional(),
  check("phone").isMobilePhone("ar-EG").optional(),
  check("profileImg").optional(),
  validatorMiddleware,
];
module.exports = {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
};
