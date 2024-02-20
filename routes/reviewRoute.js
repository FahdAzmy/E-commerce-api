const express = require("express");
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validator/reviewValidator");
const router = express.Router({ mergeParams: true });
const {
  getAllReview,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setproductIdtobody,
} = require("../services/reviewService");
const Authservices = require("../services/authService");

router
  .route("/")
  .get(createFilterObj, getAllReview)
  .post(
    Authservices.protect,
    Authservices.allowTo("user"),
    setproductIdtobody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    Authservices.protect,
    Authservices.allowTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    Authservices.protect,
    Authservices.allowTo("admin", "manager", "user"),
    deleteReviewValidator,
    deleteReview
  );
module.exports = router;
