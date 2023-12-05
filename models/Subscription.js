const { Schema, model } = require("mongoose");

const schema = new Schema({
  tier: {
    type: String,
    required: true
  },
  plans: [{
    duration: {
      type: String,
      enum: ["yearly", "quarterly", "monthly"],
    },
    price: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "USD"
    },
  }],
  features: [{ title: String, subtitle: Array }],
}, {
  timestamps: true
});

const Subscription = model('Subscription', schema);

module.exports = Subscription;