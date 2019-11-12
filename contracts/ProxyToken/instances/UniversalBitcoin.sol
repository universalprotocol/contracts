pragma solidity ^0.5.0;

import "../ProxyToken.sol";

/**
 * @title UniversalBitcoin
 */
contract UniversalBitcoin is ProxyToken {
  /**
  * @notice Constructor for the UniversalBitcoin
  * @param owner owner of the initial proxy tokens
  */
  constructor(address owner) public ProxyToken(owner, "Universal Bitcoin", "UPBTC", 8, 0) {} // solium-disable-line no-empty-blocks
}
