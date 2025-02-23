import { useAccount, useConnect, useBalance, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { toast } from 'react-hot-toast'
import { getTransactionsByAddress, getTokenBalances, getNFTs } from '@/services/alchemy'
import { useState, useCallback } from 'react'

export const useWallet = () => {
  const { address, isConnected } = useAccount()
  const { connect, connectAsync, connectors } = useConnect()
  const { data: balanceData } = useBalance({ address })
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [transactionHistory, setTransactionHistory] = useState<any[]>([])
  const [tokenBalances, setTokenBalances] = useState<any[]>([])
  const [nfts, setNfts] = useState<any[]>([])

  const { config } = usePrepareSendTransaction({
    to: undefined,
    value: undefined,
  })

  const { sendTransaction } = useSendTransaction(config)
  const { data: transactionData, isLoading: isTransactionPending } = useWaitForTransaction({
    hash: undefined,
  })

  const connectWallet = async () => {
    try {
      const metamask = connectors.find(c => c.id === 'metamask')
      if (metamask) {
        await connectAsync({ connector: metamask })
        toast.success('Wallet connected successfully')
      } else {
        toast.error('MetaMask not found')
      }
    } catch (error) {
      console.error('Connection error:', error)
      toast.error('Failed to connect wallet')
    }
  }

  const simulateTransaction = async (to: string, amount: string) => {
    try {
      const value = parseEther(amount)
      const config = await usePrepareSendTransaction({
        to,
        value,
      })
      
      return {
        success: !config.isError,
        error: config.error?.message,
        to,
        amount,
      }
    } catch (error) {
      console.error('Simulation error:', error)
      return {
        success: false,
        error: 'Failed to simulate transaction',
        to,
        amount,
      }
    }
  }

  const sendTransaction = async (to: string, amount: string) => {
    try {
      const simulation = await simulateTransaction(to, amount)
      if (!simulation.success) {
        throw new Error(simulation.error || 'Transaction simulation failed')
      }

      const tx = await sendTransaction?.()
      if (tx?.hash) {
        toast.success('Transaction sent successfully')
        return tx.hash
      }
    } catch (error) {
      console.error('Transaction error:', error)
      toast.error('Failed to send transaction')
      throw error
    }
  }

  const loadTransactionHistory = useCallback(async (network: 'mainnet' | 'sepolia' = 'mainnet') => {
    if (!address) return
    
    setIsLoadingHistory(true)
    try {
      const history = await getTransactionsByAddress(address, network)
      setTransactionHistory(history.transfers || [])
    } catch (error) {
      console.error('Failed to load transaction history:', error)
      toast.error('Failed to load transaction history')
    } finally {
      setIsLoadingHistory(false)
    }
  }, [address])

  const loadTokenBalances = useCallback(async (network: 'mainnet' | 'sepolia' = 'mainnet') => {
    if (!address) return
    
    try {
      const balances = await getTokenBalances(address, network)
      setTokenBalances(balances.tokenBalances || [])
    } catch (error) {
      console.error('Failed to load token balances:', error)
      toast.error('Failed to load token balances')
    }
  }, [address])

  const loadNFTs = useCallback(async (network: 'mainnet' | 'sepolia' = 'mainnet') => {
    if (!address) return
    
    try {
      const nftData = await getNFTs(address, network)
      setNfts(nftData.ownedNfts || [])
    } catch (error) {
      console.error('Failed to load NFTs:', error)
      toast.error('Failed to load NFTs')
    }
  }, [address])

  return {
    address,
    balance: balanceData?.formatted,
    isConnected,
    connectWallet,
    simulateTransaction,
    sendTransaction,
    isTransactionPending,
    transactionHistory,
    isLoadingHistory,
    loadTransactionHistory,
    tokenBalances,
    loadTokenBalances,
    nfts,
    loadNFTs,
  }
}
