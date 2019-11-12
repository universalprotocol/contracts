pragma solidity ^0.5.0;

import "../ProxyTokenRequestsStorage.sol";

/**
 * @title UniversalBitcoinRequestsStorageV0
 */
contract UniversalBitcoinRequestsStorageV0 is ProxyTokenRequestsStorageV0 {
  /**
  * @notice Constructor for the UniversalBitcoinRequestsStorageV0
  * @param owner owner of the contract
  */
  constructor(address owner) public ProxyTokenRequestsStorageV0(owner) {} // solium-disable-line no-empty-blocks
}
