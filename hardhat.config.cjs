require('@nomicfoundation/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    basecamp: {
      url: process.env.VITE_RPC_URL || 'https://rpc.basecamp.t.raas.gelato.cloud',
      accounts: process.env.VITE_PRIVATE_KEY ? [process.env.VITE_PRIVATE_KEY] : [],
      chainId: parseInt(process.env.VITE_CHAIN_ID || '123420001114'),
      gasPrice: 20000000000, // 20 gwei
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
