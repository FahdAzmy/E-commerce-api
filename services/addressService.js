const userModel = require("../models/userModel");
const apiError = require("../utils/apierror");
const asyncHandler = require("express-async-handler");
// add product to wishlist

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        address: req.body,
      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Address added Successfully ",
    data: user.address,
  });
});
// delete
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { address: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Address removed Successfully.",
    data: user.address,
  });
});
// get all wishList Logged User
exports.userAddresses = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("address");

  res.status(200).json({
    data: user.address,
  });
});
