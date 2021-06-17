const crypto = require('crypto')
const axios = require('axios')


let timestamp ;// TIME STAMP
let apiSecret ; //SECRET KEY OF EXCHANGE

//CREATE SIGNATURE


const signature = (timestamp) => {
  return crypto.createHmac("sha256", apiSecret).update(timestamp).digest("hex");
};

const getCoins = (serverTime,apiKey,secretKey) => {
  try {
    apiSecret = secretKey ;
    timestamp = "timestamp=" + serverTime;
    let signedSignature = signature(timestamp);

    let config = {
      headers: {
        "Content-Type": "application/json",
        "X-MBX-APIKEY": apiKey,
      },
    };

    return axios.get(
      `https://api.binance.com/sapi/v1/capital/config/getall?${timestamp}&signature=${signedSignature}`,
      config
    );
  } catch (error) {
    console.log("🚀 ~ file: binance.js ~ line 30 ~ getCoins ~ error", error);
  }
};








module.exports = {
    getCoins,
};
