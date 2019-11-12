pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title ProxyTokenAuthorizableV0
 * @dev ProxyTokenAuthorizableV0 offers modifiers to verify authorization of a user
 * and functions to authorize and deauthorize users
 */
contract ProxyTokenAuthorizableV0 is Ownable {
  mapping (address => bool) public mintRequestAuthorization;
  mapping (address => bool) public mintFulfillAuthorization;
  mapping (address => bool) public burnRequestAuthorization;
  mapping (address => bool) public burnFulfillAuthorization;

  /**
  * @dev Runs a function only after checking if a user is not the owner
  * @param user Address for verifying authorization
  */
  modifier exceptOwner(address user) {
    require(user != owner(), "User cannot be the owner");
    _;
  }

  /**
  * @dev Runs a function only after checking if a user is authorized to request mints
  * @param user Address for verifying authorization
  */
  modifier onlyAuthorizedMintRequester(address user) {
    require(mintRequestAuthorization[user], "Only authorized mint requester");
    _;
  }

  /**
  * @dev Runs a function only after checking if a user is authorized to fulfill mints
  * @param user Address for verifying authorization
  */
  modifier onlyAuthorizedMintFulfiller(address user) {
    require(mintFulfillAuthorization[user], "Only authorized mint fulfiller");
    _;
  }

  /**
  * @dev Runs a function only after checking if a user is authorized to request burns
  * @param user Address for verifying authorization
  */
  modifier onlyAuthorizedBurnRequester(address user) {
    require(burnRequestAuthorization[user], "Only authorized burn requester");
    _;
  }

  /**
  * @dev Runs a function only after checking if a user is authorized to fulfill burns
  * @param user Address for verifying authorization
  */
  modifier onlyAuthorizedBurnFulfiller(address user) {
    require(burnFulfillAuthorization[user], "Only authorized burn fulfiller");
    _;
  }

  /**
  * @dev Constructor assigns authorization to the provided owner
  * @param owner Address of the owner of this contract
  */
  constructor (address owner) public {
    if (msg.sender == owner) {
      return;
    }

    transferOwnership(owner);
  }

  /**
  * @dev Authorize a user under the onlyAuthorizedMintRequester modifier
  * @param user Address to authorize
  */
  function authorizeMintRequester(address user) public onlyOwner exceptOwner(user) {
    require(!mintRequestAuthorization[user], "User has mint request authorization");
    require(!mintFulfillAuthorization[user], "User has mint fulfill authorization");

    mintRequestAuthorization[user] = true;
  }

  /**
  * @dev Deauthorize a user under the onlyAuthorizedMintRequester modifier
  * @param user Address to deauthorize
  */
  function deauthorizeMintRequester(address user) public onlyOwner {
    require(mintRequestAuthorization[user], "User does not have mint request authorization");

    mintRequestAuthorization[user] = false;
  }

  /**
  * @dev Authorize a user under the onlyAuthorizedMintFulfiller modifier
  * @param user Address to authorize
  */
  function authorizeMintFulfiller(address user) public onlyOwner exceptOwner(user) {
    require(!mintRequestAuthorization[user], "User has mint request authorization");
    require(!mintFulfillAuthorization[user], "User has mint fulfill authorization");

    mintFulfillAuthorization[user] = true;
  }

  /**
  * @dev Deauthorize a user under the onlyAuthorizedMintFulfiller modifier
  * @param user Address to deauthorize
  */
  function deauthorizeMintFulfiller(address user) public onlyOwner {
    require(mintFulfillAuthorization[user], "User does not have mint fulfill authorization");

    mintFulfillAuthorization[user] = false;
  }

  /**
  * @dev Authorize a user under the onlyAuthorizedBurnRequester modifier
  * @param user Address to authorize
  */
  function authorizeBurnRequester(address user) public onlyOwner exceptOwner(user) {
    require(!burnRequestAuthorization[user], "User has burn request authorization");
    require(!burnFulfillAuthorization[user], "User has burn fulfill authorization");

    burnRequestAuthorization[user] = true;
  }

  /**
  * @dev Deauthorize a user under the onlyAuthorizedBurnRequester modifier
  * @param user Address to deauthorize
  */
  function deauthorizeBurnRequester(address user) public onlyOwner {
    require(burnRequestAuthorization[user], "User does not have burn request authorization");

    burnRequestAuthorization[user] = false;
  }

  /**
  * @dev Authorize a user under the onlyAuthorizedBurnFulfiller modifier
  * @param user Address to authorize
  */
  function authorizeBurnFulfiller(address user) public onlyOwner exceptOwner(user) {
    require(!burnRequestAuthorization[user], "User has burn request authorization");
    require(!burnFulfillAuthorization[user], "User has burn fulfill authorization");

    burnFulfillAuthorization[user] = true;
  }

  /**
  * @dev Deauthorize a user under the onlyAuthorizedBurnFulfiller modifier
  * @param user Address to deauthorize
  */
  function deauthorizeBurnFulfiller(address user) public onlyOwner {
    require(burnFulfillAuthorization[user], "Only authorized burn fulfiller");

    burnFulfillAuthorization[user] = false;
  }
}
