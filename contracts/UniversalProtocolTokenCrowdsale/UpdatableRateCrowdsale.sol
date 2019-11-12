pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title UpdatableRateCrowdsale
 */
contract UpdatableRateCrowdsale is Crowdsale, Ownable
{
  uint256 private _customRate;
  event RateChanged(uint256 rate);

  /**
   * @param rate Number of token units a buyer gets per wei
   */
  constructor(uint256 rate) public {
    _customRate = rate;
  }

  /**
   * @dev Overrides parent method taking into account variable rate.
   * @param weiAmount The value in wei to be converted into tokens
   * @return The number of tokens _weiAmount wei will buy at present time
   */
  function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
    return weiAmount.mul(_customRate);
  }

  /**
   * @dev Gets the custom rate.
   */
  function rate() public view returns (uint256) {
    return _customRate;
  }

  /**
   * @dev Sets a custom rate.
   * @param newRate The new rate to be set
   */
  function setRate(uint256 newRate) public onlyOwner {
    require(newRate > 0, "New rate cannot be zero");

    _customRate = newRate;

    emit RateChanged(_customRate);
  }
}
