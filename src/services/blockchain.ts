import { ethers } from 'ethers'
import { CONTRACTS } from '../config/wallet'

// MemeNFT Contract ABI (minimal for minting)
const MEME_NFT_ABI = [
  "function mintMeme(string memory title, string memory description, string memory tokenURI, uint256 _royaltyPercentage, bool isRemix, uint256 originalTokenId) public returns (uint256)",
  "function totalSupply() public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)"
]

export interface MintResult {
  tokenId: number
  transactionHash: string
  explorerUrl: string
}

export const mintMeme = async (
  signer: ethers.JsonRpcSigner,
  imageData: string,
  metadata: {
    name: string
    description: string
    topText?: string
    bottomText?: string
    isRemix?: boolean
    originalTokenId?: number
  }
): Promise<MintResult> => {
  try {
    // Create the NFT contract instance
    const memeNFTContract = new ethers.Contract(
      CONTRACTS.MEME_NFT,
      MEME_NFT_ABI,
      signer
    )

    // Create metadata JSON
    const tokenMetadata = {
      name: metadata.name,
      description: metadata.description,
      image: imageData, // Base64 image data
      attributes: [
        ...(metadata.topText ? [{ trait_type: "Top Text", value: metadata.topText }] : []),
        ...(metadata.bottomText ? [{ trait_type: "Bottom Text", value: metadata.bottomText }] : []),
        { trait_type: "Created", value: new Date().toISOString() }
      ]
    }

    // For now, we'll use a simple JSON string as tokenURI
    // In production, you'd upload to IPFS
    const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(tokenMetadata))}`

    // Parameters for mintMeme function
    const title = metadata.name
    const description = metadata.description
    const royaltyPercentage = 500 // 5% royalty
    const isRemix = metadata.isRemix || false
    const originalTokenId = metadata.originalTokenId || 0

    // Estimate gas
    const gasEstimate = await memeNFTContract.mintMeme.estimateGas(
      title,
      description,
      tokenURI,
      royaltyPercentage,
      isRemix,
      originalTokenId
    )
    
    // Add 20% buffer to gas estimate
    const gasLimit = gasEstimate * 120n / 100n

    // Call the mintMeme function
    const transaction = await memeNFTContract.mintMeme(
      title,
      description,
      tokenURI,
      royaltyPercentage,
      isRemix,
      originalTokenId,
      { gasLimit }
    )

    // Wait for transaction confirmation
    const receipt = await transaction.wait()

    // Get the token ID from the transaction logs
    const totalSupply = await memeNFTContract.totalSupply()
    const tokenId = Number(totalSupply) - 1 // Latest minted token

    const explorerUrl = `https://basecamp.cloud.blockscout.com/tx/${receipt.hash}`

    return {
      tokenId,
      transactionHash: receipt.hash,
      explorerUrl
    }
  } catch (error: any) {
    console.error('Minting failed:', error)
    throw new Error(error.message || 'Failed to mint meme on blockchain')
  }
}

export const getTokenInfo = async (
  provider: ethers.BrowserProvider,
  tokenId: number
) => {
  try {
    const memeNFTContract = new ethers.Contract(
      CONTRACTS.MEME_NFT,
      MEME_NFT_ABI,
      provider
    )

    const [owner, tokenURI] = await Promise.all([
      memeNFTContract.ownerOf(tokenId),
      memeNFTContract.tokenURI(tokenId)
    ])

    return { owner, tokenURI }
  } catch (error) {
    console.error('Failed to get token info:', error)
    throw error
  }
}
