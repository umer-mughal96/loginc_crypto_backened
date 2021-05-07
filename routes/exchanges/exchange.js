const express = require("express");
const { authenticated } = require("../../middleware/auth");
const router = express.Router();
const { connectExchange } = require("../../controllers/exchanges/exchange");







router.post("/connect", authenticated, connectExchange);





module.exports = router;
