const {model, Schema} = require("mongoose");

const candleSchema = new Schema({
    timestamp: String,
    open: String,
    high: String,
    low: String,
    close: String,
    volume: String,
    transparent_open: String,
    transparent_high: String,
    transparent_low: String,
    transparent_close: String,
    transparent_volume: String,
    volume_transparency: {
        ab: String,
        A: String,
        B: String,
        C: String,
        D: String
    }
})

const schema = new Schema({
    currency_id: String,
    candle_thirty_days_hourly: [candleSchema],
    candle_thirty_days_daily: [candleSchema],
    candle_one_year: [candleSchema],
    timestamp: Date
}, {
    strict: false
})

const Candle = model("Candle", schema);

module.exports = Candle;
