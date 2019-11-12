pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Authorizable
 * @dev Authorizable offers a modifier to verify authorization of a user and functions to authorize/deauthorize users
 */
contract Authorizable is Ownable {
  mapping (address => bool) public authorized;

  /**
  * @dev constructor automatically authorizes the contract creator
  * @param owner address of the contract owner
  */
  constructor (address owner) public {
    transferOwnership(owner);
  }

  /**
  * @dev runs a function only after checking if a user is authorized
  * @param user address to verify authorization of
  */
  modifier isAuthorized(address user) {
    require(user != owner(), "Owner is not authorized");
    require(authorized[user], "Not authorized");

    _;
  }

  /**
  * @dev authorize a user under the isAuthorized modifier
  * @param user address to authorize
  */
  function authorize(address user) public onlyOwner {
    require(!authorized[user], "Already authorized");
    require(user != owner(), "Owner cannot be authorized");

    authorized[user] = true;
  }

  /**
  * @dev deauthorize a user under the isAuthorized modifier
  * @param user address to deauthorize
  */
  function deauthorize(address user) public onlyOwner {
    require(user != owner(), "Owner cannot be deauthorized");
    require(authorized[user], "Already unauthorized");

    authorized[user] = false;
  }
}
