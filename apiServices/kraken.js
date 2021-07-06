const KrakenClient = require('kraken-api');
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



module.exports = {
    getKrakenAssets
}