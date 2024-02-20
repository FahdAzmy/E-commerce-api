const cartModel = require("../models/curtMdoel");
const productModel = require("../models/productModel");
const apiError = require("../utils/apierror");
const asyncHandler = require("express-async-handler");
const coponModel = require("../models/coponModel");
const calcTotalCartPrice = (cart) => {
  // Calculate total cart price
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += Math.floor(item.quantity * item.price);
  });

  return totalPrice;
};

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  // Get Cart for Logged User
  const { productId, color } = req.body;
  const product = await productModel.findById(productId);
  let cart = await cartModel.findOne({ user: req.user._id });
  // Create a cart if doesn't exist
  if (!cart) {
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // Prodcut Exist in cart So update Quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // Product doen't exist Push it ot CartItmes
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  const totalPrice = calcTotalCartPrice(cart);
  cart.totalCartPrice = totalPrice;
  await cart.save();
  res.status(200).json({
    massage: "Product Added To Cart Succefully",
    result: cart.cartItems.length,
    data: cart,
  });
});
exports.getCartUser = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new apiError("Cart is Empty", 404));
  res.status(200).json({ NumberOfProducts: cart.cartItems.length, date: cart });
});
exports.removeProduct = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );
  const totalPrice = calcTotalCartPrice(cart);
  cart.totalCartPrice = totalPrice;
  cart.save();
  res.status(200).json({
    massage: "Product Removed From Cart Succefully",
    result: cart.cartItems.length,
    data: cart,
  });
});
exports.clearUserCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(200).send();
});
exports.updateItemQuntity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new apiError("There is no cart to this User", 404));
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    if (!cart) return next(new apiError("There is no cart to this User", 404));
  }
  const totalPrice = calcTotalCartPrice(cart);
  cart.totalCartPrice = totalPrice;
  cart.save();
  res.status(200).json({
    massage: "Quntity Updated",
    result: cart.cartItems.length,
    data: cart,
  });
});
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get Coupen Based in Coupon Name
  const coupon = await coponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon)
    return next(new apiError("There is Coupon is INvalid or Expired", 404));
  // 2) Get Logged user cart to get total cart Price
  const cart = await cartModel.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartPrice;
  //3) Cacl Price after discount
  const totalPriceAfterDiscount = (
    (totalPrice * coupon.discount) /
    100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({
    massage: "Copon Applied",
    result: cart.cartItems.length,
    data: cart,
  });
});
