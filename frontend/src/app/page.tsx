'use client'

import { WalletStatus } from '@/components/WalletStatus'
import { TransactionForm } from '@/components/TransactionForm'
import { TransactionHistory } from '@/components/TransactionHistory'
import { TokenBalances } from '@/components/TokenBalances'
import { NFTGallery } from '@/components/NFTGallery'
import { useState } from 'react'
import { defaultNetwork } from '@/config/wagmi'

export default function Home() {
  const [network, setNetwork] = useState<'mainnet' | 'sepolia'>(defaultNetwork)

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Personal Wallet</h1>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value as 'mainnet' | 'sepolia')}
            className="bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700"
          >
            <option value="mainnet">Base Mainnet</option>
            <option value="sepolia">Base Sepolia</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <WalletStatus />
            <TransactionForm />
            <TransactionHistory network={network} />
            <NFTGallery network={network} />
          </div>
          <div className="lg:col-span-1">
            <TokenBalances network={network} />
          </div>
        </div>
      </div>
    </main>
  )
}
