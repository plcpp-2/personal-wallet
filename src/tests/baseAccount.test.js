import { expect } from 'chai';
import { ethers } from 'ethers';
import { BaseAccount } from '../base/baseAccount.js';

describe('BaseAccount', () => {
    let baseAccount;
    const testAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    
    beforeEach(() => {
        // Use Base Sepolia for testing
        baseAccount = new BaseAccount('base_sepolia');
    });
    
    describe('Basic Functionality', () => {
        it('should initialize with Base provider', () => {
            expect(baseAccount.provider).to.not.be.undefined;
            expect(baseAccount.network.chainId).to.equal(84532); // Base Sepolia
        });
        
        it('should get ETH balance', async () => {
            const balance = await baseAccount.getBalance(testAddress);
            expect(balance).to.not.be.undefined;
        });
        
        it('should get USDC balance', async () => {
            const balance = await baseAccount.getUSDCBalance(testAddress);
            expect(balance).to.not.be.undefined;
        });
    });
    
    describe('Development Features', () => {
        before(() => {
            process.env.NODE_ENV = 'development';
            process.env.ENABLE_CHEATCALLS = 'true';
        });
        
        it('should impersonate account with balances', async () => {
            await baseAccount.impersonateWithBalance(testAddress, '10', '1000');
            
            const ethBalance = await baseAccount.getBalance(testAddress);
            expect(ethers.formatEther(ethBalance)).to.equal('10.0');
            
            const usdcBalance = await baseAccount.getUSDCBalance(testAddress);
            expect(usdcBalance).to.equal('1000.0');
            
            await baseAccount.stopImpersonating();
        });
    });
});
