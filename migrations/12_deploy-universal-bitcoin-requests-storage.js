'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalBitcoinRequestsStorageV0 = artifacts.require('./UniversalBitcoinRequestsStorageV0');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, upbtcRequestsStorageOwner } = decodeAccounts(accounts);
  const upbtcRequestsStorageOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upbtc.requestsStorageOwner.${network}`) : upbtcRequestsStorageOwner;

  await deployer.deploy(UniversalBitcoinRequestsStorageV0, upbtcRequestsStorageOwnerAddress, { from: deployAddress });
};
