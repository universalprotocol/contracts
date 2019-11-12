pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";

/**
 * @title TimedCrowdsale
 * @dev Crowdsale accepting contributions only within a time frame.
 */
contract TimedCrowdsale is Crowdsale {
  using SafeMath for uint256;

  uint256 internal _openingTime;
  uint256 internal _closingTime;

  /**
   * @dev Reverts if not in crowdsale time range.
   */
  modifier onlyWhileOpen {
    require(isOpen()); // solium-disable-line error-reason
    _;
  }

  /**
   * @dev Constructor, takes crowdsale opening and closing times.
   * @param openingTime Crowdsale opening time
   * @param closingTime Crowdsale closing time
   */
  constructor (uint256 openingTime, uint256 closingTime) public {
    // solhint-disable-next-line not-rely-on-time
    require(openingTime >= block.timestamp); // solium-disable-line
    require(closingTime > openingTime); // solium-disable-line error-reason

    _openingTime = openingTime;
    _closingTime = closingTime;
  }

  /**
   * @return the crowdsale opening time.
   */
  function openingTime() public view returns (uint256) {
    return _openingTime;
  }

  /**
   * @return the crowdsale closing time.
   */
  function closingTime() public view returns (uint256) {
    return _closingTime;
  }

  /**
   * @return true if the crowdsale is open, false otherwise.
   */
  function isOpen() public view returns (bool) {
    // solhint-disable-next-line not-rely-on-time
    return block.timestamp >= _openingTime && block.timestamp <= _closingTime; // solium-disable-line security/no-block-members
  }

  /**
   * @dev Checks whether the period in which the crowdsale is open has already elapsed.
   * @return Whether crowdsale period has elapsed
   */
  function hasClosed() public view returns (bool) {
    // solhint-disable-next-line not-rely-on-time
    return block.timestamp > _closingTime; // solium-disable-line security/no-block-members
  }

  /**
   * @dev Extend parent behavior requiring to be within contributing period
   * @param beneficiary Token purchaser
   * @param weiAmount Amount of wei contributed
   */
  function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal onlyWhileOpen view {
    super._preValidatePurchase(beneficiary, weiAmount);
  }
}
