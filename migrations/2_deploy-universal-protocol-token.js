'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const UniversalProtocolToken = artifacts.require('./UniversalProtocolToken.sol');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { deployAddress } = decodeAccounts(accounts);

  await deployer.deploy(UniversalProtocolToken, deployAddress, { from: deployAddress });
};
