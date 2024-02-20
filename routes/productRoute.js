const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  creatsProduct,
  uppladProductIMages,
  resizeProductImages,
} = require("../services/productService");
const {
  getProductValidator,
  createProductValidator,
  deleteProductValidator,
  updateProductValidator,
} = require("../utils/validator/productValidator");
const Authservices = require("../services/authService");
// nested route
const reviewRoute = require("../routes/reviewRoute");
router.use("/:productId/review", reviewRoute);
router
  .route("/")
  .get(getAllProducts)
  .post(
    Authservices.protect,
    Authservices.allowTo("admin", "manager"),
    uppladProductIMages,
    resizeProductImages,
    createProductValidator,
    creatsProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    Authservices.protect,
    Authservices.allowTo("admin", "manager"),
    updateProductValidator,
    updateProduct
  )
  .delete(
    Authservices.protect,
    Authservices.allowTo("admin"),
    deleteProductValidator,
    deleteProduct
  );
module.exports = router;
