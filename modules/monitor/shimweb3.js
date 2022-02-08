const Web3 = require('web3')

// This can also be the node module debug https://www.npmjs.com/package/debug
const debug = (...messages) => console.log(...messages)

const web3 = new Web3()

/**
 * Refreshes provider instance and attaches even handlers to it
 */
function refreshProvider(web3Obj, providerUrl) {
  let retries = 0

  function retry(event) {
    if (event) {
      debug('Web3 provider disconnected or errored.')
      retries += 1

      if (retries > 5) {
        debug(`Max retries of 5 exceeding: ${retries} times tried`)
        return setTimeout(refreshProvider, 5000)
      }
    } else {
      debug(`Reconnecting web3 provider ${config.eth.provider}`)
      refreshProvider(web3Obj, providerUrl)
    }

    return null
  }

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

  const provider = new Web3.providers.WebsocketProvider(providerUrl, options)
  
  provider.on('end', () => retry())
  provider.on('error', () => retry())

  web3Obj.setProvider(provider)

  debug('New Web3 provider initiated')

  return provider
}


refreshProvider(web3, process.env.RPC_URI_WS)



module.exports = web3