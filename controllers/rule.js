const { validationResult } = require("express-validator");
const User = require("../models/User");
const Exchange = require("../models/Exchange");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/jwt");
const bcrypt = require("bcrypt");
const cron = require("node-cron");
const sendEmailToUser = require("../utils/email");
const Token = require("../models/Token");
const randomstring = require("randomstring");
const authServices = require("../services/auth");
const { placeOkexDirectOrder } = require("../apiServices/okex");
const {placeBinanceDirectOrder} = require("../apiServices/binance");
const { placeBitstampDirectOrder } = require("../apiServices/bitstamp");
const { placeBitpandaproDirectOrder } = require("../apiServices/bitpandapro");
const {placehitBTCDirectOrder} = require("../apiServices/hitbtc");
const {placeCoinbaseDirectOrder} = require("../apiServices/coinbase");


//POST        @NEW RULE
//API         @  '/new '

const newRule = async (req, res, next) => {
  // console.log("In rule OK")
  console.log(req.user.id);
  const place = req.body.place;
  const requestExchange = req.body.exchange;
  let finalExchange;
  const result = await Exchange.findOne({userId : req.user.id});
  // console.log("This is"+result.exchanges[0]);

  const credentials = result.exchanges;

  // credentials.forEach(ex);

  credentials.forEach(element => {
    if(element.exchangeName === requestExchange)
    {
      finalExchange = element;
      // console.log(finalExchange);
    }
    
  });
  if(finalExchange == '' || finalExchange == null)
  {
    res.status(500).json({ success: false, error: "Exchange not found" });
  }
  
  // console.log(credentials);



  // res.sendStatus(200);
  try {
    if(place === 'Direct')
    {
     const orderResult =  newDirectOrder(req.body, finalExchange);
    }
    else if(place === 'Time')
    {

    }
  } catch (error) {
    console.log(error);
  }








  // try {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ success: false, error: errors.array() });
  //   }
  //   const { email, password , firstName , lastName } = req.body;
  //   let findUser = await User.findOne({ email });
  //   if(findUser){

  //   }
  //   res.status(201).json({ success: true, msg: "Successfully registered!" });
  //   // job.start();
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ success: false, error: err.message });
  // }
};

const newDirectOrder = (req, credentials) => {
  const exchange = req.exchange;
  // console.log(credentials, exchange);
  if(exchange == "Okex")
  {
    console.log("In new Direct order okex");
    return placeOkexDirectOrder(req, credentials);
  }
  else if(exchange === "Binance")
  {
    return placeBinanceDirectOrder(req, credentials); // Only send respective exchange credentials not all
    // return placeBinanceDirectOrder(req, credentials);
  }
  else if(exchange === "Bitstamp") //Only send respective exchange credentials not all
  {
    return placeBitstampDirectOrder(req, credentials);
  }
  else if(exchange === "Bitpandapro") //Only send respective exchange credentials not all
  {
    // return placeBitstampDirectOrder(req, credentials);
    return placeBitpandaproDirectOrder(req, credentials);
  }
  else if(exchange === "HitBTC")
  {
    
    return placehitBTCDirectOrder(req, credentials);
  }
  else if(exchange === "Coinbase")
  {
    return placeCoinbaseDirectOrder(req, credentials);
  }
  
  

}

//POST        @LOGIN USER
//API         @  '/signin'

const userLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid Credentials !" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };

    const token = await generateToken(payload);
    const loginUser = await User.findOne({ email }).select("-password");
    res.status(200).json({ success: true, loginUser, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//POST        @FORGOT PASSWORD
//API         @  '/forgotpassword'

const forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid Email !" });
    }

    let forgetCode = randomstring.generate({
      length: 6,
      charset: "numeric",
    });
    let userToken = new Token({
      userId: user.id,
      token: forgetCode,
    });
    await sendEmailToUser(user, forgetCode);
    await userToken.save();
    res.status(200).json({ success: true, msg: "Send link to your email" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//POST        @VERIFY TOKEN
//API         @  '/verify'



module.exports = {
  
  userLogin,
  forgotPassword,
  newRule
  
};
