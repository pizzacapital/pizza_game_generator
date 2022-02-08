const Rand = require("./generator/Rand");
const TraitGenerator = require("./generator/TraitGenerator");
const AssetFetcher = require("./generator/AssetFetcher");
const Composer = require("./Composer");
    
const RAND_SEED_BASE = process.env.RAND_SEED_BASE;

const build = (tokenId) => {
    const generator = Rand.getGenerator(RAND_SEED_BASE, tokenId);
    
    const chefType = TraitGenerator.rollChefType(generator);
    const genderType = TraitGenerator.rollGenderType(generator);
    const skinPath = AssetFetcher.getSkinPath(generator, chefType, genderType);
    const clothesPath = AssetFetcher.getClothesPath(generator, chefType, genderType);
    const shoesPath = AssetFetcher.getShoesPath(generator, chefType, genderType);
    const hatPath = AssetFetcher.getHatPath(generator, chefType, genderType);
    const hairPath = AssetFetcher.getHairPath(generator, chefType, genderType);
    const facialHairPath = AssetFetcher.getFacialHairPath(generator, chefType, genderType);

    return {
        tokenId,
        chefType,
        genderType,
        skinPath,
        clothesPath,
        shoesPath,
        hatPath,
        hairPath,
        facialHairPath
    };
};

const compose = async (chef) => {
    const {
        tokenId,
        chefType,
        genderType,
        skinPath,
        clothesPath,
        shoesPath,
        hatPath,
        hairPath,
        facialHairPath
    } = chef;

    await Composer.compose(tokenId, chefType, genderType, skinPath, clothesPath, shoesPath, hatPath, hairPath, facialHairPath);
}

module.exports = {
    build,
    compose
};
