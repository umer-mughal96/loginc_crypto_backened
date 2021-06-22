const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExchangeNameSchema = new Schema({
    exchangeName: [{
        name: {
            required: true,
            type: String
        },
        active: {
            required: true,
            type: Boolean,
            default: true,
        }

    }],

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ExchangeName", ExchangeNameSchema);
