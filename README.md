# Blockchain Technical Round – MVP

## Overview
This MVP delivers the **token economy layer** for the game:
- **GameToken** (ERC-20, 18 decimals) – main in-game currency
- **MockUSDT** (ERC-20, 6 decimals) – test USDT token for simulation
- **TokenStore** – on-ramp contract to buy GT using USDT

## Features
- Minting restricted to `TokenStore`
- Secure purchase function with nonReentrant guard
- Mock USDT with 1M pre-minted supply for testing

## Deployment Order
1. Deploy `GameToken.sol`
2. Deploy `MockUSDT.sol`
3. Deploy `TokenStore.sol` with:
   - `_usdt` = MockUSDT address
   - `_gt` = GameToken address
   - `_gtPerUsdt` = `1000000000000000000` (1e18)
4. Call `setTokenStore(TokenStoreAddress)` in GameToken

## Future Scope
- PlayGame.sol escrow logic
- Leaderboard event listener
- Backend API and frontend UI

## Testing in Remix
1. Approve USDT for TokenStore
2. Call `buy()` to get GT
3. Check GT balance with `balanceOf()`
