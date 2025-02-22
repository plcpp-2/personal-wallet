import { render, screen, fireEvent } from '@testing-library/react'
import { WalletStatus } from './WalletStatus'

describe('WalletStatus', () => {
  const mockOnConnect = jest.fn()
  const mockAddress = '0x1234567890abcdef1234567890abcdef12345678'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders connect button when not connected', () => {
    render(
      <WalletStatus
        isConnected={false}
        balance="0"
        address={mockAddress}
        onConnect={mockOnConnect}
      />
    )

    const connectButton = screen.getByRole('button', { name: /connect wallet/i })
    expect(connectButton).toBeInTheDocument()
    
    fireEvent.click(connectButton)
    expect(mockOnConnect).toHaveBeenCalledTimes(1)
  })

  it('displays wallet info when connected', () => {
    const balance = '1.234'
    render(
      <WalletStatus
        isConnected={true}
        balance={balance}
        address={mockAddress}
        onConnect={mockOnConnect}
      />
    )

    // Check for connected status
    expect(screen.getByText(/Connected/i)).toBeInTheDocument()

    // Check for truncated address (first 6 and last 4 characters)
    const truncatedAddress = `${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`
    expect(screen.getByText(truncatedAddress)).toBeInTheDocument()

    // Check for balance
    expect(screen.getByText(new RegExp(`${balance}\\s*ETH`, 'i'))).toBeInTheDocument()
  })

  it('formats large balance correctly', () => {
    const balance = '1.23456789'
    render(
      <WalletStatus
        isConnected={true}
        balance={balance}
        address={mockAddress}
        onConnect={mockOnConnect}
      />
    )

    // Should round to 4 decimal places
    expect(screen.getByText(/1.2346\s*ETH/i)).toBeInTheDocument()
  })
})
