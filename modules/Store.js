const Keyv = require('keyv');

const MONGODB_ADDRESS = process.env.MONGODB_ADDRESS;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

const MONGO_CONNECTION_STRING = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_ADDRESS}:27017/${process.env.ENVIRONMENT}?authSource=admin&w=1`;

const METADATA_NAMESPACE = `chef_metadata`;
const IMAGE_NAMESPACE = `chef_image`;
const STATIC_METADATA_NAMESPACE = `static_metadata`;
const STATIC_IMAGE_NAMESPACE = `static_image`;

const FAILURE_NAMESPACE = `error`;

const Metadata = new Keyv(MONGO_CONNECTION_STRING, {namespace: METADATA_NAMESPACE, serialize: (value) => JSON.stringify(value, null, 2), deserialize: JSON.parse});
Metadata.on('error', err => console.log('Metadata Connection Error', err));

const Image = new Keyv(MONGO_CONNECTION_STRING, {namespace: IMAGE_NAMESPACE});
Image.on('error', err => console.log('Image Connection Error', err));

const StaticMetadata = new Keyv(MONGO_CONNECTION_STRING, {namespace: STATIC_METADATA_NAMESPACE, serialize: (value) => JSON.stringify(value, null, 2), deserialize: JSON.parse});
StaticMetadata.on('error', err => console.log('StaticMetadata Connection Error', err));

const StaticImage = new Keyv(MONGO_CONNECTION_STRING, {namespace: STATIC_IMAGE_NAMESPACE});
StaticImage.on('error', err => console.log('StaticImage Connection Error', err));

const Failure = new Keyv(MONGO_CONNECTION_STRING, {namespace: FAILURE_NAMESPACE});
Failure.on('error', err => console.log('Failure Connection Error', err));

module.exports = {
    Metadata,
    Image,
    Failure,
    StaticMetadata,
    StaticImage
};
