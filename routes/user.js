const express = require("express");
const router = express.Router();
const {
  getExchangesDataOfSpecificExchange,
  stripePayment,
} = require("../controllers/user");
const { authenticated } = require("../middleware/auth");
const { isAdmin } = require("../middleware/roles");

router.get("/exchange/assets" , authenticated , getExchangesDataOfSpecificExchange)

router.post("/pay", authenticated, stripePayment);

module.exports = router;
