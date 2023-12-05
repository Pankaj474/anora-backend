const {model, Schema} = require("mongoose");

const schema = new Schema({
    currency_id: String
}, {
    strict: false
})

const Exchange = model("Exchange", schema);

module.exports = Exchange;
