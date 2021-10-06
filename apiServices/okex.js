const { default: axios } = require('axios');
const crypto = require('crypto');
const { stringify } = require('flatted');

const CryptoJS = require('crypto-js');


const baseUrl = "https://www.okex.com";
let config ;
let preHashString
let secretKey;
let apiKey;



const signature = (prehash) => {
    // console.log("This is secret kry in signature : )
    // console.log("This is 18 line "+secretKey);
    // const abc =  crypto.createHmac("sha256", secretKey).update(timestamp).digest("base64");
    return crypto.createHmac("sha256", secretKey).update(prehash).digest("base64");
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
            'OK-ACCESS-PASSPHRASE' : 'Rajaali123',
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
    // console.log("This is data : ");
    // console.log(data);
    let timestamp =await  getServerTime();
    secretKey = credentials.secretKey;
    console.log("This is secret key : " + secretKey);
    apiKey = credentials.apiKey;
    // console.log(timestamp.epoch);
  
    // const sign=CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp.epoch + 'POST' + '/api/v5/trade/order'+ secretKey))
    // console.log(timestamp);

    // const asign=await CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + 'POST' + '/api/v5/trade/order', secretKey))
    


    const body = {
                "instId" : data.coin+"-USDT",
                "tdMode" : "cash",
                "side" : data.action.toLowerCase(),
                "ordType" : "market",
                "sz" : data.amount
    }

   const ppreHashString = timestamp.iso+'POST'+'/api/v5/trade/order'+JSON.stringify(body);





   
//    console.log("🚀 ~ file: okex.js ~ line 96 ~ placeOkexDirectOrder ~ ppreHashString", ppreHashString)

    const hashes = signature(ppreHashString)
    console.log("🚀 ~ file: okex.js ~ line 106 ~ placeOkexDirectOrder ~ hashes", hashes)


    // console.log(sign);

    // console.log(timestamp);
    // console.log("🚀 ~ file: okex.js ~ line 103 ~ placeOkexDirectOrder ~ timestamp", timestamp)
    const configg = {
        headers : {
            'OK-ACCESS-KEY' : credentials.apiKey,
            'OK-ACCESS-SIGN' :  hashes,
            'OK-ACCESS-TIMESTAMP' : timestamp.iso,
            'OK-ACCESS-PASSPHRASE' : 'Rajaali123',
            'Content-Type' : 'application/json'
        }
    }
    if(data.action == "Buy")
    {
        // console.log("line 106");
        try {
            const result = await axios.post(baseUrl+'/api/v5/trade/order', 
            
               body
            , configg);
    
            
    
            // console.log(result.data.data);
             return result.data.data;
        } catch (error) {
            console.log(error);
        }
      
    }
    else if(data.action == "Sell")
    {
        console.log("line 106");

        const result = await axios.post(baseUrl+'/api/v5/trade/order', 
        body, configg);

        console.log(result.data);
        return result.data;
    }
    
}



module.exports = {
    getOkexAssets,
    placeOkexDirectOrder
}
