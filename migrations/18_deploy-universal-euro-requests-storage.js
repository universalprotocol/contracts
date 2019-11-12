'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalEuroRequestsStorageV0 = artifacts.require('./UniversalEuroRequestsStorageV0');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, upeurRequestsStorageOwner } = decodeAccounts(accounts);
  const upeurRequestsStorageOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upeur.requestsStorageOwner.${network}`) : upeurRequestsStorageOwner;

  await deployer.deploy(UniversalEuroRequestsStorageV0, upeurRequestsStorageOwnerAddress, { from: deployAddress });
};
