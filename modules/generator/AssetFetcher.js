const Rand = require('./Rand');
const TraitMap = require("./TraitMap");
const MetadataMap = require("./MetadataMap");

const FEMALE = "Female";
const MALE = "Male";
const MAIN = "MAIN";
const GOLD = "GOLD";

const genderMap = {
    "FEMALE": FEMALE,
    "MALE": MALE
};

const chefTypeMap = {
    "CHEF": MAIN,
    "MASTER CHEF": GOLD
};

// IMAGE

const getRandomItem = (generator, array, canBeNull) => {
    if (canBeNull) {
        const rand = Rand.intBetween(generator, 1, array.length+1);
        return rand == array.length+1 ? null : array[rand-1];
    }

    const rand = Rand.intBetween(generator, 1, array.length);
    return array[rand-1];
};

const imageFetcher = (root, hasGender, hasGold, canBeNull=false) => {
    let items;

    return (generator, chefType, genderType) => {
        if (hasGender && hasGold) {
            items = TraitMap[root][genderMap[genderType]][chefTypeMap[chefType]];
        }

        if (hasGender && !hasGold) {
            items = TraitMap[root][genderMap[genderType]][MAIN];
        }
        
        if (!hasGender && hasGold) {
            items = TraitMap[root][chefTypeMap[chefType]];
        }

        if (!hasGender && !hasGold) {
            items = TraitMap[root][MAIN];
        }

        const item = getRandomItem(generator, items, canBeNull);
        return item == null ? null : item["path"];
    };
};

// METADATA

const metaDataFetcher = (root) => {
    return (chefType) => {
        return MetadataMap[root][chefTypeMap[chefType]];
    }
};

// imageFetcher = (root, hasGender, hasGold) =>
module.exports = {
    getSkinPath: imageFetcher("Skin", true, true),
    getClothesPath: imageFetcher("Clothes", false, true),
    getShoesPath: imageFetcher("Shoes", false, false),
    getHatPath: imageFetcher("Hats", false, true, true),
    getHairPath: imageFetcher("Hair", true, true),
    getFacialHairPath: imageFetcher("Facial Hair", false, true),
    getName: metaDataFetcher("Name"),
    getPPM: metaDataFetcher("PPM"),
    getDescription: metaDataFetcher("Description"),
};
