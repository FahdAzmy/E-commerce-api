const catogaryModel = require("../models/catogeryModel");
const factory = require("./handlerFactory");
const sharp = require("sharp");
const { v4: uuid4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middleware/uplaodImage");
//upload Single Image
exports.uploadCategoryImages = uploadSingleImage("image");
//Resize Image
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `catogery-${uuid4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);
    req.body.image = filename;
  }
  next();
});
// @desc Get All category
// @route get /api/v1/categories
// @acces public
exports.getAllcategoris = factory.getAll(catogaryModel);
// @desc Get sapacif category
// @route Post /api/v1/categories
// @acces puplic
exports.getcategory = factory.getOne(catogaryModel);

// @desc Create category
// @route Post /api/v1/categories
// @acces private
exports.createCatogary = factory.createOne(catogaryModel);
// @desc Update category
// @route Post /api/v1/categories
// @acces private
exports.updateCategory = factory.updateONe(catogaryModel);

// @desc Delete category
// @route Post /api/v1/categories
// @acces private
exports.deleteCategory = factory.deleteOne(catogaryModel);
