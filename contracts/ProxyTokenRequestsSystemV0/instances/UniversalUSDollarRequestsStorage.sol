pragma solidity ^0.5.0;

import "../ProxyTokenRequestsStorage.sol";

/**
 * @title UniversalUSDollarRequestsStorageV0
 */
contract UniversalUSDollarRequestsStorageV0 is ProxyTokenRequestsStorageV0 {
  /**
  * @notice Constructor for the UniversalUSDollarRequestsStorageV0
  * @param owner owner of the contract
  */
  constructor(address owner) public ProxyTokenRequestsStorageV0(owner) {} // solium-disable-line no-empty-blocks
}
