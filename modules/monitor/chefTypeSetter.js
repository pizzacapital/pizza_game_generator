require("dotenv").config();

const Queue = require('../Queue');
const {setChefType, hasGasPrices} = require("./setChefType");

const DELAY = 100;

const delay = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, ms);
    })
}

const getTransactionPromise = (id, chefType) => {
    return function() {
        return delay(DELAY).then(() => {
            return setChefType(id, chefType);
        });
    };
}

const enqueueSetChefType = (id, chefType) => {
    Queue.enqueue(getTransactionPromise(id, chefType));
}

module.exports = {
    enqueueSetChefType,
    hasGasPrices
};