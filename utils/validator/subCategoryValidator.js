const { check } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddlware");
const getSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id"),
  validatorMiddleware,
];
const createSubCatogaryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory required")
    .isLength({ min: 3 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("Too Long"),
  check("catogery")
    .isMongoId()
    .withMessage("Invvalid Category")
    .notEmpty()
    .withMessage("category is reuired")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
const updateSubCategoryValidator = [
  check("id")
    .isMongoId()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Invalid Brandid"),
  validatorMiddleware,
];
const deleteSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validatorMiddleware,
];
module.exports = {
  getSubcategoryValidator,
  createSubCatogaryValidator,
  updateSubCategoryValidator,
  deleteSubcategoryValidator,
};
