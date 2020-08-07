'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalGoldRequestsStorageV0 = artifacts.require('./UniversalGoldRequestsStorageV0');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, upxauRequestsStorageOwner } = decodeAccounts(accounts);
  const upxauRequestsStorageOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upxau.requestsStorageOwner.${network}`) : upxauRequestsStorageOwner;

  await deployer.deploy(UniversalGoldRequestsStorageV0, upxauRequestsStorageOwnerAddress, { from: deployAddress });
};
