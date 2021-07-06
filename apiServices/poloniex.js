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




module.exports = {
    getPloniexAssets
}