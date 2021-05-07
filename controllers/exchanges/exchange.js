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
    } else {
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
      if (exchangeName == "Binance") {
        binanceConnection(exchangeInfo);
        return res
          .status(200)
          .json({ success: true, msg: "Added Successfully" });
      }
      if (exchangeName == "Binance US") {
        binanceUsConnection(exchangeInfo);
        return res
          .status(200)
          .json({ success: true, msg: "Added Successfully" });
      }
      if (exchangeName == "Bitpanda pro") {
        bitpandaProConnection(exchangeInfo);
        return res
          .status(200)
          .json({ success: true, msg: "Added Successfully" });
      }
      if (exchangeName == "Bitstamp") {
        bitstampConnection(exchangeInfo);
        return res
          .status(200)
          .json({ success: true, msg: "Added Successfully" });
      }
      if (exchangeName == "Coinbase | Pro") {
        coinbaseProConnection(exchangeInfo);
        return res
          .status(200)
          .json({ success: true, msg: "Added Successfully" });
      }
      if (exchangeName == "HitBTC") {
        hitbtcConnection(exchangeInfo);
        return res
          .status(200)
          .json({ success: true, msg: "Added Successfully" });
      }
      if (exchangeName == "Kreken") {
        krekenConnection(exchangeInfo);
        return res
          .status(200)
          .json({ success: true, msg: "Added Successfully" });
      }
      if (exchangeName == "Liquid") {
        liquidConnection(exchangeInfo);
        return res
          .status(200)
          .json({ success: true, msg: "Added Successfully" });
      }
      if (exchangeName == "Okex") {
        okexConnection(exchangeInfo);
        return res
          .status(200)
          .json({ success: true, msg: "Added Successfully" });
      }
      if (exchangeName == "Poloniex") {
        poloniexConnection(exchangeInfo);
        return res
          .status(200)
          .json({ success: true, msg: "Added Successfully" });
      }

      res.status(400).json({ success: false, msg: "Wrong Exchange" });
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 9 ~ connectExchange ~ error",
      error
    );
  }
};

const binanceConnection = async (exchangeData) => {
  try {
    return await createExchange(exchangeData);
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 61 ~ binanceConnection ~ error",
      error
    );
  }
};

const binanceUsConnection = async (exchangeData) => {
  try {
    return await createExchange(exchangeData);
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 61 ~ binanceConnection ~ error",
      error
    );
  }
};
const bitpandaProConnection = async (exchangeData) => {
  try {
    return await createExchange(exchangeData);
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 61 ~ binanceConnection ~ error",
      error
    );
  }
};
const bitstampConnection = async (exchangeData) => {
  try {
    return await createExchange(exchangeData);
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 61 ~ binanceConnection ~ error",
      error
    );
  }
};
const coinbaseProConnection = async (exchangeData) => {
  try {
    return await createExchange(exchangeData);
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 61 ~ binanceConnection ~ error",
      error
    );
  }
};
const hitbtcConnection = async (exchangeData) => {
  try {
    return await createExchange(exchangeData);
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 61 ~ binanceConnection ~ error",
      error
    );
  }
};
const krekenConnection = async (exchangeData) => {
  try {
    return await createExchange(exchangeData);
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 61 ~ binanceConnection ~ error",
      error
    );
  }
};
const liquidConnection = async (exchangeData) => {
  try {
    return await createExchange(exchangeData);
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 61 ~ binanceConnection ~ error",
      error
    );
  }
};
const okexConnection = async (exchangeData) => {
  try {
    return await createExchange(exchangeData);
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 61 ~ binanceConnection ~ error",
      error
    );
  }
};
const poloniexConnection = async (exchangeData) => {
  try {
    return await createExchange(exchangeData);
  } catch (error) {
    console.log(
      "🚀 ~ file: exchange.js ~ line 61 ~ binanceConnection ~ error",
      error
    );
  }
};

module.exports = { connectExchange };
