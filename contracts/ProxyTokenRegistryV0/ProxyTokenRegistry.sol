pragma solidity ^0.5.0;

import "../util/Authorizable.sol";
import "../ProxyToken/ProxyToken.sol";

/**
 * @title ProxyTokenRegistryV0
 * @dev ProxyTokenRegistryV0 acts as a registry for all proxy tokens.
 */
contract ProxyTokenRegistryV0 is Ownable {
  mapping (address => string) public _tokenNames;
  mapping (bytes32 => address) public _tokenAddresses;
  mapping (address => address) public _tokenRequests;
  mapping (address => bool) public _registeredTokens;

  event ProxyTokenRegistered(string tokenName, address tokenAddress, address tokenRequests, uint256 time);
  event ProxyTokenUnregistered(string tokenName, address tokenAddress, uint256 time);

  /**
  * @notice Constructor for ProxyTokenRequests
  * @param owner owner of the contract
  */
  constructor(address owner) public {
    transferOwnership(owner);
  }

  /**
  * @dev registerProxyToken registers a token iff the token has not been previously registered.
  * @param tokenAddress is the address of the ProxyToken to register
  * @param tokenRequests is the address of the ProxyToken requests to register
  */
  function registerProxyToken(
    address tokenAddress,
    address tokenRequests)
    public
    onlyOwner
  {
    ProxyToken token = ProxyToken(tokenAddress);
    string memory name = token.name();
    bytes32 tokenName = keccak256(abi.encodePacked(name));
    require(_tokenAddresses[tokenName] == address(0x0), "Token address already taken");

    _tokenNames[tokenAddress] = name;
    _tokenAddresses[tokenName] = tokenAddress;
    _registeredTokens[tokenAddress] = true;

    setProxyTokenRequests(tokenAddress, tokenRequests);
    emit ProxyTokenRegistered(name, tokenAddress, tokenRequests, block.timestamp); // solium-disable-line security/no-block-members
  }

  /**
  * @dev setProxyTokenRequests sets the address of ProxyTokenRequests
  * @param tokenAddress is the address of the ProxyToken to register
  * @param tokenRequests is the address of the ProxyToken requests to register
  */
  function setProxyTokenRequests(
    address tokenAddress,
    address tokenRequests)
    public
    onlyOwner
  {
    require(_registeredTokens[tokenAddress], "Cannot find the registered token address");

    _tokenRequests[tokenAddress] = tokenRequests;
  }

  /**
  * @dev unregisterProxyToken unregisters a token
  * @param tokenAddress is the address of the ProxyToken to unregister
  */
  function unregisterProxyToken(address tokenAddress) public onlyOwner {
    ProxyToken token = ProxyToken(tokenAddress);
    string memory name = token.name();
    bytes32 tokenName = keccak256(abi.encodePacked(name));

    delete _tokenNames[tokenAddress];
    delete _tokenAddresses[tokenName];
    delete _tokenRequests[tokenAddress];
    delete _registeredTokens[tokenAddress];

    emit ProxyTokenUnregistered(name, tokenAddress, block.timestamp); // solium-disable-line security/no-block-members
  }

  /**
  * @param name is the name of the proxy token to lookup in the registry
  * @return returns the address of the token with name `name`.
  * If the address is 0x000...00 then the token has not been registered.
  */
  function getToken(string memory name) public view returns (address) {
    bytes32 tokenName = keccak256(abi.encodePacked(name));
    return _tokenAddresses[tokenName];
  }

  /**
  * @param tokenAddress is the address of the proxy token to lookup in the registry
  * @return returns the name of the token with address `tokenAddress`.
  * If the name is '' then the token has not been registered.
  */
  function getTokenName(address tokenAddress) public view returns (string memory) {
    return _tokenNames[tokenAddress];
  }
}
