
const { default: axios } = require('axios');
const Poloniex = require('poloniex-api-node');


// import sha256 from 'crypto-js/sha256';
// import hmacSHA512 from 'crypto-js/hmac-sha512';
const Base64  = require('crypto-js/enc-base64');
const hmacSHA256 = require('crypto-js/hmac-sha256') 
// const message, nonce, path, privateKey; // ...
// const hashDigest = sha256(nonce + message);
// const hmacDigest = Base64.stringify(hmacSHA512(path + hashDigest, privateKey));


const getBinanceusAssets = async (apiKey, secretKey) => {
    // /api/v3/account GET request
    //let res = await getUserBalances()
    // return res;
}





const getUserBalances = async () => {

    try {
        let res = await poloniex.returnAvailableAccountBalances()
        return res;

    } catch (error) {
        console.log("🚀 ~ file: poloniex.js ~ line 40 ~ error", error)

    }

}
const getInstance = async (credentials) => {
    return new Poloniex(credentials.apiKey, credentials.secretKey);
}

const placeBinanceusDirectOrder = async (data, credentials) => {
/*
symbol	LTCBTC
side	BUY
type	LIMIT
timeInForce	GTC
quantity	1
price	0.1
recvWindow	5000
timestamp	1499827319559 

*/
        var body = {
            symbol : "LTCBTC",
            side : "BUY",
            type : "LIMIT",
            timeInForce : "GTC",
            quantity : "1",
            price : "0.1",
            timestamp : Date.now()
        }
        const path = process.env.BINANCEUS_BASE_URL+"/api/v3/order";
        // const hashDigest = sha256(credentials.privateKey + body);
        const hmacDigest = Base64.stringify(hmacSHA256(path + body, "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"));
        const config = {
            headers : {
                "X-MBX-APIKEY" : "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A"
        }
    }
    body = {
        symbol : "LTCBTC",
        side : "BUY",
        type : "LIMIT",
        timeInForce : "GTC",
        quantity : "1",
        price : "0.1",
        timestamp : Date.now(),
        signature : hmacDigest
    }


    
    try 
    {
        if(data.action == "Buy")
        {
            const t = await axios.post(process.env.BINANCEUS_BASE_URL+"/api/v3/order", body, config)
        console.log(t);

        }
        else if(data.action == "Sell")
        {
            const transact =  poloniex.sell('USDT_'+data.coin,'1', data.amount );
        console.log(transact);
        }
        
    } catch (error) {
        
    }

    
}




module.exports = {
   
    placeBinanceusDirectOrder
}