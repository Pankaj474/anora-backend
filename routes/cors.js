const cors = require('cors');

const whitelist = [
    'http://localhost:3000',
    /\.localhost\.3000$/,
    'http://localhost:3300',
    /\.localhost\.3300$/,
    "*"
];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req)
    console.log('cors ',req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1 ) {
        corsOptions = {
            "origin": req.header('Origin'),
            "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
            "allowedHeaders": "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, *",
            "exposedHeaders": "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
            "preflightContinue": false,
            "credentials": true,
            "optionsSuccessStatus": 204
        };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
