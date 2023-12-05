const { Router } = require("express");
const Currency = require("../models/Currency");

const router = Router();

router.get("/get", async (req, res) => {
  const {
    limit = 100,
    page = 1,
    id,
    price_min,
    price_max,
    sort_by = "rank",
    order = "asc",
    average_min,
    average_max,
    market_cap_min,
    market_cap_max,
    circulating_supply_min,
    circulating_supply_max,
    interval,
    volume_min,
    volume_max,
    keyword,
  } = req.query;

  const offset = limit * (page - 1);
  if (keyword) {
    var query = Currency.find({
      rank: { $exists: true },
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { currency_id: { $regex: keyword, $options: "i" } },
      ],
    });
  } else {
    var query = Currency.find({ rank: { $exists: true } });
  }

  //   const query = Currency.find({ rank: { $exists: true } });

  if (id) query.where({ currency_id: id });

  if (price_min) query.where({ price: { $gte: price_min } });

  if (price_max) query.where({ price: { $lte: price_max } });

  if (market_cap_min) query.where({ market_cap: { $gte: market_cap_min } });

  if (market_cap_max) query.where({ market_cap: { $lte: market_cap_max } });

  if (interval) {
    if (volume_min)
      query.where({ [`${interval}.volume`]: { $gte: volume_min } });

    if (volume_max)
      query.where({ [`${interval}.volume`]: { $lte: volume_min } });
  }

  if (circulating_supply_min && circulating_supply_max)
    query.where({
      circulating_supply: {
        $gte: circulating_supply_min,
        $lte: circulating_supply_max,
      },
    });

  query.sort({ [sort_by]: order });

  const total = await Currency.find().merge(query).countDocuments();
  query.limit(Number(limit)).skip(offset);
  const currencies = await query;
  res.json({ total, limit, data: currencies });
});

exports.currencyRouter = router;
