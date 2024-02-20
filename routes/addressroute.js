const express = require("express");
const Authservices = require("../services/authService");
const {
  addAddress,
  removeAddress,
  userAddresses,
} = require("../services/addressService");

const router = express.Router();
router.use(Authservices.protect, Authservices.allowTo("user"));

router.route("/").post(addAddress).get(userAddresses);
router.route("/:addressId").delete(removeAddress);
module.exports = router;
