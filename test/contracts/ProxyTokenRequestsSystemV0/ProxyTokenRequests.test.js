'use strict';

/**
 * Module dependencies.
 */

const ProxyToken = artifacts.require('ProxyToken');
const ProxyTokenRequestsV0 = artifacts.require('ProxyTokenRequestsV0');
const ProxyTokenRequestsStorageV0 = artifacts.require('ProxyTokenRequestsStorageV0');
const UniversalProtocolToken = artifacts.require('UniversalProtocolToken');
const assertRevert = require('../../helpers/assertRevert');

/**
 * `ProxyTokenRequests` tests.
 */

contract('ProxyTokenRequests', ([, owner, requester, fulfiller, deployer]) => {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const amount = 100;
  const data = '0x123';

  beforeEach(async function() {
    this.upt = await UniversalProtocolToken.new(owner, { from: deployer });
    this.token = await ProxyToken.new(owner, 'UniversalProxyBitcoin', 'UPBTC', 0, amount, { from: deployer });
    this.tokenRequestsStorage = await ProxyTokenRequestsStorageV0.new(owner, { from: deployer });
    this.tokenRequests = await ProxyTokenRequestsV0.new(owner, this.upt.address, owner, 0, 0, this.token.address, this.tokenRequestsStorage.address, { from: deployer });

    await this.token.addMinter(this.tokenRequests.address, { from: owner });
    await this.token.addBurner(this.tokenRequests.address, { from: owner });

    await this.tokenRequests.authorizeMintRequester(requester, { from: owner });
    await this.tokenRequests.authorizeBurnRequester(requester, { from: owner });
    await this.tokenRequests.authorizeMintFulfiller(fulfiller, { from: owner });
    await this.tokenRequests.authorizeBurnFulfiller(fulfiller, { from: owner });

    await this.tokenRequestsStorage.authorize(this.tokenRequests.address, { from: owner });
  });

  describe('constructor', () => {
    describe('when the UPT beneficiary is the zero address', () => {
      it('reverts', async function() {
        await assertRevert(ProxyTokenRequestsV0.new(owner, this.upt.address, ZERO_ADDRESS, 0, 0, this.token.address, this.tokenRequestsStorage.address, { from: deployer }), 'UPT beneficiary cannot be the zero address');
      });
    });
  });

  describe('Mint', () => {
    describe('createMintRequest', () => {
      describe('when the requester is unauthorized', () => {
        it('reverts', async function() {
          await assertRevert(this.tokenRequests.createMintRequest(owner, amount, data, { from: fulfiller }), 'Only authorized mint requester');
        });
      });

      describe('when the requester is authorized', () => {
        describe('when requests have an amount of 0', () => {
          it('reverts', async function() {
            await assertRevert(this.tokenRequests.createMintRequest(owner, 0, data, { from: requester }), 'Proxy amount cannot be zero');
          });
        });

        describe('when requests are greater than zero', () => {
          it('creates a valid mint request', async function() {
            const { logs } = await this.tokenRequests.createMintRequest(owner, amount, data, { from: requester });
            const requestId = 0;

            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'MintRequestCreated');
            assert.equal(logs[0].args.requestId, requestId);
          });

          it('creates a valid mint request by requester for owner', async function() {
            const { logs } = await this.tokenRequests.createMintRequest(owner, amount, data, { from: requester });
            const requestId = 0;

            // Mint Request Event
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'MintRequestCreated');
            assert.equal(logs[0].args.requestId, requestId);
          });

          describe('when the mint fee is greater than zero', () => {
            beforeEach(async function() {
              await this.tokenRequests.setMintFee(10, { from: owner });
            });

            describe('when the requester does not have any UPT', () => {
              it('reverts', async function() {
                await assertRevert(this.tokenRequests.createMintRequest(owner, amount, data, { from: requester }));
              });
            });

            describe('when the requester did not give sufficient allowance to the contract', () => {
              it('reverts', async function() {
                await this.upt.transfer(requester, 10, { from: owner });
                await assertRevert(this.tokenRequests.createMintRequest(owner, amount, data, { from: requester }));
              });
            });

            describe('when the requester did give sufficient allowance to the contract', () => {
              it('charges a UPT mint fee', async function() {
                await this.upt.transfer(requester, 10, { from: owner });
                await this.upt.approve(this.tokenRequests.address, 10, { from: requester });

                const { logs } = await this.tokenRequests.createMintRequest(owner, amount, data, { from: requester });
                const requestId = 0;

                // Mint Request Event
                assert.equal(logs.length, 1);
                assert.equal(logs[0].event, 'MintRequestCreated');
                assert.equal(logs[0].args.requestId, requestId);
              });
            });
          });
        });
      });
    });

    describe('fulfillMintRequest', () => {
      const requestId = 0;

      beforeEach(async function() {
        await this.tokenRequests.createMintRequest(owner, amount, data, { from: requester });
      });

      describe('when the fulfiller is unauthorized', () => {
        it('reverts', async function() {
          await assertRevert(this.tokenRequests.fulfillMintRequest(requestId, data, { from: requester }), 'Only authorized mint fulfiller');
        });
      });

      describe('when the fulfiller is authorized', () => {
        describe('when the request is FULFILLED', () => {
          it('reverts', async function() {
            await this.tokenRequests.fulfillMintRequest(requestId, data, { from: fulfiller });
            await assertRevert(this.tokenRequests.fulfillMintRequest(requestId, data, { from: fulfiller }), 'The mint request status must be new');
          });
        });

        describe('when the request is CANCELLED', () => {
          it('reverts', async function() {
            await this.tokenRequests.cancelMintRequest(requestId, data, { from: requester });
            await assertRevert(this.tokenRequests.fulfillMintRequest(requestId, data, { from: requester }), 'The mint request status must be new');
          });
        });

        describe('when the request is REJECTED', () => {
          it('reverts', async function() {
            await this.tokenRequests.rejectMintRequest(requestId, data, { from: fulfiller });
            await assertRevert(this.tokenRequests.fulfillMintRequest(requestId, data, { from: requester }), 'The mint request status must be new');
          });
        });

        describe('when the request is NEW', () => {
          it('reverts', async function() {
            await this.tokenRequests.createMintRequest(ZERO_ADDRESS, amount, data, { from: requester });
            await assertRevert(this.tokenRequests.fulfillMintRequest(requestId + 1, data, { from: fulfiller }));
          });

          it('correctly fulfills the request', async function() {
            const { logs } = await this.tokenRequests.fulfillMintRequest(requestId, data, { from: fulfiller });

            assert.equal(await this.tokenRequestsStorage.getMintRequestStringMap(requestId, 'fulfillData'), data);

            // Mint Request
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'MintRequestFulfilled');
            assert.equal(logs[0].args.requestId, requestId);
          });

          it('creates a valid mint request by requester for owner', async function() {
            const beforeAmount = await this.token.balanceOf(owner);
            const { logs } = await this.tokenRequests.fulfillMintRequest(requestId, data, { from: fulfiller });

            assert.equal(await this.tokenRequestsStorage.getMintRequestStringMap(requestId, 'fulfillData'), data);

            // Mint Request
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'MintRequestFulfilled');
            assert.equal(logs[0].args.requestId, requestId);

            const afterAmount = await this.token.balanceOf(owner);

            assert.equal(afterAmount.toNumber(), beforeAmount.toNumber() + amount);
          });
        });
      });
    });

    describe('cancelMintRequest', () => {
      const requestId = 0;

      beforeEach(async function() {
        await this.tokenRequests.createMintRequest(owner, amount, data, { from: requester });
      });

      describe('when the requester is unauthorized', () => {
        it('reverts', async function() {
          await assertRevert(this.tokenRequests.cancelMintRequest(requestId, data, { from: fulfiller }), 'Only authorized mint requester');
        });
      });

      describe('when the requester is authorized', () => {
        describe('when the request is FULFILLED', () => {
          it('reverts', async function() {
            await this.tokenRequests.fulfillMintRequest(requestId, data, { from: fulfiller });
            await assertRevert(this.tokenRequests.cancelMintRequest(requestId, data, { from: requester }), 'The mint request status must be new');
          });
        });

        describe('when the request is CANCELLED', () => {
          it('reverts', async function() {
            await this.tokenRequests.cancelMintRequest(requestId, data, { from: requester });
            await assertRevert(this.tokenRequests.cancelMintRequest(requestId, data, { from: requester }), 'The mint request status must be new');
          });
        });

        describe('when the request is REJECTED', () => {
          it('reverts', async function() {
            await this.tokenRequests.rejectMintRequest(requestId, data, { from: fulfiller });
            await assertRevert(this.tokenRequests.cancelMintRequest(requestId, data, { from: requester }), 'The mint request status must be new');
          });
        });

        describe('when the request is NEW', () => {
          it('correctly cancels the request', async function() {
            const { logs } = await this.tokenRequests.cancelMintRequest(requestId, data, { from: requester });

            assert.equal(await this.tokenRequestsStorage.getMintRequestStringMap(requestId, 'cancelData'), data);

            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'MintRequestCancelled');
            assert.equal(logs[0].args.requestId.toNumber(), requestId);
          });
        });
      });
    });

    describe('rejectMintRequest', () => {
      const requestId = 0;

      beforeEach(async function() {
        await this.tokenRequests.createMintRequest(owner, amount, data, { from: requester });
      });

      describe('when the fulfiller is unauthorized', () => {
        it('reverts', async function() {
          await assertRevert(this.tokenRequests.rejectMintRequest(requestId, data, { from: requester }), 'Only authorized mint fulfiller');
        });
      });

      describe('when the fulfiller is authorized', () => {
        describe('when the request is FULFILLED', () => {
          it('reverts', async function() {
            await this.tokenRequests.fulfillMintRequest(requestId, data, { from: fulfiller });
            await assertRevert(this.tokenRequests.rejectMintRequest(requestId, data, { from: fulfiller }), 'The mint request status must be new');
          });
        });

        describe('when the request is CANCELLED', () => {
          it('reverts', async function() {
            await this.tokenRequests.cancelMintRequest(requestId, data, { from: requester });
            await assertRevert(this.tokenRequests.rejectMintRequest(requestId, data, { from: fulfiller }), 'The mint request status must be new');
          });
        });

        describe('when the request is REJECTED', () => {
          it('reverts', async function() {
            await this.tokenRequests.rejectMintRequest(requestId, data, { from: fulfiller });
            await assertRevert(this.tokenRequests.rejectMintRequest(requestId, data, { from: fulfiller }), 'The mint request status must be new');
          });
        });

        describe('when the request is NEW', () => {
          it('correctly rejects the request', async function() {
            const { logs } = await this.tokenRequests.rejectMintRequest(requestId, data, { from: fulfiller });

            assert.equal(await this.tokenRequestsStorage.getMintRequestStringMap(requestId, 'rejectData'), data);

            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'MintRequestRejected');
            assert.equal(logs[0].args.requestId.toNumber(), requestId);
          });
        });
      });
    });
  });

  describe('Burn', () => {
    describe('createBurnRequest', () => {
      describe('when the requester is unauthorized', () => {
        it('reverts', async function() {
          await assertRevert(this.tokenRequests.createBurnRequest(owner, amount, data, { from: fulfiller }), 'Only authorized burn requester');
        });
      });

      describe('when the requester is the owner', () => {
        it('reverts', async function() {
          await assertRevert(this.tokenRequests.createBurnRequest(owner, amount, data, { from: owner }), 'Only authorized burn requester');
        });
      });

      describe('when the requester is authorized', () => {
        describe('when requests have an amount of 0', () => {
          it('reverts', async function() {
            await assertRevert(this.tokenRequests.createBurnRequest(owner, 0, data, { from: requester }), 'Proxy amount cannot be zero');
          });
        });

        describe('when requests are greater than zero', () => {
          it('creates a valid burn request by owner', async function() {
            await this.token.increaseBurnAllowance(this.tokenRequests.address, 100, { from: owner });
            const { logs } = await this.tokenRequests.createBurnRequest(owner, amount, data, { from: requester });
            const requestId = 0;

            // Burn Request Event
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'BurnRequestCreated');
            assert.equal(logs[0].args.requestId, requestId);
          });

          it('creates a valid burn request by requester for owner', async function() {
            const { logs } = await this.tokenRequests.createBurnRequest(owner, amount, data, { from: requester });
            const requestId = 0;

            // Burn Request Event
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'BurnRequestCreated');
            assert.equal(logs[0].args.requestId, requestId);
          });

          describe('when the burn fee is greater than zero', () => {
            beforeEach(async function() {
              await this.tokenRequests.setBurnFee(10, { from: owner });
            });

            describe('when the requester does not have any UPT', () => {
              it('reverts', async function() {
                await assertRevert(this.tokenRequests.createBurnRequest(owner, amount, data, { from: requester }));
              });
            });

            describe('when the requester did not give sufficient allowance to the contract', () => {
              it('reverts', async function() {
                await this.upt.transfer(requester, 10, { from: owner });
                await assertRevert(this.tokenRequests.createBurnRequest(owner, amount, data, { from: requester }));
              });
            });

            describe('when the requester did give sufficient allowance to the contract', () => {
              it('charges a UPT burn fee', async function() {
                await this.upt.transfer(requester, 10, { from: owner });
                await this.upt.approve(this.tokenRequests.address, 10, { from: requester });

                const { logs } = await this.tokenRequests.createBurnRequest(owner, amount, data, { from: requester });
                const requestId = 0;

                // Burn Request Event
                assert.equal(logs.length, 1);
                assert.equal(logs[0].event, 'BurnRequestCreated');
                assert.equal(logs[0].args.requestId, requestId);
              });
            });
          });
        });
      });
    });

    describe('fulfillBurnRequest', () => {
      const requestId = 0;

      beforeEach(async function() {
        await this.token.increaseBurnAllowance(this.tokenRequests.address, amount, { from: owner });
        await this.tokenRequests.createBurnRequest(owner, amount, data, { from: requester });
      });

      describe('when the fulfiller is unauthorized', () => {
        it('reverts', async function() {
          await assertRevert(this.tokenRequests.fulfillBurnRequest(requestId, data, { from: requester }), 'Only authorized burn fulfiller');
        });
      });

      describe('when the fulfiller is authorized', () => {
        describe('when the request is FULFILLED', () => {
          it('reverts', async function() {
            await this.tokenRequests.fulfillBurnRequest(requestId, data, { from: fulfiller });
            await assertRevert(this.tokenRequests.fulfillBurnRequest(requestId, data, { from: fulfiller }), 'The burn request status must be new');
          });
        });

        describe('when the request is CANCELLED', () => {
          it('reverts', async function() {
            await this.tokenRequests.cancelBurnRequest(requestId, data, { from: requester });
            await assertRevert(this.tokenRequests.fulfillBurnRequest(requestId, data, { from: fulfiller }), 'The burn request status must be new');
          });
        });

        describe('when the request is REJECTED', () => {
          it('reverts', async function() {
            await this.tokenRequests.rejectBurnRequest(requestId, data, { from: fulfiller });
            await assertRevert(this.tokenRequests.fulfillBurnRequest(requestId, data, { from: fulfiller }), 'The burn request status must be new');
          });
        });

        describe('when the request is NEW', () => {
          it('reverts', async function() {
            await this.tokenRequests.createBurnRequest(ZERO_ADDRESS, amount, data, { from: requester });
            await assertRevert(this.tokenRequests.fulfillBurnRequest(requestId + 1, data, { from: fulfiller }), 'Not enough burn allowance');
          });

          it('correctly fulfills the request', async function() {
            const { logs } = await this.tokenRequests.fulfillBurnRequest(requestId, data, { from: fulfiller });

            assert.equal(await this.tokenRequestsStorage.getBurnRequestStringMap(requestId, 'fulfillData'), data);
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'BurnRequestFulfilled');
            assert.equal(logs[0].args.requestId, requestId);
          });

          it('creates a valid burn request by requester for owner', async function() {
            const beforeAmount = await this.token.balanceOf(owner);
            const { logs } = await this.tokenRequests.fulfillBurnRequest(requestId, data, { from: fulfiller });

            assert.equal(await this.tokenRequestsStorage.getBurnRequestStringMap(requestId, 'fulfillData'), data);
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'BurnRequestFulfilled');
            assert.equal(logs[0].args.requestId, requestId);

            const afterAmount = await this.token.balanceOf(owner);

            assert.equal(afterAmount.toNumber(), beforeAmount.toNumber() - amount);
          });
        });
      });
    });

    describe('cancelBurnRequest', () => {
      const requestId = 0;

      beforeEach(async function() {
        await this.token.increaseBurnAllowance(this.tokenRequests.address, amount, { from: owner });
        await this.tokenRequests.createBurnRequest(owner, amount, data, { from: requester });
      });

      describe('when the requester is unauthorized', () => {
        it('reverts', async function() {
          await assertRevert(this.tokenRequests.cancelBurnRequest(requestId, data, { from: fulfiller }), 'Only authorized burn requester');
        });
      });

      describe('when the requester is authorized', () => {
        describe('when the request is FULFILLED', () => {
          it('reverts', async function() {
            await this.tokenRequests.fulfillBurnRequest(requestId, data, { from: fulfiller });
            await assertRevert(this.tokenRequests.cancelBurnRequest(requestId, data, { from: requester }), 'The burn request status must be new');
          });
        });

        describe('when the request is CANCELLED', () => {
          it('reverts', async function() {
            await this.tokenRequests.cancelBurnRequest(requestId, data, { from: requester });
            await assertRevert(this.tokenRequests.cancelBurnRequest(requestId, data, { from: requester }), 'The burn request status must be new');
          });
        });

        describe('when the request is REJECTED', () => {
          it('reverts', async function() {
            await this.tokenRequests.rejectBurnRequest(requestId, data, { from: fulfiller });
            await assertRevert(this.tokenRequests.cancelBurnRequest(requestId, data, { from: requester }), 'The burn request status must be new');
          });
        });

        describe('when the request is NEW', () => {
          it('correctly cancels the request made by owner', async function() {
            const { logs } = await this.tokenRequests.cancelBurnRequest(requestId, data, { from: requester });

            // Burn Request event
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'BurnRequestCancelled');
            assert.equal(logs[0].args.requestId.toNumber(), requestId);
          });

          it('correctly cancels the request made by requester for owner', async function() {
            await this.tokenRequests.cancelBurnRequest(requestId, data, { from: requester });
            await this.tokenRequests.createBurnRequest(owner, amount, data, { from: requester });
            const { logs } = await this.tokenRequests.cancelBurnRequest(requestId + 1, data, { from: requester });

            // Burn Request event
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'BurnRequestCancelled');
            assert.equal(logs[0].args.requestId.toNumber(), requestId + 1);
          });
        });
      });
    });
  });

  describe('rejectBurnRequest', () => {
    const requestId = 0;

    beforeEach(async function() {
      await this.token.increaseBurnAllowance(this.tokenRequests.address, amount, { from: owner });
      await this.tokenRequests.createBurnRequest(owner, amount, data, { from: requester });
    });

    describe('when the fulfiller is unauthorized', () => {
      it('reverts', async function() {
        await assertRevert(this.tokenRequests.rejectBurnRequest(requestId, data, { from: requester }), 'Only authorized burn fulfiller');
      });
    });

    describe('when the fulfiller is authorized', () => {
      describe('when the request is FULFILLED', () => {
        it('reverts', async function() {
          await this.tokenRequests.fulfillBurnRequest(requestId, data, { from: fulfiller });
          await assertRevert(this.tokenRequests.rejectBurnRequest(requestId, data, { from: fulfiller }), 'The burn request status must be new');
        });
      });

      describe('when the request is CANCELLED', () => {
        it('reverts', async function() {
          await this.tokenRequests.cancelBurnRequest(requestId, data, { from: requester });
          await assertRevert(this.tokenRequests.rejectBurnRequest(requestId, data, { from: fulfiller }), 'The burn request status must be new');
        });
      });

      describe('when the request is REJECTED', () => {
        it('reverts', async function() {
          await this.tokenRequests.rejectBurnRequest(requestId, data, { from: fulfiller });
          await assertRevert(this.tokenRequests.rejectBurnRequest(requestId, data, { from: fulfiller }), 'The burn request status must be new');
        });
      });

      describe('when the request is NEW', () => {
        it('correctly rejects the request made by owner', async function() {
          const { logs } = await this.tokenRequests.rejectBurnRequest(requestId, data, { from: fulfiller });

          // Burn Request event
          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'BurnRequestRejected');
          assert.equal(logs[0].args.requestId.toNumber(), requestId);
        });
      });

      describe('when the transfer fails', () => {
        it('correctly rejects the request', async function() {
          await assertRevert(this.tokenRequests.rejectBurnRequest(requestId, data, { from: owner }), 'Only authorized burn fulfiller');
        });
      });
    });
  });

  describe('getFeeBeneficiary', () => {
    it('should return the UPT fee beneficiary', async function() {
      assert.equal(await this.tokenRequests.getFeeBeneficiary(), owner);
    });
  });

  describe('setFeeBeneficiary', () => {
    describe('when the sender is not the owner', () => {
      it('reverts', async function() {
        await assertRevert(this.tokenRequests.setFeeBeneficiary(fulfiller, { from: fulfiller }));
        await assertRevert(this.tokenRequests.setFeeBeneficiary(requester, { from: requester }));
      });
    });

    describe('when the sender is the owner', () => {
      it('updates the UPT fee beneficiary', async function() {
        assert.equal(await this.tokenRequests.getFeeBeneficiary(), owner);

        await this.tokenRequests.setFeeBeneficiary(fulfiller, { from: owner });

        assert.equal(await this.tokenRequests.getFeeBeneficiary(), fulfiller);
      });
    });
  });

  describe('getBurnFee', () => {
    it('should return the burn fee', async function() {
      assert.equal(await this.tokenRequests.getBurnFee(), 0);
    });
  });

  describe('setBurnFee', () => {
    describe('when the sender is not the owner', () => {
      it('reverts', async function() {
        await assertRevert(this.tokenRequests.setBurnFee(0, { from: fulfiller }));
        await assertRevert(this.tokenRequests.setBurnFee(0, { from: requester }));
      });
    });

    describe('when the sender is the owner', () => {
      it('updates the burn fee', async function() {
        assert.equal(await this.tokenRequests.getBurnFee(), 0);

        await this.tokenRequests.setBurnFee(10000, { from: owner });

        assert.equal(await this.tokenRequests.getBurnFee(), 10000);
      });
    });
  });

  describe('getMintFee', () => {
    it('should return the mint fee', async function() {
      assert.equal(await this.tokenRequests.getMintFee(), 0);
    });
  });

  describe('setMintFee', () => {
    describe('when the sender is not the owner', () => {
      it('reverts', async function() {
        await assertRevert(this.tokenRequests.setMintFee(0, { from: fulfiller }));
        await assertRevert(this.tokenRequests.setMintFee(0, { from: requester }));
      });
    });

    describe('when the sender is the owner', () => {
      it('updates the mint fee', async function() {
        assert.equal(await this.tokenRequests.getMintFee(), 0);

        await this.tokenRequests.setMintFee(10000, { from: owner });

        assert.equal(await this.tokenRequests.getMintFee(), 10000);
      });
    });
  });
});
