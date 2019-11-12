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
  const { crowdsaleOwner, whitelister } = decodeAccounts(accounts);
  const crowdsale = await UniversalProtocolTokenCrowdsale.deployed();
  const crowdsaleOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.crowdsaleOwner.${network}`) : crowdsaleOwner;
  const whitelisterAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.crowdsaleWhitelister.${network}`) : whitelister;

  await confirm(network, 'crowdsale owner', async () => {
    await crowdsale.addCapper(whitelisterAddress, { from: crowdsaleOwnerAddress });
    await crowdsale.addWhitelistAdmin(whitelisterAddress, { from: crowdsaleOwnerAddress });
  });
};
