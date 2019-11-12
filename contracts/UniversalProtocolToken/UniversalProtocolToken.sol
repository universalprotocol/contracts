pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

/**
 * @title UniversalProtocolToken
 */

contract UniversalProtocolToken is ERC20, ERC20Detailed {
  uint8 public constant DECIMALS = 18;
  uint256 public constant INITIAL_SUPPLY = (10 ** 10) * (10 ** uint256(DECIMALS));

  /**
   * @dev Constructor that gives beneficiary all of existing tokens.
   */
  constructor (address beneficiary) public ERC20Detailed("Universal Protocol Token", "UPT", DECIMALS) {
    _mint(beneficiary, INITIAL_SUPPLY);
  }
}
