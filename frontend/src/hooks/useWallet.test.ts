import { renderHook, act } from '@testing-library/react'
import { useWallet } from './useWallet'
import { toast } from 'react-hot-toast'

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
  useBalance: jest.fn(),
  usePrepareSendTransaction: jest.fn(),
  useSendTransaction: jest.fn(),
  useWaitForTransaction: jest.fn(),
}))

// Mock viem
jest.mock('viem', () => ({
  parseEther: jest.fn((amount: string) => BigInt(amount.replace('.', ''))),
  formatEther: jest.fn((amount: bigint) => amount.toString()),
}))

// Mock toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}))

// Import the mocked modules
import { useAccount, useConnect, useBalance, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { parseEther, formatEther } from 'viem'

describe('useWallet', () => {
  const mockAddress = '0x1234567890abcdef1234567890abcdef12345678'
  const mockBalance = { formatted: '1.0', value: BigInt(1000000000000000000) }
  const mockConnect = jest.fn()
  const mockDisconnect = jest.fn()
  const mockSendTransaction = jest.fn()
  const mockWaitForTransaction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock implementations
    ;(useAccount as jest.Mock).mockReturnValue({
      address: mockAddress,
      isConnected: true,
      connector: { id: 'metamask' },
    })

    ;(useConnect as jest.Mock).mockReturnValue({
      connect: mockConnect,
      connectAsync: mockConnect,
      connectors: [{ id: 'metamask', name: 'MetaMask' }],
    })

    ;(useBalance as jest.Mock).mockReturnValue({
      data: mockBalance,
      isLoading: false,
      isError: false,
    })

    ;(usePrepareSendTransaction as jest.Mock).mockReturnValue({
      config: {},
      isError: false,
      error: null,
    })

    ;(useSendTransaction as jest.Mock).mockReturnValue({
      sendTransaction: mockSendTransaction,
      data: null,
      isLoading: false,
      isError: false,
    })

    ;(useWaitForTransaction as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    })

    ;(parseEther as jest.Mock).mockImplementation((amount: string) => BigInt(amount.replace('.', '')))
    ;(formatEther as jest.Mock).mockImplementation((amount: bigint) => amount.toString())
  })

  it('returns wallet state correctly', () => {
    const { result } = renderHook(() => useWallet())

    expect(result.current.address).toBe(mockAddress)
    expect(result.current.balance).toBe(mockBalance.formatted)
    expect(result.current.isConnected).toBe(true)
  })

  it('connects wallet successfully', async () => {
    const { result } = renderHook(() => useWallet())

    await act(async () => {
      await result.current.connectWallet()
    })

    expect(mockConnect).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith('Wallet connected successfully')
  })

  it('handles connection error', async () => {
    const error = new Error('Connection failed')
    ;(useConnect as jest.Mock).mockReturnValue({
      connect: jest.fn().mockRejectedValue(error),
      connectAsync: jest.fn().mockRejectedValue(error),
    })

    const { result } = renderHook(() => useWallet())

    await act(async () => {
      await result.current.connectWallet()
    })

    expect(toast.error).toHaveBeenCalledWith('Failed to connect wallet')
  })

  it('simulates transaction correctly', async () => {
    const to = '0x9876543210abcdef9876543210abcdef98765432'
    const amount = '1.0'

    ;(usePrepareSendTransaction as jest.Mock).mockReturnValue({
      config: {
        to,
        value: parseEther(amount),
      },
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useWallet())

    await act(async () => {
      const simulation = await result.current.simulateTransaction(to, amount)
      expect(simulation.success).toBe(true)
      expect(simulation.to).toBe(to)
      expect(simulation.amount).toBe(amount)
    })
  })

  it('sends transaction successfully', async () => {
    const to = '0x9876543210abcdef9876543210abcdef98765432'
    const amount = '1.0'
    const txHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'

    ;(useSendTransaction as jest.Mock).mockReturnValue({
      sendTransaction: jest.fn().mockResolvedValue({ hash: txHash }),
      data: { hash: txHash },
      isLoading: false,
      isError: false,
    })

    ;(useWaitForTransaction as jest.Mock).mockReturnValue({
      data: { status: 1 },
      isLoading: false,
      isError: false,
    })

    const { result } = renderHook(() => useWallet())

    await act(async () => {
      await result.current.sendTransaction(to, amount)
    })

    expect(toast.success).toHaveBeenCalledWith('Transaction sent successfully')
  })

  it('handles transaction error', async () => {
    const error = new Error('Transaction failed')
    ;(useSendTransaction as jest.Mock).mockReturnValue({
      sendTransaction: jest.fn().mockRejectedValue(error),
      isError: true,
      error,
    })

    const { result } = renderHook(() => useWallet())

    await act(async () => {
      await result.current.sendTransaction('0x123', '1.0')
    })

    expect(toast.error).toHaveBeenCalledWith('Failed to send transaction')
  })
})
