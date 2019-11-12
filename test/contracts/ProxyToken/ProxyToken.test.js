'use strict';

/**
 * Module dependencies.
 */

const BigNumber = require('bignumber.js');
const { BN } = require('openzeppelin-test-helpers');
const { shouldBehaveLikeERC20 } = require('../../behaviors/ERC20.behavior');
const { shouldBehaveLikeERC20Detailed } = require('../../behaviors/ERC20Detailed.behavior');
const { shouldBehaveLikeERC20Mintable } = require('../../behaviors/ERC20Mintable.behavior');
const ProxyToken = artifacts.require('ProxyToken');

/**
 * `ProxyToken` tests.
 */

contract('ProxyToken', accounts => {
  const [, initialHolder, recipient] = accounts;
  const tokenDetails = {
    decimals: new BN(8),
    initialSupply: new BN(new BigNumber(10).pow(8).times(100).toString(10)),
    name: 'Universal Proxy Bitcoin',
    symbol: 'UPBTC'
  };

  describe('constructor()', () => {
    it('should mint tokens to the passed owner address', async () => {
      const token = await ProxyToken.new(initialHolder, tokenDetails.name, tokenDetails.symbol, tokenDetails.decimals, 10000, { from: recipient });
      const balance = await token.balanceOf(initialHolder);
      const totalSupply = await token.totalSupply();

      assert.equal(balance.toString(10), totalSupply.toString(10));
    });
  });

  const tokenBuilder = async ({ from }) => await ProxyToken.new(from, tokenDetails.name, tokenDetails.symbol, tokenDetails.decimals, 100, { from });

  shouldBehaveLikeERC20(accounts, tokenDetails, tokenBuilder);
  shouldBehaveLikeERC20Detailed(accounts, tokenDetails, tokenBuilder);
  shouldBehaveLikeERC20Mintable(accounts, tokenDetails, tokenBuilder);
});
