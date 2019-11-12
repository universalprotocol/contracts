'use strict';

/**
 * Module dependencies.
 */

const ProxyToken = artifacts.require('ProxyToken');
const assertRevert = require('../../helpers/assertRevert');

/**
 * `ProxyTokenBurnable` tests.
 */

contract('ProxyTokenBurnable', ([, initialOwner, burner, anyone]) => {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  describe('authorizes users', () => {
    beforeEach(async function() {
      this.token = await ProxyToken.new(initialOwner, 'UniversalProxyBitcoin', 'UPBTC', 0, 100, { from: anyone });

      await this.token.addBurner(burner, { from: initialOwner });
      await this.token.renounceBurner({ from: initialOwner });
    });

    describe('as a burnable token', () => {
      describe('burn', () => {
        context('when the sender doesn\'t have burning permission', () => {
          it('reverts', async function() {
            await assertRevert(this.token.burn(100, { from: anyone }), 'Sender does not have a burner role');
          });
        });

        context('when the account address does not have balance', () => {
          it('reverts', async function() {
            await assertRevert(this.token.burn(100, { from: burner }));
          });
        });

        context('when the sender has burning permission and allowance', () => {
          beforeEach(async function() {
            await this.token.addBurner(initialOwner, { from: burner });
          });

          function shouldBurn(amount) {
            it('burns the requested amount', async function() {
              const before = await this.token.balanceOf(initialOwner);

              await this.token.burn(amount, { from: initialOwner });

              const after = await this.token.balanceOf(initialOwner);

              assert.equal(after.toNumber(), before.toNumber() - amount);
            });

            it('emits a burn and a transfer event', async function() {
              const { logs } = await this.token.burn(amount, { from: initialOwner });

              assert.equal(logs.length, 1);
              assert.equal(logs[0].event, 'Transfer');
              assert.equal(logs[0].args.from, initialOwner);
              assert.equal(logs[0].args.to, ZERO_ADDRESS);
              assert.equal(logs[0].args.value, amount);
            });
          }

          context('for a zero amount', () => {
            shouldBurn(0);
          });

          context('for a non-zero amount', () => {
            shouldBurn(100);
          });
        });
      });

      describe('burner role', () => {
        context('when the sender doesn\'t have burning permission', () => {
          it('reverts', async function() {
            await this.token.renounceBurner({ from: burner });

            await assertRevert(this.token.burn(100, { from: burner }), 'Sender does not have a burner role');
          });
        });
      });

      describe('burnFrom', () => {
        context('when the sender doesn\'t have burning permission', () => {
          it('reverts', async function() {
            await assertRevert(this.token.burnFrom(initialOwner, 100, { from: anyone }), 'Sender does not have a burner role');
          });
        });

        context('when the sender address does not have burning allowance', () => {
          it('reverts', async function() {
            await assertRevert(this.token.burnFrom(initialOwner, 100, { from: burner }), 'Not enough burn allowance');
          });
        });

        context('when the account address does not have balance', () => {
          it('reverts', async function() {
            await assertRevert(this.token.burnFrom(burner, 100, { from: burner }));
          });
        });

        context('when the sender has burning permission and allowance', () => {
          function shouldBurn(amount) {
            beforeEach(async function() {
              await this.token.increaseBurnAllowance(burner, amount + 20, { from: initialOwner });
            });

            it('burns the requested amount', async function() {
              const before = await this.token.balanceOf(initialOwner);
              const allowance = await this.token.burnAllowance(initialOwner, burner);

              assert.equal(allowance.toNumber(), amount + 20);

              await this.token.burnFrom(initialOwner, amount, { from: burner });

              const after = await this.token.balanceOf(initialOwner);

              assert.equal(after.toNumber(), before.toNumber() - amount);
            });

            it('emits a burn and a transfer event', async function() {
              const { logs } = await this.token.burnFrom(initialOwner, amount, { from: burner });

              assert.equal(logs.length, 2);
              assert.equal(logs[0].event, 'Transfer');
              assert.equal(logs[0].args.from, initialOwner);
              assert.equal(logs[0].args.to, ZERO_ADDRESS);
              assert.equal(logs[0].args.value, amount);
              assert.equal(logs[1].event, 'BurnApproval');
              assert.equal(logs[1].args.owner, initialOwner);
              assert.equal(logs[1].args.spender, burner);
              assert.equal(logs[1].args.value, 20);
            });
          }

          context('for a zero amount', () => {
            shouldBurn(0);
          });

          context('for a non-zero amount', () => {
            shouldBurn(100);
          });
        });
      });
    });

    describe('increaseBurnAllowance()', () => {
      it('should revert if the burner is the zero address', async function() {
        await assertRevert(this.token.increaseBurnAllowance(ZERO_ADDRESS, 0, { from: anyone }), 'Invalid burner address');
      });

      it('should increment the burn allowance', async function() {
        const allowanceBefore = await this.token.burnAllowance(anyone, burner);

        await this.token.increaseBurnAllowance(burner, 20, { from: anyone });

        const allowanceAfter = await this.token.burnAllowance(anyone, burner);

        assert.equal(allowanceBefore.toNumber() + 20, allowanceAfter.toNumber());
      });
    });

    describe('decreaseBurnAllowance()', () => {
      it('should revert if the burner is the zero address', async function() {
        await assertRevert(this.token.decreaseBurnAllowance(ZERO_ADDRESS, 0, { from: anyone }), 'Invalid burner address');
      });

      it('should revert if the address does not have any allowance', async function() {
        await assertRevert(this.token.decreaseBurnAllowance(burner, 10, { from: anyone }));
      });

      it('should decrement the burn allowance', async function() {
        await this.token.increaseBurnAllowance(burner, 20, { from: anyone });

        const allowanceBefore = await this.token.burnAllowance(anyone, burner);

        await this.token.decreaseBurnAllowance(burner, 10, { from: anyone });

        const allowanceAfter = await this.token.burnAllowance(anyone, burner);

        assert.equal(allowanceBefore.toNumber(), allowanceAfter.toNumber() + 10);
      });
    });
  });
});
