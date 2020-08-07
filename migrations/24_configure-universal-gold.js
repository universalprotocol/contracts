'use strict';

/**
 * Module dependencies.
 */

const { confirm, decodeAccounts } = require('./helper');
const UniversalGold = artifacts.require('./UniversalGold');
const UniversalGoldRequestsV0 = artifacts.require('./UniversalGoldRequestsV0');
const UniversalGoldRequestsStorageV0 = artifacts.require('./UniversalGoldRequestsStorageV0');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const {
    upxauOwner,
    upxauRequestsStorageOwner,
    upxauRequestsOwner,
    upxauMintRequester,
    upxauMintFulfiller,
    upxauBurnRequester,
    upxauBurnFulfiller
  } = decodeAccounts(accounts);
  const upxauOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upxau.owner.${network}`) : upxauOwner;
  const upxauRequestsStorageOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upxau.requestsStorageOwner.${network}`) : upxauRequestsStorageOwner;
  const upxauRequestsOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upxau.requestsOwner.${network}`) : upxauRequestsOwner;
  const upxauRequests = await UniversalGoldRequestsV0.deployed();
  const upxau = await UniversalGold.deployed();
  const upxauRequestsStorage = await UniversalGoldRequestsStorageV0.deployed();

  // Add access of ProxyTokenRequests contract address to the ProxyTokenRequestsStorage contract.
  await confirm(network, 'UPXAU Requests Storage owner', () => upxauRequestsStorage.authorize(upxauRequests.address, { from: upxauRequestsStorageOwnerAddress }));

  // Add ProxyTokenRequests contract address as minter and burner.
  await confirm(network, 'UPXAU owner', async () => {
    await upxau.addBurner(upxauRequests.address, { from: upxauOwnerAddress });
    await upxau.addMinter(upxauRequests.address, { from: upxauOwnerAddress });
  });

  // Add mint requester, mint fulfiller, burn requester and burn fulfiller.
  await confirm(network, 'UPXAU Requests owner', async () => {
    const upxauMintRequesterAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upxau.mint.requester.${network}`) : upxauMintRequester;
    const upxauMintFulfillerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upxau.mint.fulfiller.${network}`) : upxauMintFulfiller;
    const upxauBurnRequesterAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upxau.burn.requester.${network}`) : upxauBurnRequester;
    const upxauBurnFulfillerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upxau.burn.fulfiller.${network}`) : upxauBurnFulfiller;

    await upxauRequests.authorizeMintRequester(upxauMintRequesterAddress, { from: upxauRequestsOwnerAddress });
    await upxauRequests.authorizeMintFulfiller(upxauMintFulfillerAddress, { from: upxauRequestsOwnerAddress });
    await upxauRequests.authorizeBurnRequester(upxauBurnRequesterAddress, { from: upxauRequestsOwnerAddress });
    await upxauRequests.authorizeBurnFulfiller(upxauBurnFulfillerAddress, { from: upxauRequestsOwnerAddress });
  });
};
