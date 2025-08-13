require('dotenv').config();

const config = {
  network: {
    rpcUrl: process.env.VITE_RPC_URL || 'https://rpc.basecamp.t.raas.gelato.cloud',
    chainId: parseInt(process.env.VITE_CHAIN_ID || '123420001114'),
    explorerUrl: process.env.VITE_EXPLORER_URL || 'https://basecamp.cloud.blockscout.com',
  },
  contracts: {
    memeNFT: process.env.VITE_MEME_NFT_CONTRACT || '',
    marketplace: process.env.VITE_MARKETPLACE_CONTRACT || '',
  },
  wallet: {
    privateKey: process.env.VITE_PRIVATE_KEY || '',
  },
  ipfs: {
    pinataApiKey: process.env.VITE_PINATA_API_KEY || '',
    pinataSecret: process.env.VITE_PINATA_SECRET_KEY || '',
  },
};

// Validate required configuration
const requiredVars = [
  'network.rpcUrl',
  'network.chainId',
  'wallet.privateKey',
];

for (const path of requiredVars) {
  const value = path.split('.').reduce((obj, key) => obj?.[key], config);
  if (!value) {
    throw new Error(`Missing required config: ${path}`);
  }
}

module.exports = config;
