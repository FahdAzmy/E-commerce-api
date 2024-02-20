const { check } = require("express-validator");
const slugify = require("slugify");
const userModel = require("../../models/userModel");

const validatorMiddleware = require("../../middleware/validatorMiddlware");
const signupValidator = [
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

  validatorMiddleware,
];
const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email Address"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 charcters"),
  validatorMiddleware,
];
module.exports = {
  signupValidator,
  loginValidator,
};
