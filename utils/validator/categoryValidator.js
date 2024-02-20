const { check } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddlware");
const getcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validatorMiddleware,
];
const createCatogaryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too Long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Brandid"),
  validatorMiddleware,
];
const deletecategoryValidator = [
  check("id")
    .isMongoId()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Invalid category id"),
  validatorMiddleware,
];
module.exports = {
  getcategoryValidator,
  createCatogaryValidator,
  updateCategoryValidator,
  deletecategoryValidator,
};
