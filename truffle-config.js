require('dotenv').config();
const { MNEMONIC, PRIVATE_KEY } = process.env;
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  networks: {

    xinfin: {
      provider: () => new HDWalletProvider(
        MNEMONIC,
        'https://erpc.xinfin.network'),
      network_id: 50,
      gasLimit: 6721975,
      confirmation: 2,
    },

    apothem: {
      provider: () => new HDWalletProvider(
        MNEMONIC,
        'https://erpc.apothem.network'),
      network_id: 51,
      gasLimit: 6721975,
      confirmation: 2,
    },

    goerli: {
      provider: () => new HDWalletProvider(
        MNEMONIC,
        'https://goerli.infura.io/v3/5e7c0198b2064e4fa54dd0563a3eb238'),
      network_id: 5,
      gasLimit: 750000,
      confirmation: 2,
    }
  },

  mocha: {
  },

  compilers: {
    solc: {
      version: "0.8.17",
    }
  },
}