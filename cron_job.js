const nodeCron = require("node-cron");
const nomics = require("./libraries/Nomics");



function getCandleCurrenciesId() {
    console.log("getCandleCurrenciesId job starts ", Date.now().toString() )

    return nomics.getCandleCurrenciesId()
}

function getThirtyDaysHourlyCandle() {
    console.log("getThirtyDaysHourlyCandle job starts ", Date.now().toString() )
    return nomics.getThirtyDaysHourlyCandle()
}

function getThirtyDaysDailyCandle() {
    console.log("getThirtyDaysDailyCandle job starts ", Date.now().toString() )
    return nomics.getThirtyDaysDailyCandle()
}

function getOneYearDailyCandle() {
    console.log("getOneYearDailyCandle job starts ", Date.now().toString() )
    return nomics.getOneYearDailyCandle()
}

function syncMarketData() {
    console.log("syncMarketData job starts ", Date.now().toString() )
    return nomics.syncMarketData()
}



const options = {
    scheduled: false,
    timezone: "America/New_York"
};


// Schedule a job to run every 1 hour
exports.getCandleCurrenciesId_job = nodeCron.schedule("0 0 */23 * * *", getCandleCurrenciesId, options);

// Schedule a job to run every 1 hour
exports.ThirtyDaysHourly_job = nodeCron.schedule("*/59 * * * *", getThirtyDaysHourlyCandle, options);

// Schedule a job to run every 1 hour
exports.ThirtyDaysDaily_job = nodeCron.schedule("*/59 * * * *", getThirtyDaysDailyCandle, options);

// Schedule a job to run every 1 hour
exports.OneYearDaily_job = nodeCron.schedule("*/59 * * * *", getOneYearDailyCandle, options);

// Schedule a job to run every 2 minutes
exports.syncMarketData_job = nodeCron.schedule("*/2 * * * *", syncMarketData, options);


