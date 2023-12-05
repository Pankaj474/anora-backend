const Subscription = require("../models/Subscription");

exports.getAllSubscriptions = async (req, res) => {
  try {
    let subscriptions = await Subscription.find({});
    res.json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message ? error.message : error
    })
  }
}

exports.updateSubscription = async (req, res) => {
  try {
    let subscriptionId = req.params.id;
    let subscription = await Subscription.findOneAndUpdate({ _id: subscriptionId }, req.body, { new: true});
    res.json({
      success: true,
      status: 'Subscription Updated',
      subscription
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message ? error.message : error
    })
  }
}

exports.createSubscription = (req, res) => {
  Subscription.create({ ...req.body })
    .then(subscription => {
      return res.json({ success: true, subscription })
    })
    .catch(err => {
      console.log(err)
      return res.status(500).json({ success: false, status: "Some error occured!" })
    })
}