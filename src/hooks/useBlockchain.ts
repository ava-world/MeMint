import { useAccount, useConnect, useDisconnect, useBalance, useWriteContract, useReadContract } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { parseEther, formatEther } from 'viem'
import { basecampTestnet, CONTRACTS } from '../config/blockchain'
import { toast } from 'react-hot-toast'

// Contract ABIs (simplified for key functions)
const MEME_NFT_ABI = [
  {
    "inputs": [
      {"name": "title", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "tokenURI", "type": "string"},
      {"name": "_royaltyPercentage", "type": "uint256"},
      {"name": "isRemix", "type": "bool"},
      {"name": "originalTokenId", "type": "uint256"}
    ],
    "name": "mintMeme",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "likeMeme",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "getMemeData",
    "outputs": [{
      "components": [
        {"name": "title", "type": "string"},
        {"name": "description", "type": "string"},
        {"name": "creator", "type": "address"},
        {"name": "createdAt", "type": "uint256"},
        {"name": "likes", "type": "uint256"},
        {"name": "isRemix", "type": "bool"},
        {"name": "originalTokenId", "type": "uint256"}
      ],
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

const MARKETPLACE_ABI = [
  {
    "inputs": [
      {"name": "tokenId", "type": "uint256"},
      {"name": "price", "type": "uint256"}
    ],
    "name": "listItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "buyItem",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "getActiveListing",
    "outputs": [{
      "components": [
        {"name": "tokenId", "type": "uint256"},
        {"name": "seller", "type": "address"},
        {"name": "price", "type": "uint256"},
        {"name": "active", "type": "bool"},
        {"name": "listedAt", "type": "uint256"}
      ],
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export function useBlockchain() {
  const { address, isConnected, chain } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { writeContract } = useWriteContract()

  // Get CAMP balance
  const { data: balance } = useBalance({
    address,
    chainId: basecampTestnet.id,
  })

  // Get total memes count
  const { data: totalMemes } = useReadContract({
    address: CONTRACTS.MEME_NFT as `0x${string}`,
    abi: MEME_NFT_ABI,
    functionName: 'totalSupply',
    chainId: basecampTestnet.id,
  })

  // Connect wallet
  const connectWallet = async () => {
    try {
      await connect({ connector: injected() })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await disconnect()
      toast.success('Wallet disconnected')
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      toast.error('Failed to disconnect wallet')
    }
  }

  // Mint a new meme NFT
  const mintMeme = async (
    title: string,
    description: string,
    imageUrl: string,
    royaltyPercentage: number = 500, // 5% default
    isRemix: boolean = false,
    originalTokenId: number = 0
  ) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      const result = await writeContract({
        address: CONTRACTS.MEME_NFT as `0x${string}`,
        abi: MEME_NFT_ABI,
        functionName: 'mintMeme',
        args: [title, description, imageUrl, BigInt(royaltyPercentage), isRemix, BigInt(originalTokenId)],
      })

      toast.success('Meme minted successfully!')
      return result
    } catch (error) {
      console.error('Failed to mint meme:', error)
      toast.error('Failed to mint meme')
      throw error
    }
  }

  // Like a meme
  const likeMeme = async (tokenId: number) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      const result = await writeContract({
        address: CONTRACTS.MEME_NFT as `0x${string}`,
        abi: MEME_NFT_ABI,
        functionName: 'likeMeme',
        args: [BigInt(tokenId)],
      })

      toast.success('Meme liked!')
      return result
    } catch (error) {
      console.error('Failed to like meme:', error)
      toast.error('Failed to like meme')
      throw error
    }
  }

  // List meme for sale
  const listMemeForSale = async (tokenId: number, priceInCAMP: string) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      const priceInWei = parseEther(priceInCAMP)
      const result = await writeContract({
        address: CONTRACTS.MARKETPLACE as `0x${string}`,
        abi: MARKETPLACE_ABI,
        functionName: 'listItem',
        args: [BigInt(tokenId), priceInWei],
      })

      toast.success('Meme listed for sale!')
      return result
    } catch (error) {
      console.error('Failed to list meme:', error)
      toast.error('Failed to list meme')
      throw error
    }
  }

  // Buy a meme
  const buyMeme = async (tokenId: number, priceInWei: bigint) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      const result = await writeContract({
        address: CONTRACTS.MARKETPLACE as `0x${string}`,
        abi: MARKETPLACE_ABI,
        functionName: 'buyItem',
        args: [BigInt(tokenId)],
        value: priceInWei,
      })

      toast.success('Meme purchased successfully!')
      return result
    } catch (error) {
      console.error('Failed to buy meme:', error)
      toast.error('Failed to buy meme')
      throw error
    }
  }

  // Format CAMP balance
  const formattedBalance = balance ? formatEther(balance.value) : '0'

  // Check if on correct network
  const isCorrectNetwork = chain?.id === basecampTestnet.id

  return {
    // Wallet state
    address,
    isConnected,
    balance: formattedBalance,
    isCorrectNetwork,
    
    // Contract data
    totalMemes: totalMemes ? Number(totalMemes) : 0,
    
    // Actions
    connectWallet,
    disconnectWallet,
    mintMeme,
    likeMeme,
    listMemeForSale,
    buyMeme,
    
    // Network info
    chainId: basecampTestnet.id,
    chainName: basecampTestnet.name,
    explorerUrl: basecampTestnet.blockExplorers.default.url,
  }
}
