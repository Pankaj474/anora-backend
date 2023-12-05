const WebSocket = require("ws");
const queryString = require("query-string");

const Currency = require("../models/Currency");
const Candle = require("../models/Candle");

const candlesServer = new WebSocket.Server({
    noServer: true,
    path: "/candles",
});

const currencyServer = new WebSocket.Server({
    noServer: true,
    path: "/currency",
});

candlesServer.on("connection", function connection(websocketConnection) {

    websocketConnection.on("message", (message) => {

        try {
            const parsedMessage = JSON.parse(message);
            console.log('message ',parsedMessage);
      
            const syncSingleCurrency = async function() {

                candlesServer.clients.forEach(async client => {

                    if(client.readyState === WebSocket.OPEN) {
                        var promises = [];
                        promises.push(Candle.findOne({currency_id: parsedMessage.currency_id}).lean().exec());
                        promises.push(Candle.findOne({candle_id : parsedMessage.candle_id}).lean().exec());

                        Promise.all(promises).then(results => {
                            
                            client.send(JSON.stringify({ currency: results[0], candle: results[1] }));
                        
                        }).catch(err => {
                            console.log(err)
                        })

                        //const query = await Currency.findOne({currency_id: parsedMessage.currency_id})
                        
                    }
                })
            }
            syncSingleCurrency();
            setInterval(syncSingleCurrency, 10000)
        }
        catch(e) {
            console.log("Something went wrong: ", e.message)
        }
    });
    
    websocketConnection.on('close', function() {
        console.log('clear interval')
        clearInterval();
    });

});

currencyServer.on("connection", function connection(websocketConnection) {

    websocketConnection.on("message", (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log('message ',parsedMessage);

            let page = parsedMessage.page;
            const documentLimit = 100;
            const sort_by = "rank", order = "asc";
            let offset = page > 0 ? ( ( page - 1 ) * documentLimit) : 0;

            var syncNomicsCurrencies = async function(){
                
                currencyServer.clients.forEach(async (client) => {
        
                    if(client.readyState === WebSocket.OPEN) {

                        console.log('10 sec')
                        console.log('page ',page)
                        console.log('offset ',offset)

                        const query = await Currency.find()
                        .sort({[sort_by]: order})
                        .skip(offset)
                        .limit(Number(documentLimit));
                        

                        const currencies = query;

                        client.send(JSON.stringify({data: currencies}))
                    }
                })
            }
            syncNomicsCurrencies()
            setInterval(syncNomicsCurrencies, 10000);   
            
        }
        catch(e) {
            console.log("Something went wrong: ", e.message)
        }
        
    });

    websocketConnection.on('close', function close() {
        clearInterval();
    });

});



exports.websockets = async (expressServer) => {
  

  expressServer.on("upgrade", (request, socket, head) => {

    //const [_path, params] = request?.url?.split("?");
    const pathname = queryString.parse(request.url);
    console.log('Pathname ',pathname)

    if (Object.hasOwnProperty.bind(pathname)('/candles')) {
        candlesServer.handleUpgrade(request, socket, head, (websocket) => {
            candlesServer.emit("connection", websocket, request);
        });
    } else if (Object.hasOwnProperty.bind(pathname)('/currency')) {
        currencyServer.handleUpgrade(request, socket, head, (websocket) => {
            currencyServer.emit("connection", websocket, request);
        });
    } else {
        socket.destroy();
    }
  });  

};