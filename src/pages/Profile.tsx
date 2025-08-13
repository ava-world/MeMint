import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, Settings, Heart, GitBranch, DollarSign, Edit3, Share2, Eye, Camera, Save, X } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import toast from 'react-hot-toast'

const Profile = () => {
  const { address, isConnected } = useWallet()
  const [activeTab, setActiveTab] = useState('created')
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [username, setUsername] = useState('')
  const [tempUsername, setTempUsername] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const tabs = [
    { id: 'created', label: 'Created', count: 24 },
    { id: 'collected', label: 'Collected', count: 12 },
    { id: 'remixed', label: 'Remixed', count: 8 },
    { id: 'liked', label: 'Liked', count: 156 }
  ]

  // Load user data from localStorage
  useEffect(() => {
    if (address) {
      const savedUsername = localStorage.getItem(`username_${address}`)
      const savedProfileImage = localStorage.getItem(`profileImage_${address}`)
      
      if (savedUsername) {
        setUsername(savedUsername)
      } else {
        setUsername(`User_${address.slice(0, 6)}`)
      }
      
      if (savedProfileImage) {
        setProfileImage(savedProfileImage)
      }
    }
  }, [address])

  const saveUsername = () => {
    if (tempUsername.trim() && address) {
      setUsername(tempUsername.trim())
      localStorage.setItem(`username_${address}`, tempUsername.trim())
      setIsEditingUsername(false)
      toast.success('Username updated successfully!')
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB')
        return
      }
      
      setIsUploadingImage(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileImage(result)
        if (address) {
          localStorage.setItem(`profileImage_${address}`, result)
          toast.success('Profile picture updated!')
        }
        setIsUploadingImage(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const userStats = {
    totalEarnings: '$2,847',
    totalLikes: 15420,
    totalRemixes: 234,
    totalViews: 89420,
    rank: 42,
    badge: 'Pro Creator'
  }

  const userMemes = [
    {
      id: '1',
      title: 'My First Viral Meme',
      likes: 2847,
      remixes: 45,
      views: 12420,
      earnings: '$247',
      image: '🚀',
      status: 'trending'
    },
    {
      id: '2',
      title: 'Crypto Mood Today',
      likes: 1892,
      remixes: 23,
      views: 8940,
      earnings: '$189',
      image: '📈',
      status: 'stable'
    },
    {
      id: '3',
      title: 'Web3 Learning Curve',
      likes: 3421,
      remixes: 67,
      views: 15680,
      earnings: '$342',
      image: '🧠',
      status: 'viral'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'viral':
        return 'text-red-400 bg-red-400/20'
      case 'trending':
        return 'text-yellow-400 bg-yellow-400/20'
      case 'stable':
        return 'text-green-400 bg-green-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center p-8 max-w-md"
        >
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to view and manage your profile.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn-primary"
          >
            Go to Home
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-6xl overflow-hidden">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="absolute bottom-2 right-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-50"
                title="Upload profile picture"
                aria-label="Upload profile picture"
              >
                {isUploadingImage ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Profile picture upload"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                {isEditingUsername ? (
                  <div className="flex items-center space-x-2 mb-2 md:mb-0">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xl font-bold focus:outline-none focus:border-primary-400"
                      placeholder="Enter username"
                      autoFocus
                    />
                    <button
                      onClick={saveUsername}
                      className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                      title="Save username"
                      aria-label="Save username"
                    >
                      <Save className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingUsername(false)
                        setTempUsername('')
                      }}
                      className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                      title="Cancel editing"
                      aria-label="Cancel editing username"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 mb-2 md:mb-0">
                    <h1 className="text-3xl font-bold text-white">{username}</h1>
                    <button
                      onClick={() => {
                        setTempUsername(username)
                        setIsEditingUsername(true)
                      }}
                      className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
                      title="Edit username"
                      aria-label="Edit username"
                    >
                      <Edit3 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full">
                  {userStats.badge}
                </span>
                <span className="text-gray-400">Rank #{userStats.rank}</span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-400 font-mono">
                  {address}
                </p>
              </div>
              
              <p className="text-gray-300 mb-6 max-w-md">
                Creating viral memes and building the future of internet culture! 
                Welcome to the decentralized meme revolution. 🚀
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-400">{userStats.totalEarnings}</div>
                  <div className="text-gray-400">Total Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{userStats.totalLikes.toLocaleString()}</div>
                  <div className="text-gray-400">Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{userStats.totalRemixes}</div>
                  <div className="text-gray-400">Total Remixes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{userStats.totalViews.toLocaleString()}</div>
                  <div className="text-gray-400">Total Views</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button className="btn-secondary flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <span>{tab.label}</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{tab.count}</span>
            </button>
          ))}
        </motion.div>

        {/* Meme Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userMemes.map((meme, index) => (
            <motion.div
              key={meme.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group cursor-pointer"
            >
              {/* Meme Image */}
              <div className="relative mb-4 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl h-48 flex items-center justify-center overflow-hidden">
                <span className="text-6xl">{meme.image}</span>
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meme.status)}`}>
                  {meme.status}
                </div>
              </div>

              {/* Meme Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                  {meme.title}
                </h3>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300">{meme.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GitBranch className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">{meme.remixes}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">{meme.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">{meme.earnings}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button className="text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium">
                    View Details
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Created', item: 'Web3 Learning Curve', time: '2 hours ago', icon: '🧠' },
              { action: 'Earned royalty from', item: 'My First Viral Meme', time: '5 hours ago', icon: '💰' },
              { action: 'Remixed', item: 'Crypto Winter Survival', time: '1 day ago', icon: '🎭' },
              { action: 'Liked', item: 'AI Taking Over', time: '2 days ago', icon: '❤️' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card flex items-center space-x-4 p-4"
              >
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-white">
                    <span className="text-gray-400">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.item}</span>
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
