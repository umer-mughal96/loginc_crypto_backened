const { default: axios } = require('axios');
const KrakenClient = require('kraken-api');
// const axios = require('axios');
let kraken;


const getBitstampAssets = async (kraApiKey, kraSecretKey) => {
    kraken = new KrakenClient(kraApiKey, kraSecretKey);

    const data = await getUserAssets()
    console.log("🚀 ~ file: kraken.js ~ line 10 ~ getKrakenAssets ~ data", data)
    
    return data;
}





const getUserAssets =async () => {

    try {
       const res = await  kraken.api('Balance');
       console.log("🚀 ~ file: kraken.js ~ line 22 ~ getUserAssets ~ res", res)
       return res;
    } catch (error) {
    console.log("🚀 ~ file: kraken.js ~ line 23 ~ getUserAssets ~ error", error)
        
    }
}

const getServerTime = () => {
    console.log(+ new Date());
    return + new Date();
}


const placeBitstampDirectOrder = (data, credentials) => {

    const config = {
        "X-Auth	": "BITSTAMP"+ " "+ credentials.apiKey, //"BITSTAMP" + " " + api_key
        "X-Auth-Signature": "", //sha256.hmac(string_to_sign, api_secret)
        "X-Auth-Nonce" : "", // see example https://www.bitstamp.net/api/#api-authentication
        "X-Auth-Timestamp" : "", //current timestamp
        "X-Auth-Version": "v2",
        "Content-Type" : "application/json"
    }

    if(data.action == "BUY")
    {
        axios.post('https://www.bitstamp.net/api/v2/buy/market/'+data.coin+'usd/', {
        amount : data.amount
    })
    }
    else if(data.action == "SELL")
    {
        axios.post('https://www.bitstamp.net/api/v2/sell/market/'+data.coin+'usd/', { 
            amount : data.amount
        }) 
    }
    

}



module.exports = {
    getBitstampAssets,
    placeBitstampDirectOrder
}