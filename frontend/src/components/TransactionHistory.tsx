import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

interface Transaction {
  hash: string
  type: 'sent' | 'received'
  amount: string
  timestamp: number
  to: string
  from: string
  confirmed: boolean
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
      <div className="mt-6 space-y-4">
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-500">No transactions yet</p>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.hash}
              className="flex items-center p-4 space-x-4 bg-gray-50 rounded-lg"
            >
              {tx.type === 'sent' ? (
                <ArrowUpIcon className="w-6 h-6 text-red-500" />
              ) : (
                <ArrowDownIcon className="w-6 h-6 text-green-500" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {tx.type === 'sent' ? 'To: ' : 'From: '}
                  {tx.type === 'sent' ? tx.to : tx.from}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(tx.timestamp * 1000).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center">
                <span
                  className={`text-sm font-medium ${
                    tx.type === 'sent' ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {tx.type === 'sent' ? '-' : '+'}
                  {tx.amount} ETH
                </span>
                {tx.confirmed ? (
                  <span className="ml-2 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    Confirmed
                  </span>
                ) : (
                  <span className="ml-2 px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                    Pending
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
