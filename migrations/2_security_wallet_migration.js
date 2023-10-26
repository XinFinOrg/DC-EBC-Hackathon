const LegacyWallet = artifacts.require("LegacyWallet");

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
    let LegacyWalletInstance = await deployer.deploy(LegacyWallet, [accounts[0],accounts[1],accounts[2],accounts[3],accounts[4]], 90000, { from: accounts[0], gas: 5000000});
  });
};

