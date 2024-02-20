const reviewModel = require("../models/reviewModel");
const factory = require("./handlerFactory");

// nested route
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};
// @desc Get All review
// @route get /api/v1/Review
// @acces public
exports.getAllReview = factory.getAll(reviewModel);
// @desc Get sapacif review
// @route Post /api/v1/Review
// @acces puplic
exports.getReview = factory.getOne(reviewModel);

// @desc Create Review
// @route Post /api/v1/Review
// @acces private
exports.setproductIdtobody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
exports.createReview = factory.createOne(reviewModel);

// @desc Update Review
// @route Post /api/v1/Review
// @acces private
exports.updateReview = factory.updateONe(reviewModel);

// @desc Delete Review
// @route Post /api/v1/Review
// @acces private
exports.deleteReview = factory.deleteOne(reviewModel);
