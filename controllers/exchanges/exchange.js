const { getExchange, createExchange } = require("../../services/exchange");

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

    const exchange = await getExchange(req.user.id);
    const findExchangeWithSameName =
      exchange &&
      exchange.exchanges.find((obj) => obj.exchangeName == exchangeName);

    if (findExchangeWithSameName) {
      return res
        .status(400)
        .json({ success: false, msg: "You wont add same exchange twice" });
    } else if (
      !findExchangeWithSameName &&
      exchange &&
      requiredExchanges.includes(exchangeName)
    ) {
      let newExchangeInfo = {
        apiKey,
        secretKey,
        exchangeName,
      };
      exchange.exchanges.unshift(newExchangeInfo);
      await exchange.save();
      return res
        .status(200)
        .json({ success: true, msg: "Additional Exchange Added" });
    } else if (requiredExchanges.includes(exchangeName)) {
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
      await createExchange(exchangeInfo);
      return res.status(200).json({ success: true, msg: "Added Successfully" });
    } else {
      return res.status(400).json({ success: false, msg: "Wrong Exchange" });
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 9 ~ connectExchange ~ error",
      error
    );
  }
};

module.exports = { connectExchange };
