// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/access/Ownable.sol";
import "./GameToken.sol";

contract TokenStore is ReentrancyGuard, Ownable {
    IERC20 public usdt;
    GameToken public gt;
    uint256 public gtPerUsdt;

    event Purchase(address indexed buyer, uint256 usdtAmount, uint256 gtOut);

    constructor(address _usdt, address _gt, uint256 _gtPerUsdt) {
        require(_usdt != address(0) && _gt != address(0), "Invalid address");
        usdt = IERC20(_usdt);
        gt = GameToken(_gt);
        gtPerUsdt = _gtPerUsdt;
    }

    function buy(uint256 usdtAmount) external nonReentrant {
        require(usdtAmount > 0, "Zero amount");
        uint256 gtOut = (usdtAmount * gtPerUsdt) / 1e6;
        require(gtOut > 0, "Zero output");

        require(usdt.transferFrom(msg.sender, address(this), usdtAmount), "USDT transfer failed");
        gt.mint(msg.sender, gtOut);

        emit Purchase(msg.sender, usdtAmount, gtOut);
    }

    function withdrawUSDT(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(usdt.transfer(to, amount), "Withdraw failed");
    }

    function setGtPerUsdt(uint256 _gtPerUsdt) external onlyOwner {
        require(_gtPerUsdt > 0, "Invalid rate");
        gtPerUsdt = _gtPerUsdt;
    }
}
