
import React, { useState, useEffect } from "react";
import classes from './main.module.css';
import { Address, createPublicClient, webSocket, createTestClient, http, publicActions, createWalletClient, decodeFunctionResult, getAddress, walletActions, custom, parseEther, decodeEventLog, formatEther } from 'viem';
import { mainnet, foundry, goerli, linea, lineaTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts'
import "viem/window";
import { estimateGas } from "viem/_types/actions/public/estimateGas";
import { Network, Alchemy } from 'alchemy-sdk';
import { Web3 } from "web3";







const transport = webSocket('wss://eth-mainnet.g.alchemy.com/v2/iXYPKPNVzY3OKROW2emJzNoE3ooToaRa');







    
    













const rETHabi = [{ "inputs": [{ "internalType": "contract RocketStorageInterface", "name": "_rocketStorageAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "EtherDeposited", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "ethAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "TokensBurned", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "ethAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "TokensMinted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_rethAmount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "depositExcess", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "depositExcessCollateral", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getCollateralRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_rethAmount", "type": "uint256" }], "name": "getEthValue", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getExchangeRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_ethAmount", "type": "uint256" }], "name": "getRethValue", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalCollateral", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_ethAmount", "type": "uint256" }, { "internalType": "address", "name": "_to", "type": "address" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]


const abi =
    [{
        "type": "event",
        "name": "Deposit",
        "inputs": [
            {
                "indexed": true,
                "name": "",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "type": "event",
        "name": "Drain",
        "inputs": [
            {
                "indexed": true,
                "name": "",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "",
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "deposit",
        "inputs": [
            {
                "name": "stETH",
                "type": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable",
        "payable": false
    },
    {
        "type": "function",
        "name": "drain",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable",
        "payable": false
    }]


const stethAbi = [{ "constant": false, "inputs": [], "name": "resume", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": false, "inputs": [], "name": "stop", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "hasInitialized", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "STAKING_CONTROL_ROLE", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_ethAmount", "type": "uint256" }], "name": "getSharesByPooledEth", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isStakingPaused", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_sender", "type": "address" }, { "name": "_recipient", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_script", "type": "bytes" }], "name": "getEVMScriptExecutor", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_maxStakeLimit", "type": "uint256" }, { "name": "_stakeLimitIncreasePerBlock", "type": "uint256" }], "name": "setStakingLimit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "RESUME_ROLE", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_lidoLocator", "type": "address" }, { "name": "_eip712StETH", "type": "address" }], "name": "finalizeUpgrade_v2", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [], "name": "getRecoveryVault", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "DOMAIN_SEPARATOR", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTotalPooledEther", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newDepositedValidators", "type": "uint256" }], "name": "unsafeChangeDepositedValidators", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "PAUSE_ROLE", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getTreasury", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isStopped", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBufferedEther", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_lidoLocator", "type": "address" }, { "name": "_eip712StETH", "type": "address" }], "name": "initialize", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "receiveELRewards", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "getWithdrawalCredentials", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getCurrentStakeLimit", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getStakeLimitFullInfo", "outputs": [{ "name": "isStakingPaused", "type": "bool" }, { "name": "isStakingLimitSet", "type": "bool" }, { "name": "currentStakeLimit", "type": "uint256" }, { "name": "maxStakeLimit", "type": "uint256" }, { "name": "maxStakeLimitGrowthBlocks", "type": "uint256" }, { "name": "prevStakeLimit", "type": "uint256" }, { "name": "prevStakeBlockNumber", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_sender", "type": "address" }, { "name": "_recipient", "type": "address" }, { "name": "_sharesAmount", "type": "uint256" }], "name": "transferSharesFrom", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_account", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "resumeStaking", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getFeeDistribution", "outputs": [{ "name": "treasuryFeeBasisPoints", "type": "uint16" }, { "name": "insuranceFeeBasisPoints", "type": "uint16" }, { "name": "operatorsFeeBasisPoints", "type": "uint16" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "receiveWithdrawals", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_sharesAmount", "type": "uint256" }], "name": "getPooledEthByShares", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "token", "type": "address" }], "name": "allowRecoverability", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "nonces", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "appId", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getOracle", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "eip712Domain", "outputs": [{ "name": "name", "type": "string" }, { "name": "version", "type": "string" }, { "name": "chainId", "type": "uint256" }, { "name": "verifyingContract", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getContractVersion", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getInitializationBlock", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_sharesAmount", "type": "uint256" }], "name": "transferShares", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [], "name": "getEIP712StETH", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "", "type": "address" }], "name": "transferToVault", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_sender", "type": "address" }, { "name": "_role", "type": "bytes32" }, { "name": "_params", "type": "uint256[]" }], "name": "canPerform", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_referral", "type": "address" }], "name": "submit", "outputs": [{ "name": "", "type": "uint256" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getEVMScriptRegistry", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_maxDepositsCount", "type": "uint256" }, { "name": "_stakingModuleId", "type": "uint256" }, { "name": "_depositCalldata", "type": "bytes" }], "name": "deposit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "UNSAFE_CHANGE_DEPOSITED_VALIDATORS_ROLE", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBeaconStat", "outputs": [{ "name": "depositedValidators", "type": "uint256" }, { "name": "beaconValidators", "type": "uint256" }, { "name": "beaconBalance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "removeStakingLimit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_reportTimestamp", "type": "uint256" }, { "name": "_timeElapsed", "type": "uint256" }, { "name": "_clValidators", "type": "uint256" }, { "name": "_clBalance", "type": "uint256" }, { "name": "_withdrawalVaultBalance", "type": "uint256" }, { "name": "_elRewardsVaultBalance", "type": "uint256" }, { "name": "_sharesRequestedToBurn", "type": "uint256" }, { "name": "_withdrawalFinalizationBatches", "type": "uint256[]" }, { "name": "_simulatedShareRate", "type": "uint256" }], "name": "handleOracleReport", "outputs": [{ "name": "postRebaseAmounts", "type": "uint256[4]" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getFee", "outputs": [{ "name": "totalFee", "type": "uint16" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "kernel", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTotalShares", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_deadline", "type": "uint256" }, { "name": "_v", "type": "uint8" }, { "name": "_r", "type": "bytes32" }, { "name": "_s", "type": "bytes32" }], "name": "permit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isPetrified", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getLidoLocator", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "canDeposit", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "STAKING_PAUSE_ROLE", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getDepositableEther", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_account", "type": "address" }], "name": "sharesOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "pauseStaking", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getTotalELRewardsCollected", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [], "name": "StakingPaused", "type": "event" }, { "anonymous": false, "inputs": [], "name": "StakingResumed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "maxStakeLimit", "type": "uint256" }, { "indexed": false, "name": "stakeLimitIncreasePerBlock", "type": "uint256" }], "name": "StakingLimitSet", "type": "event" }, { "anonymous": false, "inputs": [], "name": "StakingLimitRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "reportTimestamp", "type": "uint256" }, { "indexed": false, "name": "preCLValidators", "type": "uint256" }, { "indexed": false, "name": "postCLValidators", "type": "uint256" }], "name": "CLValidatorsUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "depositedValidators", "type": "uint256" }], "name": "DepositedValidatorsChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "reportTimestamp", "type": "uint256" }, { "indexed": false, "name": "preCLBalance", "type": "uint256" }, { "indexed": false, "name": "postCLBalance", "type": "uint256" }, { "indexed": false, "name": "withdrawalsWithdrawn", "type": "uint256" }, { "indexed": false, "name": "executionLayerRewardsWithdrawn", "type": "uint256" }, { "indexed": false, "name": "postBufferedEther", "type": "uint256" }], "name": "ETHDistributed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "reportTimestamp", "type": "uint256" }, { "indexed": false, "name": "timeElapsed", "type": "uint256" }, { "indexed": false, "name": "preTotalShares", "type": "uint256" }, { "indexed": false, "name": "preTotalEther", "type": "uint256" }, { "indexed": false, "name": "postTotalShares", "type": "uint256" }, { "indexed": false, "name": "postTotalEther", "type": "uint256" }, { "indexed": false, "name": "sharesMintedAsFees", "type": "uint256" }], "name": "TokenRebased", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "lidoLocator", "type": "address" }], "name": "LidoLocatorSet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "amount", "type": "uint256" }], "name": "ELRewardsReceived", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "amount", "type": "uint256" }], "name": "WithdrawalsReceived", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "sender", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "referral", "type": "address" }], "name": "Submitted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "amount", "type": "uint256" }], "name": "Unbuffered", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "executor", "type": "address" }, { "indexed": false, "name": "script", "type": "bytes" }, { "indexed": false, "name": "input", "type": "bytes" }, { "indexed": false, "name": "returnData", "type": "bytes" }], "name": "ScriptResult", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "vault", "type": "address" }, { "indexed": true, "name": "token", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "RecoverToVault", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "eip712StETH", "type": "address" }], "name": "EIP712StETHInitialized", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "sharesValue", "type": "uint256" }], "name": "TransferShares", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }, { "indexed": false, "name": "preRebaseTokenAmount", "type": "uint256" }, { "indexed": false, "name": "postRebaseTokenAmount", "type": "uint256" }, { "indexed": false, "name": "sharesAmount", "type": "uint256" }], "name": "SharesBurnt", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Stopped", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Resumed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "version", "type": "uint256" }], "name": "ContractVersionSet", "type": "event" }]









