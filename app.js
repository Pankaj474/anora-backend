require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {cors} = require('./routes/cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/adminUser');
const {currencyRouter} = require("./routes/currency");
const {candlesRouter} = require("./routes/candles");
const {articlesRouter} = require("./routes/article");
const nomics = require("./libraries/Nomics");
const cronJob = require('./cron_job');
const subscriptionsRouter = require('./routes/subscriptions')
const gradeRouter = require('./routes/grades')
const marketDataRouter = require('./routes/market_data');


// Initialize mongoose object
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {

    console.log('Successfully connected to MongoDB Atlas!');


    // App types 
    if(process.env.APP_TYPE === 'cron') {
        cronJob.getCandleCurrenciesId_job.start();
        cronJob.ThirtyDaysHourly_job.start()
        cronJob.OneYearDaily_job.start();
        cronJob.ThirtyDaysDaily_job.start();
        cronJob.syncMarketData_job.start();
    }

    if(process.env.APP_TYPE === 'syncCurrencies') {
        nomics.syncCurrencies();
    }
        
    //nomics.getCandleCurrenciesId();
    //nomics.getThirtyDaysHourlyCandle();
    //nomics.getThirtyDaysDailyCandle();e
    //nomics.getOneYearDailyCandleTT();
    nomics.syncMarketData();
    
}).catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(cors);
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);
app.use('/currency', currencyRouter);
app.use('/candle', candlesRouter);
app.use('/article', articlesRouter);
app.use('/subscription', subscriptionsRouter)
app.use('/grades', gradeRouter)
app.use('/market_data', marketDataRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
