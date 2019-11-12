'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalEuro = artifacts.require('./UniversalEuro');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, upeurOwner } = decodeAccounts(accounts);
  const upeurOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upeur.owner.${network}`) : upeurOwner;

  await deployer.deploy(UniversalEuro, upeurOwnerAddress, { from: deployAddress });
};
