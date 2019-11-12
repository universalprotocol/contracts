'use strict';

/**
 * Module dependencies.
 */

const ProxyToken = artifacts.require('ProxyToken');
const ProxyTokenRegistryV0 = artifacts.require('ProxyTokenRegistryV0');
const ProxyTokenRequestsV0 = artifacts.require('ProxyTokenRequestsV0');
const ProxyTokenRequestsStorageV0 = artifacts.require('ProxyTokenRequestsStorageV0');
const UniversalProtocolToken = artifacts.require('UniversalProtocolToken');
const assertRevert = require('../../helpers/assertRevert');

/**
 * `ProxyTokenRegistryV0` tests.
 */

contract('ProxyTokenRegistryV0', ([, owner, nonOwnerAddress, randomAddress, deployer]) => {
  describe('registers a proxy token', () => {
    beforeEach(async function() {
      this.upt = await UniversalProtocolToken.new(owner, { from: deployer });
      this.token1 = await ProxyToken.new(owner, 'UniversalProxyBitcoin', 'UPBTC', 0, 100, { from: deployer });
      this.tokenRequestsStorage1 = await ProxyTokenRequestsStorageV0.new(owner, { from: deployer });
      this.tokenRequests1 = await ProxyTokenRequestsV0.new(owner, this.upt.address, owner, 0, 0, this.token1.address, this.tokenRequestsStorage1.address, { from: deployer });

      await this.tokenRequestsStorage1.authorize(this.tokenRequests1.address, { from: owner });

      this.token2 = await ProxyToken.new(owner, 'UniversalProxyBitcoin', 'UPBTC2', 0, 100, { from: deployer });
      this.tokenRequestsStorage2 = await ProxyTokenRequestsStorageV0.new(owner, { from: deployer });
      this.tokenRequests2 = await ProxyTokenRequestsV0.new(owner, this.upt.address, owner, 0, 0, this.token2.address, this.tokenRequestsStorage2.address, { from: deployer });

      await this.tokenRequestsStorage2.authorize(this.tokenRequests2.address, { from: owner });

      this.registry = await ProxyTokenRegistryV0.new(owner, { from: deployer });
    });

    describe('that uses an invalid token address', () => {
      it('reverts', async function() {
        await assertRevert(this.registry.registerProxyToken(randomAddress, this.tokenRequestsStorage1.address, { from: owner }));
      });

      it('reverts ', async function() {
        await assertRevert(this.registry.setProxyTokenRequests(randomAddress, this.tokenRequestsStorage1.address, { from: owner }), 'Cannot find the registered token address');
      });
    });

    it('that has not been registered', async function() {
      const { logs } = await this.registry.registerProxyToken(
        this.token1.address,
        this.tokenRequests1.address,
        { from: owner });

      assert.equal(logs.length, 1);
      assert.equal(logs[0].event, 'ProxyTokenRegistered');
      assert.equal(logs[0].args.tokenName, 'UniversalProxyBitcoin');

      const tokenAddress = await this.registry.getToken('UniversalProxyBitcoin', { from: owner });

      assert.equal(tokenAddress, this.token1.address);
    });

    it('only with a unique name', async function() {
      const { logs } = await this.registry.registerProxyToken(
        this.token1.address,
        this.tokenRequests1.address,
        { from: owner });

      assert.equal(logs.length, 1);
      assert.equal(logs[0].event, 'ProxyTokenRegistered');
      assert.equal(logs[0].args.tokenName, 'UniversalProxyBitcoin');

      await assertRevert(this.registry.registerProxyToken(
        this.token2.address,
        this.tokenRequests2.address,
        { from: owner }), 'Token address already taken');

      const tokenName = await this.registry.getTokenName(this.token1.address, { from: owner });

      assert.equal(tokenName, 'UniversalProxyBitcoin');
    });

    it('unless the sender is not the owner', async function() {
      const { logs } = await this.registry.registerProxyToken(
        this.token1.address,
        this.tokenRequests1.address,
        { from: owner });

      assert.equal(logs.length, 1);
      assert.equal(logs[0].event, 'ProxyTokenRegistered');
      assert.equal(logs[0].args.tokenName, 'UniversalProxyBitcoin');

      await assertRevert(this.registry.registerProxyToken(
        this.token1.address,
        this.tokenRequests1.address,
        { from: nonOwnerAddress }));
      await assertRevert(this.registry.registerProxyToken(
        this.token1.address,
        this.tokenRequests1.address,
        { from: owner }), 'Token address already taken');
    });
  });

  describe('unregisters a proxy token', () => {
    beforeEach(async function() {
      this.upt = await UniversalProtocolToken.new(owner, { from: deployer });
      this.registry = await ProxyTokenRegistryV0.new(owner, { from: deployer });
      this.token1 = await ProxyToken.new(owner, 'UniversalProxyBitcoin', 'UPBTC', 0, 100, { from: deployer });
      this.tokenRequestsStorage1 = await ProxyTokenRequestsStorageV0.new(owner, { from: deployer });
      this.tokenRequests1 = await ProxyTokenRequestsV0.new(owner, this.upt.address, owner, 0, 0, this.token1.address, this.tokenRequestsStorage1.address, { from: deployer });

      await this.tokenRequestsStorage1.authorize(this.tokenRequests1.address, { from: owner });
    });

    it('only with proper authorization', async function() {
      const { logs } = await this.registry.registerProxyToken(
        this.token1.address,
        this.tokenRequests1.address,
        { from: owner });

      assert.equal(logs.length, 1);
      assert.equal(logs[0].event, 'ProxyTokenRegistered');
      assert.equal(logs[0].args.tokenName, 'UniversalProxyBitcoin');
      await assertRevert(this.registry.unregisterProxyToken(
        this.token1.address,
        { from: nonOwnerAddress }));
    });

    it('that has been registered', async function() {
      await this.registry.registerProxyToken(
        this.token1.address,
        this.tokenRequests1.address,
        { from: owner });

      const { logs } = await this.registry.unregisterProxyToken(
        this.token1.address,
        { from: owner });

      assert.equal(logs.length, 1);
      assert.equal(logs[0].event, 'ProxyTokenUnregistered');
      assert.equal(logs[0].args.tokenName, 'UniversalProxyBitcoin');
    });
  });
});
