const convert = require('ether-converter');
const axios = require('axios').default;

let currentNormalPrice = null;
let currentFastPrice = null;
let currentMedianPrice = null;
let currentTargetPrice = null;
let currentTransactionPrice = null;
let currentTransactionPriceAvax = null;

const EVERY = 120_000;
const TX_GAS = 53000;

const log = (m) => {
    console.log(`[GasPricer] ${m}`);
};

const median = (arr) => {
    const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

const fetchPriceData = async () => {
    return await axios.get("https://api.debank.com/chain/gas_price_dict_v2?chain=avax").then((response) => {
        return response.data.data;
    })
};

const fetchPrices = async () => {
    const data = await fetchPriceData().catch((e) => {
        log("failed to fetch gas prices");
        console.log(e);
    });

    currentNormalPrice = data.normal.price;
    currentFastPrice = data.fast.price;
    currentMedianPrice = median([currentNormalPrice, currentFastPrice]);
    currentTargetPrice = Math.floor((currentNormalPrice + currentNormalPrice * 0.1));
    currentTransactionPrice = TX_GAS * currentTargetPrice;
    currentTransactionPriceAvax = convert(currentTransactionPrice, 'wei', 'ether');

    log(`
        currentNormalPrice:${currentNormalPrice}
        currentFastPrice:${currentFastPrice}
        currentTargetPrice:${currentTargetPrice}
        currentTransactionPrice:${currentTransactionPriceAvax} AVAX
    `);
};

const interval = setInterval(function() {
    fetchPrices()
}, EVERY);

fetchPrices();

const hasGasPrices = () => {
    if (
        currentNormalPrice == null
        || currentFastPrice == null
        || currentMedianPrice == null
        || currentTargetPrice == null
        || currentTransactionPrice == null
        || currentTransactionPriceAvax == null
    ) {
        return false;
    }

    return true;
};

const getGasPrices = async () => {
    if (!hasGasPrices()) {
        console.log("waiting for gas prices")
        await fetchPrices();   
    }

    return {
        currentNormalPrice,
        currentFastPrice,
        currentMedianPrice,
        currentTargetPrice,
        currentTransactionPrice,
        currentTransactionPriceAvax,
        TX_GAS
    };
};

module.exports = {
    getGasPrices,
    hasGasPrices
};
