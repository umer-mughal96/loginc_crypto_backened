const crypto = require('crypto')
const axios = require('axios')


let timestamp ;// TIME STAMP
let apiSecret ; //SECRET KEY OF EXCHANGE
let apiKey ; //API KEY OF EXCHANGE
let binanceServerTime ; //SERVER TIME FROM BINANCE
let config ;

 const getBinanceAssets = async  (serverTime,bApiKey,secretKey) => {
   
   apiSecret = secretKey ;
   apiKey = bApiKey;
   binanceServerTime = serverTime;
   timestamp = "timestamp=" + binanceServerTime;
   config = {
     headers: {
       "Content-Type": "application/json",
       "X-MBX-APIKEY": apiKey,
      },
    };
  
  
  let coins = await  getCoins() ;
  let acc = await getUserAccountData();
  let data = {
    coins : coins.data,
    account : acc.data
  }
  return data ;

}

//CREATE SIGNATURE


const signature = (timestamp) => {
  return crypto.createHmac("sha256", apiSecret).update(timestamp).digest("hex");
};


//GET ALL COINS 

const getCoins = () => {
  try {
   
    let signedSignature = signature(timestamp);

    return axios.get(
      `${process.env.BINANCE_BASE_URL}/sapi/v1/capital/config/getall?${timestamp}&signature=${signedSignature}`,
      config
    );
  } catch (error) {
    console.log("🚀 ~ file: binance.js ~ line 30 ~ getCoins ~ error", error);
  }
};

const getUserAccountData = () => {
  try {
    let signedSignature = signature(timestamp);

    return axios.get(
      `${process.env.BINANCE_BASE_URL}/api/v3/account?${timestamp}&signature=${signedSignature}`,
      config
    );
  } catch (error) {
    console.log("🚀 ~ file: binance.js ~ line 30 ~ getCoins ~ error", error);
  }
};

const serverTimepstamp = async () => {
  let serverTime = await axios.get(`${process.env.BINANCE_BASE_URL}/api/v3/time`);
  return serverTime.data.serverTime;
}

const placeBinanceDirectOrder =async  (data, credentials) => {

  console.log("In Binance");

  apiSecret = credentials.secretKey ;
   apiKey = credentials.apiKey;
   binanceServerTime = serverTimepstamp();
   timestamp = "timestamp=" + binanceServerTime;
   config = {
     headers: {
       "Content-Type": "application/json",
       "X-MBX-APIKEY": apiKey,
      },
    };

    let signedSignature = signature(timestamp);
    if(data.action == "Buy")
    {
      const result = await  axios.post(process.env.BINANCE_BASE_URL+'/api/v3/order/test',
      {
       symbol : "BTC",
       side : "BUY",
       type: "MARKET",
       timestamp	: binanceServerTime,
       quantity : data.amount

   
       
      }, config);
      console.log(result);
    }
    else if(data.action == "SELL")
    {
      const result = await  axios.post(process.env.BINANCE_BASE_URL+'/api/v3/order/test',
      {
       symbol : "BTC",
       side : "BUY",
       type: "MARKET",
       timestamp	: binanceServerTime,
       quantity : data.amount

   
       
      }, config);
      console.log(result);
    }



  



}










module.exports = {
  getBinanceAssets,
  placeBinanceDirectOrder
};
