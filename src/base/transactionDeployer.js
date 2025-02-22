import { ethers } from 'ethers';
import { BaseAccount } from './baseAccount.js';

class TransactionQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    add(tx) {
        this.queue.push(tx);
    }

    clear() {
        this.queue = [];
    }

    async process(deployer) {
        if (this.processing) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const tx = this.queue.shift();
            try {
                await deployer.executeTx(tx);
            } catch (error) {
                console.error(`Failed to process transaction: ${error.message}`);
                // Re-queue failed transactions if they're retryable
                if (error.message.includes('nonce too low') || error.message.includes('replacement fee too low')) {
                    this.queue.push(tx);
                }
            }
        }

        this.processing = false;
    }
}

export class TransactionDeployer extends BaseAccount {
    constructor(providerName = 'base') {
        super(providerName);
        this.txQueue = new TransactionQueue();
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
        this.pendingNonces = new Set();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.provider.on('block', async (blockNumber) => {
            // Process queued transactions on each new block
            await this.txQueue.process(this);
        });
    }

    async getNonceForAddress(address) {
        const nonce = await this.provider.getTransactionCount(address, 'latest');
        return this.pendingNonces.has(nonce) ? nonce + 1 : nonce;
    }

    async estimateOptimalGas(tx) {
        const gasLimit = await this.provider.estimateGas(tx);
        const feeData = await this.provider.getFeeData();
        
        return {
            gasLimit: gasLimit,
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
        };
    }

    async executeTx(tx, retryCount = 0) {
        try {
            const nonce = await this.getNonceForAddress(this.wallet.address);
            this.pendingNonces.add(nonce);

            const gasEstimate = await this.estimateOptimalGas(tx);
            
            const transaction = {
                ...tx,
                ...gasEstimate,
                nonce
            };

            const signedTx = await this.wallet.signTransaction(transaction);
            const response = await this.provider.broadcastTransaction(signedTx);
            
            // Wait for transaction confirmation
            const receipt = await response.wait(1);
            this.pendingNonces.delete(nonce);
            
            return receipt;
        } catch (error) {
            if (retryCount < this.maxRetries) {
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.executeTx(tx, retryCount + 1);
            }
            throw error;
        }
    }

    async deployContract(abi, bytecode, constructorArgs = []) {
        const factory = new ethers.ContractFactory(abi, bytecode, this.wallet);
        const deployTx = factory.getDeployTransaction(...constructorArgs);
        
        return await this.executeTx(deployTx);
    }

    async batchTransactions(transactions) {
        for (const tx of transactions) {
            this.txQueue.add(tx);
        }
        await this.txQueue.process(this);
    }

    // Account Abstraction Integration
    async executeAccountAbstraction(tx, paymaster = null) {
        // Add UserOperation structure for ERC-4337
        const userOp = {
            sender: this.wallet.address,
            nonce: await this.getNonceForAddress(this.wallet.address),
            initCode: '0x',
            callData: tx.data || '0x',
            callGasLimit: tx.gasLimit || await this.provider.estimateGas(tx),
            verificationGasLimit: 150000,
            preVerificationGas: 21000,
            maxFeePerGas: tx.maxFeePerGas || (await this.provider.getFeeData()).maxFeePerGas,
            maxPriorityFeePerGas: tx.maxPriorityFeePerGas || (await this.provider.getFeeData()).maxPriorityFeePerGas,
            paymasterAndData: paymaster || '0x',
            signature: '0x'
        };

        // Sign the UserOperation
        const userOpHash = ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(
            ['address', 'uint256', 'bytes', 'bytes', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'bytes'],
            [
                userOp.sender,
                userOp.nonce,
                userOp.initCode,
                userOp.callData,
                userOp.callGasLimit,
                userOp.verificationGasLimit,
                userOp.preVerificationGas,
                userOp.maxFeePerGas,
                userOp.maxPriorityFeePerGas,
                userOp.paymasterAndData
            ]
        ));
        
        userOp.signature = await this.wallet.signMessage(ethers.getBytes(userOpHash));
        
        // Submit UserOperation to the bundler
        return await this.provider.send('eth_sendUserOperation', [userOp]);
    }
}

// Example usage
async function main() {
    const deployer = new TransactionDeployer('base_sepolia');
    
    try {
        // Example contract deployment
        const simpleStorageABI = ['function set(uint256 value) public', 'function get() public view returns (uint256)'];
        const simpleStorageBytecode = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea2646970667358221220d282c71834f7aa7c5159ea25b6c513ce2c0c0b86bbc8be83e07a8c4b7a37661264736f6c63430008090033';
        
        const deploymentReceipt = await deployer.deployContract(simpleStorageABI, simpleStorageBytecode);
        console.log('Contract deployed at:', deploymentReceipt.contractAddress);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

if (require.main === module) {
    main();
