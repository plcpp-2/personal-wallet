import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TransactionForm } from './TransactionForm'

describe('TransactionForm', () => {
  const mockOnSimulate = jest.fn()
  const mockOnSend = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form fields correctly', () => {
    render(
      <TransactionForm
        onSimulate={mockOnSimulate}
        onSend={mockOnSend}
        isSimulating={false}
        disabled={false}
      />
    )

    expect(screen.getByRole('radio', { name: /Custom Address/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Coinbase/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/To Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Simulate/i })).toBeInTheDocument()
  })

  it('handles form submission correctly', async () => {
    render(
      <TransactionForm
        onSimulate={mockOnSimulate}
        onSend={mockOnSend}
        isSimulating={false}
        disabled={false}
      />
    )

    const toInput = screen.getByLabelText(/To Address/i)
    const amountInput = screen.getByLabelText(/Amount/i)
    const submitButton = screen.getByRole('button', { name: /Simulate/i })

    await userEvent.type(toInput, '0x123')
    await userEvent.type(amountInput, '1.0')

    fireEvent.click(submitButton)

    expect(mockOnSimulate).toHaveBeenCalledWith('0x123', '1.0')
  })

  it('disables form when disabled prop is true', () => {
    render(
      <TransactionForm
        onSimulate={mockOnSimulate}
        onSend={mockOnSend}
        isSimulating={false}
        disabled={true}
      />
    )

    expect(screen.getByLabelText(/To Address/i)).toBeDisabled()
    expect(screen.getByLabelText(/Amount/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /Simulate/i })).toBeDisabled()
  })

  it('shows loading state when simulating', () => {
    render(
      <TransactionForm
        onSimulate={mockOnSimulate}
        onSend={mockOnSend}
        isSimulating={true}
        disabled={false}
      />
    )

    expect(screen.getByText(/Simulating/i)).toBeInTheDocument()
  })

  it('validates form inputs', async () => {
    render(
      <TransactionForm
        onSimulate={mockOnSimulate}
        onSend={mockOnSend}
        isSimulating={false}
        disabled={false}
      />
    )

    const submitButton = screen.getByRole('button', { name: /Simulate/i })
    expect(submitButton).toBeDisabled()

    const toInput = screen.getByLabelText(/To Address/i)
    const amountInput = screen.getByLabelText(/Amount/i)

    await userEvent.type(toInput, '0x123')
    expect(submitButton).toBeDisabled()

    await userEvent.type(amountInput, '1.0')
    expect(submitButton).not.toBeDisabled()
  })

  it('handles Coinbase selection', async () => {
    render(
      <TransactionForm
        onSimulate={mockOnSimulate}
        onSend={mockOnSend}
        isSimulating={false}
        disabled={false}
      />
    )

    const coinbaseRadio = screen.getByRole('radio', { name: /Coinbase/i })
    const customAddressRadio = screen.getByRole('radio', { name: /Custom Address/i })
    
    fireEvent.click(coinbaseRadio)

    expect(coinbaseRadio).toBeChecked()
    expect(customAddressRadio).not.toBeChecked()
  })
})
