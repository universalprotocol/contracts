'use strict';

/**
 * Module dependencies.
 */

const { confirm, decodeAccounts } = require('./helper');
const UniversalUSDollar = artifacts.require('./UniversalUSDollar');
const UniversalUSDollarRequestsV0 = artifacts.require('./UniversalUSDollarRequestsV0');
const UniversalUSDollarRequestsStorageV0 = artifacts.require('./UniversalUSDollarRequestsStorageV0');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const {
    upusdOwner,
    upusdRequestsStorageOwner,
    upusdRequestsOwner,
    upusdMintRequester,
    upusdMintFulfiller,
    upusdBurnRequester,
    upusdBurnFulfiller
  } = decodeAccounts(accounts);
  const upusdOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upusd.owner.${network}`) : upusdOwner;
  const upusdRequestsStorageOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upusd.requestsStorageOwner.${network}`) : upusdRequestsStorageOwner;
  const upusdRequestsOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upusd.requestsOwner.${network}`) : upusdRequestsOwner;
  const upusdRequests = await UniversalUSDollarRequestsV0.deployed();
  const upusd = await UniversalUSDollar.deployed();
  const upusdRequestsStorage = await UniversalUSDollarRequestsStorageV0.deployed();

  // Add access of ProxyTokenRequests contract address to the ProxyTokenRequestsStorage contract.
  await confirm(network, 'UPUSD Requests Storage owner', () => upusdRequestsStorage.authorize(upusdRequests.address, { from: upusdRequestsStorageOwnerAddress }));

  // Add ProxyTokenRequests contract address as minter and burner.
  await confirm(network, 'UPUSD owner', async () => {
    await upusd.addBurner(upusdRequests.address, { from: upusdOwnerAddress });
    await upusd.addMinter(upusdRequests.address, { from: upusdOwnerAddress });
  });

  // Add mint requester, mint fulfiller, burn requester and burn fulfiller.
  await confirm(network, 'UPUSD Requests owner', async () => {
    const upusdMintRequesterAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upusd.mint.requester.${network}`) : upusdMintRequester;
    const upusdMintFulfillerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upusd.mint.fulfiller.${network}`) : upusdMintFulfiller;
    const upusdBurnRequesterAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upusd.burn.requester.${network}`) : upusdBurnRequester;
    const upusdBurnFulfillerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upusd.burn.fulfiller.${network}`) : upusdBurnFulfiller;

    await upusdRequests.authorizeMintRequester(upusdMintRequesterAddress, { from: upusdRequestsOwnerAddress });
    await upusdRequests.authorizeMintFulfiller(upusdMintFulfillerAddress, { from: upusdRequestsOwnerAddress });
    await upusdRequests.authorizeBurnRequester(upusdBurnRequesterAddress, { from: upusdRequestsOwnerAddress });
    await upusdRequests.authorizeBurnFulfiller(upusdBurnFulfillerAddress, { from: upusdRequestsOwnerAddress });
  });
};
