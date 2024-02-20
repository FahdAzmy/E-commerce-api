const express = require("express");
const Authservices = require("../services/authService");
const {
  addProductToWichlist,
  removeProductFromWichlist,
  userWishList,
} = require("../services/wishListService");

const router = express.Router();
router.use(Authservices.protect, Authservices.allowTo("user"));

router.route("/").post(addProductToWichlist).get(userWishList);
router.route("/:productId").delete(removeProductFromWichlist);
module.exports = router;
