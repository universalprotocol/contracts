'use strict';

/**
 * Module dependencies.
 */

const { confirm, decodeAccounts } = require('./helper');
const UniversalBitcoin = artifacts.require('./UniversalBitcoin');
const UniversalBitcoinRequestsV0 = artifacts.require('./UniversalBitcoinRequestsV0');
const UniversalBitcoinRequestsStorageV0 = artifacts.require('./UniversalBitcoinRequestsStorageV0');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const {
    upbtcOwner,
    upbtcRequestsStorageOwner,
    upbtcRequestsOwner,
    upbtcMintRequester,
    upbtcMintFulfiller,
    upbtcBurnRequester,
    upbtcBurnFulfiller
  } = decodeAccounts(accounts);
  const upbtcOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upbtc.owner.${network}`) : upbtcOwner;
  const upbtcRequestsStorageOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upbtc.requestsStorageOwner.${network}`) : upbtcRequestsStorageOwner;
  const upbtcRequestsOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upbtc.requestsOwner.${network}`) : upbtcRequestsOwner;
  const upbtcRequests = await UniversalBitcoinRequestsV0.deployed();
  const upbtc = await UniversalBitcoin.deployed();
  const upbtcRequestsStorage = await UniversalBitcoinRequestsStorageV0.deployed();

  // Add access of ProxyTokenRequests contract address to the ProxyTokenRequestsStorage contract.
  await confirm(network, 'UPBTC Requests Storage owner', () => upbtcRequestsStorage.authorize(upbtcRequests.address, { from: upbtcRequestsStorageOwnerAddress }));

  // Add ProxyTokenRequests contract address as minter and burner.
  await confirm(network, 'UPBTC owner', async () => {
    await upbtc.addBurner(upbtcRequests.address, { from: upbtcOwnerAddress });
    await upbtc.addMinter(upbtcRequests.address, { from: upbtcOwnerAddress });
  });

  // Add mint requester, mint fulfiller, burn requester and burn fulfiller.
  await confirm(network, 'UPBTC Requests owner', async () => {
    const upbtcMintRequesterAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upbtc.mint.requester.${network}`) : upbtcMintRequester;
    const upbtcMintFulfillerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upbtc.mint.fulfiller.${network}`) : upbtcMintFulfiller;
    const upbtcBurnRequesterAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upbtc.burn.requester.${network}`) : upbtcBurnRequester;
    const upbtcBurnFulfillerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upbtc.burn.fulfiller.${network}`) : upbtcBurnFulfiller;

    await upbtcRequests.authorizeMintRequester(upbtcMintRequesterAddress, { from: upbtcRequestsOwnerAddress });
    await upbtcRequests.authorizeMintFulfiller(upbtcMintFulfillerAddress, { from: upbtcRequestsOwnerAddress });
    await upbtcRequests.authorizeBurnRequester(upbtcBurnRequesterAddress, { from: upbtcRequestsOwnerAddress });
    await upbtcRequests.authorizeBurnFulfiller(upbtcBurnFulfillerAddress, { from: upbtcRequestsOwnerAddress });
  });
};
