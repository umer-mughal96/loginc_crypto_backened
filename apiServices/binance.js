let curTime = Number(new Date().getTime()).toFixed(0);
let timestamp = "timestamp=" + curTime; // TIME STAMP
const apiSecret =
  "wGDjxZpwgQjFByEMHRT6J3K869UqMdj1V56RVcKHVCn64nDgVLol7IA2cCnZM7EU"; //SECRET KEY OF EXCHANGE

//CREATE SIGNATURE

const signature = (timestamp) => {
  return crypto.createHmac("sha256", apiSecret).update(timestamp).digest("hex");
};

const getCoins = () => {
  try {
    let signedSignature = signature(timestamp);

    let config = {
      headers: {
        "Content-Type": "application/json",
        "X-MBX-APIKEY":
          "axpHg2O3KVpC9fPJ7mObpORqkiIe49REjrCYU91CjTJOQ5toFRks6zY9C0clJ4Ui",
      },
    };

    return await axios.get(
      `https://api.binance.com/sapi/v1/capital/config/getall?${timestamp}&signature=${signedSignature}`,
      config
    );
  } catch (error) {
    console.log("🚀 ~ file: binance.js ~ line 30 ~ getCoins ~ error", error);
  }
};








module.exports = {
    getCoins,
};
