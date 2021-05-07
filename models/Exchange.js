const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExchangeSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  exchanges: [
    {
      exchangeName: {
        type: String,
        required: true,
      },
      apiKey: {
        type: String,
        required: true,
      },
      secretKey: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Exchange", ExchangeSchema);
