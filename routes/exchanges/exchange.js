const express = require("express");
const { authenticated } = require("../../middleware/auth");
const router = express.Router();
const { connectExchange , getExchanges, deleteUserExchange } = require("../../controllers/exchanges/exchange");







router.post("/connect", authenticated, connectExchange);
router.get("/get/exchanges", authenticated, getExchanges);
router.post("/delete", authenticated, deleteUserExchange);





module.exports = router;
