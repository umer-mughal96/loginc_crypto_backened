const { default: axios } = require('axios');
const crypto = require('crypto');
const { stringify } = require('flatted');

const CryptoJS = require('crypto-js');


const baseUrl = "https://www.okex.com";
let config ;
let preHashString
let secretKey;
let apiKey;



const signature = (timestamp) => {
    return crypto.createHmac("sha256", secretKey).update(timestamp).digest("base64");
  };


  const getServerTime = async () => {
    let res = await axios.get('https://www.okex.com/api/general/v3/time')
    return res.data
  }


const getOkexAssets = async (okexApiKey, okexSecretKey) => {
    secretKey = okexSecretKey ;
    apiKey = okexApiKey
       
    let timestamp =await  getServerTime()
    
    preHashString = timestamp.epoch + 'GET' + '/api/v5/account/balance';


    let hashes = signature(preHashString)

    config = {
        headers : {
            'OK-ACCESS-KEY' : okexApiKey,
            'OK-ACCESS-SIGN' : hashes,
            'OK-ACCESS-TIMESTAMP' : timestamp.epoch,
            'OK-ACCESS-PASSPHRASE' : 'rajaali123',
            'Content-Type' : 'application/json'
        }
    }
    // return
    const data = await getUserAssets()
    return data;
}




const getUserAssets =async () => {

    try {
       const res = await  axios.get(`${baseUrl}/api/v5/account/balance` , config)
       return stringify(res.data.data)
     
    } catch (error) {
    console.log("🚀 ~ file: kraken.js ~ line 23 ~ getUserAssets ~ error", error)
        
    }
}
const placeOkexDirectOrder = async (data, credentials) => {


    let timestamp =await  getServerTime();
    secretKey = credentials.secretKey;
    console.log(secretKey);

    const sign=CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp.iso + 'POST' + '/api/v5/trade/order', secretKey))
    // console.log(data, credentials);
    

    
    // console.log(timestamp);
    preHashString = timestamp.iso + 'POST' + '/api/v5/trade/order';



    let hashes = signature(preHashString)

    console.log("This is Okex line 74");



    const config = {
        headers : {
            'OK-ACCESS-KEY' : credentials.apiKey,
            'OK-ACCESS-SIGN' :  sign,
            'OK-ACCESS-TIMESTAMP' : timestamp.iso,
            'OK-ACCESS-PASSPHRASE' : 'rajaali123',
            'Content-Type' : 'application/json'
        }
    }
    if(data.action == "Buy")
    {
        console.log("line 90");
        try {
            const result = await axios.post(baseUrl+'/api/v5/trade/order', 
            {
                instId : data.coin+"-USDT",
                tdMode : "cash",
                side : "buy",
                ordType : "market",
                sz : data.amount
    
            }, config);
    
            
    
            console.log(result);
            return result;
        } catch (error) {
            console.log(error);
        }
      
    }
    else if(data.action == "Sell")
    {
        console.log("line 106");

        const result = await axios.post(baseUrl+'/api/v5/trade/order', 
        {
            instId : data.coin+"-USDT",
            tdMode : "cash",
            side : "sell",
            ordType : "market",
            sz : data.amount

        }, config);

        console.log(result);
        return result;
    }
    
}



module.exports = {
    getOkexAssets,
    placeOkexDirectOrder
}
