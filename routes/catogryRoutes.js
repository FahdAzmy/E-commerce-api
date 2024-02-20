const express = require("express");
const {
  getcategoryValidator,
  createCatogaryValidator,
  updateCategoryValidator,
  deletecategoryValidator,
} = require("../utils/validator/categoryValidator");
const router = express.Router();
const {
  getAllcategoris,
  createCatogary,
  getcategory,
  updateCategory,
  uploadCategoryImages,
  deleteCategory,
  resizeImage,
} = require("../services/catogeryService");
const Authservices = require("../services/authService");
const subCategoryRoute = require("../routes/subCategoryroute");
router.use("/:catogeryId/subcategory", subCategoryRoute);
router
  .route("/")
  .get(getAllcategoris)
  .post(
    Authservices.protect,
    Authservices.allowTo("admin", "manager"),
    uploadCategoryImages,
    resizeImage,
    createCatogaryValidator,
    createCatogary
  );
router
  .route("/:id")
  .get(getcategoryValidator, getcategory)
  .put(
    Authservices.protect,
    Authservices.allowTo("admin", "manager"),
    uploadCategoryImages,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    Authservices.protect,
    Authservices.allowTo("admin", "manager"),
    deletecategoryValidator,
    deleteCategory
  );
module.exports = router;
