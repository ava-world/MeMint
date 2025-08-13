import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search as SearchIcon, Copy, Heart, User, Calendar, Zap, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useWallet } from '../contexts/WalletContext'
import { searchMemesByName, getMemeByTokenId, MemeData } from '../services/search'
import { useNavigate } from 'react-router-dom'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [tokenIdQuery, setTokenIdQuery] = useState('')
  const [searchResults, setSearchResults] = useState<MemeData[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedMeme, setSelectedMeme] = useState<MemeData | null>(null)
  const { provider, isConnected } = useWallet()
  const navigate = useNavigate()

  const handleNameSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a meme name to search')
      return
    }

    if (!isConnected || !provider) {
      toast.error('Please connect your wallet to search')
      return
    }

    setIsSearching(true)
    try {
      const results = await searchMemesByName(provider, searchQuery.trim())
      setSearchResults(results)
      
      if (results.length === 0) {
        toast('No memes found with that name', { icon: 'ℹ️' })
      } else {
        toast.success(`Found ${results.length} meme${results.length > 1 ? 's' : ''}!`)
      }
    } catch (error: any) {
      toast.error(`Search failed: ${error.message}`)
    } finally {
      setIsSearching(false)
    }
  }

  const handleTokenIdSearch = async () => {
    const tokenId = parseInt(tokenIdQuery.trim())
    if (isNaN(tokenId) || tokenId < 0) {
      toast.error('Please enter a valid token ID')
      return
    }

    if (!isConnected || !provider) {
      toast.error('Please connect your wallet to search')
      return
    }

    setIsSearching(true)
    try {
      const result = await getMemeByTokenId(provider, tokenId)
      if (result) {
        setSearchResults([result])
        toast.success('Meme found!')
      } else {
        setSearchResults([])
        toast('No meme found with that token ID', { icon: 'ℹ️' })
      }
    } catch (error: any) {
      toast.error(`Search failed: ${error.message}`)
    } finally {
      setIsSearching(false)
    }
  }

  const handleRemixMeme = (meme: MemeData) => {
    if (!meme.imageData) {
      toast.error('Cannot remix this meme - image data not available')
      return
    }

    // Store the meme data for remixing and navigate to create page
    localStorage.setItem('remixMeme', JSON.stringify({
      originalTokenId: meme.tokenId,
      imageData: meme.imageData,
      originalTitle: meme.title,
      originalCreator: meme.creator
    }))
    
    toast.success(`🎨 Remixing "${meme.title}"! Redirecting to create page...`)
    navigate('/create')
  }

  const copyContractAddress = () => {
    navigator.clipboard.writeText(`${window.location.origin}/search?token=${selectedMeme?.tokenId}`)
    toast.success('Shareable link copied to clipboard!')
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            Discover & Remix Memes
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Search for memes by name or token ID, then remix them to create your own unique versions!
          </p>
        </motion.div>

        {/* Search Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Search by Name */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <SearchIcon className="w-5 h-5" />
              <span>Search by Name</span>
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter meme name..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && handleNameSearch()}
              />
              <button
                onClick={handleNameSearch}
                disabled={isSearching || !isConnected}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Searching...' : 'Search Memes'}
              </button>
            </div>
          </motion.div>

          {/* Search by Token ID */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Copy className="w-5 h-5" />
              <span>Search by Token ID</span>
            </h3>
            
            <div className="space-y-4">
              <input
                type="number"
                value={tokenIdQuery}
                onChange={(e) => setTokenIdQuery(e.target.value)}
                placeholder="Enter token ID (e.g. 42)..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && handleTokenIdSearch()}
              />
              <button
                onClick={handleTokenIdSearch}
                disabled={isSearching || !isConnected}
                className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Searching...' : 'Find Meme'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Search Results ({searchResults.length})
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((meme) => (
                <div key={meme.tokenId} className="card group hover:border-primary-500/50 transition-all duration-300">
                  {/* Meme Image */}
                  {meme.imageData && (
                    <div className="relative mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={meme.imageData} 
                        alt={meme.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  )}
                  
                  {/* Meme Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
                        {meme.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {meme.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{truncateAddress(meme.creator)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(meme.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{meme.likes}</span>
                        </div>
                        <span className="text-primary-400">#{meme.tokenId}</span>
                      </div>
                      
                      {meme.isRemix && (
                        <span className="text-xs bg-accent-500/20 text-accent-300 px-2 py-1 rounded-full">
                          Remix
                        </span>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => handleRemixMeme(meme)}
                        className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-1"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Remix</span>
                      </button>
                      <button
                        onClick={() => setSelectedMeme(meme)}
                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Meme Detail Modal */}
        {selectedMeme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMeme(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedMeme.title}</h2>
                <button
                  onClick={() => setSelectedMeme(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {selectedMeme.imageData && (
                <img 
                  src={selectedMeme.imageData} 
                  alt={selectedMeme.title}
                  className="w-full rounded-lg mb-4"
                />
              )}
              
              <div className="space-y-4">
                <p className="text-gray-300">{selectedMeme.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Creator:</span>
                    <p className="text-white font-mono">{truncateAddress(selectedMeme.creator)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Owner:</span>
                    <p className="text-white font-mono">{truncateAddress(selectedMeme.owner)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Token ID:</span>
                    <p className="text-white">#{selectedMeme.tokenId}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Likes:</span>
                    <p className="text-white">{selectedMeme.likes}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleRemixMeme(selectedMeme)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Remix This Meme</span>
                  </button>
                  <button
                    onClick={copyContractAddress}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Connection Prompt */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="card max-w-md mx-auto">
              <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-gray-400 mb-4">
                Connect your wallet to search and discover amazing memes on the blockchain!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Search
