const {model, Schema} = require("mongoose");

const intervalSchema = new Schema({
    volume: Number,
    price_change: Number,
    price_change_pct: Number,
    volume_change: Number,
    volume_change_pct: Number,
    market_cap_change: Number,
    market_cap_change_pct: Number
})

const schema = new Schema({
    currency_id: String,
    rank: Number,
    "1h": intervalSchema,
    "1d": intervalSchema,
    "7d": intervalSchema,
    "30d": intervalSchema,
    "365d": intervalSchema,
    "ytd": intervalSchema
}, {
    strict: false
})

const Currency = model("Currency", schema);

module.exports = Currency;
