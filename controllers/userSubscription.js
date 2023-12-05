
exports.subscribe = (req, res) => {
    let { plan } = req

    switch (plan) {
        case "stripe":

            break;
        case "paypal":

            break;

        default:
            return res.status(406).json({success:false, status: "Please select a valid payment method!"})
            break;
    }
}

const createPaypalOrder = (amount, user) => {

}

const createStripeIntent = (amount, user) => {

}
