import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'

if (!process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL) {
  throw new Error('Missing NEXT_PUBLIC_BASE_MAINNET_RPC_URL environment variable')
}

if (!process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL) {
  throw new Error('Missing NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL environment variable')
}

// Configure chains with custom RPC URLs
const configuredBase = {
  ...base,
  rpcUrls: {
    ...base.rpcUrls,
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL],
    },
  },
}

const configuredBaseSepolia = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL],
    },
  },
}

// Create wagmi config
export const config = createConfig({
  chains: [configuredBase, configuredBaseSepolia],
  connectors: [
    new MetaMaskConnector(),
    new CoinbaseWalletConnector({
      options: {
        appName: 'Personal Wallet',
      },
    }),
  ],
  transports: {
    [configuredBase.id]: http(),
    [configuredBaseSepolia.id]: http(),
  },
})

// Export configured chains for use in components
export const chains = {
  mainnet: configuredBase,
  sepolia: configuredBaseSepolia,
}

// Get the default network from environment variable
export const defaultNetwork = (process.env.NEXT_PUBLIC_DEFAULT_NETWORK || 'mainnet') as 'mainnet' | 'sepolia'
