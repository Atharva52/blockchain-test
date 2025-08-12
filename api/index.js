// api/index.js
require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");

const app = express();
app.use(express.json());

// Setup provider & signer
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load ABIs
const tokenStoreAbi = require("./abis/TokenStore.json");
const playGameAbi = require("./abis/PlayGame.json");

const tokenStore = new ethers.Contract(process.env.TOKENSTORE_ADDRESS, tokenStoreAbi, wallet);
const playGame = new ethers.Contract(process.env.PLAYGAME_ADDRESS, playGameAbi, wallet);

// Routes
app.get("/purchase", async (req, res) => {
  try {
    const amount = ethers.BigNumber.from(req.query.amount);
    const tx = await tokenStore.buy(amount);
    await tx.wait();
    res.json({ status: "success", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/match/start", async (req, res) => {
  try {
    const { matchId, p1, p2, stake } = req.body;
    const tx = await playGame.createMatch(matchId, p1, p2, stake);
    await tx.wait();
    res.json({ status: "match created", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/match/result", async (req, res) => {
  try {
    const { matchId, winner } = req.body;
    const tx = await playGame.commitResult(matchId, winner);
    await tx.wait();
    res.json({ status: "match settled", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
