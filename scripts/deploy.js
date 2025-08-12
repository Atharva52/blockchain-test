// scripts/deploy.js
// This script demonstrates deployment order for contracts.
// For the test, it shows logical flow even if not run.

async function main() {
  console.log("Starting deployment...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy MockUSDT
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();
  await usdt.deployed();
  console.log("MockUSDT deployed to:", usdt.address);

  // Deploy GameToken
  const GameToken = await ethers.getContractFactory("GameToken");
  const gt = await GameToken.deploy();
  await gt.deployed();
  console.log("GameToken deployed to:", gt.address);

  // Deploy TokenStore
  const gtPerUsdt = ethers.utils.parseUnits("1", 18); // 1 USDT => 1 GT
  const TokenStore = await ethers.getContractFactory("TokenStore");
  const store = await TokenStore.deploy(usdt.address, gt.address, gtPerUsdt);
  await store.deployed();
  console.log("TokenStore deployed to:", store.address);

  // Link TokenStore to GameToken
  await gt.setTokenStore(store.address);
  console.log("TokenStore linked to GameToken");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
