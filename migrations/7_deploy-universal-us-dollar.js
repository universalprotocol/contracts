'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalUSDollar = artifacts.require('./UniversalUSDollar');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, upusdOwner } = decodeAccounts(accounts);
  const upusdOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upusd.owner.${network}`) : upusdOwner;

  await deployer.deploy(UniversalUSDollar, upusdOwnerAddress, { from: deployAddress });
};
