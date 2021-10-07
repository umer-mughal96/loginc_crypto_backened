const KrakenClient = require('kraken-api');
const crypto = require('crypto');
const qs     = require('qs');
const axios = require('axios');
let kraken;


const getKrakenAssets = async (kraApiKey, kraSecretKey) => {
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
const getMessageSignature = (path, request, secret, nonce) => {
    const message       = qs.stringify(request);
    const secret_buffer = new Buffer.from(secret, 'base64');
    const hash          = new crypto.createHash('sha256');
    const hmac          = new crypto.createHmac('sha512', secret_buffer);
    const hash_digest   = hash.update(nonce + message).digest('binary');
    const hmac_digest   = hmac.update(path + hash_digest, 'binary').digest('base64');

    return hmac_digest;
};


const placeKrakenDirectOrder = async (data, credentials) => {

    console.log("This i saasadasssssssssss")
    kraken = new KrakenClient(credentials.apiKey, credentials.secretKey);

    const time = Date.now();
    // const body = 'nonce='+time+'&pair='+data.coin+'USD&ordertype=market&type='+data.action+'&volume='+data.amount;
    const bb= {
        nonce : time.epoch, 
        pair: data.coin+'USD',
        ordertype : 'market',
        type: data.action.toLowerCase(),
        volume : '0.5'
    }

   const result =  await kraken.api('AddOrder', bb);   ///0/private/
   console.log("🚀 ~ file: kraken.js ~ line 60 ~ placeKrakenDirectOrder ~ result", result)

//    console.log(result)
    

    // console.log(body);

    // const signature = getMessageSignature('/0/private/AddOrder', bb, credentials.secretKey, time);
    

    // console.log(signature);
    // const config = {
    //     headers : {
    //         'API-Key' : credentials.apiKey,
    //         'API-Sign': signature,
    //         'content-type' : 'application/x-www-form-urlencoded'
    //     }
    // }

    // await axios.post(process.env.KRAKEN_BASE_URL+'/0/private/AddOrder',{bb}, config)
    // .then((error, response)=>{
    //     if(response) console.log(response);
    //     else console.log(error);
    // })
    // .catch((error)=>{
    //      console.log(error);
    // })



    // return signature;


        
}



module.exports = {
    getKrakenAssets,
    placeKrakenDirectOrder
}