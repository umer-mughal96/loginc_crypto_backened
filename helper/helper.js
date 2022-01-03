const conn = require('../config/dbConnections');
const MongoClient =   require('mongodb').MongoClient;
const objectId    =   require('mongodb').ObjectID;
const { IoTJobsDataPlane } = require("aws-sdk");

module.exports = {

    getSymbols: (collectionName) => {
        return new Promise(resolve => {
            conn.then(async (db) => {
                let lookup = [
                    {
                        '$group' : {
                            _id       : '$symbol',  
                            coin_name : {'$first' : '$coin_name'}
                        }
                    }
                ]
                let coins = await db.collection(collectionName).aggregate(lookup).toArray()
                resolve(coins)
                
            })
        })
    },//end getSymbols

    //every 6 hours 
    userExchangeDetails : (exchangeName) => {
        return new Promise (resolve => {
            conn.then(async (db) => {

                var olderDate = new Date();
                olderDate.setHours(olderDate.getHours() - 6)

                let recordUpdateQuery = [
                    {
                        '$match' : {

                            '$or' : [
                                { 'lat-updated_time'  :  {'$exists' : false} },
                                { 'lat-updated_time'  :  {'$gte'    : olderDate} }
                            ],
                            'exchange' : exchangeName
                        }
                    },
                    {
                        '$project' : {
                            _id        :   {'$toString' : '$_id'},
                            userId     :   "$userId",
                            exchanges  :   "$exchanges",
                            apiKey     :   '$apiKey',
                            secretKey  :   '$secretKey'
                        }
                    },
                    {
                        '$sort' : { 'updated_time' : -1}
                    },
                    {
                        '$limit' : 5
                    }
                ];

                let data = await db.collection('exchanges').aggregate(recordUpdateQuery).toArray();
                resolve(data);
            })
        })
    },//end balance cron
}