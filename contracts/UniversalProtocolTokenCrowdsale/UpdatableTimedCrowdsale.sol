pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./TimedCrowdsale.sol";

/**
 * @title UpdatableTimedCrowdsale
 * @dev Crowdsale accepting contributions only within a time frame,
 * with updatable opening time and closing time.
 */
contract UpdatableTimedCrowdsale is TimedCrowdsale, Ownable {
  event OpeningTimeChanged(uint256 openingTime);
  event ClosingTimeChanged(uint256 closingTime);

  /**
   * @dev Constructor, takes crowdsale opening and closing times.
   * @param openingTime Crowdsale opening time
   * @param closingTime Crowdsale closing time
   */
  constructor (
    uint256 openingTime,
    uint256 closingTime
  ) public TimedCrowdsale(openingTime, closingTime) {} // solium-disable-line no-empty-blocks

  /**
   * @dev Set a new closing time
   * @param newClosingTime Closing time in seconds
   */
  function setClosingTime(uint256 newClosingTime) public onlyOwner {
    require(newClosingTime > _openingTime); // solium-disable-line error-reason

    _closingTime = newClosingTime;

    emit ClosingTimeChanged(_closingTime);
  }

  /**
   * @dev Set a new opening time
   * @param newOpeningTime Opening time in seconds
   */
  function setOpeningTime(uint256 newOpeningTime) public onlyOwner {
    require(newOpeningTime >= block.timestamp); // solium-disable-line
    require(newOpeningTime < _closingTime); // solium-disable-line error-reason

    _openingTime = newOpeningTime;

    emit OpeningTimeChanged(_openingTime);
  }
}

