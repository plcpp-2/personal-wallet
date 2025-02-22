import { ethers } from 'ethers';
import { PersonalWallet } from '../wallet.js';

// USDC Contract ABI (minimal for transfers)
const USDC_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)'
];

export class BaseAccount extends PersonalWallet {
    constructor(providerName = 'base') {
        super(providerName);
        this.network = this.provider.network;
        this.usdcAddress = this.network.chainId === 8453 
            ? '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'  // Base Mainnet
            : '0x036CbD53842c5426634e7929541eC2318f3dCF7e'; // Base Sepolia
        this.usdcContract = new ethers.Contract(this.usdcAddress, USDC_ABI, this.provider);
    }

    async getUSDCBalance(address = null) {
        const targetAddress = address || this.wallet.address;
        const balance = await this.usdcContract.balanceOf(targetAddress);
        return ethers.formatUnits(balance, 6); // USDC has 6 decimals
    }

    async transferUSDC(to, amount) {
        if (!this.wallet) {
            throw new Error('No private key provided. Cannot send transactions.');
        }

        const parsedAmount = ethers.parseUnits(amount.toString(), 6);
        const tx = await this.usdcContract.connect(this.wallet).transfer(to, parsedAmount);
        return await tx.wait();
    }

    async approveUSDC(spender, amount) {
        if (!this.wallet) {
            throw new Error('No private key provided. Cannot send transactions.');
        }

        const parsedAmount = ethers.parseUnits(amount.toString(), 6);
        const tx = await this.usdcContract.connect(this.wallet).approve(spender, parsedAmount);
        return await tx.wait();
    }

    // Development and testing methods
    async impersonateWithBalance(address, ethAmount = '10', usdcAmount = '1000') {
        await super.impersonateAccount(address);
        await super.setBalance(address, ethAmount);
        
        // If we're on a testnet, we can try to manipulate USDC balance
        if (this.network.chainId !== 8453) {
            const usdcStorage = await this.provider.send('eth_getStorageAt', [
                this.usdcAddress,
                ethers.keccak256(
                    ethers.AbiCoder.defaultAbiCoder().encode(
                        ['uint256', 'uint256'],
                        [address, 0] // balance slot
                    )
                ),
                'latest'
            ]);
            
            await this.provider.send('hardhat_setStorageAt', [
                this.usdcAddress,
                usdcStorage,
                ethers.toBeHex(ethers.parseUnits(usdcAmount, 6))
            ]);
        }
    }
}

// Example usage
async function main() {
    const baseAccount = new BaseAccount('base_sepolia');
    
    try {
        // Get balances
        const ethBalance = await baseAccount.getBalance();
        const usdcBalance = await baseAccount.getUSDCBalance();
        
        console.log(`ETH Balance: ${ethers.formatEther(ethBalance)} ETH`);
        console.log(`USDC Balance: ${usdcBalance} USDC`);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

if (require.main === module) {
    main();
