const express = require("express");
const router = express.Router();
const {
  
  newRule,
} = require("../../controllers/rule");
const { authenticated } = require("../../middleware/auth");
const { isAdmin } = require("../../middleware/roles");

// router.get("/exchange/assets" , authenticated , getExchangesDataOfSpecificExchange)

// router.post("/pay", authenticated, stripePayment);



router.post('/new', authenticated, newRule);

module.exports = router;
