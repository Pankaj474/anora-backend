var express = require('express');
var router = express.Router();
const MarketData = require("../models/MarketData");

router.use(express.json());


router.get('/', function(req, res){
  MarketData.find({})
  .then((marketdata) => {
        console.log('found', marketdata)
        //res.statusCode = 200;
        //res.setHeader('Content-Type', 'application/json');
        res.send(marketdata);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
