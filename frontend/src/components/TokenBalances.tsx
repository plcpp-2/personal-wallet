import { useEffect } from 'react'
import { useWallet } from '@/hooks/useWallet'

interface TokenBalancesProps {
  network?: 'mainnet' | 'sepolia'
}

export const TokenBalances = ({ network = 'mainnet' }: TokenBalancesProps) => {
  const { tokenBalances, loadTokenBalances, isConnected } = useWallet()

  useEffect(() => {
    if (isConnected) {
      loadTokenBalances(network)
    }
  }, [isConnected, loadTokenBalances, network])

  if (!isConnected) {
    return null
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Token Balances</h2>
      {tokenBalances.length === 0 ? (
        <p className="text-gray-500">No tokens found</p>
      ) : (
        <div className="space-y-2">
          {tokenBalances.map((token, index) => (
            <div
              key={`${token.contractAddress}-${index}`}
              className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {token.tokenSymbol?.[0] || '?'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{token.tokenSymbol || 'Unknown Token'}</p>
                  <p className="text-sm text-gray-500">{token.tokenName || 'Unknown'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {parseFloat(token.tokenBalance).toFixed(4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
