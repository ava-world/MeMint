import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

const WalletButton = () => {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnect = () => {
    connect({ connector: injected() })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-green-400 text-sm">
          {formatAddress(address)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-sm hover:bg-red-500/30"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Connect Wallet
    </button>
  )
}

export default WalletButton
