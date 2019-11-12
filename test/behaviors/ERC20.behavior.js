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
  /**
   * @dev Test suite taken from `https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/test/token/ERC20/ERC20.test.js`.
   */

  shouldBehaveLikeERC20: ([, initialHolder, recipient, anotherAccount], { initialSupply }, tokenBuilder) => {
    describe('ERC20', () => {
      beforeEach(async function() {
        this.token = await tokenBuilder({ from: initialHolder });
      });

      describe('total supply', () => {
        it('returns the total amount of tokens', async function() {
          (await this.token.totalSupply()).should.be.bignumber.equal(initialSupply);
        });
      });

      describe('balanceOf', () => {
        describe('when the requested account has no tokens', () => {
          it('returns zero', async function() {
            (await this.token.balanceOf(anotherAccount)).should.be.bignumber.equal('0');
          });
        });

        describe('when the requested account has some tokens', () => {
          it('returns the total amount of tokens', async function() {
            (await this.token.balanceOf(initialHolder)).should.be.bignumber.equal(initialSupply);
          });
        });
      });

      describe('transfer', () => {
        describe('when the recipient is not the zero address', () => {
          const to = recipient;

          describe('when the sender does not have enough balance', () => {
            const amount = initialSupply.addn(1);

            it('reverts', async function() {
              await shouldFail.reverting(this.token.transfer(to, amount, { from: initialHolder }));
            });
          });

          describe('when the sender has enough balance', () => {
            const amount = initialSupply;

            it('transfers the requested amount', async function() {
              await this.token.transfer(to, amount, { from: initialHolder });

              (await this.token.balanceOf(initialHolder)).should.be.bignumber.equal('0');

              (await this.token.balanceOf(to)).should.be.bignumber.equal(amount);
            });

            it('emits a transfer event', async function() {
              const { logs } = await this.token.transfer(to, amount, { from: initialHolder });

              expectEvent.inLogs(logs, 'Transfer', {
                from: initialHolder,
                to,
                value: amount
              });
            });
          });
        });

        describe('when the recipient is the zero address', () => {
          const to = ZERO_ADDRESS;

          it('reverts', async function() {
            await shouldFail.reverting(this.token.transfer(to, initialSupply, { from: initialHolder }));
          });
        });
      });

      describe('approve', () => {
        describe('when the spender is not the zero address', () => {
          const spender = recipient;

          describe('when the sender has enough balance', () => {
            const amount = initialSupply;

            it('emits an approval event', async function() {
              const { logs } = await this.token.approve(spender, amount, { from: initialHolder });

              expectEvent.inLogs(logs, 'Approval', {
                owner: initialHolder,
                spender,
                value: amount
              });
            });

            describe('when there was no approved amount before', () => {
              it('approves the requested amount', async function() {
                await this.token.approve(spender, amount, { from: initialHolder });

                (await this.token.allowance(initialHolder, spender)).should.be.bignumber.equal(amount);
              });
            });

            describe('when the spender had an approved amount', () => {
              beforeEach(async function() {
                await this.token.approve(spender, new BN(1), { from: initialHolder });
              });

              it('approves the requested amount and replaces the previous one', async function() {
                await this.token.approve(spender, amount, { from: initialHolder });

                (await this.token.allowance(initialHolder, spender)).should.be.bignumber.equal(amount);
              });
            });
          });

          describe('when the sender does not have enough balance', () => {
            const amount = initialSupply.addn(1);

            it('emits an approval event', async function() {
              const { logs } = await this.token.approve(spender, amount, { from: initialHolder });

              expectEvent.inLogs(logs, 'Approval', {
                owner: initialHolder,
                spender,
                value: amount
              });
            });

            describe('when there was no approved amount before', () => {
              it('approves the requested amount', async function() {
                await this.token.approve(spender, amount, { from: initialHolder });

                (await this.token.allowance(initialHolder, spender)).should.be.bignumber.equal(amount);
              });
            });

            describe('when the spender had an approved amount', () => {
              beforeEach(async function() {
                await this.token.approve(spender, new BN(1), { from: initialHolder });
              });

              it('approves the requested amount and replaces the previous one', async function() {
                await this.token.approve(spender, amount, { from: initialHolder });

                (await this.token.allowance(initialHolder, spender)).should.be.bignumber.equal(amount);
              });
            });
          });
        });

        describe('when the spender is the zero address', () => {
          const amount = initialSupply;
          const spender = ZERO_ADDRESS;

          it('reverts', async function() {
            await shouldFail.reverting(this.token.approve(spender, amount, { from: initialHolder }));
          });
        });
      });

      describe('transfer from', () => {
        const spender = recipient;

        describe('when the recipient is not the zero address', () => {
          const to = anotherAccount;

          describe('when the spender has enough approved balance', () => {
            beforeEach(async function() {
              await this.token.approve(spender, initialSupply, { from: initialHolder });
            });

            describe('when the initial holder has enough balance', () => {
              const amount = initialSupply;

              it('transfers the requested amount', async function() {
                await this.token.transferFrom(initialHolder, to, amount, { from: spender });

                (await this.token.balanceOf(initialHolder)).should.be.bignumber.equal('0');

                (await this.token.balanceOf(to)).should.be.bignumber.equal(amount);
              });

              it('decreases the spender allowance', async function() {
                await this.token.transferFrom(initialHolder, to, amount, { from: spender });

                (await this.token.allowance(initialHolder, spender)).should.be.bignumber.equal('0');
              });

              it('emits a transfer event', async function() {
                const { logs } = await this.token.transferFrom(initialHolder, to, amount, { from: spender });

                expectEvent.inLogs(logs, 'Transfer', {
                  from: initialHolder,
                  to,
                  value: amount
                });
              });

              it('emits an approval event', async function() {
                const { logs } = await this.token.transferFrom(initialHolder, to, amount, { from: spender });

                expectEvent.inLogs(logs, 'Approval', {
                  owner: initialHolder,
                  spender,
                  value: await this.token.allowance(initialHolder, spender)
                });
              });
            });

            describe('when the initial holder does not have enough balance', () => {
              const amount = initialSupply.addn(1);

              it('reverts', async function() {
                await shouldFail.reverting(this.token.transferFrom(initialHolder, to, amount, { from: spender }));
              });
            });
          });

          describe('when the spender does not have enough approved balance', () => {
            beforeEach(async function() {
              await this.token.approve(spender, initialSupply.subn(1), { from: initialHolder });
            });

            describe('when the initial holder has enough balance', () => {
              const amount = initialSupply;

              it('reverts', async function() {
                await shouldFail.reverting(this.token.transferFrom(initialHolder, to, amount, { from: spender }));
              });
            });

            describe('when the initial holder does not have enough balance', () => {
              const amount = initialSupply.addn(1);

              it('reverts', async function() {
                await shouldFail.reverting(this.token.transferFrom(initialHolder, to, amount, { from: spender }));
              });
            });
          });
        });

        describe('when the recipient is the zero address', () => {
          const amount = initialSupply;
          const to = ZERO_ADDRESS;

          beforeEach(async function() {
            await this.token.approve(spender, amount, { from: initialHolder });
          });

          it('reverts', async function() {
            await shouldFail.reverting(this.token.transferFrom(initialHolder, to, amount, { from: spender }));
          });
        });
      });

      describe('decrease allowance', () => {
        describe('when the spender is not the zero address', () => {
          const spender = recipient;

          function shouldDecreaseApproval(amount) {
            describe('when there was no approved amount before', () => {
              it('reverts', async function() {
                await shouldFail.reverting(this.token.decreaseAllowance(spender, amount, { from: initialHolder }));
              });
            });

            describe('when the spender had an approved amount', () => {
              const approvedAmount = amount;

              beforeEach(async function() {
                ({ logs: this.logs } = await this.token.approve(spender, approvedAmount, { from: initialHolder }));
              });

              it('emits an approval event', async function() {
                const { logs } = await this.token.decreaseAllowance(spender, approvedAmount, { from: initialHolder });

                expectEvent.inLogs(logs, 'Approval', {
                  owner: initialHolder,
                  spender,
                  value: new BN(0)
                });
              });

              it('decreases the spender allowance subtracting the requested amount', async function() {
                await this.token.decreaseAllowance(spender, approvedAmount.subn(1), { from: initialHolder });

                (await this.token.allowance(initialHolder, spender)).should.be.bignumber.equal('1');
              });

              it('sets the allowance to zero when all allowance is removed', async function() {
                await this.token.decreaseAllowance(spender, approvedAmount, { from: initialHolder });
                (await this.token.allowance(initialHolder, spender)).should.be.bignumber.equal('0');
              });

              it('reverts when more than the full allowance is removed', async function() {
                await shouldFail.reverting(
                  this.token.decreaseAllowance(spender, approvedAmount.addn(1), { from: initialHolder })
                );
              });
            });
          }

          describe('when the sender has enough balance', () => {
            const amount = initialSupply;

            shouldDecreaseApproval(amount);
          });

          describe('when the sender does not have enough balance', () => {
            const amount = initialSupply.addn(1);

            shouldDecreaseApproval(amount);
          });
        });

        describe('when the spender is the zero address', () => {
          const amount = initialSupply;
          const spender = ZERO_ADDRESS;

          it('reverts', async function() {
            await shouldFail.reverting(this.token.decreaseAllowance(spender, amount, { from: initialHolder }));
          });
        });
      });

      describe('increase allowance', () => {
        const amount = initialSupply;

        describe('when the spender is not the zero address', () => {
          const spender = recipient;

          describe('when the sender has enough balance', () => {
            it('emits an approval event', async function() {
              const { logs } = await this.token.increaseAllowance(spender, amount, { from: initialHolder });

              expectEvent.inLogs(logs, 'Approval', {
                owner: initialHolder,
                spender,
                value: amount
              });
            });

            describe('when there was no approved amount before', () => {
              it('approves the requested amount', async function() {
                await this.token.increaseAllowance(spender, amount, { from: initialHolder });

                (await this.token.allowance(initialHolder, spender)).should.be.bignumber.equal(amount);
              });
            });

            describe('when the spender had an approved amount', () => {
              beforeEach(async function() {
                await this.token.approve(spender, new BN(1), { from: initialHolder });
              });

              it('increases the spender allowance adding the requested amount', async function() {
                await this.token.increaseAllowance(spender, amount, { from: initialHolder });

                (await this.token.allowance(initialHolder, spender)).should.be.bignumber.equal(amount.addn(1));
              });
            });
          });

          describe('when the sender does not have enough balance', () => {
            const amount = initialSupply.addn(1);

            it('emits an approval event', async function() {
              const { logs } = await this.token.increaseAllowance(spender, amount, { from: initialHolder });

              expectEvent.inLogs(logs, 'Approval', {
                owner: initialHolder,
                spender,
                value: amount
              });
            });

            describe('when there was no approved amount before', () => {
              it('approves the requested amount', async function() {
                await this.token.increaseAllowance(spender, amount, { from: initialHolder });

                (await this.token.allowance(initialHolder, spender)).should.be.bignumber.equal(amount);
              });
            });

            describe('when the spender had an approved amount', () => {
              beforeEach(async function() {
                await this.token.approve(spender, new BN(1), { from: initialHolder });
              });

              it('increases the spender allowance adding the requested amount', async function() {
                await this.token.increaseAllowance(spender, amount, { from: initialHolder });

                (await this.token.allowance(initialHolder, spender)).should.be.bignumber.equal(amount.addn(1));
              });
            });
          });
        });

        describe('when the spender is the zero address', () => {
          const spender = ZERO_ADDRESS;

          it('reverts', async function() {
            await shouldFail.reverting(this.token.increaseAllowance(spender, amount, { from: initialHolder }));
          });
        });
      });
    });
  }
};
