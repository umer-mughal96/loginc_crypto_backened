const { Transaction } = require('coinbase');
const Poloniex = require('poloniex-api-node');




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
    
    const poloniex = await getInstance(credentials);
    // console.log("🚀 ~ file: poloniex.js ~ line 41 ~ placePoloniexDirectOrder ~ poloniex", poloniex)
    try 
    {
        if(data.action == "Buy")
        {
            console.log("In Buy action")
        const transact = await poloniex.buy('USDT_'+data.coin,'1', data.amount );

        console.log("After api execution");
        console.log("🚀 ~ file: poloniex.js ~ line 47 ~ placePoloniexDirectOrder ~ transact", transact)
        // console.log(transact);

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
    getPloniexAssets,
    placePoloniexDirectOrder
}