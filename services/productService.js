const productModel = require("../models/productModel");
const factory = require("./handlerFactory");
const { uploadMixOfImages } = require("../middleware/uplaodImage");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

exports.uppladProductIMages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/product/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/product/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );

    next();
  }
});

// @desc Get All Products
// @route get /api/v1/Procucts
// @acces public
exports.getAllProducts = factory.getAll(productModel);
// @desc Get Spacific Product
// @route get /api/v1/Procucts/:id
// @acces public
exports.getProduct = factory.getOne(productModel, "reviews");
// @desc Create Product
// @route get /api/v1/Procucts
// @acces public
exports.creatsProduct = factory.createOne(productModel);
// @desc Update Product
// @route get /api/v1/Procucts/:id
// @acces public
exports.updateProduct = factory.updateONe(productModel);

// @desc Delete Product
// @route get /api/v1/Procucts/:id
// @acces public
exports.deleteProduct = factory.deleteOne(productModel);
