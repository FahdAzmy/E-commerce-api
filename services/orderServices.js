const asyncHandler = require("express-async-handler");
const factory = require("./handlerFactory");
const ApiError = require("../utils/apierror");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const cartModel = require("../models/curtMdoel");
const orderModel = require("../models/orderModel");
const stripe = require("stripe")(process.env.stipe_secret);
// create Cach Order
//route POst /orders/cartId
async function getDocument(model, req) {
  // 1)get Cart Depend on Cart Id
  let document = await model.findById(req);
  return document;
}
function getCartPrice(cart) {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 2) Get Order PRice Depen on Cart Price check IF Coupon applaied
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrices = cartPrice + shippingPrice + taxPrice;
  return totalOrderPrices;
}
function updateQuntityAndProductSold(cart) {
  // 4) After creating order, decrement product quantity, increment product sold

  const bulkOption = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));
  return bulkOption;
}
async function clearCart(req) {
  await cartModel.findByIdAndDelete(req);
}
exports.createCahOrder = asyncHandler(async (req, res, next) => {
  // 1)get Cart Depend on Cart Id
  const cart = await getDocument(cartModel, req.params.cartId);
  if (!cart) return next(new ApiError("cart is Empty", 404));
  // 2) Get Order PRice Depen on Cart Price check IF Coupon applaied
  const totalPrice = await getCartPrice(cart);
  // 3) create Order cach
  const order = await orderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice: totalPrice,
  });
  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    await productModel.bulkWrite(updateQuntityAndProductSold(cart), {});
    clearCart(req.params.cartId);
  }
  res.status(201).json({ status: "success", data: order });
});
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
});
exports.getOrders = factory.getAll(orderModel);
exports.getSpacificOrder = factory.getOne(orderModel);
exports.updateOrderStutusToPaid = asyncHandler(async (req, res, next) => {
  const order = await getDocument(orderModel, req.params.id);
  if (!order) return next(new ApiError("There/'s NO Order", 404));
  order.isPaid = true;
  order.paidAt = Date.now();
  const updateOrder = await order.save();
  res.status(201).json({ status: "success", data: updateOrder });
});

exports.updateOrderStutusToDailvered = asyncHandler(async (req, res, next) => {
  const order = await getDocument(orderModel, req.params.id);
  if (!order) return next(new ApiError("There/'s NO Order", 404));
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updateOrder = await order.save();
  res.status(201).json({ status: "Delivered", data: updateOrder });
});
// Create Session for check out from stripe and send to responese
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // Get Cart And TotalOrder Price
  const cart = await getDocument(cartModel, req.params.cartId);
  if (!cart) return next(new ApiError("cart is Empty", 404));
  const totalPrice = await getCartPrice(cart);
  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalPrice * 100,
          product_data: { name: req.user.name },
        },
        quantity: 1,
      },
    ],

    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  //4) Send Session To Response
  res.status(200).json({ statu: "Success ", session });
});
