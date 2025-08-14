import { ethers } from 'ethers'

// Camp Basecamp Testnet Configuration
export const NETWORK_CONFIG = {
  chainId: 123420001114,
  name: 'Camp Basecamp Testnet',
  rpcUrl: 'https://rpc.basecamp.t.raas.gelato.cloud',
  explorerUrl: 'https://basecamp.cloud.blockscout.com',
  nativeCurrency: {
    name: 'CAMP',
    symbol: 'CAMP',
    decimals: 18,
  },
}

// Contract Configuration - Real deployed contracts
export const CONTRACTS = {
  MEME_NFT: '0x05CbD9a80756171Fa6eB558Ff8c2Ac7f7d08EACA',
  MARKETPLACE: '0xe4930a67e86Ad009AfA28F45C90080f18443500E',
} as const

// Wallet connection utilities
export const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      // Check if we're on the correct network
      const network = await provider.getNetwork()
      if (Number(network.chainId) !== NETWORK_CONFIG.chainId) {
        await switchToNetwork()
      }
      
      return { provider, signer, address }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  } else {
    throw new Error('MetaMask is not installed')
  }
}

export const switchToNetwork = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}`,
              chainName: NETWORK_CONFIG.name,
              rpcUrls: [NETWORK_CONFIG.rpcUrl],
              blockExplorerUrls: [NETWORK_CONFIG.explorerUrl],
              nativeCurrency: NETWORK_CONFIG.nativeCurrency,
            },
          ],
        })
      } else {
        throw switchError
      }
    }
  }
}

// Global type for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
