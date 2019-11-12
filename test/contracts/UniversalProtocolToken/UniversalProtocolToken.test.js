'use strict';

/**
 * Module dependencies.
 */

const BigNumber = require('bignumber.js');
const { BN } = require('openzeppelin-test-helpers');
const { shouldBehaveLikeERC20 } = require('../../behaviors/ERC20.behavior');
const { shouldBehaveLikeERC20Detailed } = require('../../behaviors/ERC20Detailed.behavior');
const UniversalProtocolToken = artifacts.require('UniversalProtocolToken');

/**
 * `UniversalProtocolToken` tests.
 */

contract('UniversalProtocolToken', accounts => {
  const [, initialHolder, recipient] = accounts;
  const details = {
    decimals: new BN(18),
    initialSupply: new BN(new BigNumber(10 ** 10).times(1e18).toString(10)),
    name: 'Universal Protocol Token',
    symbol: 'UPT'
  };

  describe('constructor()', () => {
    it('should mint tokens to the passed owner address', async () => {
      const token = await UniversalProtocolToken.new(initialHolder, { from: recipient });
      const balance = await token.balanceOf(initialHolder);
      const totalSupply = await token.totalSupply();

      assert.equal(balance.toString(10), totalSupply.toString(10));
    });
  });

  const tokenBuilder = async ({ from }) => await UniversalProtocolToken.new(from, { from });

  shouldBehaveLikeERC20(accounts, details, tokenBuilder);
  shouldBehaveLikeERC20Detailed(accounts, details, tokenBuilder);
});
