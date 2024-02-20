const express = require("express");
const {
  createSubCatogaryValidator,
  getSubcategoryValidator,
  updateSubCategoryValidator,
  deleteSubcategoryValidator,
} = require("../utils/validator/subCategoryValidator");
const {
  createSubcategory,
  getSubcategories,
  getSubcategoriy,
  deleteSubcategories,
  updateSubcategories,
  setCategoryIdtobody,
  createFilterObj,
} = require("../services/subCategorySerivce");
const Authservices = require("../services/authService");

const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(createFilterObj, getSubcategories)
  .post(
    Authservices.protect,
    Authservices.allowTo("admin", "manager"),
    setCategoryIdtobody,
    createSubCatogaryValidator,
    createSubcategory
  );
router
  .route("/:id")
  .get(getSubcategoryValidator, getSubcategoriy)
  .put(
    Authservices.protect,
    Authservices.allowTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubcategories
  )
  .delete(
    Authservices.protect,
    Authservices.allowTo("admin"),
    deleteSubcategoryValidator,
    deleteSubcategories
  );

module.exports = router;
