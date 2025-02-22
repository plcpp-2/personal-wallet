import { TransactionReceipt } from 'viem'

export interface Transaction {
  hash: string
  type: 'sent' | 'received'
  amount: string
  timestamp: number
  to: string
  from: string
  confirmed: boolean
  receipt?: TransactionReceipt
}

export interface SimulationResult {
  success: boolean
  gasLimit: string
  estimatedFee: string
  totalCost: string
  error?: string
  to?: string
  amount?: string
}

export interface WalletStatus {
  isConnected: boolean
  balance: string | undefined
  address: `0x${string}` | undefined
  chainId: number
}

export interface TransactionFormData {
  to: string
  amount: string
  isCoinbase: boolean
}

export interface WalletHookReturn {
  address: `0x${string}` | undefined
  balance: string | undefined
  isConnected: boolean
  connectWallet: () => Promise<void>
  sendTransaction: (to: string, amount: string) => Promise<TransactionReceipt | undefined>
  simulateTransaction: (to: string, amount: string) => Promise<SimulationResult>
}
