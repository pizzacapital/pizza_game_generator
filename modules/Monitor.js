const ChefBuilder = require("./ChefBuilder");
const { ChefTypeId } = require("./generator/Constants");
const ChefContract = require("../contracts/Chef.json");

const { enqueueSetChefType } = require("./monitor/chefTypeSetter");

const Store = require("./Store");

const ORACLE_PRIVATE_KEY = process.env.ORACLE_PRIVATE_KEY;

const web3 = require("./monitor/shimweb3");

let networkId = null;
let deployedNetwork = null;
let contract = null;

const setupState = async () => {
    if (networkId == null) networkId = await web3.eth.net.getId();
    if (deployedNetwork == null) deployedNetwork = ChefContract.networks[networkId];
    if (contract == null) contract = await new web3.eth.Contract(ChefContract.abi, deployedNetwork.address);
};

const account = web3.eth.accounts.privateKeyToAccount(ORACLE_PRIVATE_KEY);

const log = (m) => {
    console.log(`[monitor] ${m}`);
};

const failure = (id, extra) => {
    Store.Failure.set(id, extra);
}

const onChefCreated = async (event) => {
    const tokenId = event.returnValues.tokenId;
    // DON'T POPULATE PROMOTIONAL
    if (tokenId <= 50) {
        return;
    }
    log(`chef ${tokenId} was minted`);
    log(`building chef ${tokenId}`);
    const chef = ChefBuilder.build(tokenId);

    log(`composing chef ${tokenId}`);
    await ChefBuilder.compose(chef)
    .then(() => {
        log(`composed chef ${tokenId}`);
    })
    .catch((error) => {
        log(`failed to compose data for token: ${tokenId}`);
        failure(tokenId, "failed to compose data");
    }); 

    enqueueSetChefType(tokenId, ChefTypeId[chef.chefType]);
};

const runMonitor = async () => {
    log("starting monitor");
    await setupState();
    log(`monitor oracle address: ${account.address}`)
    log(`contract oracle address: ${await contract.methods.chefTypeOracleAddress.call().call()}`)

    contract.events.onChefCreated().on('data', event => onChefCreated(event));
};

module.exports = {
    runMonitor
};
