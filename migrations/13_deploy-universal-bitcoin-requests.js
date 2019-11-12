'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalProtocolToken = artifacts.require('./UniversalProtocolToken');
const UniversalBitcoin = artifacts.require('./UniversalBitcoin');
const UniversalBitcoinRequestsV0 = artifacts.require('./UniversalBitcoinRequestsV0');
const UniversalBitcoinRequestsStorageV0 = artifacts.require('./UniversalBitcoinRequestsStorageV0');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, upbtcFeeBeneficiary, upbtcRequestsOwner } = decodeAccounts(accounts);

  await deployer.deploy(UniversalBitcoinRequestsV0,
    // Owner.
    ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upbtc.requestsOwner.${network}`) : upbtcRequestsOwner,
    // UPT contract address.
    (await UniversalProtocolToken.deployed()).address,
    // Fee beneficiary.
    ['mainnet', 'ropsten'].includes(network) ? config.get(`wallets.upbtc.feeBeneficiary.${network}`) : upbtcFeeBeneficiary,
    // Burn fee.
    Number(config.get('upbtc.burnFee')),
    // Mint fee.
    Number(config.get('upbtc.mintFee')),
    // UPBTC contract address.
    (await UniversalBitcoin.deployed()).address,
    // UPBTC Requests Storage contract address.
    (await UniversalBitcoinRequestsStorageV0.deployed()).address,
    { from: deployAddress }
  );
};
