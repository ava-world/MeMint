import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Share2, GitBranch, DollarSign, Eye, User, Calendar, ArrowLeft, Zap, Download } from 'lucide-react'
import toast from 'react-hot-toast'

const MemeDetail = () => {
  const { id } = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [showRemixModal, setShowRemixModal] = useState(false)

  // Mock meme data - in real app, fetch by ID
  const meme = {
    id: id || '1',
    title: 'Crypto Winter Survivor',
    creator: 'MemeKing42',
    creatorAvatar: '👑',
    price: '0.5 ETH',
    likes: 1247,
    remixes: 89,
    views: 15420,
    image: '🥶',
    description: 'When you\'ve been hodling through the crypto winter and finally see green candles again. This meme captures the resilience of true crypto believers!',
    tags: ['crypto', 'winter', 'hodl', 'bullish'],
    createdAt: '2024-01-15',
    isRemixable: true,
    royaltyPercentage: 10,
    blockchain: 'Camp Network',
    contractAddress: '0x1234...5678',
    familyTree: [
      { id: '1', title: 'Original', creator: 'MemeKing42', generation: 0 },
      { id: '2', title: 'Crypto Winter Extended', creator: 'HODLer123', generation: 1 },
      { id: '3', title: 'Bear Market Blues', creator: 'DiamondHands', generation: 1 },
      { id: '4', title: 'Bull Run Coming', creator: 'MoonBoy', generation: 2 }
    ]
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast.success(isLiked ? 'Removed from likes' : 'Added to likes!')
  }

  const handleRemix = () => {
    setShowRemixModal(true)
    // In real app, redirect to create page with this meme as base
    setTimeout(() => {
      setShowRemixModal(false)
      toast.success('Remix created! Redirecting to editor...')
    }, 2000)
  }

  const handlePurchase = () => {
    toast.success('🎉 Meme purchased successfully! Added to your collection.')
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Link
            to="/marketplace"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Marketplace</span>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Meme Display */}
          <div className="space-y-6">
            {/* Main Meme */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="card"
            >
              <div className="relative bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl h-96 flex items-center justify-center overflow-hidden mb-4">
                <span className="text-8xl">{meme.image}</span>
                {meme.isRemixable && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                    Remixable
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isLiked
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{meme.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>

                {meme.isRemixable && (
                  <button
                    onClick={handleRemix}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <GitBranch className="w-5 h-5" />
                    <span>Remix</span>
                  </button>
                )}
              </div>
            </motion.div>

            {/* Family Tree */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <GitBranch className="w-5 h-5" />
                <span>Meme Family Tree</span>
              </h3>
              
              <div className="space-y-3">
                {meme.familyTree.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      item.id === meme.id
                        ? 'bg-primary-500/20 border border-primary-500/30'
                        : 'bg-white/5'
                    }`}
                    style={{ marginLeft: `${item.generation * 20}px` }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-sm">
                      {item.generation === 0 ? '🌱' : '🌿'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-sm text-gray-400">by {item.creator}</p>
                    </div>
                    {item.id === meme.id && (
                      <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Details & Purchase */}
          <div className="space-y-6">
            {/* Meme Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="card"
            >
              <h1 className="text-3xl font-bold text-white mb-4">{meme.title}</h1>
              
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-xl">
                  {meme.creatorAvatar}
                </div>
                <div>
                  <p className="text-white font-medium">{meme.creator}</p>
                  <p className="text-sm text-gray-400">Creator</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                {meme.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {meme.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-white/10 text-gray-300 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <Eye className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                  <div className="text-xl font-bold text-white">{meme.views.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Views</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <GitBranch className="w-6 h-6 mx-auto mb-2 text-green-400" />
                  <div className="text-xl font-bold text-white">{meme.remixes}</div>
                  <div className="text-sm text-gray-400">Remixes</div>
                </div>
              </div>
            </motion.div>

            {/* Purchase Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="card border-2 border-primary-500/30"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-accent-400 mb-2">{meme.price}</div>
                <p className="text-gray-400">Current Price</p>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full btn-primary mb-4 flex items-center justify-center space-x-2"
              >
                <DollarSign className="w-5 h-5" />
                <span>Purchase Meme</span>
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Royalty to Creator:</span>
                  <span className="text-white">{meme.royaltyPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Blockchain:</span>
                  <span className="text-white">{meme.blockchain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white">{new Date(meme.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">🔒 Blockchain Verified</h4>
                <p className="text-sm text-blue-300">
                  This meme is registered on Camp blockchain with immutable proof of ownership and creation.
                </p>
                <p className="text-xs text-blue-400 mt-2 font-mono">
                  Contract: {meme.contractAddress}
                </p>
              </div>
            </motion.div>

            {/* Creator Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4">About the Creator</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-2xl">
                  {meme.creatorAvatar}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{meme.creator}</h4>
                  <p className="text-gray-400">Pro Creator • Rank #12</p>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4">
                Creating viral memes since 2023. Known for crypto and tech humor that resonates with the community.
              </p>

              <Link
                to="/profile"
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>View Profile</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Remix Modal */}
        {showRemixModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-md mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Creating Remix...</h3>
                <p className="text-gray-300 mb-6">
                  Setting up your remix workspace with the original meme as a base.
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MemeDetail
