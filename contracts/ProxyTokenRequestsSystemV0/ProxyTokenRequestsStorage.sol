pragma solidity ^0.5.0;

import "../util/Authorizable.sol";
import "../ProxyToken/ProxyToken.sol";

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title ProxyTokenRequestsStorageV0
 */
contract ProxyTokenRequestsStorageV0 is Authorizable {
  using SafeMath for uint256;

  enum Status { NEW, FULFILLED, CANCELLED, REJECTED }

  /**
  * @notice MintRequest organizes data for requests involving token minting
  * @param status the status of the request
  * @param mintID the id of the request
  * @param addressMap String to address mapping
  * @param uintMap String to uint256 mapping
  * @param stringMap String to string mapping
  */
  struct MintRequest {
    Status status;
    uint256 mintID;

    mapping (string => address) addressMap;
    mapping (string => uint256) uintMap;
    mapping (string => string) stringMap;
  }

  /**
  * @notice BurnRequest organizes data for requests involving token burning
  * @param status the status of the request
  * @param burnID the id of the request
  * @param addressMap String to address mapping
  * @param uintMap String to uint256 mapping
  * @param stringMap String to string mapping
  */
  struct BurnRequest {
    Status status;
    uint256 burnID;

    mapping (string => address) addressMap;
    mapping (string => uint256) uintMap;
    mapping (string => string) stringMap;
  }

  MintRequest[] public mintRequests;
  BurnRequest[] public burnRequests;

  /**
  * @notice Constructor for the ProxyTokenRequestsStorageV0
  * @param owner address of owner
  */
  constructor(address owner) public Authorizable(owner) {} // solium-disable-line no-empty-blocks


  /**
  * @dev Runs a function only after checking if the requestId
  * is a valid burn request
  * @param requestId Identification for burn request
  */
  modifier onlyValidBurnRequest(uint256 requestId) {
    require(requestId < burnRequests.length, "Not a valid burn request ID");

    _;
  }

  /**
  * @dev Runs a function only after checking if the requestId
  * is a valid mint request
  * @param requestId Identification for mint request
  */
  modifier onlyValidMintRequest(uint256 requestId) {
    require(requestId < mintRequests.length, "Not a valid mint request ID");

    _;
  }

  /**
  * @notice Initialize a mint request
  */
  function createMintRequest()
    public
    isAuthorized(msg.sender)
    returns (uint256)
  {
    uint256 requestId = mintRequests.length;

    mintRequests.push(MintRequest(Status.NEW, requestId));

    return requestId;
  }

  /**
  * @notice Initialize a burn request
  */
  function createBurnRequest()
    public
    isAuthorized(msg.sender)
    returns (uint256)
  {
    uint256 requestId = burnRequests.length;

    burnRequests.push(BurnRequest(Status.NEW, requestId));

    return requestId;
  }

  /**
  * @notice Get the burn requests array length
  */
  function getBurnRequestsLength() public view returns(uint256) {
    return burnRequests.length;
  }

  /**
  * @notice Get the mint requests array length
  */
  function getMintRequestsLength() public view returns(uint256) {
    return mintRequests.length;
  }

  /**
  * @notice Return a mintRequest status
  * @param mintRequestID mintRequestID of mint request
  */
  function getMintRequestStatus(
    uint256 mintRequestID)
    public
    onlyValidMintRequest(mintRequestID)
    view
    returns (Status)
  {
    MintRequest storage request = mintRequests[mintRequestID];

    return request.status;
  }

  /**
  * @notice Return a burnRequest status
  * @param burnRequestID burnRequestID of burn request
  */
  function getBurnRequestStatus(
    uint256 burnRequestID)
    public
    onlyValidBurnRequest(burnRequestID)
    view
    returns (Status)
  {
    BurnRequest storage request = burnRequests[burnRequestID];

    return request.status;
  }

  /**
  * @notice Get a mintRequest's addressMap value with a specific key
  * @param mintRequestID mintRequestID of mint request to return
  * @param key Key value for addressMap
  */
  function getMintRequestAddressMap(
    uint256 mintRequestID,
    string memory key)
    public
    onlyValidMintRequest(mintRequestID)
    view
    returns (address)
  {
    MintRequest storage request = mintRequests[mintRequestID];

    return request.addressMap[key];
  }

  /**
  * @notice Get a burnRequest's addressMap value with a specific key
  * @param burnRequestID burnRequestID of mint request to return
  * @param key Key value for addressMap
  */
  function getBurnRequestAddressMap(
    uint256 burnRequestID,
    string memory key)
    public
    onlyValidBurnRequest(burnRequestID)
    view
    returns (address)
  {
    BurnRequest storage request = burnRequests[burnRequestID];

    return request.addressMap[key];
  }

  /**
  * @notice Get a mintRequest's uintMap value with a specific key
  * @param mintRequestID mintRequestID of mint request to return
  * @param key Key value for uintMap
  */
  function getMintRequestUintMap(
    uint256 mintRequestID,
    string memory key)
    public
    onlyValidMintRequest(mintRequestID)
    view
    returns (uint256)
  {
    MintRequest storage request = mintRequests[mintRequestID];

    return request.uintMap[key];
  }

  /**
  * @notice Get a burnRequest's uintMap value with a specific key
  * @param burnRequestID burnRequestID of mint request to return
  * @param key Key value for uintMap
  */
  function getBurnRequestUintMap(
    uint256 burnRequestID,
    string memory key)
    public
    onlyValidBurnRequest(burnRequestID)
    view
    returns (uint256)
  {
    BurnRequest storage request = burnRequests[burnRequestID];

    return request.uintMap[key];
  }

  /**
  * @notice Get a mintRequest's stringMap value with a specific key
  * @param mintRequestID mintRequestID of mint request to return
  * @param key Key value for stringMap
  */
  function getMintRequestStringMap(
    uint256 mintRequestID,
    string memory key)
    public
    onlyValidMintRequest(mintRequestID)
    view
    returns (string memory)
  {
    MintRequest storage request = mintRequests[mintRequestID];

    return request.stringMap[key];
  }

  /**
  * @notice Get a burnRequest's stringMap value with a specific key
  * @param burnRequestID burnRequestID of mint request to return
  * @param key Key value for stringMap
  */
  function getBurnRequestStringMap(
    uint256 burnRequestID,
    string memory key)
    public
    onlyValidBurnRequest(burnRequestID)
    view
    returns (string memory)
  {
    BurnRequest storage request = burnRequests[burnRequestID];

    return request.stringMap[key];
  }

  /**
  * @notice Modify a mintRequest status
  * @param mintRequestID mintRequestID of mint request to modify
  * @param newStatus New status to be set
  */
  function setMintRequestStatus(
    uint256 mintRequestID,
    Status newStatus)
    public
    isAuthorized(msg.sender)
    onlyValidMintRequest(mintRequestID)
  {
    MintRequest storage request = mintRequests[mintRequestID];

    request.status = newStatus;
  }

  /**
  * @notice Modify a burnRequest status
  * @param burnRequestID burnRequestID of burn request to modify
  * @param newStatus New status to be set
  */
  function setBurnRequestStatus(
    uint256 burnRequestID,
    Status newStatus)
    public
    isAuthorized(msg.sender)
    onlyValidBurnRequest(burnRequestID)
  {
    BurnRequest storage request = burnRequests[burnRequestID];

    request.status = newStatus;
  }

  /**
  * @notice Modify a mintRequest's addressMap with a specific key pair
  * @param mintRequestID mintRequestID of mint request to modify
  * @param key Key value for addressMap
  * @param value Value addressMap[key] will be changed to
  */
  function setMintRequestAddressMap(
    uint256 mintRequestID,
    string memory key,
    address value)
    public
    isAuthorized(msg.sender)
    onlyValidMintRequest(mintRequestID)
  {
    MintRequest storage request = mintRequests[mintRequestID];

    request.addressMap[key] = value;
  }

  /**
  * @notice Modify a burnRequest's addressMap with a specific key pair
  * @param burnRequestID burnRequestID of burn request to modify
  * @param key Key value for addressMap
  * @param value Value addressMap[key] will be changed to
  */
  function setBurnRequestAddressMap(
    uint256 burnRequestID,
    string memory key,
    address value)
    public
    isAuthorized(msg.sender)
    onlyValidBurnRequest(burnRequestID)
  {
    BurnRequest storage request = burnRequests[burnRequestID];

    request.addressMap[key] = value;
  }

  /**
  * @notice Modify a mintRequest's uintMap with a specific key pair
  * @param mintRequestID mintRequestID of mint request to modify
  * @param key Key value for uintMap
  * @param value Value uintMap[key] will be changed to
  */
  function setMintRequestUintMap(
    uint256 mintRequestID,
    string memory key,
    uint value)
    public
    isAuthorized(msg.sender)
    onlyValidMintRequest(mintRequestID)
  {
    MintRequest storage request = mintRequests[mintRequestID];

    request.uintMap[key] = value;
  }

  /**
  * @notice Modify a burnRequest's uintMap with a specific key pair
  * @param burnRequestID burnRequestID of burn request to modify
  * @param key Key value for uintMap
  * @param value Value uintMap[key] will be changed to
  */
  function setBurnRequestUintMap(
    uint256 burnRequestID,
    string memory key,
    uint value)
    public
    isAuthorized(msg.sender)
    onlyValidBurnRequest(burnRequestID)
  {
    BurnRequest storage request = burnRequests[burnRequestID];

    request.uintMap[key] = value;
  }

  /**
  * @notice Modify a mintRequest's stringMap with a specific key pair
  * @param mintRequestID mintRequestID of mint request to modify
  * @param key Key value for stringMap
  * @param value Value stringMap[key] will be changed to
  */
  function setMintRequestStringMap(
    uint256 mintRequestID,
    string memory key,
    string memory value)
    public
    isAuthorized(msg.sender)
    onlyValidMintRequest(mintRequestID)
  {
    MintRequest storage request = mintRequests[mintRequestID];

    request.stringMap[key] = value;
  }

  /**
  * @notice Modify a burnRequest's stringMap with a specific key pair
  * @param burnRequestID burnRequestID of burn request to modify
  * @param key Key value for stringMap
  * @param value Value stringMap[key] will be changed to
  */
  function setBurnRequestStringMap(
    uint256 burnRequestID,
    string memory key,
    string memory value)
    public
    isAuthorized(msg.sender)
    onlyValidBurnRequest(burnRequestID)
  {
    BurnRequest storage request = burnRequests[burnRequestID];

    request.stringMap[key] = value;
  }
}
