const rand = require("./Rand");
const { ChefTypes, GenderTypes } = require("./Constants");

const rollChefType = (generator) => {
    const roll = rand.intBetween(generator, 1, 100);
    return roll <= 95 ? ChefTypes.CHEF : ChefTypes.MASTER_CHEF;
};

const rollGenderType = (generator) => {
    const roll = rand.intBetween(generator, 1, 100);
    return roll <= 51 ? GenderTypes.MALE : GenderTypes.FEMALE;
};

module.exports = {
    rollChefType,
    rollGenderType
};
