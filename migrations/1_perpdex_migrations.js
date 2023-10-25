const PerpetualDex = artifacts.require("PerpetualDex");

// Constructor variables can be declared here
const USDC_ADDRESS = "0xf9c5e4f6e627201ab2d6fb6391239738cf4bdcf9"; 

module.exports = function (deployer) {
    deployer.deploy(PerpetualDex, USDC_ADDRESS);
}