'use strict';

/**
 * Module dependencies.
 */

const { confirm, decodeAccounts } = require('./helper');
const BigNumber = require('bignumber.js');
const UniversalProtocolToken = artifacts.require('./UniversalProtocolToken');
const UniversalProtocolTokenCrowdsale = artifacts.require('./UniversalProtocolTokenCrowdsale');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { crowdsalePool } = decodeAccounts(accounts);
  const token = await UniversalProtocolToken.deployed();
  const { address: crowdsaleAddress } = await UniversalProtocolTokenCrowdsale.deployed();
  const crowdsalePoolAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`wallets.upt.crowdsale.pool.${network}`) : crowdsalePool;

  await confirm(network, 'crowdsale pool', () => token.increaseAllowance(crowdsaleAddress, new BigNumber(0.3e27).toString(10), { from: crowdsalePoolAddress }));
};
