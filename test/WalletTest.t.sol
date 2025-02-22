// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";

contract WalletTest is Test {
    address payable public wallet;
    address public constant COINBASE = 0x742d35Cc6634C0532925a3b844Bc454e4438f44e;
    uint256 public constant INITIAL_BALANCE = 100 ether;

    function setUp() public {
        // Create a new wallet
        wallet = payable(makeAddr("wallet"));
        vm.deal(wallet, INITIAL_BALANCE);
    }

    function testTransferToCoinbase() public {
        uint256 amount = 1 ether;
        
        // Record balances before
        uint256 walletBalanceBefore = wallet.balance;
        uint256 coinbaseBalanceBefore = COINBASE.balance;

        // Perform transfer
        vm.prank(wallet);
        (bool success,) = COINBASE.call{value: amount}("");
        assertTrue(success, "Transfer failed");

        // Verify balances
        assertEq(wallet.balance, walletBalanceBefore - amount, "Incorrect wallet balance");
        assertEq(COINBASE.balance, coinbaseBalanceBefore + amount, "Incorrect Coinbase balance");
    }

    function testFailInsufficientBalance() public {
        uint256 amount = INITIAL_BALANCE + 1 ether;
        
        vm.prank(wallet);
        (bool success,) = COINBASE.call{value: amount}("");
        assertTrue(success, "Transfer should fail");
    }

    function testSimulateGasEstimation() public {
        uint256 amount = 1 ether;
        
        // Start recording gas usage
        uint256 gasBefore = gasleft();
        
        vm.prank(wallet);
        (bool success,) = COINBASE.call{value: amount}("");
        assertTrue(success, "Transfer failed");
        
        uint256 gasUsed = gasBefore - gasleft();
        console.log("Gas used for transfer:", gasUsed);
    }

    receive() external payable {}
}
