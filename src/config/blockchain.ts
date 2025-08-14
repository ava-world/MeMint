import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'

// Camp Basecamp Testnet Configuration
export const basecampTestnet = defineChain({
  id: 123420001114,
  name: 'Camp Basecamp Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'CAMP',
    symbol: 'CAMP',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.basecamp.t.raas.gelato.cloud'],
      webSocket: [],
    },
    public: {
      http: ['https://rpc.basecamp.t.raas.gelato.cloud', 'https://rpc-campnetwork.xyz'],
      webSocket: [],
    },
  },
  blockExplorers: {
    default: {
      name: 'Basecamp Explorer',
      url: 'https://basecamp.cloud.blockscout.com',
    },
  },
  testnet: true,
})

// Wagmi Configuration for Camp Basecamp
export const config = createConfig({
  chains: [basecampTestnet],
  transports: {
    [basecampTestnet.id]: http(),
  },
})

// Contract Configuration
export const CONTRACTS = {
  MEME_NFT: '0x05CbD9a80756171Fa6eB558Ff8c2Ac7f7d08EACA',
  MARKETPLACE: '0xe4930a67e86Ad009AfA28F45C90080f18443500E',
}

// Environment Configuration
export const ENV = {
  RPC_URL: (import.meta as any).env?.VITE_RPC_URL || 'https://rpc.basecamp.t.raas.gelato.cloud',
  CHAIN_ID: parseInt((import.meta as any).env?.VITE_CHAIN_ID || '123420001114'),
  EXPLORER_URL: 'https://basecamp.cloud.blockscout.com',
}
