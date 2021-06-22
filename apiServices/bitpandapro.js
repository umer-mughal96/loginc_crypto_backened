const axios = require('axios')





let apiKey ;
let config ;


const getBitpandaAssets = async (bitApiKey) => {
    apiKey = bitApiKey ;

    config={
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
    }
    const data = await getUserAssets()
    console.log("🚀 ~ file: bitpandapro.js ~ line 21 ~ getBitpandaAssets ~ data", data)
    return data ;
}





const getUserAssets = () => {

    return axios.get(`${process.env.BITPANDAPRO_BASE_URL}/account/balances`,config)
}



module.exports = {
    getBitpandaAssets
}