const WebSocket = require("ws");
const queryString = require("query-string");

const marketDataServer = new WebSocket.Server({
    noServer: true,
    path: "/market_data",
});