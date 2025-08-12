// tools/leaderboard.js
const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const playGameAbi = require("./abis/PlayGame.json");
const playGame = new ethers.Contract(process.env.PLAYGAME_ADDRESS, playGameAbi, provider);

const leaderboard = {};

function updateLeaderboard(winner, amount) {
  if (!leaderboard[winner]) leaderboard[winner] = { wins: 0, totalGT: ethers.BigNumber.from(0) };
  leaderboard[winner].wins += 1;
  leaderboard[winner].totalGT = leaderboard[winner].totalGT.add(amount);
  console.table(leaderboard);
}

playGame.on("Settled", (matchId, winner, amount) => {
  console.log(`Match ${matchId} settled: ${winner} won ${amount.toString()} GT`);
  updateLeaderboard(winner, amount);
});

console.log("Listening for Settled events...");
