const axios = require("axios");
const Currency = require("../models/Currency");
const Candle = require("../models/Candle");
const Exchange = require("../models/Exchange");
const MarketData = require("../models/MarketData");
const moment = require('moment');

class Nomics {

    baseUrl = "https://api.nomics.com/v1/";
    key = process.env.NOMICS_KEY
    eth_gas_fee_key = process.env.ETH_GAS_FEE_KEY

    getEtherGasFee(params) {
        try{
            return axios.get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle`, {
                params: {
                    apikey: this.eth_gas_fee_key,
                    ...params
                }
            })
        }
        catch(e) {
            console.log("Something went wrong: ",e.message)
        }
    }

    getBTCMarketCapDominance(params) {
        try{
            return axios.get(`${this.baseUrl}currencies/ticker`, {
                params: {
                    key: this.key,
                    ids: `BTC,ETH`,
                    ...params
                }
            })
        }
        catch(e) {
            console.log("Something went wrong: ",e.message)
        }
    }

    getMarketCap(params) {
        try{
            return axios.get(`${this.baseUrl}global-ticker`, {
                params: {
                    key: this.key,
                    ...params
                }
            })
        }
        catch(e) {
            console.log("Something went wrong: ",e.message)
        }
    }

    getCurrencies(params) {
        try{
            return axios.get(`${this.baseUrl}currencies/ticker?interval=1h,1d,7d,30d,365d,ytd`, {
                params: {
                    key: this.key,
                    ...params
                }
            })
        }
        catch(e) {
            console.log("Something went wrong: ",e.message)
        }
    }

    getCandles(params) {
        try{
            return axios.get(`${this.baseUrl}candles`, {
                params: {
                    key: this.key,
                    ...params
                }
            })
        }
        catch(e) {
            console.log("Something went wrong: ",e.message)
        }
    }

    getExchange(params) {
        try{
            return axios.get(`${this.baseUrl}exchange-rates`, {
                params: {
                    key: this.key,
                    ...params
                }
            })
        }
        catch(e) {
            console.log("Something went wrong: ",e.message)
        }
    }

    async syncCurrencies({page = 1} = {}) {
        console.log(`Getting Currencies Page: ${page}`);
        const {data: currencies} = await this.getCurrencies({
            "per-page": 100,
            "interval": "1h,1d,7d,30d,365d,ytd",
            page
        });
        console.log(`Got ${currencies.length} Currencies`);
        console.log(`Importing Currencies`);
        await Promise.all(currencies.forEach(async ({id, ...data}) => {
            let currency = await Currency.findOne({currency_id: id});
            if (!currency)
                currency = new Currency({
                    currency_id: id
                });
            Object.entries(data).forEach(([key, value]) => currency.set(key, value))
            await currency.save();
            return currency;
        }))
        console.log(`Imported ${currencies.length} Currencies`);
        return this.syncCurrencies({page: currencies.length ? page + 1 : 1})
    }



    async getCandleCurrenciesId({page = 1} = {}) {
        console.log(`Getting Currencies Page: ${page}`);
        const {data: currencies} = await this.getCurrencies({
            "per-page": 100,
            "interval": "1h,1d,7d,30d,365d,ytd",
            page
        });
        console.log(`Got ${currencies.length} Currencies`);
        console.log(`Importing Currencies`);

        await Promise.all(currencies.forEach(async (currency) => {
                           
            let candle = await Candle.findOne({currency_id: currency.id});
            if (!candle)
                candle = new Candle({
                    currency_id: currency.id,
                });
                await candle.save();
                return console.log('saved new candle ',candle);
        }))
        .catch(e => console.log(e))
        console.log(`Imported ${currencies.length} Currencies`);
        if(currencies.length != 0)
            return this.getCandleCurrenciesId({page: currencies.length ? page + 1 : 1})
        else
            return console.log("Get candle currencies ID finito");

    }

    async getThirtyDaysHourlyCandle({page = 1} = {}) {

        const documentLimit = 100;
        const sort_by = "currency_id", order = "asc";
        let offset = page > 0 ? ( ( page - 1 ) * documentLimit) : 0;

        Candle.find()
        .sort({[sort_by]: order})
        .skip(offset)
        .limit(Number(documentLimit))
        .then((query) => {

            query.forEach(async currency => {

                try{

                    // Call 30days candle by 1 hour interval for each currency ID
                    const { data: candles_30_1hr } = await this.getCandles({
                        "interval": `1h`,
                        "currency": currency.currency_id,
                    });
                
                    await candles_30_1hr.forEach(async (candleData) => {
                        
                        Candle.findOne({currency_id: currency.currency_id})
                        .then((candle) => {  
                            console.log('Candle ID ', candle.currency_id);
                            console.log('Candle data ', candleData);
                            candle.candle_thirty_days_hourly.push(candleData)

                            console.log('Pushed candle data');
                            candle.save();

                        })
                        .catch((error) => {
                            console.log("error ", error)
                        })
                    })
                }
                catch(e) {
                    console.log("Something went wrong: ",e.message)
                }
                //console.log(`Queried ${query.length} Currencies`);
                if(query.length != 0)
                    return this.getThirtyDaysHourlyCandle({page: query.length ? page + 1 : 1})
                else
                    return console.log('Currencies finito')
            })
        })
        .catch(err => console.log(err))
    }



    async getThirtyDaysDailyCandle({page = 1} = {}) {

        const documentLimit = 100;
        const sort_by = "currency_id", order = "asc";
        let offset = page > 0 ? ( ( page - 1 ) * documentLimit) : 0;

        Candle.find()
        .sort({[sort_by]: order})
        .skip(offset)
        .limit(Number(documentLimit))
        .then((query) => {

            query.forEach(async currency => {

                var start_30_1d = moment().subtract(30, 'd').utcOffset(5).format();

                try{
                    // Call 30days candle by 1 day interval for each currency ID
                    const {data: candles_30_1d } = await this.getCandles({
                        "interval": `1d`,
                        "currency": currency.currency_id,
                        "start": start_30_1d,
                    });
                    await candles_30_1d.forEach(async (candleData) => {
                        
                        Candle.findOne({currency_id: currency.currency_id})
                        .then((candle) => {

                            candle.candle_thirty_days_daily.push(candleData)
                            console.log('Pushed daily candle data');
                            candle.save();

                        })
                        .catch((error) => {
                            console.log("error ", error)
                        })
                    })
                }
                catch(e) {
                    console.log('Something went wrong ',e.message)
                }
                //console.log(`Queried ${query.length} Currencies`);
                if(query.length != 0)
                    return this.getThirtyDaysDailyCandle({page: query.length ? page + 1 : 1})
                else
                    return console.log('Currencies finito')
            })
        })
        .catch(err => console.log(err))
    }


    async getOneYearDailyCandle({page = 1} = {}) {

        const documentLimit = 100;
        //const sort_by = "rank", order = "desc";
        let offset = page > 0 ? ( ( page - 1 ) * documentLimit) : 0;

        Candle.find()
        .sort({currency_id: 'asc'})
        .skip(offset)
        .limit(Number(documentLimit))
        .then((query) => {

            query.forEach(async currency => {

                var start_1_year = moment().subtract(1, 'y').utcOffset(5).format();

                try{
                    // Call 1 year candle by 1 day interval for each currency ID
                    const {data: candles_1yr } = await this.getCandles({
                        "interval": `1d`,
                        "currency": currency.currency_id,
                        "start": start_1_year,
                    });

                    await candles_1yr.forEach(async (candleData) => {


                        Candle.findOne({currency_id: currency.currency_id})
                        .then((candle) => {

                            candle.candle_one_year.push(candleData)
                            console.log('Pushed yearly candle data');
                            candle.save();

                        })
                        .catch((error) => {
                            console.log("error ", error)
                        });

                    })
                }
                catch(e) {
                    console.log("Something went wrong: ",e.message)
                }
                //console.log(`Queried ${query.length} Currencies`);
                if(query.length != 0)
                    return this.getOneYearDailyCandle({page: query.length ? page + 1 : 1})
                else
                    return console.log('Currencies finito')
            })
        })
        .catch(err => console.log(err))
    }



    async getOneYearDailyCandleT() {
        
        var start_1_year = moment().subtract(1, 'y').utcOffset(5).format();

        try{

            // Call 1 year candle by 1 day interval for each currency ID
            const {data: candles_1yr } = await this.getCandles({
                "interval": `1d`,
                "currency": "ADA",
                //"start": start_1_year,
            });

            await candles_1yr.forEach(async (candleData) => {
                
                Candle.findOne({currency_id: "ADA"})
                .then((candle) => {  
                    console.log('candle data ',candleData)
                    candle.candle_thirty_days_hourly.push(candleData)
                    const result = candle.candle_thirty_days_hourly;
                    console.log('Pushed candle data', result);
                    candle.save();

                })
                .catch((error) => {
                    console.log("error ", error)
                })
            })

            console.log(`Queried ${candles_1yr.length} candles`);
            return console.log("Job completed!");
        }
        catch(e) {
            console.log("Something went wrong: ",e.message)
        }
            
    }

    async getOneYearDailyCandleTT() {
        
        // Call 1 year candle by 1 day interval for each currency ID
            
        Candle.findOne({currency_id: "ADA"})
        .then((candle) => {  
            
            const result = candle.candle_thirty_days_hourly;
            console.log('Get candle data', result);
            console.log(`Queried ${result.length} candles`);

        })
        .catch((error) => {
            console.log("error ", error)
        })

        return;

    }


    /*async syncCandles({interval = 1, currency} = {}) {
        const {data: candles} = await this.getCandles({
            "interval": `${interval}h`,
            currency
        });
        console.log(`Got ${candles.length} Candles`);
        console.log(`Importing Candles`);
        await Promise.all(candles.map(async ({id, ...data}) => {
            let candle = await Candle.findOne({candle_id: id});
            if (!candle)
                candle = new Candle({
                    candle_id: id
                });
            Object.entries(data).forEach(([key, value]) => candle.set(key, value))
            await candle.save();
            return candle;
        }))
        console.log(`Imported ${candles.length} Candles`);
        return this.syncCandles({interval, currency})
    }*/


    async syncMarketData() {

        console.log('syncing dong start')

        try {
            let promises = [];

            const { data: marketCap } = await this.getMarketCap();
            promises.push(marketCap);
            
            const { data: btcMarketDominance } = await this.getBTCMarketCapDominance();
            promises.push(btcMarketDominance);

            const { data: etherGas } = await this.getEtherGasFee();
            promises.push(etherGas);

            Promise.all(promises).then(results => {
                let marketcapData = results[0];

                let btc_MarketcapDominance = results[1][0];

                let eth_MarketDominance = results[1][1];
                let gasfee = results[2];

                MarketData.find({}).then((data) => {
                    //console.log('data ',data[0])
                    MarketData.findOne({_id: data[0]._id}, function(err, doc){

                        if(err) console.log(err)

                        doc.market_cap = marketcapData.market_cap,
                        doc.One_day_volume_change = marketcapData["1d"].volume_change,
                        doc.One_day_market_cap_change_pct = marketcapData["1d"].market_cap_change_pct * 100,
                        doc.One_day_volume_change_pct = marketcapData["1d"].volume_change_pct * 100,
        
                        doc.One_day_btc_price_change_pc = btc_MarketcapDominance["1d"].price_change_pct,
                        doc.btc_price = btc_MarketcapDominance.price,
                        doc.btc_One_day_market_cap_dominance = parseFloat(btc_MarketcapDominance.market_cap_dominance) * 100,
                        doc.eth_One_day_market_cap_dominance = parseFloat(eth_MarketDominance.market_cap_dominance) * 100,
                        doc.eth_gas_fee = gasfee.result.SafeGasPrice

                        doc.save();
                    })
                })

                
            })
            .catch(error => console.log(error))
            
        }
        catch(e) {
            console.log("Something went wrong: ",e.message)
        }
    }



    async syncExchange() {
        const {data: exchange} = await this.getExchange();
        console.log(`Got ${exchange.length} Exchange`);
        console.log(`Importing Exchange`);
        await Promise.all(exchange.map(async ({id, ...data}) => {
            let exchange;
            exchange = new Exchange();
            Object.entries(data).forEach(([key, value]) => exchange.set(key, value))
            await exchange.save();
            return exchange;
        }))
        console.log(`Imported ${exchange.length} Exchange Rates`);
        return this.syncExchange();
    }
}

const nomics = new Nomics();

module.exports = nomics;