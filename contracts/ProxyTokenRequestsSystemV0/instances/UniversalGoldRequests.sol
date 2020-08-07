pragma solidity ^0.5.0;

import "../ProxyTokenRequests.sol";

/**
 * @title UniversalGoldRequestsV0
 */
contract UniversalGoldRequestsV0 is ProxyTokenRequestsV0 {
  /**
  * @notice Constructor for the UniversalGoldRequestsV0
  * @param owner owner of the contract
  */
  constructor(
    address owner,
    address universalProtocolToken,
    address uptFeeBeneficiary,
    uint256 burnFee,
    uint256 mintFee,
    address proxyToken,
    address proxyTokenRequestsStorage
  ) public ProxyTokenRequestsV0(
    owner,
    universalProtocolToken,
    uptFeeBeneficiary,
    burnFee,
    mintFee,
    proxyToken,
    proxyTokenRequestsStorage
  ) {} // solium-disable-line no-empty-blocks
}
