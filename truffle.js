'use strict';

/**
 * Module dependencies.
 */

const LedgerWalletProvider = require('truffle-ledger-provider');
const config = require('config');

/**
 * Exports.
 */

module.exports = {
  networks: {
    coverage: {
      gas: 100000000,
      host: '127.0.0.1',
      network_id: '*',
      port: 8555
    },
    development: {
      confirmations: 0,
      host: '127.0.0.1',
      network_id: '1547047525792',
      port: 8545
    },
    mainnet: {
      confirmations: 2,
      gasPrice: 5 * 1e9,
      network_id: '1',
      provider: () => new LedgerWalletProvider({
        accountsLength: 1,
        accountsOffset: 0,
        askConfirm: false,
        networkId: 1,
        path: `44'/60'/0'/0/0`
      }, `https://mainnet.infura.io/v3/${config.get('infura.apiKey')}`, true)
    },
    ropsten: {
      gas: 100000,
      gasPrice: 20 * 1e9,
      network_id: '3',
      provider: () => new LedgerWalletProvider({
        accountsLength: 1,
        accountsOffset: 0,
        askConfirm: false,
        networkId: 3,
        path: `44'/1'/0'/0/0`
      }, `https://ropsten.infura.io/v3/${config.get('infura.apiKey')}`, true)
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
