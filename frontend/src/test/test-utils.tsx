import { ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'
import { render } from '@testing-library/react'
import { config } from '@/config/wagmi'

export const renderWithWagmi = (ui: ReactNode) => {
  return render(
    <WagmiConfig config={config}>
      {ui}
    </WagmiConfig>
  )
}

export * from '@testing-library/react'
