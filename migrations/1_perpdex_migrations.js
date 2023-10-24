const PerpetualDex = artifacts.require("PerpetualDex");

// Constructor variables can be declared here
const USDC_ADDRESS = "0xd55d4a6b2be09a42fb89a51a2a861c09cb26d6c0"; 

module.exports = function (deployer) {
    // deploy perpetual DEX with USDC as collateral
    deployer.deploy(PerpetualDex, [USDC_ADDRESS]);
}