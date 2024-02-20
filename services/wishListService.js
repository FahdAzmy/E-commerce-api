const userModel = require("../models/userModel");
const apiError = require("../utils/apierror");
const asyncHandler = require("express-async-handler");
// add product to wishlist

exports.addProductToWichlist = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        wishlist: req.body.productId,
      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product added Successfully to your wichlist.",
    data: user.wishlist,
  });
});
// delete
exports.removeProductFromWichlist = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product removed Successfully to your wichlist.",
    data: user.wishlist,
  });
});
// get all wishList Logged User
exports.userWishList = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.user._id)
    .populate("wishlist", " title");

  res.status(200).json({
    data: user.wishlist,
  });
});
