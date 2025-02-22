import { useState } from 'react'
import { ArrowUpIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface TransactionFormProps {
  onSimulate: (to: string, amount: string) => void
  onSend: (to: string, amount: string) => void
  isSimulating: boolean
  disabled: boolean
}

export function TransactionForm({ onSimulate, onSend, isSimulating, disabled }: TransactionFormProps) {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [isCoinbase, setIsCoinbase] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSimulate(to, amount)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900">Send Transaction</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Recipient Type
          </label>
          <div className="mt-2">
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  checked={!isCoinbase}
                  onChange={() => setIsCoinbase(false)}
                />
                <span className="ml-2">Custom Address</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  checked={isCoinbase}
                  onChange={() => setIsCoinbase(true)}
                />
                <span className="ml-2">Coinbase</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            To Address
          </label>
          <div className="mt-2">
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0x..."
              disabled={disabled}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount (ETH)
          </label>
          <div className="mt-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.0001"
              min="0"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0.0"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={disabled || isSimulating || !to || !amount}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <ArrowUpIcon className="w-5 h-5 mr-2" />
                Simulate
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
