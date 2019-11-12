'use strict';

/**
 * Module dependencies.
 */

const { confirm, decodeAccounts } = require('./helper');
const UniversalProtocolTokenCrowdsale = artifacts.require('./UniversalProtocolTokenCrowdsale');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { crowdsaleOwner } = decodeAccounts(accounts);
  const crowdsale = await UniversalProtocolTokenCrowdsale.deployed();
  const crowdsaleOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.crowdsaleOwner.${network}`) : crowdsaleOwner;

  await confirm(network, 'crowdsale owner', async () => {
    await crowdsale.setClosingTime(config.get('crowdsale.postpones')[0], { from: crowdsaleOwnerAddress });
  });
};
