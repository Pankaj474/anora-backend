const {model, Schema} = require("mongoose");


const marketDataSchema = new Schema({ 
    
    market_cap: String,
    btc_price: String,
    One_day_volume_change: String,
    One_day_market_cap_change_pct: String,
    One_day_volume_change_pct: String,

    btc_One_day_market_cap_dominance: String,
    eth_One_day_market_cap_dominance: String,
    One_day_btc_price_change_pc: String,
    eth_gas_fee: String

 });

const MarketData = model("MarketData", marketDataSchema);

module.exports = MarketData;