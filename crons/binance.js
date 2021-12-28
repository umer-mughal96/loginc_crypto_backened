
const Binance = require('node-binance-api');
const binance = new Binance().options({});

const conn = require('../config/dbConnections');
var helperCon = require("../helper/helper");

module.exports = {
    price: () => {
        conn.then(async (db) => {
            let symbolsArray = await helperCon.getSymbols("coins_binance");
            console.log(symbolsArray)

            var coins = symbolsArray.map(el => el._id);
            for (let i = 0; i < coins.length; i++) {

                binance.prices(coins[i], (error, ticker) => {
                    if(error){

                        console.log('error ========================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error)
                        return true;
                    }
                    ticker = Object.entries(ticker);
                    ticker.forEach(([key, value]) => {

                        var result = coins.includes(key);

                        if (result == true || result == 'true') {
                            let insertedArray = {
                                symbol: key,
                                price: parseFloat(value),
                                created_date: new Date()
                            }
                            console.log('======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',insertedArray)

                            let whereCoin = { symbol: key }
                            console.log('where ================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.', whereCoin)

                            db.collection('market_prices_binance').updateOne(whereCoin, { $set: insertedArray }, { upsert: true }, (err, result) => {
                                if (err) {

                                    console.log(err)
                                } else {
                                    console.log('upserted count: ======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ',result.upsertedCount)
                                    console.log('modified count: ======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ',result. modifiedCount)
                                }
                            })
                        }//end if
                    });
                });
            }
        }).catch((err) => {
            console.log(err);
        })
    },//End of price crone


    //balance update call
    balanceUpdate : () => {
        conn.then(async (db) => { 
            let exchangeDetails = await helperCon.userExchangeDetails("binance");
            let coins = await helperCon.getSymbols("coins_binance");

            if(exchangeDetails.length > 0){
                for(let user = 0 ; user < exchangeDetails.length; user++){

                    const binance = new Binance().options({
                        APIKEY      :   exchangeDetails[user]['exchanges'][0]['apiKey'],
                        APISECRET   :   exchangeDetails[user]['exchanges'][0]['secretKey']
                    });

                    binance.balance(async (error, balances) => {
                        if ( error ){

                            // for( let coinIteration1 = 0 ; coinIteration1 < coins.length ;  coinIteration1++ ){                                
                            //     let insertBalance = {
                            //         balance  :   0  ,
                            //         onOrder  :   0 ,
                            //         create_date : new Date()
                            //     } 

                            //     // console.log(coinIteration1)
                            //     console.log('symbol =======>>>>>>>>>>>>>>>>>>>>>>>>>>>', coins[coinIteration1]['_id'])
                            //     db.collection('balance_binance').updateOne({symbol : coins[coinIteration1]['_id'], userId :  exchangeDetails[user]['userId']}, {'$set' : insertBalance}, {upsert:true})
                            // }//end loop
                            db.collection('exchanges').updateOne({ userId : exchangeDetails[user]['userId']}, {'$set' : { updated_time : new Date()}})
                            return true;//console.error(error);
                        }else{
                            for( let coinIteration = 0 ; coinIteration < coins.length ;  coinIteration++ ){
                                let coinName = coins[coinIteration]['coin_name'];
                                
                                let insertBalance = {
                                    balance  :  (balances[coinName].available > 0) ? balances[coinName].available : 0  ,
                                    onOrder  :  (balances[coinName].onOrder > 0) ? balances[coinName].onOrder : 0 ,
                                    create_date : new Date()
                                } 

                                // console.log(insertBalance)
                                db.collection('balance_binance').updateOne({symbol : coins[coinIteration]['_d'], userId :  exchangeDetails[user]['userId']}, {'$set' : insertBalance}, {upsert:true})
                            }//end loop
                            db.collection('exchanges').updateOne({ userId : exchangeDetails[user]['userId']}, {'$set' : { updated_time : new Date()}})
                        }//end else
                    });
                }//end loop
            }//end if 
        })
    },//end balance 

}//end crone