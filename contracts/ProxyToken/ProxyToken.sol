pragma solidity ^0.5.0;

import "./ProxyTokenBurnable.sol";

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

/**
 * @title ProxyToken
 */
contract ProxyToken is ERC20, ERC20Detailed, ERC20Mintable, ProxyTokenBurnable {
  /**
  * @notice Constructor for the ProxyToken
  * @param owner owner of the initial proxy tokens
  * @param name name of the proxy token
  * @param symbol symbol of the proxy token
  * @param decimals divisibility of proxy token
  * @param initialProxySupply initial amount of proxy tokens
  */
  constructor(
    address owner,
    string memory name,
    string memory symbol,
    uint8 decimals,
    uint256 initialProxySupply)
  public ERC20Detailed(name, symbol, decimals) {
    mint(owner, initialProxySupply * (10 ** uint256(decimals)));

    if (owner == msg.sender) {
      return;
    }

    addBurner(owner);
    addMinter(owner);
    renounceBurner();
    renounceMinter();
  }
}
