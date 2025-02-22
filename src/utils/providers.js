import dotenv from 'dotenv';
dotenv.config();

class ProviderProxy {
    constructor() {
        this.providers = {};
        this.fallbackProvider = null;
        this.initializeProviders();
    }

    initializeProviders() {
        // Add providers based on environment variables
        if (process.env.ALCHEMY_KEY) {
            this.addProvider('alchemy', `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`);
        }
        if (process.env.INFURA_KEY) {
            this.addProvider('infura', `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
        }
        if (process.env.TENDERLY_KEY) {
            this.addProvider('tenderly', `https://rpc.tenderly.co/fork/${process.env.TENDERLY_KEY}`);
        }
        if (process.env.CUSTOM_RPC) {
            this.addProvider('custom', process.env.CUSTOM_RPC);
        }
    }

    addProvider(name, url) {
        this.providers[name] = url;
        // Set first provider as fallback if none set
        if (!this.fallbackProvider) {
            this.fallbackProvider = name;
        }
    }

    getProvider(name = null) {
        if (name && this.providers[name]) {
            return this.providers[name];
        }
        // Return fallback provider if specific one not found
        return this.providers[this.fallbackProvider];
    }

    getAllProviders() {
        return this.providers;
    }

    setFallbackProvider(name) {
        if (this.providers[name]) {
            this.fallbackProvider = name;
            return true;
        }
        return false;
    }
}

// Network configurations
export const networks = {
    mainnet: {
        chainId: 1,
        name: 'Mainnet',
        currency: 'ETH',
        explorer: 'https://etherscan.io'
    },
    goerli: {
        chainId: 5,
        name: 'Goerli',
        currency: 'ETH',
        explorer: 'https://goerli.etherscan.io'
    },
    polygon: {
        chainId: 137,
        name: 'Polygon',
        currency: 'MATIC',
        explorer: 'https://polygonscan.com'
    }
};

// Create singleton instance
export const providerProxy = new ProviderProxy();
