'use strict';

/**
 * Module dependencies.
 */

const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const { ZERO_ADDRESS } = constants;

/**
 * Exports.
 */

module.exports = {
  shouldBehaveLikeERC20Mintable: ([, minter, anyone], details, tokenBuilder) => {
    describe('ERC20Mintable', () => {
      beforeEach(async function() {
        this.token = await tokenBuilder({ from: minter });
      });

      describe('as a mintable token', () => {
        describe('mint', () => {
          const amount = new BN(100);

          context('when the sender has minting permission', () => {
            const from = minter;

            function shouldMint(amount) {
              beforeEach(async function() {
                ({ logs: this.logs } = await this.token.mint(anyone, amount, { from }));
              });

              it('mints the requested amount', async function() {
                (await this.token.balanceOf(anyone)).should.be.bignumber.equal(amount);
              });

              it('emits a mint and a transfer event', function() {
                expectEvent.inLogs(this.logs, 'Transfer', {
                  from: ZERO_ADDRESS,
                  to: anyone,
                  value: amount
                });
              });
            }

            context('for a zero amount', () => {
              shouldMint(new BN(0));
            });

            context('for a non-zero amount', () => {
              shouldMint(amount);
            });
          });

          context('when the sender doesn\'t have minting permission', () => {
            const from = anyone;

            it('reverts', async function() {
              await shouldFail.reverting(this.token.mint(anyone, amount, { from }));
            });
          });
        });
      });
    });
  }
};
