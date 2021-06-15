const exchangeSevices = require("../services/exchange");
const authServices = require("../services/auth");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { default: axios } = require("axios");
const stripeClient = require('stripe')("sk_test_51IyeYHAk9CJdz6j4sVXOtfaGM5sBCHcHY0ybvPWfnQZUploDADT8Y9wwP9G1EgMq80G0uC0VorY76ldxgJut9Wp100ZW8KYDjM")


//Update User By Id



const stripePayment = async (req, res, next) => {
  try {
    const { id, price } = req.body;
    const response = await stripeClient.paymentIntents.create({
      amount: price * 100,
      currency: "USD",
      description: "Crypto",
      payment_method: id,
      confirm: true,
    });
    console.log("🚀 ~ file: user.js ~ line 142 ~ stripePayment ~ response", response)
    res.status(200).json({ success: true, response });
  } catch (err) {
    console.log("🚀 ~ file: user.js ~ line 145 ~ stripePayment ~ err", err)
    res.status(500).json({ success: false, error: err.message });
  }
};




const getExchangesDataOfSpecificExchange = async (req, res, next) => {

  try {
      let getExchanges = await exchangeSevices.getExchange(req.user.id)

      if(!getExchanges){
        return res.status(400).json({ success: false, msg : "Exchange Bad Request" });
      }
      let findExchange = getExchanges.exchanges.find((ex) => ex.exchangeName == req.query.name)

      let config = {
        headers : {
          'Content-Type' : 'application/json',
          'X-MBX-APIKEY' : 'axpHg2O3KVpC9fPJ7mObpORqkiIe49REjrCYU91CjTJOQ5toFRks6zY9C0clJ4Ui'
        }
      }

      let coins = await axios.get(`https://api.binance.com/sapi/v1/capital/config/getall?`, config)
      console.log("🚀 ~ file: user.js ~ line 45 ~ getExchangesDataOfSpecificExchange ~ coins", coins)
      
      res.status(200).json({ success: true,findExchange });
      
  } catch (err) {
    console.log("🚀 ~ file: user.js ~ line 145 ~ stripePayment ~ err", err)
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getExchangesDataOfSpecificExchange,
  stripePayment
};
