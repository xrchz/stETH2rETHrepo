import React, { useState, useEffect } from 'react'
import { ethers } from "ethers"
import classes from './uniTest.module.css';
import { Address, createPublicClient, http, publicActions, createWalletClient, walletActions, decodeFunctionResult, decodeFunctionData, custom, parseEther, formatEther } from 'viem';
import { mainnet, goerli } from 'viem/chains';
import { TradeType, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import { CurrentConfig } from './libs/config.ts'
import { fromReadableAmount } from './libs/conversion.ts'
import { providers } from 'ethers';
import UniAbi from "./libs/UniAbi.json"
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
} from './libs/providers.ts'
import {
    MAX_FEE_PER_GAS,
    MAX_PRIORITY_FEE_PER_GAS,
    ERC20_ABI,
    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
    V3_SWAP_ROUTER_ADDRESS,
} from './libs/constants.ts'
import "viem/window";

const UniTest = () => {


    const stETH2rETH = '0xfAaBbE302750635E3F918385a1aEb4A9eb45977a';
    const rETHcontract = '0xae78736Cd615f374D3085123A210448E74Fc6393';
    const stETHcontract = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';

    const [wallet, setWallet] = useState(undefined)
    const [account, setAccount] = useState("")
    const [connected, setConnected] = useState(false);
    const [routeCreated, setRouteCreated] = useState(false);
    const [currentRoute, setCurrentRoute] = useState<SwapRoute | undefined>(undefined)


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

            setConnected(true);



        } catch (e) {
            console.log("Error in request", e);
            alert("You must install an Ethereum Wallet to use the app")

            // location.reload();
        }
    }


    const handleRoute = async () => {

        try {

            await generateRoute();

            setRouteCreated(true)

        } catch (e) {
            console.log("Error in route creation", e)

        }


    }


    const handleExecuteRoute = async () => {
        await executeRoute(currentRoute);
    }


    useEffect(() => {

        console.log(currentRoute)

    }, [currentRoute])


    useEffect(() => {

        console.log(account)

    }, [account])




    async function generateRoute(): Promise<SwapRoute | null> {
        const router = new AlphaRouter({
            chainId: 1,
            provider: getMainnetProvider(),
        })

        const options: SwapOptionsSwapRouter02 = {
            recipient: '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb',
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


        setCurrentRoute(route);

        return route
    }






    async function getTokenTransferApproval(
        token: Token
    ): Promise<TransactionState> {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const address = '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb';
        const signer = provider.getSigner();
        if (!provider || !address) {
            console.log('No Provider Found')
            return TransactionState.Failed
        }

        try {
            const tokenContract = new ethers.Contract(
                token.address,
                ERC20_ABI,
                signer
            )

            const transaction = await tokenContract.approve(
                V3_SWAP_ROUTER_ADDRESS,
                fromReadableAmount(
                    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
                    token.decimals
                ).toString()
            )

            return sendTransaction({
                ...transaction,
                from: account,

            })
        } catch (e) {
            console.error(e)
            return TransactionState.Failed
        }
    }












    async function executeRoute(
        route: SwapRoute
    ) {
      

        

       


       

       /* const res = await sendTransaction({
            data: route.methodParameters?.calldata,
            to: V3_SWAP_ROUTER_ADDRESS,
            value: route?.methodParameters?.value,
            from: '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb',
            maxFeePerGas: MAX_FEE_PER_GAS,
            maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
        })*/

        const { functionName, args } = decodeFunctionData({
            abi: UniAbi,
            data: route.methodParameters?.calldata
          })



       /* const receipt  = await client.call({
            data: route.methodParameters?.calldata,
            to: V3_SWAP_ROUTER_ADDRESS,
            account:  '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb',

        }) */

        const { result } = await client.simulateContract({
            address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            abi: UniAbi,
            functionName,
            args,
            account: '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb',
          })


       /* const value = decodeFunctionResult({
            abi: wagmiAbi,
            functionName: 'ownerOf',
            data: '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac'
          })*/

        console.log(functionName);
        console.log(args);
        console.log(result)

        return result;


    }













    return (
        <div className={classes.container}>

            <div className={classes.wrapper}>
                <h2>UniTest</h2>



            


                {!routeCreated &&


                    <button onClick={handleRoute}>Create Route</button>
                }

                {routeCreated &&

                    <button onClick={handleExecuteRoute} >Execute Route</button>

                }


            </div>

        </div>
    )
}

export default UniTest