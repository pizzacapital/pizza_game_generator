const Web3HttpProvider = require("web3-providers-http");
const Web3WsProvider = require('web3-providers-ws');

const getHttpProvider = () => {
    const options = {
        timeout: 30000, // ms
    };

    return new Web3HttpProvider(process.env.RPC_URI_HTTP, options);
}

const getWsProvider = () => {
    const options = {
        timeout: 30000, // ms
        headers: {
            Authorization: process.env.RPC_AUTH ? process.env.RPC_AUTH : ''
        },
        clientConfig: {
          // Useful to keep a connection alive
          keepalive: true,
          keepaliveInterval: 30000
        },
    
        // Enable auto reconnection
        reconnect: {
            auto: true,
            delay: 5000, // ms
            maxAttempts: 10,
            onTimeout: false
        }
    };

    return new Web3WsProvider(process.env.RPC_URI_WS, options)
}

module.exports = {
    getHttpProvider,
    getWsProvider
}