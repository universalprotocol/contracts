pragma solidity ^0.5.0;

import "./ProxyTokenBurnerRole.sol";

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/**
 * @title Burnable Token
 * @dev Token that can be irreversibly burned (destroyed).
 */
contract ProxyTokenBurnable is ERC20, ProxyTokenBurnerRole {
  mapping (address => mapping (address => uint256)) private _burnAllowed;

  event BurnApproval(address indexed owner, address indexed spender, uint256 value);

  /**
   * @dev Modifier to check if a burner can burn a specific amount of owner's tokens.
   * @param burner address The address which will burn the funds.
   * @param owner address The address which owns the funds.
   * @param amount uint256 The amount of tokens to burn.
   */

  modifier onlyWithBurnAllowance(address burner, address owner, uint256 amount) {
    if (burner != owner) {
      require(burnAllowance(owner, burner) >= amount, "Not enough burn allowance");
    }
    _;
  }

  /**
   * @dev Function to check the amount of tokens that an owner allowed to burn.
   * @param owner address The address which owns the funds.
   * @param burner address The address which will burn the funds.
   * @return A uint256 specifying the amount of tokens still available to burn.
   */
  function burnAllowance(address owner, address burner) public view returns (uint256) {
    return _burnAllowed[owner][burner];
  }

  /**
   * @dev Increase the amount of tokens that an owner allowed to a burner to burn.
   * @param burner The address which will burn the funds.
   * @param addedValue The increased amount of tokens to be burnt.
   */
  function increaseBurnAllowance(address burner, uint256 addedValue) public returns (bool) {
    require(burner != address(0), "Invalid burner address");

    _burnAllowed[msg.sender][burner] = _burnAllowed[msg.sender][burner].add(addedValue);

    emit BurnApproval(msg.sender, burner, _burnAllowed[msg.sender][burner]);

    return true;
  }

  /**
   * @dev Decrease the amount of tokens that an owner allowed to a burner to burn.
   * @param burner The address which will burn the funds.
   * @param subtractedValue The subtractedValue amount of tokens to be burnt.
   */
  function decreaseBurnAllowance(address burner, uint256 subtractedValue) public returns (bool) {
    require(burner != address(0), "Invalid burner address");

    _burnAllowed[msg.sender][burner] = _burnAllowed[msg.sender][burner].sub(subtractedValue);

    emit BurnApproval(msg.sender, burner, _burnAllowed[msg.sender][burner]);

    return true;
  }

  /**
   * @dev Function to burn tokens
   * @param amount The amount of tokens to burn.
   * @return A boolean that indicates if the operation was successful.
   */
  function burn(uint256 amount)
    public
    onlyBurner
  returns (bool) {
    _burn(msg.sender, amount);

    return true;
  }

  /**
   * @dev Burns a specific amount of tokens from the target address and decrements allowance
   * @param account address The address which you want to send tokens from
   * @param amount uint256 The amount of token to be burned
   */
  function burnFrom(address account, uint256 amount)
    public
    onlyBurner
    onlyWithBurnAllowance(msg.sender, account, amount)
  returns (bool) {
    _burnAllowed[account][msg.sender] = _burnAllowed[account][msg.sender].sub(amount);

    _burn(account, amount);

    emit BurnApproval(account, msg.sender, _burnAllowed[account][msg.sender]);

    return true;
  }
}
