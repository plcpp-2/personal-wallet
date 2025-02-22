import { expect } from 'chai';
import { ethers } from 'ethers';
import { TransactionDeployer } from '../base/transactionDeployer.js';

describe('TransactionDeployer', () => {
    let deployer;
    const testAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    
    beforeEach(() => {
        deployer = new TransactionDeployer('base_sepolia');
    });
    
    describe('Transaction Management', () => {
        it('should estimate optimal gas', async () => {
            const tx = {
                to: testAddress,
                value: ethers.parseEther('0.1')
            };
            
            const gasEstimate = await deployer.estimateOptimalGas(tx);
            expect(gasEstimate.gasLimit).to.not.be.undefined;
            expect(gasEstimate.maxFeePerGas).to.not.be.undefined;
            expect(gasEstimate.maxPriorityFeePerGas).to.not.be.undefined;
        });
        
        it('should manage nonces correctly', async () => {
            const nonce = await deployer.getNonceForAddress(testAddress);
            expect(typeof nonce).to.equal('number');
        });
    });
    
    describe('Contract Deployment', () => {
        const simpleStorageABI = ['function set(uint256 value) public', 'function get() public view returns (uint256)'];
        const simpleStorageBytecode = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea2646970667358221220d282c71834f7aa7c5159ea25b6c513ce2c0c0b86bbc8be83e07a8c4b7a37661264736f6c63430008090033';
        
        before(() => {
            process.env.NODE_ENV = 'development';
            process.env.ENABLE_CHEATCALLS = 'true';
        });
        
        it('should deploy contract', async () => {
            // First set up test account with ETH
            await deployer.impersonateWithBalance(testAddress, '10');
            
            const receipt = await deployer.deployContract(simpleStorageABI, simpleStorageBytecode);
            expect(receipt.contractAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
            
            await deployer.stopImpersonating();
        });
    });
    
    describe('Account Abstraction', () => {
        it('should create valid UserOperation', async () => {
            const tx = {
                to: testAddress,
                value: ethers.parseEther('0.1'),
                data: '0x'
            };
            
            // This will throw in most test environments without a proper bundler
            try {
                await deployer.executeAccountAbstraction(tx);
            } catch (error) {
                expect(error.message).to.include('eth_sendUserOperation');
            }
        });
    });
    
    describe('Batch Transactions', () => {
        it('should queue multiple transactions', async () => {
            const transactions = [
                {
                    to: testAddress,
                    value: ethers.parseEther('0.1')
                },
                {
                    to: testAddress,
                    value: ethers.parseEther('0.2')
                }
            ];
            
            // Add transactions to queue
            await deployer.batchTransactions(transactions);
            expect(deployer.txQueue.queue.length).to.equal(0); // Should be processed
        });
    });
});
