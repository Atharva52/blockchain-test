// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/access/Ownable.sol";

contract GameToken is ERC20, Ownable {
    address public tokenStore;

    event Minted(address indexed to, uint256 amount);

    constructor() ERC20("Game Token", "GT") {}

    modifier onlyTokenStore() {
        require(msg.sender == tokenStore, "Not authorized");
        _;
    }

    function setTokenStore(address _store) external onlyOwner {
        require(_store != address(0), "Invalid address");
        tokenStore = _store;
    }

    function mint(address to, uint256 amount) external onlyTokenStore {
        _mint(to, amount);
        emit Minted(to, amount);
    }
}
