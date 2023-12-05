const { model, Schema } = require("mongoose");

let purchaseSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: "Subscription"
    },
    paymentMethod: {
        type: String,
        enum: ["paypal", "stripe"],
        required: true
    },
    amount:{
        type: Number,
        required: true
    }
},
    {
        timestamps: true
    })

let SubscriptionPurchase = model("SubscriptionPurchase", purchaseSchema)
module.exports = SubscriptionPurchase;