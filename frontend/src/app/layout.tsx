'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { WagmiConfig } from 'wagmi'
import { config } from '@/config/wagmi'
import type { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Personal Wallet Manager',
  description: 'Manage your Base network transactions and Coinbase transfers',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={config}>
          <div className="min-h-screen bg-gray-100">
            <main className="py-10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
          <Toaster position="bottom-right" />
        </WagmiConfig>
      </body>
    </html>
  )
}
