'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { ArrowPathIcon, ArrowUpIcon } from '@heroicons/react/24/outline'
import { WalletStatus } from '@/components/WalletStatus'
import { TransactionForm } from '@/components/TransactionForm'
import { TransactionHistory } from '@/components/TransactionHistory'
import { SimulationResult } from '@/components/SimulationResult'
import { useWallet } from '@/hooks/useWallet'
import { toast } from 'react-hot-toast'

export default function Home() {
  const { 
    wallet, 
    balance, 
    isConnected,
    connectWallet,
    sendTransaction,
    simulateTransaction 
  } = useWallet()

  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState(null)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if (isConnected && wallet) {
      fetchTransactionHistory()
    }
  }, [isConnected, wallet])

  const fetchTransactionHistory = async () => {
    try {
      // Implement transaction history fetching
    } catch (error) {
      console.error('Failed to fetch transaction history:', error)
      toast.error('Failed to load transaction history')
    }
  }

  const handleSimulate = async (to: string, amount: string) => {
    setIsSimulating(true)
    try {
      const result = await simulateTransaction(to, amount)
      setSimulationResult(result)
      toast.success('Transaction simulation completed')
    } catch (error) {
      console.error('Simulation failed:', error)
      toast.error('Transaction simulation failed')
    } finally {
      setIsSimulating(false)
    }
  }

  const handleSend = async (to: string, amount: string) => {
    try {
      const tx = await sendTransaction(to, amount)
      toast.success('Transaction sent successfully')
      await fetchTransactionHistory()
    } catch (error) {
      console.error('Transaction failed:', error)
      toast.error('Transaction failed')
    }
  }

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold leading-6 text-gray-900">Personal Wallet</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your Base network transactions and Coinbase transfers
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <WalletStatus 
            isConnected={isConnected} 
            balance={balance} 
            onConnect={connectWallet} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <TransactionForm 
            onSimulate={handleSimulate}
            onSend={handleSend}
            isSimulating={isSimulating}
            disabled={!isConnected}
          />
          
          {simulationResult && (
            <SimulationResult 
              result={simulationResult}
              onConfirm={(to, amount) => handleSend(to, amount)}
            />
          )}
        </div>

        <div>
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </div>
  )
}
