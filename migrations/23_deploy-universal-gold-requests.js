'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalProtocolToken = artifacts.require('./UniversalProtocolToken');
const UniversalGold = artifacts.require('./UniversalGold');
const UniversalGoldRequestsV0 = artifacts.require('./UniversalGoldRequestsV0');
const UniversalGoldRequestsStorageV0 = artifacts.require('./UniversalGoldRequestsStorageV0');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, upxauFeeBeneficiary, upxauRequestsOwner } = decodeAccounts(accounts);

  await deployer.deploy(UniversalGoldRequestsV0,
    // Owner.
    ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upxau.requestsOwner.${network}`) : upxauRequestsOwner,
    // UPT contract address.
    (await UniversalProtocolToken.deployed()).address,
    // Fee beneficiary.
    ['mainnet', 'ropsten'].includes(network) ? config.get(`wallets.upxau.feeBeneficiary.${network}`) : upxauFeeBeneficiary,
    // Burn fee.
    Number(config.get('upxau.burnFee')),
    // Mint fee.
    Number(config.get('upxau.mintFee')),
    // UPXAU contract address.
    (await UniversalGold.deployed()).address,
    // UPXAU Requests Storage contract address.
    (await UniversalGoldRequestsStorageV0.deployed()).address,
    { from: deployAddress }
  );
};
