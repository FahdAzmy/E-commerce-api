const { check } = require("express-validator");
const reviewModel = require("../../models/reviewModel");
const validatorMiddleware = require("../../middleware/validatorMiddlware");
const getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id"),
  validatorMiddleware,
];
const createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Review Rating is Required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("RatingValue must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid user"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product")
    .custom((val, { req }) =>
      //check if logged user create Review before
      reviewModel
        .findOne({ user: req.user._id, product: req.body.product })
        .then((review) => {
          if (review) {
            return Promise.reject(new Error("You Already Created a Review"));
          }
        })
    ),
  validatorMiddleware,
];
const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Reviewid")
    .custom((val, { req }) => {
      // check Review ownership before update
      return reviewModel.findById(val).then((review) => {
        if (!review)
          return Promise.reject(new Error("there is no review with this id"));
        if (review.user._id.toString() !== req.user._id.toString())
          return Promise.reject(
            new Error("You are not allowed to perform this action")
          );
      });
    }),
  validatorMiddleware,
];
const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Reviewid")
    .custom((val, { req }) => {
      //check if user is user not admin
      if (req.user.role === "user") {
        // check Review ownership before update
        return reviewModel.findById(val).then((review) => {
          if (!review)
            return Promise.reject(new Error("there is no review with this id"));
          if (review.user._id.toString() !== req.user._id.toString())
            return Promise.reject(
              new Error("You are not allowed to perform this action")
            );
        });
      }
      return true;
    }),
  validatorMiddleware,
];
module.exports = {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
};
