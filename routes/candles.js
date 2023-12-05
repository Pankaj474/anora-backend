const {Router} = require("express");
const Candle = require("../models/Candle");
const nomics = require("../libraries/Nomics");

const router = Router();

router.get("/get", async (req, res) => {
    const {interval, currency, date_from, date_to} = req.query;
    const {data: candles} = await nomics.getCandles({
        currency,
        interval,
        ...(date_from ? {start: date_from} : {}),
        ...(date_to ? {end: date_to} : {})
    });
    res.json(candles);
});

exports.candlesRouter = router;
