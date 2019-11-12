pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "../ProxyToken/ProxyToken.sol";
import "../UniversalProtocolToken/UniversalProtocolToken.sol";
import "./ProxyTokenAuthorizable.sol";
import "./ProxyTokenRequestsStorage.sol";

/**
 * @title ProxyTokenRequestsV0
 */
contract ProxyTokenRequestsV0 is ProxyTokenAuthorizableV0 {
  using SafeMath for uint256;

  event FeeBeneficiaryUpdated(address beneficiary);

  event MintFeeUpdated(uint256 fee);
  event MintRequestCreated(uint256 indexed requestId);
  event MintRequestFulfilled(uint256 indexed requestId);
  event MintRequestCancelled(uint256 indexed requestId);
  event MintRequestRejected(uint256 indexed requestId);

  event BurnFeeUpdated(uint256 fee);
  event BurnRequestCreated(uint256 indexed requestId);
  event BurnRequestFulfilled(uint256 indexed requestId);
  event BurnRequestCancelled(uint256 indexed requestId);
  event BurnRequestRejected(uint256 indexed requestId);

  ProxyToken public _proxyToken;
  ProxyTokenRequestsStorageV0 public _storage;

  UniversalProtocolToken public _universalProtocolToken;
  address public _feeBeneficiary;
  uint256 public _burnFee;
  uint256 public _mintFee;

  /**
  * @notice Runs the function only after checking if a mint request is new
  * @param requestId Identification for mint request
  */
  modifier onlyNewMintRequest(uint256 requestId) {
    require(
      _storage.getMintRequestStatus(requestId) == ProxyTokenRequestsStorageV0.Status.NEW,
      "The mint request status must be new"
    );
    _;
  }

  /**
  * @notice Runs the function only after checking if a burn request is new
  * @param requestId Identification for burn request
  */
  modifier onlyNewBurnRequest(uint256 requestId) {
    require(
      _storage.getBurnRequestStatus(requestId) == ProxyTokenRequestsStorageV0.Status.NEW,
      "The burn request status must be new"
    );
    _;
  }

  /**
  * @dev Runs a function only after checking if a user is authorized to request
  * or is the requester of the proxy tokens to be minted
  * @param user Address for verifying authorization
  * @param requestId Identification for mint request
  */
  modifier onlySelfMintRequester(address user, uint256 requestId) {
    require(
      mintRequestAuthorization[user] && _storage.getMintRequestAddressMap(requestId, "requester") == user,
      "Only authorized mint requester"
    );
    _;
  }

  /**
  * @dev Runs a function only after checking if a user is authorized to request,
  * or is the requester of the proxy tokens to be burned
  * @param user Address for verifying authorization
  * @param requestId Identification for burn request
  */
  modifier onlySelfBurnRequester(address user, uint256 requestId) {
    require(
      burnRequestAuthorization[user] && _storage.getBurnRequestAddressMap(requestId, "requester") == user,
      "Only authorized burn requester"
    );
    _;
  }

  /**
  * @notice Constructor for ProxyTokenRequests
  * @param owner owner of the contract
  * @param universalProtocolTokenAddress address of the UPT contract
  * @param feeBeneficiary address of the beneficiary of the mint and burn fees
  * @param burnFee burn fee (in UPT)
  * @param mintFee mint fee (in UPT)
  * @param proxyToken address of the Proxy Token
  * @param proxyTokenRequestsStorage address for ProxyTokenRequestsStorage
  */
  constructor(
    address owner,
    address universalProtocolTokenAddress,
    address feeBeneficiary,
    uint256 burnFee,
    uint256 mintFee,
    address proxyToken,
    address proxyTokenRequestsStorage)
  public ProxyTokenAuthorizableV0(owner) {
    require(feeBeneficiary != address(0x0), "UPT beneficiary cannot be the zero address");

    _burnFee = burnFee;
    _feeBeneficiary = feeBeneficiary;
    _mintFee = mintFee;
    _proxyToken = ProxyToken(proxyToken);
    _storage = ProxyTokenRequestsStorageV0(proxyTokenRequestsStorage);
    _universalProtocolToken = UniversalProtocolToken(universalProtocolTokenAddress);
  }

  /**
  * @notice Creates a mint request
  * @notice This function requires the requester to call the `approve`
  * function for `mintFee` of UniversalProtocolToken (UPT) tokens before calling this function.
  * @param beneficiary address of the beneficiary of the tokens to be minted
  * @param amount amount of proxy tokens to mint
  */
  function createMintRequest(
    address beneficiary,
    uint256 amount,
    string memory data)
    public
    onlyAuthorizedMintRequester(msg.sender)
  {
    require(amount > 0, "Proxy amount cannot be zero");

    if (_mintFee > 0) {
      require(_universalProtocolToken.transferFrom(msg.sender, _feeBeneficiary, _mintFee), "Failed to charge UPT mint fee");
    }

    uint256 requestId = _storage.createMintRequest();
    _storage.setMintRequestAddressMap(requestId, "beneficiary", beneficiary);
    _storage.setMintRequestAddressMap(requestId, "fulfiller", address(0x0));
    _storage.setMintRequestAddressMap(requestId, "rejecter", address(0x0));
    _storage.setMintRequestAddressMap(requestId, "requester", msg.sender);
    _storage.setMintRequestStringMap(requestId, "requestData", data);
    _storage.setMintRequestUintMap(requestId, "amount", amount);

    emit MintRequestCreated(requestId);
  }

  /**
  * @notice Fulfills a mint request, minting `amount` tokens
  * @param requestId requestId of mint request to fulfill
  * @param data external data logged as part of the mint request
  */
  function fulfillMintRequest(
    uint256 requestId,
    string memory data)
    public
    onlyNewMintRequest(requestId)
    onlyAuthorizedMintFulfiller(msg.sender)
  {
    _storage.setMintRequestStatus(requestId, ProxyTokenRequestsStorageV0.Status.FULFILLED);
    _storage.setMintRequestAddressMap(requestId, "fulfiller", msg.sender);
    _storage.setMintRequestStringMap(requestId, "fulfillData", data);

    address beneficiary = _storage.getMintRequestAddressMap(requestId, "beneficiary");
    uint256 amount = _storage.getMintRequestUintMap(requestId, "amount");
    require(_proxyToken.mint(beneficiary, amount), "fulfillMintRequest failed");

    emit MintRequestFulfilled(requestId);
  }

  /**
  * @notice The proxy token owner or an authorized requester cancels a mint request
  * @param requestId requestId of mint request to cancel
  * @param data external data logged as part of the mint request cancellation
  */
  function cancelMintRequest(
    uint256 requestId,
    string memory data)
    public
    onlyNewMintRequest(requestId)
    onlySelfMintRequester(msg.sender, requestId)
  {
    _storage.setMintRequestStatus(requestId, ProxyTokenRequestsStorageV0.Status.CANCELLED);
    _storage.setMintRequestStringMap(requestId, "cancelData", data);

    emit MintRequestCancelled(requestId);
  }

  /**
  * @notice An authorized fulfiller rejects a mint request
  * @param requestId requestId of mint request to cancel
  * @param data external data logged as part of the mint request cancellation
  */
  function rejectMintRequest(
    uint256 requestId,
    string memory data)
    public
    onlyNewMintRequest(requestId)
    onlyAuthorizedMintFulfiller(msg.sender)
  {
    _storage.setMintRequestStatus(requestId, ProxyTokenRequestsStorageV0.Status.REJECTED);
    _storage.setMintRequestAddressMap(requestId, "rejecter", msg.sender);
    _storage.setMintRequestStringMap(requestId, "rejectData", data);

    emit MintRequestRejected(requestId);
  }

  /**
  * @notice Creates a burn request, transfering `amount` tokens to this contract as escrow.
  * @notice This function requires the requester to call the `approveBurn` function
  * for `amount` tokens before calling this function and `approve` for `burnFee` of
  * UniversalProtocolToken (UPT) tokens.
  * @param beneficiary address of the beneficiary of the tokens to be burnt
  * @param amount amount of proxy tokens to burn
  */
  function createBurnRequest(
    address beneficiary,
    uint256 amount,
    string memory data)
    public
    onlyAuthorizedBurnRequester(msg.sender)
  {
    require(amount > 0, "Proxy amount cannot be zero");

    if (_burnFee > 0) {
      require(_universalProtocolToken.transferFrom(msg.sender, _feeBeneficiary, _burnFee), "Failed to charge UPT burn fee");
    }

    uint256 requestId = _storage.createBurnRequest();
    _storage.setBurnRequestAddressMap(requestId, "beneficiary", beneficiary);
    _storage.setBurnRequestAddressMap(requestId, "fulfiller", address(0x0));
    _storage.setBurnRequestAddressMap(requestId, "rejecter", address(0x0));
    _storage.setBurnRequestAddressMap(requestId, "requester", msg.sender);
    _storage.setBurnRequestStringMap(requestId, "requestData", data);
    _storage.setBurnRequestUintMap(requestId, "amount", amount);

    emit BurnRequestCreated(requestId);
  }

  /**
  * @notice Fulfills a burn request, burning `amount` tokens
  * @param requestId requestId of burn request to fulfill
  * @param data external data logged as part of the burn request
  */
  function fulfillBurnRequest(
    uint256 requestId,
    string memory data)
    public
    onlyNewBurnRequest(requestId)
    onlyAuthorizedBurnFulfiller(msg.sender)
  {
    _storage.setBurnRequestAddressMap(requestId, "fulfiller", msg.sender);
    _storage.setBurnRequestStatus(requestId, ProxyTokenRequestsStorageV0.Status.FULFILLED);
    _storage.setBurnRequestStringMap(requestId, "fulfillData", data);

    address beneficiary = _storage.getBurnRequestAddressMap(requestId, "beneficiary");
    uint256 amount = _storage.getBurnRequestUintMap(requestId, "amount");
    require(_proxyToken.burnFrom(beneficiary, amount), "fulfillBurnRequest failed");

    emit BurnRequestFulfilled(requestId);
  }

  /**
  * @notice The proxy token owner or an authorized requester cancels a burn request
  * @param requestId requestId of burn request to cancel
  * @param data external data logged as part of the burn request cancellation
  */
  function cancelBurnRequest(
    uint256 requestId,
    string memory data)
    public
    onlyNewBurnRequest(requestId)
    onlySelfBurnRequester(msg.sender, requestId)
  {
    _storage.setBurnRequestStatus(requestId, ProxyTokenRequestsStorageV0.Status.CANCELLED);
    _storage.setBurnRequestStringMap(requestId, "cancelData", data);

    emit BurnRequestCancelled(requestId);
  }

  /**
  * @notice An authorized fulfiller rejects a burn request
  * @param requestId requestId of burn request to cancel
  * @param data external data logged as part of the burn request cancellation
  */
  function rejectBurnRequest(
    uint256 requestId,
    string memory data)
    public
    onlyNewBurnRequest(requestId)
    onlyAuthorizedBurnFulfiller(msg.sender)
  {
    _storage.setBurnRequestAddressMap(requestId, "rejecter", msg.sender);
    _storage.setBurnRequestStatus(requestId, ProxyTokenRequestsStorageV0.Status.REJECTED);
    _storage.setBurnRequestStringMap(requestId, "rejectData", data);

    emit BurnRequestRejected(requestId);
  }

  /**
  * @notice Get the burn fee
  */
  function getBurnFee() public view returns(uint256) {
    return _burnFee;
  }

  /**
  * @notice Get the UPT fee beneficiary
  */
  function getFeeBeneficiary() public view returns(address) {
    return _feeBeneficiary;
  }

  /**
  * @notice Get the mint fee
  */
  function getMintFee() public view returns(uint256) {
    return _mintFee;
  }

  /**
  * @notice The owner can set a new burn fee
  * @param burnFee the burn fee in UPT
  */
  function setBurnFee(uint256 burnFee) public onlyOwner {
    _burnFee = burnFee;

    emit BurnFeeUpdated(_burnFee);
  }

  /**
  * @notice The owner can set a UPT fee beneficiary
  * @param feeBeneficiary the UPT fee beneficiary
  */
  function setFeeBeneficiary(address feeBeneficiary) public onlyOwner {
    _feeBeneficiary = feeBeneficiary;

    emit FeeBeneficiaryUpdated(feeBeneficiary);
  }

  /**
  * @notice The owner can set a new mint fee
  * @param mintFee the mint fee in UPT
  */
  function setMintFee(uint256 mintFee) public onlyOwner {
    _mintFee = mintFee;

    emit MintFeeUpdated(_mintFee);
  }
}
