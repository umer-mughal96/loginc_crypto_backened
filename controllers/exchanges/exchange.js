const { getExchange, createExchange, deleteExchange } = require("../../services/exchange");

const connectExchange = async (req, res, next) => {
  try {
    let requiredExchanges = [
      "Binance",
      "Binance US",
      "Bitpanda pro",
      "Bitstamp",
      "Coinbase | Pro",
      "HitBTC",
      "Kreken",
      "Liquid",
      "Okex",
      "Poloniex",
    ];
    const { apiKey, secretKey, exchangeName } = req.body;
    
    if (!apiKey || !secretKey || !exchangeName) {
      return res.status(400).json({
        success: false,
        msg: "Bad Request",
      });
    }
    console.log("This is new");
    const exchange = await getExchange(req.user.id);
    const findExchangeWithSameName =
      exchange &&
      exchange.exchanges.find((obj) => obj.exchangeName == exchangeName);

    if (findExchangeWithSameName) {
      console.log('Same Exchange Happen')
      return res
        .status(400)
        .json({ success: false, msg: "You wont add same exchange twice" });
    } else if (
      !findExchangeWithSameName &&
      exchange &&
      requiredExchanges.includes(exchangeName)
    ) {
      console.log('Unsifht New Exchange')
      let newExchangeInfo = {
        apiKey,
        secretKey,
        exchangeName,
      };
      console.log(exchange)
      exchange.exchanges.unshift(newExchangeInfo);
      await exchange.save();
      return res.status(200).json({
        success: true,
        msg: "Additional Exchange Added",
        exchanges: exchange,
      });
    } else if (requiredExchanges.includes(exchangeName)) {
      console.log('ADD new Exchange')
      const exchangeInfo = {
        userId: req.user.id,
        exchanges: [
          {
            apiKey,
            secretKey,
            exchangeName,
          },
        ],
      };
      let exchanges = await createExchange(exchangeInfo);
      return res
        .status(200)
        .json({ success: true, msg: "Added Successfully", exchanges });
    } else {
      return res.status(400).json({ success: false, msg: "Wrong Exchange" });
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 72 ~ connectExchange ~ error",
      error
    );
  }
};

const getExchanges = async (req, res, next) => {
  console.log("get exchanges called")
  try {
    const exchanges = await getExchange(req.user.id);
    return res.status(200).json({ success: true, exchanges });
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 72 ~ connectExchange ~ error",
      error
    );
  }
};



const deleteUserExchange = async (req, res, next) => {
  try {
    await deleteExchange(req.body.id , req.body.exchangeId);
    return res.status(200).json({ success: true, msg : "Successfully Deleted" });
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 72 ~ connectExchange ~ error",
      error
    );
  }
};

module.exports = { connectExchange, getExchanges,deleteUserExchange };
