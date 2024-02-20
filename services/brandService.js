const brandModel = require("../models/brandModel ");
const factory = require("./handlerFactory");
const { v4: uuid4 } = require("uuid");
const { uploadSingleImage } = require("../middleware/uplaodImage");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

exports.uploadBrandImages = uploadSingleImage("image");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brands-${uuid4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);
  req.body.image = filename;
  next();
});
// @desc Get All brand
// @route get /api/v1/brands
// @acces public
exports.getAllBrands = factory.getAll(brandModel);
// @desc Get sapacif brand
// @route Post /api/v1/brands
// @acces puplic
exports.getBrand = factory.getOne(brandModel);

// @desc Create brand
// @route Post /api/v1/brands
// @acces private
exports.createBrand = factory.createOne(brandModel);

// @desc Update category
// @route Post /api/v1/brands
// @acces private
exports.updateBrand = factory.updateONe(brandModel);

// @desc Delete category
// @route Post /api/v1/brands
// @acces private
exports.deleteBrand = factory.deleteOne(brandModel);
