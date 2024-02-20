const express = require("express");
const Authservices = require("../services/authService");
const {
  addProductToCart,

  getCartUser,
  removeProduct,
  updateItemQuntity,
  clearUserCart,
  applyCoupon,
} = require("../services/cartService");

const router = express.Router();
router.use(Authservices.protect, Authservices.allowTo("user"));
router.put("/applyCoupon", applyCoupon);
router.route("/").post(addProductToCart).get(getCartUser).delete(clearUserCart);
router.route("/:itemId").delete(removeProduct).put(updateItemQuntity);

// router.route("/:addressId").delete();
module.exports = router;
