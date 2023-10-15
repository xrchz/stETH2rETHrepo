import React, { useState } from 'react'
import classes from './uniTest.module.css';
import { Address, createPublicClient, http, publicActions, createWalletClient, walletActions, custom, parseEther, formatEther } from 'viem';
import { mainnet, goerli } from 'viem/chains';
import { TradeType, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import { CurrentConfig } from './libs/config'
import { fromReadableAmount } from './libs/conversion'
import {
    AlphaRouter,
    ChainId,
    SwapOptionsSwapRouter02,
    SwapRoute,
    SwapType,
} from '@uniswap/smart-order-router'
import {
    getMainnetProvider,
    getWalletAddress,
    sendTransaction,
    TransactionState,
    getProvider,
} from './libs/providers'
import {
    MAX_FEE_PER_GAS,
    MAX_PRIORITY_FEE_PER_GAS,
    ERC20_ABI,
    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
    V3_SWAP_ROUTER_ADDRESS,
  } from './libs/constants'

const UniTest = () => {


    const stETH2rETH = '0xfAaBbE302750635E3F918385a1aEb4A9eb45977a';
    const rETHcontract = '0xae78736Cd615f374D3085123A210448E74Fc6393';
    const stETHcontract = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';

    const [wallet, setWallet] = useState(undefined)
    const [account, setAccount] = useState("")

    const client = createPublicClient({

        chain: mainnet,
        transport: http('https://eth-mainnet.g.alchemy.com/v2/HqWYoX-F7NdfHKak6bC23gpRfU6YOklW')
    })
        .extend(publicActions)
        .extend(walletActions)



    const connect = async () => {
        try {
            const newWallet = await createWalletClient({
                chain: mainnet,
                transport: custom(window.ethereum)
            })

            setWallet(newWallet);

            const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' })

            setAccount(address)

        } catch (e) {
            console.log("error in request", e);
            alert("You must install an Ethereum Wallet to use the app")

            // location.reload();
        }
    }


    async function getTokenTransferApproval(
        token: Token
    ): Promise<TransactionState> {
        const provider = getProvider()
        const address = account;
        if (!provider || !address) {
            console.log('No Provider Found')
            return TransactionState.Failed
        }

        try {
            const tokenContract = new ethers.Contract(
                token.address,
                ERC20_ABI,
                provider
            )

            const transaction = await tokenContract.populateTransaction.approve(
                V3_SWAP_ROUTER_ADDRESS,
                fromReadableAmount(
                    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
                    token.decimals
                ).toString()
            )

            return sendTransaction({
                ...transaction,
                from: address,
            })
        } catch (e) {
            console.error(e)
            return TransactionState.Failed
        }
    }





    const handleSend = async () => {

        const router = new AlphaRouter({
            chainId: ChainId.MAINNET,
            provider: getMainnetProvider(),
        })


        const options: SwapOptionsSwapRouter02 = {
            recipient: account,
            slippageTolerance: new Percent(50, 10_000),
            deadline: Math.floor(Date.now() / 1000 + 1800),
            type: SwapType.SWAP_ROUTER_02,
        }



        const route = await router.route(
            CurrencyAmount.fromRawAmount(
                CurrentConfig.tokens.in,
                fromReadableAmount(
                    CurrentConfig.tokens.amountIn,
                    CurrentConfig.tokens.in.decimals
                ).toString()
            ),
            CurrentConfig.tokens.out,
            TradeType.EXACT_INPUT,
            options
        )



        const tokenApproval = await getTokenTransferApproval(CurrentConfig.tokens.in)




        const res = await sendTransaction({
            data: route.methodParameters?.calldata,
            to: V3_SWAP_ROUTER_ADDRESS,
            value: route?.methodParameters?.value,
            from: address,
            maxFeePerGas: MAX_FEE_PER_GAS,
            maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
        })


    }














    return (
        <div className={classes.container}>
            <h2>UniTest</h2>



            <button onClick={connect}>Connect Account</button>


        </div>
    )
}

export default UniTest