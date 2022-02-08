const genFactory = require('random-seed');

function getGenerator(baseSeed, tokenId) {
    const seed = (BigInt(baseSeed) << BigInt(tokenId)).toString().slice(0, 77);
    return genFactory.create(seed);
}

function intBetween(generator, min, max) {
    return generator.intBetween(min, max);
}

module.exports = {
    getGenerator,
    intBetween
};
