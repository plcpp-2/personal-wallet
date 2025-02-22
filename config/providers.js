import dotenv from 'dotenv';
dotenv.config();

export const networks = {
    mainnet: {
        name: 'Ethereum Mainnet',
        chainId: 1,
        currency: 'ETH',
        blockExplorer: 'https://etherscan.io'
    },
    base: {
        name: 'Base Mainnet',
        chainId: 8453,
        currency: 'ETH',
        blockExplorer: 'https://basescan.org',
        usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    },
    base_sepolia: {
        name: 'Base Sepolia',
        chainId: 84532,
        currency: 'ETH',
        blockExplorer: 'https://sepolia.basescan.org',
        usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
    },
    sepolia: {
        name: 'Sepolia Testnet',
        chainId: 11155111,
        currency: 'ETH',
        blockExplorer: 'https://sepolia.etherscan.io'
    },
    localhost: {
        name: 'Local Network',
        chainId: 31337,
        currency: 'ETH',
        blockExplorer: null
    }
};

class ProviderProxy {
    constructor() {
        this.providers = {
            infura: process.env.INFURA_URL,
            alchemy: process.env.ALCHEMY_URL,
            base: process.env.BASE_URL || 'https://mainnet.base.org',
            base_sepolia: process.env.BASE_SEPOLIA_URL || 'https://sepolia.base.org',
            local: 'http://127.0.0.1:8545'
        };
        this.defaultProvider = 'local';
    }

    getProvider(providerName = null) {
        const provider = providerName || process.env.DEFAULT_PROVIDER || this.defaultProvider;
        
        if (!this.providers[provider]) {
            throw new Error(`Provider ${provider} not configured. Please check your .env file.`);
        }
        
        return this.providers[provider];
    }
}

export const providerProxy = new ProviderProxy();
