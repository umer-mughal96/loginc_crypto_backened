const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const placeLiquidDirectOrder = async (data, credentials) => {
// console.log("🚀 ~ file: liquid.js ~ line 5 ~ placeLiquidDirectOrder ~ credentials", credentials)
    
  const  ttoken_id = '2295177';
const user_secret = 'KhXnyiDDw0k4trog9YUFIdvsxXjvuWAC4d2cSiN+NiC//IIgb5sUNVYbO6/THvcdme9/gNIQCqrqJO6EBk0Msw==';
const ppath = '/orders';

const non = Date.now();
// console.log("🚀 ~ file: liquid.js ~ line 11 ~ placeLiquidDirectOrder ~ non", non)
const auth_payload = {
    "path" : ppath,
    "nonce" : non,
    "token_id" : ttoken_id
}
console.log(auth_payload);

const signature =  jwt.sign(JSON.stringify(auth_payload), user_secret); //, { algorithm: 'HS256'}

// const signature = jwt.sign(auth_payload, user_secret);

// const signature = crypto.createHmac("sha256", user_secret).update(JSON.stringify(auth_payload)).digest("base64");
// console.log("🚀 ~ file: liquid.js ~ line 19 ~ placeLiquidDirectOrder ~ signature", signature)


const config = {
    headers : {
        'X-Quoine-Auth' : signature,
        'Content-Type' : 'application/json',
        
    }
}

const url = process.env.LIQUID_BASE_URL+'/orders';
// console.log("🚀 ~ file: liquid.js ~ line 33 ~ placeLiquidDirectOrder ~ url", url)

const bb = {
    order_type : "market",
    product_id : 1,
    side : data.action.toLowerCase(),
    quantity : data.amount
}


try {

        if(data.action == "Buy")
        {
            axios.post(url, bb, config)
            .then((error, response)=>{
            if(response) console.log(response.response);
            else console.log(error);
            })
            .catch((error)=> {
            console.log(error);
            })
        }
        else if(data.action == "Sell")
        {
            axios.post(url, bb, config)
            .then((error, response)=>{
            if(response) console.log(response.response);
            else console.log(error);
            })
            .catch((error)=> {
            console.log(error);
            })
        }

    
    
    
} catch (error) {
    
}






}

module.exports = 
{
    placeLiquidDirectOrder
}