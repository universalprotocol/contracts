'use strict';

/**
 * Module dependencies.
 */

const { confirm, decodeAccounts } = require('./helper');
const UniversalEuro = artifacts.require('./UniversalEuro');
const UniversalEuroRequestsV0 = artifacts.require('./UniversalEuroRequestsV0');
const UniversalEuroRequestsStorageV0 = artifacts.require('./UniversalEuroRequestsStorageV0');
const config = require('config');

/**
 * Exports.
 */

module.exports = async (deployer, network, accounts) => {
  const {
    upeurOwner,
    upeurRequestsStorageOwner,
    upeurRequestsOwner,
    upeurMintRequester,
    upeurMintFulfiller,
    upeurBurnRequester,
    upeurBurnFulfiller
  } = decodeAccounts(accounts);
  const upeurOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upeur.owner.${network}`) : upeurOwner;
  const upeurRequestsStorageOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upeur.requestsStorageOwner.${network}`) : upeurRequestsStorageOwner;
  const upeurRequestsOwnerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upeur.requestsOwner.${network}`) : upeurRequestsOwner;
  const upeurRequests = await UniversalEuroRequestsV0.deployed();
  const upeur = await UniversalEuro.deployed();
  const upeurRequestsStorage = await UniversalEuroRequestsStorageV0.deployed();

  // Add access of ProxyTokenRequests contract address to the ProxyTokenRequestsStorage contract.
  await confirm(network, 'UPEUR Requests Storage owner', () => upeurRequestsStorage.authorize(upeurRequests.address, { from: upeurRequestsStorageOwnerAddress }));

  // Add ProxyTokenRequests contract address as minter and burner.
  await confirm(network, 'UPEUR owner', async () => {
    await upeur.addBurner(upeurRequests.address, { from: upeurOwnerAddress });
    await upeur.addMinter(upeurRequests.address, { from: upeurOwnerAddress });
  });

  // Add mint requester, mint fulfiller, burn requester and burn fulfiller.
  await confirm(network, 'UPEUR Requests owner', async () => {
    const upeurMintRequesterAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upeur.mint.requester.${network}`) : upeurMintRequester;
    const upeurMintFulfillerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upeur.mint.fulfiller.${network}`) : upeurMintFulfiller;
    const upeurBurnRequesterAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upeur.burn.requester.${network}`) : upeurBurnRequester;
    const upeurBurnFulfillerAddress = ['mainnet', 'ropsten'].includes(network) ? config.get(`operators.upeur.burn.fulfiller.${network}`) : upeurBurnFulfiller;

    await upeurRequests.authorizeMintRequester(upeurMintRequesterAddress, { from: upeurRequestsOwnerAddress });
    await upeurRequests.authorizeMintFulfiller(upeurMintFulfillerAddress, { from: upeurRequestsOwnerAddress });
    await upeurRequests.authorizeBurnRequester(upeurBurnRequesterAddress, { from: upeurRequestsOwnerAddress });
    await upeurRequests.authorizeBurnFulfiller(upeurBurnFulfillerAddress, { from: upeurRequestsOwnerAddress });
  });
};
