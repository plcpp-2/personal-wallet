import { useAccount, useConnect, useBalance, usePrepareSendTransaction, useSendTransaction } from 'wagmi'
import { useCallback } from 'react'
import { parseEther } from 'viem'
import { toast } from 'react-hot-toast'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'

export function useWallet() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { data: balance } = useBalance({
    address,
    watch: true,
  })

  const { config } = usePrepareSendTransaction({
    to: undefined,
    value: undefined,
  })

  const { sendTransaction } = useSendTransaction(config)

  const connectWallet = useCallback(() => {
    try {
      connect({
        connector: new CoinbaseWalletConnector({
          options: {
            appName: 'Personal Wallet Manager',
          },
        }),
      })
      toast.success('Wallet connected successfully')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }, [connect])

  const simulateTransaction = useCallback(async (to: string, amount: string) => {
    if (!address) throw new Error('Wallet not connected')

    try {
      const value = parseEther(amount)
      const { config } = await usePrepareSendTransaction({
        to,
        value,
      })

      return {
        success: true,
        gasLimit: config.gas?.toString() || '0',
        estimatedFee: config.value?.toString() || '0',
        totalCost: (BigInt(config.value || 0) + BigInt(config.gas || 0)).toString(),
      }
    } catch (error) {
      console.error('Simulation failed:', error)
      throw error
    }
  }, [address])

  const sendTransactionAsync = useCallback(async (to: string, amount: string) => {
    if (!address) throw new Error('Wallet not connected')

    try {
      const value = parseEther(amount)
      const { config } = await usePrepareSendTransaction({
        to,
        value,
      })

      const tx = await sendTransaction?.(config)
      if (tx) {
        toast.success('Transaction sent successfully')
        return tx
      }
    } catch (error) {
      console.error('Transaction failed:', error)
      toast.error('Transaction failed')
      throw error
    }
  }, [address, sendTransaction])

  return {
    address,
    balance: balance?.formatted,
    isConnected,
    connectWallet,
    sendTransaction: sendTransactionAsync,
    simulateTransaction,
  }
}
