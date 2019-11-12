pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/access/Roles.sol";

contract ProxyTokenBurnerRole {
  using Roles for Roles.Role;

  event BurnerAdded(address indexed account);
  event BurnerRemoved(address indexed account);

  Roles.Role private burners;

  constructor() internal {
    _addBurner(msg.sender);
  }

  modifier onlyBurner() {
    require(isBurner(msg.sender), "Sender does not have a burner role");

    _;
  }

  function isBurner(address account) public view returns (bool) {
    return burners.has(account);
  }

  function addBurner(address account) public onlyBurner {
    _addBurner(account);
  }

  function renounceBurner() public {
    _removeBurner(msg.sender);
  }

  function _addBurner(address account) internal {
    burners.add(account);
    emit BurnerAdded(account);
  }

  function _removeBurner(address account) internal {
    burners.remove(account);
    emit BurnerRemoved(account);
  }
}
