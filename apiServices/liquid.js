const axios = require('axios');
const jwt = require('jsonwebtoken');

const placeLiquidDirectOrder = async (data, credentials) => {
    
  const  token_id = '2291124'
const user_secret = 'ieGpXraVhVwyyrVSzwge8J8u74WysDiUqP7uzkTr+bpr5+Kg2/BtaG6yK23kbP7Z0jHh0gcQldFEk+igbvJ60A==';
const path = '/orders';


const auth_payload = {
    path : path,
    nonce : Date.now(),
    token_id : token_id
}
console.log(auth_payload);

const signature = await jwt.sign(auth_payload, user_secret, { algorithm: 'HS256'}); //, 'HS256'


const config = {
    headers : {
        'X-Quoine-Auth' : signature
    }
}
/*

order_type
REQUIRED
string
Supported values: limit, market, market_with_range, trailing_stop, limit_post_only, stop
product_id
REQUIRED
number
For BTCUSD product ID is 1.
side
REQUIRED
string
Supported values: buy or sell.
quantity
REQUIRED
string
The quantity to buy or sell.
price
REQUIRED
string
Price per unit of crypto. Only required if order_type is limit, limit_post_only, market_with_range, stop.


*/



await axios.post(process.env.LIQUID_BASE_URL+'/orders', {
    order_type : "market",
    product_id : 1,
    side : "buy",
    quantity : "1"
}, config)
.then((error, response)=>{
    if(response) console.log(response);
    else console.log(error);
})
.catch((error)=> {
    console.log(error);
})





}

module.exports = 
{
    placeLiquidDirectOrder
}