import { useEffect } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { formatEther } from 'viem'

interface TransactionHistoryProps {
  network?: 'mainnet' | 'sepolia'
}

export const TransactionHistory = ({ network = 'mainnet' }: TransactionHistoryProps) => {
  const { transactionHistory, loadTransactionHistory, isConnected, isLoadingHistory } = useWallet()

  useEffect(() => {
    if (isConnected) {
      loadTransactionHistory(network)
    }
  }, [isConnected, loadTransactionHistory, network])

  if (!isConnected) {
    return null
  }

  if (isLoadingHistory) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      {transactionHistory.length === 0 ? (
        <p className="text-gray-500">No transactions found</p>
      ) : (
        <div className="space-y-4">
          {transactionHistory.map((tx, index) => (
            <div
              key={`${tx.hash}-${index}`}
              className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
                  </p>
                  <p className="text-sm text-gray-500">
                    To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                  </p>
                  {tx.tokenId && (
                    <p className="text-sm text-gray-500">
                      Token ID: {tx.tokenId}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {tx.value ? formatEther(BigInt(tx.value)) : '0'} {tx.asset || 'ETH'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Block: {tx.blockNum}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
