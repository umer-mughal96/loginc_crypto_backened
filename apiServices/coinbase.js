const axios = require('axios')
const fetch = require('node-fetch');

var Client = require('coinbase').Client;






let apiKey ;
let config ;


const getCoinbaseAssets = async (coinbaseApiKey) => {
    // apiKey = coinbaseApiKey ;

    // config={
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${apiKey}`,
    //       },
    // }
    // const data = await getUserAssets()
    // console.log("🚀 ~ file: bitpandapro.js ~ line 21 ~ getBitpandaAssets ~ data", data)
    // return data ;
}





const getUserAssets = () => {

    // return axios.get(`${process.env.BITPANDAPRO_BASE_URL}/account/balances`,config)
}


const placeCoinbaseDirectOrder = async (data, credentials) => { // eyJvcmciOiJiaXRwYW5kYS1nZSIsImFsZyI6IlJTMjU2Iiwia2lkIjoiZXhjaGFuZ2UtbGl2ZSJ9.eyJhdWQiOlsiaHR0cHM6XC9cL2FwaS5leGNoYW5nZS5iaXRwYW5kYS5jb20iLCJ3c3M6XC9cL3N0cmVhbXMuZXhjaGFuZ2UuYml0cGFuZGEuY29tIl0sInN1YiI6ImFjYzoxY2U0OTQ5OC0wY2RhLTQ5MTEtYmQ3OC01ZDI2ZTJjZDNiOTUiLCJzY3AiOlsiUkVBRF9PTkxZIiwiV0lUSERSQVciLCJUUkFERSJdLCJuYmYiOjE2MzI5ODMxMjgsImlzcyI6Imh0dHBzOlwvXC9hcGkuZXhjaGFuZ2UuYml0cGFuZGEuY29tXC9vYXV0aDIiLCJpcHMiOltdLCJpYXQiOjE2MzI5ODMxMjgsImp0aSI6ImNlZTk4ZGYwLTI3OTUtNDY0Ni04YzFkLTQxY2MyZDc2Y2RjOSJ9.bmWiYIpX5xl42XqiU13KS5mVLAE55pyJON9DS7CTacRPAmI-NnMpYma4TcKaWFWZv6vPctXah4QjM8WSg_GUhmLatRmTjFZ4SPXIMTUaVQUNKycDv5_2DRn3l1di1pXAdxykAe8UemREkVcG1UM8TJBzrOVq1UWs6Z8GZAZHz8hY-Em0bwn8U-U3L3Q_rPW0K02hSxSFhZ0GfT4ay3enZyuAgmQ0UAcxuBZSY6NZxylPtUvFJ5ZmTiW987xYKJ_GApLEw5ZUVcfeeUpDL07WLJYgGLm9jGSdnEjDLzcFS2gPncVVGZM7uJR2t0ZumDYSCDlqPVOQJVqj3CgqlYKaJoXzidQSxdOz4FD81hkF4TTt65NR227t9LOJHAT7gC1DQhpniRmUKtFasKrfW0i_-sXmhrgGeopWyQml0-aGekWqEmFczdC-fDSGK1mQ7BlrOyP0NCBzCyXP7gSzEHDsDUogoui0tL8WSwdGudkPfKNskiKQpG1OVdIhHT9YOSeI8H9Dc66eOKfjbEWYiY68VukZGHdBnjNXWYTNCrUa-fNTlNNTm2S0G6K5uN4qmPgcUNVti3A9uk3-sBrhisLpRcABeHKOXSVdZ60XrYLSVqxWmIx5r1UcebvFfPR14B4eKUOSTDvgrfeVtkA5JsUrcN8yE939boLcixY2Ib6WbOY

    console.log(data, credentials);
    const apiKey = credentials.apiKey;
    const secretKey = credentials.secretKey;

    const client = await new Client({'apiKey': apiKey, 'apiSecret': secretKey, strictSSL: false});
    // console.log(client);

    // const headers = {
    //     'Content-Type':'application/json',
    //     'Accept':'application/json',
    //     'Authorization' : 'Bearer '+apiKey,//////////////////timestamp + method + requestPath + body
    // const t = timeStamp+"POST"+""


    // const signature = crypto.createHmac("sha256", apiSecret).update(timestamp).digest("hex");
    //   };

      if(data.action == "Buy")
      {

        try {
             client.getAccount({}, function(err, account) {
                if(err)
                {
                    console.log(err);
                }
                else 
                {
                    account.buy({"amount": "10",
                             "currency": "BTC",
                             "payment_method": "83562370-3e5c-51db-87da-752af5ab9559"}, function(err, tx) {
                  console.log(tx);
                });
                }
                
              });
        } catch (error) {
            console.log(error);                                                                        
        }
        
        //////////////////////////////////////////////////////////////////////////////////////////////////
        // const inputBody = {
        //     "instrument_code": data.coin+"_EUR",
        //     "side": "BUY",
        //     "type": "MARKET",
        //     "amount": data.amount,
            
        //   };
        // // const finalBody = JSON.stringify(inputBody)
        // // console.log(inputBody);

    
        //    await axios.post('https://api.exchange.bitpanda.com/public/v1/account/orders', inputBody, {headers:{
        //     'Content-Type':'application/json',
        //     'Accept':'application/json',
        //     'Authorization' : 'Bearer '+apiKey,
        //    }})
        //    .then((error, response)=>{
        //        if(error)
        //        {
        //            console.log("error : " + error);
        //        }
        //        else 
        //        {
        //         console.log("Result  : " + response);
        //        }
        //    })
        //    .catch((error)=>{
        //        console.log(error);
        //    })

    
    
        //   console.log(result);
          
    
      }
      else if(data.action == "Sell")
      {
        
      }

      
}



module.exports = {
    
    placeCoinbaseDirectOrder
}