'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalUSDollarRequestsStorageV0 = artifacts.require('./UniversalUSDollarRequestsStorageV0');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, upusdRequestsStorageOwner } = decodeAccounts(accounts);
  const upusdRequestsStorageOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upusd.requestsStorageOwner.${network}`) : upusdRequestsStorageOwner;

  await deployer.deploy(UniversalUSDollarRequestsStorageV0, upusdRequestsStorageOwnerAddress, { from: deployAddress });
};
