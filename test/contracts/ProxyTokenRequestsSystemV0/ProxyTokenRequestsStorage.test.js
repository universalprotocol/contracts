'use strict';

/**
 * Module dependencies.
 */

const ProxyToken = artifacts.require('ProxyToken');
const ProxyTokenRequestsStorageV0 = artifacts.require('ProxyTokenRequestsStorageV0');
const assertRevert = require('../../helpers/assertRevert');

/**
 * `ProxyTokenRequestsStorage` tests.
 */

contract('ProxyTokenRequestsStorage', ([, owner, authorized,, deployer]) => {
  beforeEach(async function() {
    this.token = await ProxyToken.new(owner, 'UniversalProxyBitcoin', 'UPBTC', 0, 100, { from: deployer });
    this.tokenRequestsStorage = await ProxyTokenRequestsStorageV0.new(owner, { from: deployer });

    await this.tokenRequestsStorage.authorize(authorized, { from: owner });
  });

  describe('getBurnRequestsLength()', () => {
    describe('when the are not any burn requests', () => {
      it('returns zero', async function() {
        assert.equal(await this.tokenRequestsStorage.getBurnRequestsLength(), 0);
      });
    });

    describe('when the are burn requests', () => {
      it('returns the length', async function() {
        await this.tokenRequestsStorage.createBurnRequest({ from: authorized });
        await this.tokenRequestsStorage.createBurnRequest({ from: authorized });

        assert.equal(await this.tokenRequestsStorage.getBurnRequestsLength(), 2);
      });
    });
  });

  describe('getMintRequestsLength()', () => {
    describe('when the are not any mint requests', () => {
      it('returns zero', async function() {
        assert.equal(await this.tokenRequestsStorage.getMintRequestsLength(), 0);
      });
    });

    describe('when the are mint requests', () => {
      it('returns the length', async function() {
        await this.tokenRequestsStorage.createMintRequest({ from: authorized });
        await this.tokenRequestsStorage.createMintRequest({ from: authorized });

        assert.equal(await this.tokenRequestsStorage.getMintRequestsLength(), 2);
      });
    });
  });

  describe('getMintRequestStringMap()', () => {
    describe('when the burn request is invalid', () => {
      it('reverts', async function() {
        await assertRevert(this.tokenRequestsStorage.getBurnRequestStringMap(100, 'foo'));
      });
    });

    describe('when the mint request is invalid', () => {
      it('reverts', async function() {
        await assertRevert(this.tokenRequestsStorage.getMintRequestStringMap(100, 'foo'));
      });
    });
  });

  describe('createMintRequest()', () => {
    describe('when the sender is the owner', () => {
      it('reverts', async function() {
        await assertRevert(this.tokenRequestsStorage.createMintRequest({ from: owner }), 'Owner is not authorized');
      });
    });

    describe('when the sender is not authorized', () => {
      it('reverts', async function() {
        await assertRevert(this.tokenRequestsStorage.createMintRequest({ from: deployer }), 'Not authorized');
      });
    });
  });
});
