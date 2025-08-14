import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Twitter, Check, Loader2, AlertCircle, Shield } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import TwitterAuthService, { TwitterAuthState, TwitterUser } from '../services/TwitterAuth'
import toast from 'react-hot-toast'

interface TwitterAuthProps {
  onAuthSuccess?: (user: TwitterUser) => void
  onAuthError?: (error: string) => void
  required?: boolean
  showStatus?: boolean
}

const TwitterAuth: React.FC<TwitterAuthProps> = ({
  onAuthSuccess,
  onAuthError,
  required = false,
  showStatus = true
}) => {
  const { address, isConnected } = useWallet()
  const [authState, setAuthState] = useState<TwitterAuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    error: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const twitterAuth = TwitterAuthService.getInstance()

  useEffect(() => {
    if (address && isConnected) {
      // Load existing auth state
      const existingAuth = twitterAuth.loadAuthState(address)
      setAuthState(existingAuth)
    }

    // Subscribe to auth state changes
    const unsubscribe = twitterAuth.subscribe((newState) => {
      setAuthState(newState)
    })

    return unsubscribe
  }, [address, isConnected])

  const handleTwitterAuth = async () => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    try {
      const result = await twitterAuth.authenticateWithTwitter(address)
      
      if (result.isAuthenticated && result.user) {
        toast.success(`Connected to Twitter as @${result.user.userHandle}`)
        onAuthSuccess?.(result.user)
      } else {
        const errorMsg = result.error || 'Failed to authenticate with Twitter'
        toast.error(errorMsg)
        onAuthError?.(errorMsg)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Authentication failed'
      toast.error(errorMsg)
      onAuthError?.(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    if (address) {
      twitterAuth.logout(address)
      toast.success('Disconnected from Twitter')
    }
  }

  // Show wallet connection requirement
  if (!isConnected) {
    return (
      <div className="card p-6 text-center">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Wallet Required</h3>
        <p className="text-gray-300">
          Connect your wallet to link your Twitter account
        </p>
      </div>
    )
  }

  // Show authenticated state
  if (authState.isAuthenticated && authState.user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={authState.user.profilePictureUrl || '/api/placeholder/48/48'}
                alt={authState.user.displayName}
                className="w-12 h-12 rounded-full"
              />
              {authState.user.isVerified && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white">@{authState.user.userHandle}</h3>
                <Twitter className="w-4 h-4 text-blue-400" />
                {authState.user.isVerified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-300">{authState.user.displayName}</p>
              <p className="text-xs text-gray-400">
                {authState.user.followerCount.toLocaleString()} followers • {authState.user.followingCount.toLocaleString()} following
              </p>
              {authState.user.profileBio && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{authState.user.profileBio}</p>
              )}
            </div>
          </div>
          
          {showStatus && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-green-400">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Connected</span>
              </div>
              <button
                onClick={handleDisconnect}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {required && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-green-400">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Twitter account verified for minting</span>
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  // Show authentication prompt
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-6 ${required ? 'border-amber-500/30 bg-amber-500/5' : ''}`}
    >
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-500/20 rounded-full">
            <Twitter className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          {required ? 'Twitter Connection Required' : 'Connect Your Twitter'}
        </h3>
        
        <p className="text-gray-300 mb-6">
          {required 
            ? 'You must connect your Twitter account before minting or remixing memes'
            : 'Link your Twitter account to enable social features and attestations'
          }
        </p>

        {authState.error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{authState.error}</span>
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTwitterAuth}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connecting to Twitter...</span>
            </>
          ) : (
            <>
              <Twitter className="w-5 h-5" />
              <span>Connect with Twitter</span>
            </>
          )}
        </motion.button>

        <p className="text-xs text-gray-400 mt-3">
          Your Twitter account will be securely linked to your wallet address
        </p>
      </div>
    </motion.div>
  )
}

export default TwitterAuth
