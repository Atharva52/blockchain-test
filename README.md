# 🎮 Blockchain Gaming Platform – Technical Round Submission

## Overview
This project implements a **full-stack blockchain gaming platform** prototype, consisting of:
- **Smart Contracts** (Solidity) for token economy, on-ramp, and match escrow.
- **Backend Gateway** (Node.js + Express) to interact with contracts securely.
- **Minimal Frontend** (HTML + Vanilla JS) for end-user interaction.
- **Leaderboard Listener** (Node.js + ethers.js) to track and display winners.

---

## 📂 Project Structure
blockchain-test/
├─ contracts/ # Solidity smart contracts
│ ├─ GameToken.sol # ERC-20 GT token (18 decimals)
│ ├─ MockUSDT.sol # Test USDT token (6 decimals)
│ ├─ TokenStore.sol # USDT → GT purchase contract
│ ├─ PlayGame.sol # Escrow + payout for matches
├─ scripts/
│ └─ deploy.js # Example Hardhat deployment script
├─ api/
│ ├─ index.js # Minimal backend with endpoints
│ └─ .env.example # Environment variable template
├─ web/
│ └─ index.html # Simple UI to interact with backend
├─ tools/
│ └─ leaderboard.js # Event listener for leaderboard tracking
├─ package.json
└─ README.md

---

## 🏗 Architecture

1. **GameToken.sol**
   - ERC-20 token with 18 decimals.
   - Minting restricted to TokenStore contract.
   - Event logging for all mints.

2. **MockUSDT.sol**
   - ERC-20 token with 6 decimals.
   - Used for local/testnet simulation of USDT.

3. **TokenStore.sol**
   - On-ramp for exchanging USDT → GT.
   - Exchange rate configurable by owner.
   - USDT transferFrom + GT mint in CEI order.
   - NonReentrant guard for safety.

4. **PlayGame.sol**
   - Escrow for 2-player matches.
   - Both players must stake before match starts.
   - Operator (backend) commits result → transfers 2× stake to winner.
   - Refund possible after timeout if not settled.

5. **Backend (api/index.js)**
   - Handles HTTP requests and calls smart contracts.
   - Endpoints:
     - `GET /purchase?amount=` – Buy GT with USDT.
     - `POST /match/start` – Create new match.
     - `POST /match/result` – Submit match result.

6. **Frontend (web/index.html)**
   - Simple HTML+JS UI to trigger backend endpoints.
   - Inputs for purchase, match creation, and result submission.

7. **Leaderboard Listener (tools/leaderboard.js)**
   - Listens to `Settled` events from PlayGame.
   - Tracks wins and total GT won per player.
   - Displays top players in console.

---

## 🚀 Deployment & Testing

### Prerequisites
- [Node.js](https://nodejs.org/en/)
- [Hardhat](https://hardhat.org/) or Remix IDE for contract deployment
- Testnet RPC URL (e.g., Polygon Mumbai, Goerli)
- MetaMask or any Ethereum wallet

### Smart Contracts
#### Deployment Order
1. Deploy **MockUSDT.sol**
2. Deploy **GameToken.sol**
3. Deploy **TokenStore.sol** with:
