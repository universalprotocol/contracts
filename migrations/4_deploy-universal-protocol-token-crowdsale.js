'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const BigNumber = require('bignumber.js');
const UniversalProtocolToken = artifacts.require('./UniversalProtocolToken');
const UniversalProtocolTokenCrowdsale = artifacts.require('./UniversalProtocolTokenCrowdsale');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, crowdsalePool, crowdsaleOwner, crowdsaleBeneficiary } = decodeAccounts(accounts);

  await deployer.deploy(UniversalProtocolTokenCrowdsale,
    // Owner.
    ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.crowdsaleOwner.${network}`) : crowdsaleOwner,
    // Token wallet.
    ['mainnet', 'ropsten'].includes(network) ? config.get(`wallets.upt.crowdsale.pool.${network}`) : crowdsalePool,
    // Rate.
    config.get('crowdsale.initialRate'),
    // Wallet.
    ['mainnet', 'ropsten'].includes(network) ? config.get(`wallets.upt.crowdsale.beneficiary.${network}`) : crowdsaleBeneficiary,
    // Token address.
    (await UniversalProtocolToken.deployed()).address,
    // Opening time.
    Number(config.get('crowdsale.openingTime')),
    // Closing time.
    Number(config.get('crowdsale.closingTime')),
    // Crowdsale cap.
    new BigNumber(1.949e27).toString(10),
    { from: deployAddress }
  );
};
