// const { Transaction } = require('coinbase');
const Poloniex = require('poloniex-api-node');

// import {  AuthenticatedClient }   from "poloniex-node-api";
// const auth = require('poloniex-node-api')
// console.log("🚀 ~ file: poloniex.js ~ line 6 ~ auth", auth)





const getPloniexAssets = async (apiKey, secretKey) => {
    poloniex = new Poloniex(apiKey, secretKey);
    let res = await getUserBalances()
    return res;
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

const placePoloniexDirectOrder = async (data, credentials) => {
/*
buy(currencyPair, rate, amount, fillOrKill, immediateOrCancel, postOnly [, callback])
sell(currencyPair, rate, amount, fillOrKill, immediateOrCancel, postOnly [, callback])

*/
    
    // const poloniex = await getInstance(credentials);
    const ppoloniex = new Poloniex(credentials.apiKey, credentials.secretKey);
    console.log("🚀 ~ file: poloniex.js ~ line 47 ~ placePoloniexDirectOrder ~ credentials.secretKey", credentials.secretKey)
    console.log("🚀 ~ file: poloniex.js ~ line 47 ~ placePoloniexDirectOrder ~ credentials.apiKey", credentials.apiKey)
    // console.log("🚀 ~ file: poloniex.js ~ line 47 ~ placePoloniexDirectOrder ~ ppoloniex", ppoloniex)
    const key = credentials.apiKey;
    const secret  = credentials.secretKey;
    // const client = new AuthenticatedClient({ key, secret });
    // console.log("🚀 ~ file: poloniex.js ~ line 41 ~ placePoloniexDirectOrder ~ poloniex", poloniex)
    try 
    {
        if(data.action == "Buy")
        {


            
            console.log("🚀 ~ file: poloniex.js ~ line 60 ~ placePoloniexDirectOrder ~ transact")
        //     console.log("In Buy action")
        return ppoloniex.buy('USDT_'+data.coin,'1', data.amount ).then((error, res) => {
            if(error) console.log(error);
            else if(res) console.log(res);
            return res;
            
         }).catch((err) => {
         return err;
             
         })

        // console.log("After api execution");
        // console.log("🚀 ~ file: poloniex.js ~ line 47 ~ placePoloniexDirectOrder ~ transact", transact)
        // return transact;

        }
        else if(data.action == "Sell")
        {
            return ppoloniex.sell('USDT_'+data.coin,'1', data.amount ).then((error, res) => {
                if(error) console.log(error);
                else if(res) console.log(res);
                return res;
                
             }).catch((err) => {
             return err;
                 
             })
        }
        
    } catch (error) {
        
    }

    
}




module.exports = {
    getPloniexAssets,
    placePoloniexDirectOrder
}