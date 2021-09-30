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
    // console.log("This is secret kry in signature : )
    // console.log("This is 18 line "+secretKey);
    // const abc =  crypto.createHmac("sha256", secretKey).update(timestamp).digest("base64");
    return crypto.createHmac("sha256", secretKey).update(timestamp).digest("base64");
    // return abc;
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
    console.log("This is data : ");
    console.log(data);
    let timestamp =await  getServerTime();
    secretKey = credentials.secretKey;
    console.log("This is secret key : " + secretKey);
  
    // const sign=CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp.epoch + 'POST' + '/api/v5/trade/order'+ secretKey))
    // console.log(timestamp);
    


    const body = {
                instId : data.coin+"-USDT",
                tdMode : "cash",
                side : "buy",
                ordType : "market",
                sz : data.amount
    }

    preHashString = timestamp.epoch + 'POST' + '/api/v5/trade/order'+secretKey;

    let hashes = signature(preHashString)


    // console.log(sign);

    console.log(timestamp.epoch);
    const configg = {
        headers : {
            'OK-ACCESS-KEY' : credentials.apiKey,
            'OK-ACCESS-SIGN' :  hashes,
            'OK-ACCESS-TIMESTAMP' : timestamp.epoch,
            'OK-ACCESS-PASSPHRASE' : 'rajaali123',
            'Content-Type' : 'application/json'
        }
    }
    if(data.action == "Buy")
    {
        console.log("line 106");
        try {
            const result = await axios.post(baseUrl+'/api/v5/trade/order', 
            {
                instId : data.coin+"-USDT",
                tdMode : "cash",
                side : "buy",
                ordType : "market",
                sz : data.amount
    
            }, configg);
    
            
    
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
