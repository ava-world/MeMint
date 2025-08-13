import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'
import { connectWallet, NETWORK_CONFIG } from '../config/wallet'
import toast from 'react-hot-toast'

interface WalletContextType {
  address: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = async () => {
    if (isConnecting) return
    
    setIsConnecting(true)
    try {
      const { provider: newProvider, signer: newSigner, address: newAddress } = await connectWallet()
      
      setProvider(newProvider)
      setSigner(newSigner)
      setAddress(newAddress)
      setIsConnected(true)
      
      toast.success('Wallet connected successfully!')
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      toast.error(error.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setProvider(null)
    setSigner(null)
    setAddress(null)
    setIsConnected(false)
    toast.success('Wallet disconnected')
  }

  // Check if wallet is already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            await connect()
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error)
        }
      }
    }

    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else if (accounts[0] !== address) {
          connect()
        }
      }

      const handleChainChanged = () => {
        window.location.reload()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [address])

  const value: WalletContextType = {
    address,
    provider,
    signer,
    isConnected,
    isConnecting,
    connect,
    disconnect,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
