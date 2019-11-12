pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/PausableCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/WhitelistCrowdsale.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./IndividuallyCappedCrowdsale.sol";
import "./UpdatableTimedCrowdsale.sol";
import "./UpdatableRateCrowdsale.sol";

/**
 * @title UniversalProtocolTokenCrowdsale
 */
contract UniversalProtocolTokenCrowdsale is
  AllowanceCrowdsale,
  CappedCrowdsale,
  IndividuallyCappedCrowdsale,
  PausableCrowdsale,
  WhitelistCrowdsale,
  Ownable,
  UpdatableTimedCrowdsale,
  UpdatableRateCrowdsale
{
  /**
   * @param owner Address of the contract owner
   * @param tokenWallet Address where the contract will take the tokens
   * @param rate Number of token units a buyer gets per wei
   * @param wallet Address where collected funds will be forwarded to
   * @param token Address of the token being sold
   * @param openingTime Crowdsale opening time
   * @param closingTime Crowdsale closing time
   * @param cap Max amount of wei to be contributed
   */
  constructor (
    address owner,
    address tokenWallet,
    uint256 rate,
    address payable wallet,
    IERC20 token,
    uint256 openingTime,
    uint256 closingTime,
    uint256 cap
  )
  AllowanceCrowdsale(tokenWallet)
  Crowdsale(rate, wallet, token)
  UpdatableTimedCrowdsale(openingTime, closingTime)
  CappedCrowdsale(cap)
  UpdatableRateCrowdsale(rate)
  public {
    if (owner == msg.sender) {
      return;
    }

    // CappedCrowdsale.
    addCapper(owner);
    renounceCapper();

    // Pausable.
    addPauser(owner);
    renouncePauser();

    // WhitelistCrowdsale.
    addWhitelistAdmin(owner);
    renounceWhitelistAdmin();

    // Ownable.
    transferOwnership(owner);
  }

  /**
   * @dev Whitelist addresses with an individual cap.
   */
  function whitelistUsersWithIndividualCaps(address[] memory users, uint256[] memory individualCaps) public onlyCapper onlyWhitelistAdmin {
    require(users.length <= 128, "Users length exceeds the maximum allowed");
    require(users.length == individualCaps.length, "Users length is not equal to individual caps");

    for (uint256 i = 0; i < users.length; i++) {
      addWhitelisted(users[i]);
      setCap(users[i], individualCaps[i]);
    }
  }
}
