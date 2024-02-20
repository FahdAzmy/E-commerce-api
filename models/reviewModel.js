const mongoose = require("mongoose");
const productModel = require("../models/productModel");

const reviewScheam = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "Min ratings value is 1.0"],
      max: [5, "Max ratings value is 5.0"],
      required: [true, "review ratings required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "Review must belong to user"],
    },
    // parent reference (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);
reviewScheam.pre(/^find/, function (next) {
  this.populate([
    {
      path: "user",
      select: "name",
    },
  ]);
  next();
});
reviewScheam.statics.calcAverageRatingsAndSum = async function (productId) {
  const result = await this.aggregate([
    // Stage 1 : get all review in spacific product
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$rating" },
        ratingQuntity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingQuntity,
    });
  } else {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};
reviewScheam.post("save", async function () {
  await this.constructor.calcAverageRatingsAndSum(this.product);
});
reviewScheam.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndSum(this.product);
});
module.exports = mongoose.model("Review", reviewScheam);
