const subcatogaryModel = require("../models/subCategoryModel");
const factory = require("./handlerFactory");

exports.setCategoryIdtobody = (req, res, next) => {
  if (!req.body.catogery) req.body.catogery = req.params.catogeryId;
  next();
};
exports.createSubcategory = factory.createOne(subcatogaryModel);
// nested route
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.catogeryId) filterObject = { catogery: req.params.catogeryId };
  req.filterObj = filterObject;
  next();
};
// @desc Get All Subcategory
// @route get /api/v1/subcateogry
// @acces public
exports.getSubcategories = factory.getAll(subcatogaryModel);

// @desc Get Spacific Subcategory
// @route get /api/v1/subcategory
// @acces public
exports.getSubcategoriy = factory.getOne(subcatogaryModel);

// @desc upadate Subcategory
// @route get /api/v1/subcategory
// @acces public

exports.updateSubcategories = factory.updateONe(subcatogaryModel);

// @desc delete subcategory
// @route get /api/v1/subcategory
// @acces public

exports.deleteSubcategories = factory.deleteOne(subcatogaryModel);
