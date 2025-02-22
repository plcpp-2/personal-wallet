import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { providerProxy, networks } from './config/providers.js';
dotenv.config();

class PersonalWallet {
    constructor(providerName = null) {
        const providerUrl = providerProxy.getProvider(providerName);
        this.provider = new ethers.JsonRpcProvider(providerUrl);
        
        if (process.env.PRIVATE_KEY) {
            this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        }
        
        this.network = networks[process.env.NETWORK || 'mainnet'];
        this.setupGasSettings();
    }

    setupGasSettings() {
        this.gasMultiplier = process.env.GAS_PRICE_MULTIPLIER ? parseFloat(process.env.GAS_PRICE_MULTIPLIER) : 1.1;
        this.maxPriorityFee = process.env.MAX_PRIORITY_FEE ? parseFloat(process.env.MAX_PRIORITY_FEE) : 2;
    }

    async getBalance(address = null) {
        const targetAddress = address || this.wallet.address;
        return await this.provider.getBalance(targetAddress);
    }

    async sendTransaction(to, amount, options = {}) {
        if (!this.wallet) {
            throw new Error('No private key provided. Cannot send transactions.');
        }

        const gasPrice = await this.provider.getFeeData();
        
        const tx = {
            to: to,
            value: ethers.parseEther(amount.toString()),
            maxFeePerGas: gasPrice.maxFeePerGas * BigInt(Math.floor(this.gasMultiplier * 100) / 100),
            maxPriorityFeePerGas: ethers.parseUnits(this.maxPriorityFee.toString(), 'gwei'),
            ...options
        };
        
        try {
            const transaction = await this.wallet.sendTransaction(tx);
            return await transaction.wait();
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    }

    // Development and testing methods
    async impersonateAccount(address) {
        if (process.env.NODE_ENV !== 'development' || !process.env.ENABLE_CHEATCALLS) {
            throw new Error('Impersonation only available in development mode with cheatcalls enabled');
        }

        await this.provider.send('cheat_impersonateAccount', [address]);
        // Store the impersonated address for later use
        this.impersonatedAddress = address;
        
        // Create a new wallet instance for the impersonated address
        this.impersonatedWallet = await ethers.Wallet.createRandom().connect(this.provider);
        
        console.log(`Now impersonating ${address}`);
        return this.impersonatedWallet;
    }

    async stopImpersonating() {
        if (this.impersonatedAddress) {
            await this.provider.send('cheat_stopImpersonatingAccount', [this.impersonatedAddress]);
            this.impersonatedAddress = null;
            this.impersonatedWallet = null;
            console.log('Stopped impersonating account');
        }
    }

    async setBalance(address, amount) {
        if (process.env.NODE_ENV !== 'development' || !process.env.ENABLE_CHEATCALLS) {
            throw new Error('Balance modification only available in development mode with cheatcalls enabled');
        }

        const params = [
            address,
            ethers.toQuantity(ethers.parseEther(amount.toString()))
        ];
        
        await this.provider.send('cheat_setBalance', params);
        console.log(`Set balance of ${address} to ${amount} ${this.network.currency}`);
    }
}

// Example usage
async function main() {
    // Use the default provider (or specify one)
    const wallet = new PersonalWallet(process.env.DEFAULT_PROVIDER);

    try {
        // Get balance
        const balance = await wallet.getBalance();
        console.log('Balance:', ethers.formatEther(balance), this.network.currency);

        // For development/testing: impersonate an account
        if (process.env.NODE_ENV === 'development' && process.env.IMPERSONATE_ADDRESS) {
            await wallet.impersonateAccount(process.env.IMPERSONATE_ADDRESS);
            const impersonatedBalance = await wallet.getBalance(process.env.IMPERSONATE_ADDRESS);
            console.log('Impersonated Balance:', ethers.formatEther(impersonatedBalance), this.network.currency);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Clean up any impersonation
        if (process.env.NODE_ENV === 'development') {
            await wallet.stopImpersonating();
        }
    }
}

if (require.main === module) {
    main();
}

export default PersonalWallet;
