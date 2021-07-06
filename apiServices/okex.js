const { default: axios } = require('axios');
const crypto = require('crypto');
const { stringify } = require('flatted');


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
            'OK-ACCESS-PASSPHRASE' : 'apikey',
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



module.exports = {
    getOkexAssets
}
