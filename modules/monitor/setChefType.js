const { getGasPrices, hasGasPrices } = require('./getGasPrice');

const ChefContract = require("../../contracts/Chef.json");
const Store = require("../Store");

const web3 = require("./shimweb3");

const ORACLE_PRIVATE_KEY = process.env.ORACLE_PRIVATE_KEY;

const account = web3.eth.accounts.privateKeyToAccount(ORACLE_PRIVATE_KEY);
let networkId = null;
let deployedNetwork = null;
let contract = null;
let contractAddress = null;
let TX_GAS = null;

const log = (m) => {
    console.log(`[SetChefType] ${m}`);
};

const failure = (id, extra) => {
    Store.Failure.set(id, extra);
}

const checkBalance = async (min) => {
    const balance = await web3.eth.getBalance(account.address);
    if (balance < min) {
        log("ORACLE DOES NOT HAVE BALANCE");
        return false;
    }
    return true;
};

const setupState = async () => {
    if (TX_GAS == null) TX_GAS = (await getGasPrices()).TX_GAS;
    if (networkId == null) networkId = await web3.eth.net.getId();
    if (deployedNetwork == null) deployedNetwork = ChefContract.networks[networkId];
    if (contractAddress == null) contractAddress = ChefContract.networks[networkId]["address"];
    if (contract == null) contract = await new web3.eth.Contract(ChefContract.abi, deployedNetwork.address);
};

const setChefType = async (tokenId, chefType) => {
    const {currentTargetPrice, currentTransactionPrice} = await getGasPrices();
    await setupState();

    if (!(await checkBalance(currentTransactionPrice))) {
        log("EXITING EARLY");
        return;
    }

    const currentChefType = 
        await contract.methods.getType(tokenId).call()
        .then((currentChefType) => {return Number(currentChefType);})
        .catch((error) => {
            failure(tokenId, `failed to get cheftype`);
            log(`failed to get chefType ${tokenId}`);
            console.log(error);
        });

    if (currentChefType !== 0) {
        if (currentChefType !== chefType) {
            failure(tokenId, "INCORRECT TYPE FOUND");
            log(`TOKEN HAS INCORRECT CHEF TYPE: ${tokenId}`); // should never happen
            return;
        }

        failure(tokenId, "cheftype already set");
        log(`cheftype already set for token: ${tokenId}`);
        return;
    };

    let success = false;
    const encodedTx = contract.methods.setChefType(tokenId, chefType).encodeABI();
    const tx = {
        to: contractAddress,
        data: encodedTx,
        gas: TX_GAS,
        gasPrice: currentTargetPrice
    };

    log(`setting chefType ${chefType} for ${tokenId}`)

    // SET CHEF TYPE //
    await web3.eth.accounts.signTransaction(tx, ORACLE_PRIVATE_KEY).then((signed) => {
        return web3.eth.sendSignedTransaction(signed.rawTransaction);
    }).then(() => {
        success = true;
    }).catch((error) => {
        console.log(error);
        failure(tokenId, "failed to set chefType");
        log(`failed to call Chef.setChefType for token: ${tokenId} with chefType: ${chefType}`);
        success = false;
    });

    if (!success) return success;
    log(`successfully setChefType for token: ${tokenId} with chefType: ${chefType}`);
    return success;
}

const getChefType = async (tokenId) => {
    await setupState();
    return await contract.methods.getType(tokenId).call()
    .then((currentChefType) => {return Number(currentChefType);})
    .catch((error) => {
        failure(tokenId, `failed to get cheftype`);
        log(`failed to get chefType ${tokenId}`);
        console.log(error);
    });
}

module.exports = {setChefType, getChefType, hasGasPrices};
