const { createCanvas, loadImage } = require("canvas");

const { ChefTypes, GenderTypes } = require("./generator/Constants");

const AssetFetcher = require("./generator/AssetFetcher");

const Store = require("./Store");

const IMAGE_ROOT = process.env.IMAGE_ROOT;
const METADATA_ROOT = process.env.METADATA_ROOT;

const imageFormat = {
    width: 700,
    height: 700
};

const drawingSize = {
    width: 640,
    height: 640
};

const draw = async (ctx, path) => {
    if (path == null) return;
    const image = await loadImage(path);
    ctx.drawImage(image, 30, 30, drawingSize.width, drawingSize.height);
};

const buildMetadata = (id, chefType) => {
    return {
        "description": AssetFetcher.getDescription(chefType), 
        "external_url": `${METADATA_ROOT}/${id}`,
        "image": `${IMAGE_ROOT}/${id}.png`,
        "name": AssetFetcher.getName(chefType),
        "attributes": [
            {
                "trait_type": "Serial",
                "value": id
            },
            {
                "trait_type": "Type",
                "value": AssetFetcher.getName(chefType)
            },
            {
                "trait_type": "PPM",
                "value": AssetFetcher.getPPM(chefType)
            },
            {
                "trait_type": "Generation",
                "value": Number(id) > 10000 ? 1 : 0
            }
         ], 
    };
}

const delay = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, ms);
    })
}

const compose = async (id, chefType, genderType, skinPath, clothesPath, shoesPath, hatPath, hairPath, facialHairPath) => {
    await delay(100)
    const canvas = createCanvas(imageFormat.width, imageFormat.height);
    const ctx = canvas.getContext("2d");

    await draw(ctx, skinPath);
    await draw(ctx, clothesPath);
    if (chefType == ChefTypes.CHEF) await draw(ctx, shoesPath);
    await draw(ctx, hairPath);
    await draw(ctx, hatPath);
    
    if (genderType == GenderTypes.MALE) await draw(ctx, facialHairPath);

    const metaData = buildMetadata(id, chefType);

    // add metadata to store
    await Store.Metadata.set(id, metaData);

    // add image to store
    await Store.Image.set(id, canvas.toDataURL());
};

module.exports = {
    compose
};