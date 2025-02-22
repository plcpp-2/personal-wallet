import { WalletIcon } from '@heroicons/react/24/outline'

interface WalletStatusProps {
  isConnected: boolean
  balance: string
  onConnect: () => void
}

export function WalletStatus({ isConnected, balance, onConnect }: WalletStatusProps) {
  return (
    <div className="flex items-center space-x-4">
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <div className="flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
            <WalletIcon className="w-5 h-5 mr-2 text-green-500" />
            <span>{parseFloat(balance).toFixed(4)} ETH</span>
          </div>
          <div className="px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-500">
            Connected
          </div>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="flex items-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500"
        >
          <WalletIcon className="w-5 h-5 mr-2" />
          Connect Wallet
        </button>
      )}
    </div>
  )
}
