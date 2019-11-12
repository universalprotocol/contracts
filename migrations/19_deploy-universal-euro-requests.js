'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalProtocolToken = artifacts.require('./UniversalProtocolToken');
const UniversalEuro = artifacts.require('./UniversalEuro');
const UniversalEuroRequestsV0 = artifacts.require('./UniversalEuroRequestsV0');
const UniversalEuroRequestsStorageV0 = artifacts.require('./UniversalEuroRequestsStorageV0');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress, upeurFeeBeneficiary, upeurRequestsOwner } = decodeAccounts(accounts);

  await deployer.deploy(UniversalEuroRequestsV0,
    // Owner.
    ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upeur.requestsOwner.${network}`) : upeurRequestsOwner,
    // UPT contract address.
    (await UniversalProtocolToken.deployed()).address,
    // Fee beneficiary.
    ['mainnet', 'ropsten'].includes(network) ? config.get(`wallets.upeur.feeBeneficiary.${network}`) : upeurFeeBeneficiary,
    // Burn fee.
    Number(config.get('upeur.burnFee')),
    // Mint fee.
    Number(config.get('upeur.mintFee')),
    // UPEUR contract address.
    (await UniversalEuro.deployed()).address,
    // UPEUR Requests Storage contract address.
    (await UniversalEuroRequestsStorageV0.deployed()).address,
    { from: deployAddress }
  );
};
