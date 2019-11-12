'use strict';

/**
 * Module dependencies.
 */

const { decodeAccounts } = require('./helper');
const BigNumber = require('bignumber.js');
const UniversalProtocolToken = artifacts.require('./UniversalProtocolToken.sol');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const { crowdsalePool, deployAddress, ecosystem, partners, stakeholders, treasury } = decodeAccounts(accounts);
  const token = await UniversalProtocolToken.deployed();
  const crowdsalePoolAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`wallets.upt.crowdsale.pool.${network}`) : crowdsalePool;
  const ecosystemAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`wallets.upt.ecosystem.${network}`) : ecosystem;
  const partnersAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`wallets.upt.partners.${network}`) : partners;
  const stakeholdersAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`wallets.upt.stakeholders.${network}`) : stakeholders;
  const treasuryAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`wallets.upt.treasury.${network}`) : treasury;

  /**
   * By the whitepaper:
   * ▶ 5,400,000,000 Universal Protocol Alliance Partners
   * ▶ 0,351,250,000 Stakeholders
   * ▶ 0,300,000,000 Ecosystem Partners
   * ▶ 1,999,750,000 Treasury
   * ▶ 1,949,000,000 Token Sale Purchases
   */
  await token.transfer(partnersAddress, new BigNumber(5.4e27).toString(10), { from: deployAddress });
  await token.transfer(stakeholdersAddress, new BigNumber(0.35125e27).toString(10), { from: deployAddress });
  await token.transfer(ecosystemAddress, new BigNumber(0.3e27).toString(10), { from: deployAddress });
  await token.transfer(treasuryAddress, new BigNumber(1.99975e27).toString(10), { from: deployAddress });
  await token.transfer(crowdsalePoolAddress, new BigNumber(1.949e27).toString(10), { from: deployAddress });
};
