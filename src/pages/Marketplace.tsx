import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, TrendingUp, Heart, Share2, DollarSign, Eye, GitBranch } from 'lucide-react'
import { Link } from 'react-router-dom'

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('trending')

  const filters = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Eye },
    { id: 'popular', label: 'Most Liked', icon: Heart },
    { id: 'remixed', label: 'Most Remixed', icon: GitBranch }
  ]

  // Mock meme data
  const memes = [
    {
      id: '1',
      title: 'Crypto Winter Survivor',
      creator: 'MemeKing42',
      price: '0.5 ETH',
      likes: 1247,
      remixes: 89,
      views: 15420,
      image: '🥶',
      tags: ['crypto', 'winter', 'hodl'],
      isRemixable: true
    },
    {
      id: '2',
      title: 'AI Taking Over',
      creator: 'TechMemer',
      price: '0.3 ETH',
      likes: 892,
      remixes: 156,
      views: 12350,
      image: '🤖',
      tags: ['ai', 'technology', 'future'],
      isRemixable: true
    },
    {
      id: '3',
      title: 'Web3 Explained',
      creator: 'BlockchainBro',
      price: '0.8 ETH',
      likes: 2103,
      remixes: 234,
      views: 28940,
      image: '🌐',
      tags: ['web3', 'blockchain', 'education'],
      isRemixable: false
    },
    {
      id: '4',
      title: 'NFT Marketplace Mood',
      creator: 'ArtistAnon',
      price: '1.2 ETH',
      likes: 567,
      remixes: 45,
      views: 8920,
      image: '🎨',
      tags: ['nft', 'art', 'marketplace'],
      isRemixable: true
    },
    {
      id: '5',
      title: 'DeFi Yield Farming',
      creator: 'YieldHunter',
      price: '0.4 ETH',
      likes: 1456,
      remixes: 178,
      views: 19230,
      image: '🚜',
      tags: ['defi', 'yield', 'farming'],
      isRemixable: true
    },
    {
      id: '6',
      title: 'Metaverse Ready',
      creator: 'VRVisionary',
      price: '0.7 ETH',
      likes: 834,
      remixes: 92,
      views: 11450,
      image: '🥽',
      tags: ['metaverse', 'vr', 'gaming'],
      isRemixable: true
    }
  ]

  const filteredMemes = memes.filter(meme =>
    meme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meme.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meme.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            Meme Marketplace
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover, collect, and trade the internet's best memes. Every purchase supports the original creator.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-md mx-auto"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search memes, creators, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 backdrop-blur-sm"
            />
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {filters.map((filter) => {
              const Icon = filter.icon
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedFilter === filter.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              )
            })}
          </motion.div>
        </div>

        {/* Meme Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemes.map((meme, index) => (
            <motion.div
              key={meme.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group cursor-pointer"
            >
              <Link to={`/meme/${meme.id}`}>
                {/* Meme Image */}
                <div className="relative mb-4 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl h-48 flex items-center justify-center overflow-hidden">
                  <span className="text-6xl">{meme.image}</span>
                  {meme.isRemixable && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Remixable
                    </div>
                  )}
                </div>

                {/* Meme Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                      {meme.title}
                    </h3>
                    <p className="text-sm text-gray-400">by {meme.creator}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {meme.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{meme.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitBranch className="w-4 h-4" />
                        <span>{meme.remixes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{meme.views}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center space-x-1 text-accent-400 font-bold">
                      <DollarSign className="w-4 h-4" />
                      <span>{meme.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <button className="btn-secondary">
            Load More Memes
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Marketplace
