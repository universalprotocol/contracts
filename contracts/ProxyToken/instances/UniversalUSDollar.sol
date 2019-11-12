pragma solidity ^0.5.0;

import "../ProxyToken.sol";

/**
 * @title UniversalUSDollar
 */
contract UniversalUSDollar is ProxyToken {
  /**
  * @notice Constructor for the UniversalUSDollar
  * @param owner owner of the initial proxy tokens
  */
  constructor(address owner) public ProxyToken(owner, "Universal US Dollar", "UPUSD", 2, 0) {} // solium-disable-line no-empty-blocks
}
