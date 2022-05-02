// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// Extend WChick token
/// @author seiji-ito
/// @dev updated:
///     - applied total_supply_limit by _mintingFinished flag
///     - gas optimization
///         1. changed some functions`s visibility from "public" to "external"
///         2. changed transfer function (removed unnecessary validation)
contract WChicks is ERC20, Ownable {
    address private s_serviceAddress;

    address private s_presaleAddress;

    uint16 private s_feePercent = 15; //1.5%

    bool private s_canMint = false;

    // apply max total supply limit
    bool private s_mintingFinished = false;

    // max total supply limit 10,000,000,000 * DECIMAL
    uint256 private constant MAX_TOTAL_SUPPLY_LIMIT = 1e19;

    event UpdateMintStatus(bool oldStatus, bool newStatus);
    event SetServiceAddress(address oldAddress, address newAddress);
    event SetPresaleAddress(address oldAddress, address newAddress);
    event SetFeePercent(uint16 oldFee, uint16 newSNewFee);
    event UpdateMintingFinished(bool oldMintingFinished, bool newMintingFinished);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialBalance
    ) ERC20(name, symbol) {
        require(initialBalance > 0, "WChicks: Supply cannot be zero");
        _mint(msg.sender, initialBalance * (10**decimals()));
    }

    function mint(address account, uint256 amount) external onlyOwner {
        require(!s_canMint, "WChicks: minting is finished");

        _mint(account, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 9;
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override {
        uint256 receiveAmount = amount;
        uint256 feePercent = s_feePercent;
        address serviceAddress = s_serviceAddress;
        address presaleAddress = s_presaleAddress;

        // feePercent can not be zero (initial: 1.5% and can not set as zero in "setFee" function)
        if (
            sender != presaleAddress &&
            sender != serviceAddress &&
            serviceAddress != recipient &&
            serviceAddress != address(0)
        ) {
            uint256 feeAmount = (amount * feePercent) / 1000;
            receiveAmount = amount - feeAmount;

            // feeAmount can not be zero in here
            super._transfer(sender, serviceAddress, feeAmount);
        }

        super._transfer(sender, recipient, receiveAmount);
    }

    function migrate(uint256 amount) public returns (bool) {
        require(amount > 0, "WChicks: Invalid amount");
        return transfer(s_serviceAddress, amount);
    }

    // @notice public -> external (for saving gas)
    function setService(address value) external onlyOwner {
        address oldServiceAddress = s_serviceAddress;

        require(value != address(0) && value != oldServiceAddress, "WChicks: Invalid Service Address");

        s_serviceAddress = value;

        emit SetServiceAddress(oldServiceAddress, value);
    }

    // @notice public -> external (for saving gas)
    function setPresale(address value) external onlyOwner {
        address oldPresaleAddress = s_presaleAddress;

        require(value != address(0) && value != oldPresaleAddress, "WChicks: Invalid Presale Address");

        s_presaleAddress = value;

        emit SetPresaleAddress(oldPresaleAddress, value);
    }

    // @notice public -> external (for saving gas), add "feePercent" parameter validation (9000 >= feePercent > 0)
    function setFee(uint16 feePercent) external onlyOwner {
        require(feePercent != 0 && feePercent <= 900, "WChicks: Invalid Fee Percentage");

        uint16 oldFeePercent = s_feePercent;
        require(oldFeePercent != feePercent, "WChicks: new fee percentage unchanged");

        s_feePercent = feePercent;

        emit SetFeePercent(oldFeePercent, feePercent);
    }

    // @notice public -> external (for saving gas)
    function fee() external view returns (uint16) {
        return s_feePercent;
    }

    // public -> external (for saving gas)
    function service() external view returns (address) {
        return s_serviceAddress;
    }

    // public -> external (for saving gas)
    function presale() external view returns (address) {
        return s_presaleAddress;
    }

    function setMint(bool _canMint) external onlyOwner {
        bool oldStatus = s_canMint;
        bool newStatus = _canMint;

        require(oldStatus != newStatus, "WChicks: new mint status unchanged");

        s_canMint = _canMint;
        emit UpdateMintStatus(oldStatus, newStatus);
    }

    /// @notice override ERC20`s _mint function for adding max_total_supply limit validation
    /// @param account The target address minting tokens
    /// @param amount The minting token amount
    function _mint(address account, uint256 amount) internal override {
        // if s_mintingFinished is set, check total supply limit
        if(s_mintingFinished){
            uint256 afterTotalSupply = totalSupply() + amount;
            require(afterTotalSupply <= MAX_TOTAL_SUPPLY_LIMIT, "WChicks: total supply was limited");
        }

        // call ERC20 _mint function
        super._mint(account, amount);
    }

    // read the minting_finished flag
    function mintingFinished() external view returns (bool){
        return s_mintingFinished;
    }

    // set the minting_finished flag
    /// @param _mintingFinished The new minting_finished flag
    function setMintingFinished(bool _mintingFinished) external onlyOwner {
        bool oldMintingFinished = s_mintingFinished;
        require(oldMintingFinished != _mintingFinished, "WChicks: new minting_finished flag unchanged");

        s_mintingFinished = _mintingFinished;

        emit UpdateMintingFinished(oldMintingFinished, _mintingFinished);
    }
 }
