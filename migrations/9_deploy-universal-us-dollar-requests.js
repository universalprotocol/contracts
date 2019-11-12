'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalProtocolToken = artifacts.require('./UniversalProtocolToken');
const UniversalUSDollar = artifacts.require('./UniversalUSDollar');
const UniversalUSDollarRequestsV0 = artifacts.require('./UniversalUSDollarRequestsV0');
const UniversalUSDollarRequestsStorageV0 = artifacts.require('./UniversalUSDollarRequestsStorageV0');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, upusdFeeBeneficiary, upusdRequestsOwner } = decodeAccounts(accounts);

  await deployer.deploy(UniversalUSDollarRequestsV0,
    // Owner.
    ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upusd.requestsOwner.${network}`) : upusdRequestsOwner,
    // UPT contract address.
    (await UniversalProtocolToken.deployed()).address,
    // Fee beneficiary.
    ['mainnet', 'ropsten'].includes(network) ? config.get(`wallets.upusd.feeBeneficiary.${network}`) : upusdFeeBeneficiary,
    // Burn fee.
    Number(config.get('upusd.burnFee')),
    // Mint fee.
    Number(config.get('upusd.mintFee')),
    // UPUSD contract address.
    (await UniversalUSDollar.deployed()).address,
    // UPUSD Requests Storage contract address.
    (await UniversalUSDollarRequestsStorageV0.deployed()).address,
    { from: deployAddress }
  );
};
