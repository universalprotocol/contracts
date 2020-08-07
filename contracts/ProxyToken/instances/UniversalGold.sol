pragma solidity ^0.5.0;

import "../ProxyToken.sol";

/**
 * @title UniversalGold
 */
contract UniversalGold is ProxyToken {
  /**
  * @notice Constructor for the UniversalGold
  * @param owner owner of the initial proxy tokens
  */
  constructor(address owner) public ProxyToken(owner, "Universal Gold", "UPXAU", 5, 0) {} // solium-disable-line no-empty-blocks
}
