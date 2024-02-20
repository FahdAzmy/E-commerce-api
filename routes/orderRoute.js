const express = require("express");
const Authservices = require("../services/authService");
const router = express.Router();
const {
  createCahOrder,
  getOrders,
  filterOrderForLoggedUser,
  getSpacificOrder,
  updateOrderStutusToPaid,
  updateOrderStutusToDailvered,
  checkoutSession,
} = require("../services/orderServices");
router
  .route("/:cartId")
  .post(Authservices.protect, Authservices.allowTo("user"), createCahOrder);
router.get(
  "/",
  (Authservices.allowTo("admin"), filterOrderForLoggedUser, getOrders)
);
router.route("/:id").get(getSpacificOrder);
router.put(
  "/:id/pay",
  Authservices.protect,
  Authservices.allowTo("admin"),
  updateOrderStutusToPaid
);
router.put(
  "/:id/dilvered",
  Authservices.protect,
  Authservices.allowTo("admin"),
  updateOrderStutusToDailvered
);
router.get(
  "/chekout-session/:cartId",
  Authservices.protect,
  Authservices.allowTo("user"),
  checkoutSession
);
module.exports = router;
