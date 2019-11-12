'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalBitcoin = artifacts.require('./UniversalBitcoin');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, upbtcOwner } = decodeAccounts(accounts);
  const upbtcOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upbtc.owner.${network}`) : upbtcOwner;

  await deployer.deploy(UniversalBitcoin, upbtcOwnerAddress, { from: deployAddress });
};
