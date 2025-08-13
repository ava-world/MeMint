import { motion } from 'framer-motion'
import { Wallet, LogOut, User, Loader } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

const WalletConnect = () => {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
          <User className="w-4 h-4 text-green-400" />
          <span className="text-green-300 text-sm font-medium">
            {formatAddress(address)}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={disconnect}
          className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </motion.button>
      </div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg text-white font-medium hover:from-primary-600 hover:to-accent-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isConnecting ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
    </motion.button>
  )
}

export default WalletConnect