function Main() {








    const [account, setAccount] = useState<Address >()
    const [foundryAccount, setFoundryAccount] = useState<Address >()
    const [approved, setApproved] = useState<boolean>(false);

    const [hash, setHash] = useState<string | undefined>()
    const [receipt, setReceipt] = useState<string | undefined>();
    const [stETHChecked, setStETHChecked] = useState<boolean>(false);
    const [stETH, setStETH] = useState<BigInt | undefined>(BigInt(0));
    const [stETHstring, setStETHstring] = useState("");
    const [ETH, setETH] = useState<bigint | undefined>(BigInt(0));
    const [ETHChecked, setETHChecked] = useState<boolean>(false)
    const [ETHstring, setETHstring] = useState("");
    const [approvalHash, setApprovalHash] = useState<string | undefined>()
    const [approvalReceipt, setApprovalReceipt] = useState<string | undefined>();
    const [errorMessage, setErrorMessage] = useState<string | undefined>("")
    const [errorMessage2, setErrorMessage2] = useState<string | undefined>("")
    const [gas, setGas] = useState<string | undefined>("")
    const [finalGas, setFinalGas] = useState<string | undefined>("")
    const [TOTAL, setTOTAL] = useState<bigint | undefined>(BigInt(0));
    const [initialised, setInitialised] = useState<boolean>(false)
    const [newTransactionBool, setNewTransactionBool] = useState(false)
    const [estReth, setEstReth] = useState<string | undefined>("")
    const [rETHBalance, setrETHBalance] = useState<string | undefined>("")
    const [ETHBalance, setETHBalance] = useState<string | undefined>("")
    const [stETHBalance, setstETHBalance]  = useState<string | undefined>("")


   

    const wallet = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum)
      })


    const client = createPublicClient({
        account,
    
        chain: mainnet,
        transport:  http('http://127.0.0.1:8545')
      })
        .extend(publicActions)
        .extend(walletActions)
      
    
    
















    function wei(number) {
        return number * Math.pow(10, -18);
    }

    //CHECK CONTRACT BALANCE
    

    const getContractBalance = async() => {

        const rETH = await client.readContract({
            address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
            abi: rETHabi,
            functionName: 'balanceOf',
            args: [account]
          })

        if (rETH >= estReth) {
            console.log("Enough rETH in contract");
            console.log("rETH CONTRACT balance:" + rETH)
            setApproved(false);

        } else{

            console.log("Not enough rETH in contract");
            console.log("rETH CONTRACT balance:" + rETH)

        }


    }

 


          
                
    
        
    

    //ESTIMATE GAS

    const estimateGas = async () => {

        let TOTAL: bigint | undefined = stETH + ETH;


     

            console.log("ETH at point before Gas Call:" + ETH);
            console.log("stETH at point before Gas Call:" + stETH);
            const result = await client.estimateContractGas({
                abi: abi,
                args: [stETH],
                address: '0xfAaBbE302750635E3F918385a1aEb4A9eb45977a',
                functionName: 'deposit',
                account,
                value: ETH
            })

            console.log(typeof result)
            let finGas = bigIntToString(result);
            console.log("Gas Estimate Call result:" + result);


            setGas(finGas);


        
    

        const rETHAmount = await client.readContract({
            address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
            abi: rETHabi,
            functionName: 'getRethValue',
            args: [TOTAL]
        })

        //const rETH = wei(parseInt(rETHAmount));

        let finrETH = bigIntToString(rETHAmount)
        let formatrETH = wei(finrETH);



        setEstReth(formatrETH.toString());



        console.log("rETH returned:" + finrETH);







    }


    useEffect(() => {
        getrETHBalance();
        balanceCheck();
        balanceCheckStETH();
    })




    //ALLOWANCE FUNCTION

    const allowanceCheck = async () => {
        const allowance: BigInt = await client.readContract({
            address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
            abi: stethAbi,
            functionName: 'allowance',
            args: [account, '0xfAaBbE302750635E3F918385a1aEb4A9eb45977a'],
            account,
        });

        
        console.log("Allowance:" + allowance)
        if (allowance < stETH) {
            setApproved(false);
           
         

        } else {
       
            

        }
    }

    //FRESH TRANSACTION

    const newTransaction = async () => {



        setETHChecked(false)
        setStETHChecked(false)
        setETH(BigInt(0))
        setStETH(BigInt(0))
        setNewTransactionBool(false);
        setFinalGas("");
        setEstReth("");
        setGas("");
    }




    //GET ADDRESSES FROM FOUNDRY





    //APPROVAL FUNCTION

    const approvalCheck = async () => {
        const approval = await wallet.writeContract({
            address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
            abi: stethAbi,
            functionName: 'approve',
            args: ['0xfAaBbE302750635E3F918385a1aEb4A9eb45977a', stETH],
            account,
        })
        console.log("Approval:" + approval)
        setApprovalHash(approval)


    }




    useEffect(() => {
        ; (async () => {
            if (approvalHash) {
                const receipt = await client.waitForTransactionReceipt({ hash: approvalHash })
                setApprovalReceipt(receipt)
                console.log("Approval receipt" + receipt.status)

                if (receipt.status === "success") {

                    setApproved(true);
                }

            }
        })()
    }, [approvalHash])


    //GET FAKE sTETH




  const handleFakestETH = async () => {
       

       await client.sendTransaction({ 
            account: foundryAccount,
            to: '0x8A60D3742EE1c5E955E9680DF3e9f986b300F791',
            value: parseEther('2')
          })

     await wallet.writeContract({
            address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
            abi: stethAbi,
            functionName: 'submit',
            args: [account],
            account,
            value: parseEther("1"),
        })



    } 

    const sendTransaction = async () => {

       // await handleFakestETH();
        await approvalCheck();

    }


      //BALANCE CHECKER stETH

  const balanceCheckStETH = async () => {



    const balance = await client.readContract({
      address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      abi: stethAbi,
      functionName: 'balanceOf',
      args: [account]
    })

    if(stETH <= balance) {
      
  
      } else {
        setErrorMessage("You have insufficient stETH.")
        
      }

    console.log("Balance:" + balance)
    setstETHBalance(formatEther(balance));

  } 




    //BALANCE CHECKER ETH

    const balanceCheck = async () => {
  
  
  
     
const balance = await client.getBalance({
  address: account,
  
})

console.log("ETH account balance:" + balance);



  
      if(ETH <= balance) {
        console.log("Balance is sufficient");
        
       
      } else {
        setErrorMessage2("You have insufficient ETH.")
        
      }
  
      console.log("Balance:" + balance)

      setETHBalance(formatEther(balance));
  
    } 

    //rETH functions

    const getrETHBalance = async () => {



        console.log("sTETH + rETH total:" + TOTAL)


        const rETHAmount = await client.readContract({
            address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
            abi: rETHabi,
            functionName: 'balanceOf',
            args: [account]
          })




            setrETHBalance(formatEther(rETHAmount));
           

            /*
        const ETHAmount = await client.readContract({
           address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
           abi: rETHabi,
           functionName: 'getEthValue',
           args: [rETHAmount]
         })
     
         const ETH = wei(parseInt(ETHAmount));
     
         console.log("Equivalent in eTH:" + ETH); */



    } 


    //DEPOSIT functions


    const Deposit = async () => {
        const result = await wallet.writeContract(
            {
                account,
                address: '0xfAaBbE302750635E3F918385a1aEb4A9eb45977a',
                abi: abi,
                functionName: 'deposit',
                args: [stETH],
                value: ETH

            }
        )
        setHash(result)
        console.log("Result:" + result);

        //rETHBalance();
    }

    useEffect(() => {
        ; (async () => {
            if (hash) {
                const receipt = await client.waitForTransactionReceipt({ hash })
                setReceipt(receipt)
                console.log("Deposit receipt" + receipt.status)


                if (receipt.status === "success") {
                   
                    setStETHstring("");
                    setETHstring("");
                    setETHChecked(false);
                    setStETHChecked(false);
                    setStETH(BigInt(0))
                    setETH(BigInt(0))
                    let finGas = bigIntToString(receipt.cumulativeGasUsed)
                    setFinalGas(finGas);
                    setApproved(false);
                    setNewTransactionBool(true);
                    getrETHBalance();
                    balanceCheck();
                    balanceCheckStETH();

                }
            }
        })()
    }, [hash])


    //GET ADDRESSES FROM FOUNDRY


    const connect = async () => {


        try {
            const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' })
            setAccount(address)
          } catch (e) {
            console.log("error in request", e);
            // location.reload();
          }
     

    }


    const getFoundry = async () => {
        const [address] = await client.requestAddresses()
        setFoundryAccount(address)
    
      }




    //HANDLE ETH Input and processing functions


    useEffect(() => {
        console.log("GRAND TOTAL:" + TOTAL);
        console.log("type of TOTAL:" + typeof TOTAL);

    }, [TOTAL])

    useEffect(() => {




        
        console.log("CURRENT ETH:" + ETH)



        if (ETHChecked) {
            balanceCheck();
            getContractBalance();
        }
        if (account !== undefined && initialised) {
           
        }
    }, [ETH])


    const handleEth = async (newETH) => {
        setETHstring(newETH);
        console.log("This is new ETh" + newETH)


        if (evalString(newETH) === false && newETH !== "0" && newETH !== "0." && newETH !== "0.0") {

            const EthCheck = parseEther(newETH);
            console.log(EthCheck);

            if (typeof EthCheck === 'bigint') {



                
                let finETH = bigIntToString(EthCheck)

                let finStETH = bigIntToString(stETH)
                
                let formatETH = wei(parseInt(finETH));
                let formatStETH = wei(parseInt(finStETH));

                let newTotal = formatETH + formatStETH
                console.log("To see if ETH is above 1: " + newTotal);


                if (newTotal < 1) {

                    setETHChecked(true)
                    setETH(parseEther(newETH));


                    setErrorMessage2("");


                } else {
                    setErrorMessage2("Your deposit must be below the value of 1 ETH.")
                    setETHChecked(false);
                    setETH(BigInt(0))
                }




            } else {
                console.log("You have not input a valid number.");
                setErrorMessage2("You have not input a valid number.")
                setETHChecked(false);
                setETH(BigInt(0))
                

            }




        } else {
            console.log("Not valid");
            setErrorMessage2("You have not input a number.");
            setETHChecked(false);
            setETH(BigInt(0))
           

        }







    }






    //HANDLE stETH functions


    useEffect(() => {



        console.log("CURRENT stETH:" + stETH)


        console.log(stETHChecked)

        if (stETHChecked) {

            balanceCheckStETH();
            getContractBalance();
           allowanceCheck();
           

        }

       




    }, [stETH])


    const evalString = (inputString) => {
        for (let i = 0; i < inputString.length; i++) {
            const charCode = inputString.charCodeAt(i);
            if (
                (charCode >= 65 && charCode <= 90) || // Uppercase letters (A-Z)
                (charCode >= 97 && charCode <= 122) || // Lowercase letters (a-z)
                ((charCode >= 33 && charCode <= 47) && // Common symbols (! to /)
                    charCode !== 46 && charCode !== 48 && charCode !== 49) || // Exclude '.' (46), '0' (48), and '1' (49)
                (charCode >= 58 && charCode <= 64) ||  // More symbols (: to @)
                (charCode >= 91 && charCode <= 96) ||  // Even more symbols ([ to `)
                (charCode >= 123 && charCode <= 126)   // Some more symbols ({ to ~)
            ) {
                return true; // Found a letter or symbol.
            }
        }
        return false;
    }










    const handleStETH = async (newStETH: string) => {
        setStETHstring(newStETH);
        console.log("This is new stETH" + newStETH)
        if (evalString(newStETH) === false && newStETH !== "0" && newStETH !== "0." && newStETH !== "0.0") {
            const stEthCheck = parseEther(newStETH)
            console.log(stEthCheck)
            if (typeof stEthCheck === 'bigint') {


                let finStETH = bigIntToString(stEthCheck)

                let finETH = bigIntToString(ETH)
                
                let formatETH = wei(parseInt(finETH));
                let formatStETH = wei(parseInt(finStETH));

                let newTotal = formatETH + formatStETH
                console.log("To see if ETH is above 1: " + newTotal);



                if (newTotal < 1) {

                    setStETHChecked(true)
                    setStETH(parseEther(newStETH));


                    setErrorMessage("");


                } else {
                    setErrorMessage("Your deposit must be below the value of 1 ETH.")
                    setETHChecked(false);
                }

            } else {
                console.log("You have not input a number.");
                setErrorMessage("You have not input a number.")
                setStETHChecked(false)

                setStETH(BigInt(0))

            }
        } else {
            console.log("Not valid");
            setErrorMessage("You have not input a number.");
            setFinalGas("");

            setStETHChecked(false);

        }
    }


    function bigIntToString(bigIntValue) {
        if (typeof bigIntValue === 'bigint') {
            return bigIntValue.toString();
        } else {
            throw new Error('Input is not a BigInt.');
        }
    }




    return (


        <div className={classes.container}>
            <div className={classes.wrapper}>

                <div className={classes.box}>

                    <h3>Connect Your Wallet</h3>


                    <button onClick={connect}>Connect Wallet</button>
                   


                    {(account) &&
                        (
                            <>
                                <h5>Connected: {account}</h5>

                            </>
                        )

                    }

<>
                                <button onClick={handleFakestETH}>Fund Test Account</button>
                                <button onClick={getFoundry}>CONNECT FOUNDRY</button>

                            </>



                </div>
                <div className={classes.box}>

                    <h3>Select your stETH and/or ETH values</h3>


                    {(!newTransactionBool) &&
                        (
                            <>

                                Value of ETH:
                                <input value={ETHstring} onChange={(e) => handleEth(e.target.value)
                                } />


                                Value of stETH:
                                <input value={stETHstring} onChange={(e) => handleStETH(e.target.value)
                                } />

                            </>
                        )

                    }

                    {(!approved && !newTransactionBool) &&
                        (
                            <>

                                <button onClick={sendTransaction}>Approve</button>
                            </>
                        )

                    }

                    {(approved && !newTransactionBool) &&
                        (
                            <>
                                <button onClick={Deposit}>Deposit</button>
                            </>
                        )

                    }

                    {(newTransactionBool) &&
                        (
                            <>
                                <>
                                    <button onClick={newTransaction}>New Transaction</button>
                                </>
                            </>
                        )

                    }


<div className={classes.error2}><p>{errorMessage}</p>  <p>{errorMessage2}</p></div>
            

          






                </div>
                <div className={classes.box}>

                    <h3>View your estimated fees & final receipt</h3>

                    {(gas !== "" && finalGas === "") && (
                        <>
                            <h5>Estimated Gas: {gas}</h5>
                        </>
                    )

                    }

                    {(finalGas !== "") && (<>
                        <h5>Final Gas: {finalGas}</h5>
                    </>)}

                    {(estReth !== "") && (
                        <>
                            <h5> rETH estimate for transaction: {estReth}</h5>
                        </>

                    )}

                        <>
                            <h5>rETH Balance: {rETHBalance}</h5>
                        </>

                  
                        <>
                            <h5>ETH Balance: {ETHBalance}</h5>
                        </>

                
                   
                        <>
                            <h5>stETH: {stETHBalance}</h5>
                        </>

            





                </div>













                <br />






            </div>



            <div className={classes.error}><p>{errorMessage}</p>  <p>{errorMessage2}</p></div>

         


        </div>




    );
}

export default Main;
