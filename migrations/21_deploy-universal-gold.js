'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalGold = artifacts.require('./UniversalGold');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, upxauOwner } = decodeAccounts(accounts);
  const upxauOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upxau.owner.${network}`) : upxauOwner;

  await deployer.deploy(UniversalGold, upxauOwnerAddress, { from: deployAddress });
};
