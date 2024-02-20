const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validator/brandValidator ");
const router = express.Router();
const {
  getAllBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImages,
  resizeImage,
} = require("../services/brandService");
const Authservices = require("../services/authService");

router
  .route("/")
  .get(getAllBrands)
  .post(
    Authservices.protect,
    Authservices.allowTo("admin", "manager"),
    uploadBrandImages,
    resizeImage,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    Authservices.protect,
    Authservices.allowTo("admin", "manager"),
    uploadBrandImages,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    Authservices.protect,
    Authservices.allowTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );
module.exports = router;
