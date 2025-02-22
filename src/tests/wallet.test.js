import { expect } from 'chai';
import { ethers } from 'ethers';
import { PersonalWallet } from '../wallet.js';

describe('PersonalWallet', () => {
    let wallet;
    const testAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    
    beforeEach(() => {
        // Use local provider for testing
        wallet = new PersonalWallet('local');
    });
    
    describe('Basic Functionality', () => {
        it('should initialize with a provider', () => {
            expect(wallet.provider).to.not.be.undefined;
        });
        
        it('should get balance', async () => {
            const balance = await wallet.getBalance(testAddress);
            expect(balance).to.not.be.undefined;
        });
    });
    
    describe('Development Features', () => {
        before(() => {
            process.env.NODE_ENV = 'development';
            process.env.ENABLE_CHEATCALLS = 'true';
        });
        
        it('should impersonate account', async () => {
            const impersonatedWallet = await wallet.impersonateAccount(testAddress);
            expect(impersonatedWallet).to.not.be.undefined;
            await wallet.stopImpersonating();
        });
        
        it('should set balance', async () => {
            const amount = '100';
            await wallet.setBalance(testAddress, amount);
            const balance = await wallet.getBalance(testAddress);
            expect(ethers.formatEther(balance)).to.equal(amount);
        });
    });
});
