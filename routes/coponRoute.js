const express = require("express");
const Authservices = require("../services/authService");
const {
  getAllCopons,
  getCopon,
  createCopon,
  updateCopon,
  deleteCopon,
} = require("../services/coponService");

const router = express.Router();
router.use(Authservices.protect, Authservices.allowTo("admin", "manager"));

router.route("/").post(createCopon).get(getAllCopons);
router.route("/:id").delete(deleteCopon).get(getCopon).put(updateCopon);
module.exports = router;
