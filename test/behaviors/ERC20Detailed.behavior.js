'use strict';

/**
 * Exports.
 */

module.exports = {
  /**
   * @dev Test suite taken from `https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/test/token/ERC20/ERC20Detailed.test.js`.
   */

  shouldBehaveLikeERC20Detailed: ([, initialHolder], { decimals, name, symbol }, tokenBuilder) => {
    beforeEach(async function() {
      this.token = await tokenBuilder({ from: initialHolder });
    });

    describe('ERC20Detailed', () => {
      it('has a name', async function() {
        (await this.token.name()).should.be.equal(name);
      });

      it('has a symbol', async function() {
        (await this.token.symbol()).should.be.equal(symbol);
      });

      it('has an amount of decimals', async function() {
        (await this.token.decimals()).should.be.bignumber.equal(decimals);
      });
    });
  }
};
