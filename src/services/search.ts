import { ethers } from 'ethers'
import { CONTRACTS } from '../config/wallet'

// Extended MemeNFT Contract ABI for search functionality
const MEME_NFT_SEARCH_ABI = [
  "function totalSupply() public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function getMemeData(uint256 tokenId) public view returns (tuple(string title, string description, address creator, uint256 createdAt, uint256 likes, bool isRemix, uint256 originalTokenId))",
  "function creators(uint256 tokenId) public view returns (address)"
]

export interface MemeData {
  tokenId: number
  title: string
  description: string
  creator: string
  createdAt: number
  likes: number
  isRemix: boolean
  originalTokenId: number
  tokenURI: string
  owner: string
  imageData?: string
}

export const searchMemesByName = async (
  provider: ethers.BrowserProvider,
  searchQuery: string
): Promise<MemeData[]> => {
  try {
    const memeNFTContract = new ethers.Contract(
      CONTRACTS.MEME_NFT,
      MEME_NFT_SEARCH_ABI,
      provider
    )

    const totalSupply = await memeNFTContract.totalSupply()
    const results: MemeData[] = []

    // Search through all memes (in production, you'd use events/indexing)
    for (let tokenId = 0; tokenId < Number(totalSupply); tokenId++) {
      try {
        const [memeData, tokenURI, owner] = await Promise.all([
          memeNFTContract.getMemeData(tokenId),
          memeNFTContract.tokenURI(tokenId),
          memeNFTContract.ownerOf(tokenId)
        ])

        const title = memeData[0]
        const description = memeData[1]
        
        // Check if title matches search query (case insensitive)
        if (title.toLowerCase().includes(searchQuery.toLowerCase())) {
          // Parse metadata to get image data
          let imageData = ''
          try {
            if (tokenURI.startsWith('data:application/json;base64,')) {
              const jsonData = atob(tokenURI.split(',')[1])
              const metadata = JSON.parse(jsonData)
              imageData = metadata.image || ''
            }
          } catch (e) {
            console.warn('Failed to parse metadata for token', tokenId)
          }

          results.push({
            tokenId,
            title,
            description,
            creator: memeData[2],
            createdAt: Number(memeData[3]),
            likes: Number(memeData[4]),
            isRemix: memeData[5],
            originalTokenId: Number(memeData[6]),
            tokenURI,
            owner,
            imageData
          })
        }
      } catch (error) {
        console.warn(`Failed to get data for token ${tokenId}:`, error)
        continue
      }
    }

    return results.sort((a, b) => b.createdAt - a.createdAt) // Sort by newest first
  } catch (error) {
    console.error('Search failed:', error)
    throw new Error('Failed to search memes')
  }
}

export const getMemeByTokenId = async (
  provider: ethers.BrowserProvider,
  tokenId: number
): Promise<MemeData | null> => {
  try {
    const memeNFTContract = new ethers.Contract(
      CONTRACTS.MEME_NFT,
      MEME_NFT_SEARCH_ABI,
      provider
    )

    const [memeData, tokenURI, owner] = await Promise.all([
      memeNFTContract.getMemeData(tokenId),
      memeNFTContract.tokenURI(tokenId),
      memeNFTContract.ownerOf(tokenId)
    ])

    // Parse metadata to get image data
    let imageData = ''
    try {
      if (tokenURI.startsWith('data:application/json;base64,')) {
        const jsonData = atob(tokenURI.split(',')[1])
        const metadata = JSON.parse(jsonData)
        imageData = metadata.image || ''
      }
    } catch (e) {
      console.warn('Failed to parse metadata for token', tokenId)
    }

    return {
      tokenId,
      title: memeData[0],
      description: memeData[1],
      creator: memeData[2],
      createdAt: Number(memeData[3]),
      likes: Number(memeData[4]),
      isRemix: memeData[5],
      originalTokenId: Number(memeData[6]),
      tokenURI,
      owner,
      imageData
    }
  } catch (error) {
    console.error('Failed to get meme by token ID:', error)
    return null
  }
}

export const getLeaderboardData = async (
  provider: ethers.BrowserProvider
): Promise<{
  mostMinted: { creator: string; count: number }[]
  mostLiked: MemeData[]
  recentMemes: MemeData[]
  totalMemes: number
}> => {
  try {
    const memeNFTContract = new ethers.Contract(
      CONTRACTS.MEME_NFT,
      MEME_NFT_SEARCH_ABI,
      provider
    )

    const totalSupply = await memeNFTContract.totalSupply()
    const allMemes: MemeData[] = []
    const creatorCounts: { [creator: string]: number } = {}

    // Get all memes data
    for (let tokenId = 0; tokenId < Number(totalSupply); tokenId++) {
      try {
        const [memeData, tokenURI, owner] = await Promise.all([
          memeNFTContract.getMemeData(tokenId),
          memeNFTContract.tokenURI(tokenId),
          memeNFTContract.ownerOf(tokenId)
        ])

        const creator = memeData[2]
        creatorCounts[creator] = (creatorCounts[creator] || 0) + 1

        // Parse metadata for image
        let imageData = ''
        try {
          if (tokenURI.startsWith('data:application/json;base64,')) {
            const jsonData = atob(tokenURI.split(',')[1])
            const metadata = JSON.parse(jsonData)
            imageData = metadata.image || ''
          }
        } catch (e) {
          // Ignore parsing errors
        }

        allMemes.push({
          tokenId,
          title: memeData[0],
          description: memeData[1],
          creator,
          createdAt: Number(memeData[3]),
          likes: Number(memeData[4]),
          isRemix: memeData[5],
          originalTokenId: Number(memeData[6]),
          tokenURI,
          owner,
          imageData
        })
      } catch (error) {
        console.warn(`Failed to get data for token ${tokenId}:`, error)
        continue
      }
    }

    // Process leaderboard data
    const mostMinted = Object.entries(creatorCounts)
      .map(([creator, count]) => ({ creator, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const mostLiked = allMemes
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10)

    const recentMemes = allMemes
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)

    return {
      mostMinted,
      mostLiked,
      recentMemes,
      totalMemes: Number(totalSupply)
    }
  } catch (error) {
    console.error('Failed to get leaderboard data:', error)
    throw new Error('Failed to load leaderboard data')
  }
}
