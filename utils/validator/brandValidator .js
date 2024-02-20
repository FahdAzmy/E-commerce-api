const { check } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddlware");
const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id"),
  validatorMiddleware,
];
const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brandrequired")
    .isLength({ min: 3 })
    .withMessage("Too short Brandname")
    .isLength({ max: 32 })
    .withMessage("Too Long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
const updateBrandValidator = [
  check("id")
    .isMongoId()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .withMessage("Invalid Brandid"),
  validatorMiddleware,
];
const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brandid"),
  validatorMiddleware,
];
module.exports = {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};
