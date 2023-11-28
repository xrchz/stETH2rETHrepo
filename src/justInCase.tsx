
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { AiOutlineClose } from 'react-icons/ai'

import classes from './main.module.css';
import { Address, createPublicClient, hexToNumber, http, publicActions, createWalletClient, decodeEventLog, walletActions, custom, decodeFunctionData, decodeFunctionResult, parseEther, formatEther } from 'viem';
import { mainnet } from 'viem/chains';
import "viem/window";
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import stETH2rETHabi from "../../abi/stETH2rETH.json"
import rETHabi from "../../abi/rETH.json"
import stethAbi from "../../abi/stETH.json"
import wstETHAbi from "../../abi/wstETH.json"
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { TradeType, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { CurrentConfig } from '../uniTest/libs/config.ts'
import { fromReadableAmount } from '../uniTest/libs/conversion.ts'
import { ethers } from "ethers";
import UniAbi from "../uniTest/libs/UniAbi.json"
import {
    AlphaRouter,
    SwapOptionsSwapRouter02,
    SwapRoute,
    SwapType,
} from '@uniswap/smart-order-router'
import {
    getMainnetProvider,

} from '../uniTest/libs/providers.ts'
import {
    WSTETH_TOKEN,
    WETH_TOKEN,
    STETH_TOKEN,
    RETH_TOKEN,
    USDC_TOKEN,
    MAX_FEE_PER_GAS
} from '../uniTest/libs/constants.ts'
import { computePoolAddress } from '@uniswap/v3-sdk'



const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};




function Main() {


    const [account, setAccount] = useState<Address>();
    const [foundryAccount, setFoundryAccount] = useState<Address>()
    const [approved, setApproved] = useState<boolean>(false);
    const [hash, setHash] = useState<string | undefined>()
    const [receipt, setReceipt] = useState<string | undefined>();
    const [stETHChecked, setStETHChecked] = useState<boolean>(false);
    const [stETH, setStETH] = useState<bigint>(BigInt(0));
    const [stETHstring, setStETHstring] = useState("");
    const [ETH, setETH] = useState<bigint>(BigInt(0));
    const [ETHChecked, setETHChecked] = useState<boolean>(false)
    const [ETHstring, setETHstring] = useState("");
    const [approvalHash, setApprovalHash] = useState<string | undefined>()
    const [approvalReceipt, setApprovalReceipt] = useState<string | undefined>();
    const [errorMessage, setErrorMessage] = useState<string | undefined>("")
    const [errorMessage2, setErrorMessage2] = useState<string | undefined>("")
    const [gas, setGas] = useState<BigInt | undefined>(BigInt(0))
    const [finalGas, setFinalGas] = useState<BigInt | undefined>(BigInt(0))

    const [initialised, setInitialised] = useState<boolean>(false)
    const [newTransactionBool, setNewTransactionBool] = useState(false)
    const [estReth, setEstReth] = useState<string | undefined>("")
    const [rETHBalance, setrETHBalance] = useState<string | undefined>("")
    const [ETHBalance, setETHBalance] = useState<string | undefined>("")
    const [stETHBalance, setstETHBalance] = useState<string | undefined>("")
    const [finrETH, setFinrETH] = useState<boolean>(false);
    const [isReadyToApprove, setIsReadyToApprove] = useState(false);
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState("#ffffff");
    const stETH2rETH = '0xfAaBbE302750635E3F918385a1aEb4A9eb45977a';
    const rETHcontract = '0xae78736Cd615f374D3085123A210448E74Fc6393';
    const stETHcontract = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';
    const [wallet, setWallet] = useState(undefined);
    const [currentWETHRoute, setCurrentWETHRoute] = useState<SwapRoute | undefined>(undefined)
    const [currentWSTETHRoute, setCurrentWSTETHRoute] = useState<SwapRoute | undefined>(undefined)
    const [currentUSDCRoute, setCurrentUSDCRoute] = useState<SwapRoute | undefined>(undefined)
    const [USD, setUSD] = useState<number>(0)
    const [altrETH, setAltrETH] = useState(0)
    const [dexGas, setDexGas] = useState<BigInt>(BigInt(0));
    const [dexWGas, setDexWGas] = useState<BigInt>(BigInt(0));
    const [dexStGas, setDexStGas] = useState<BigInt>(BigInt(0));
    const [showModal2, setShowModal2] = useState(false);
    const [depositSuccess, setDepositSuccess] = useState(false);
    const [routeGenerated, setRouteGenerated] = useState(false);
    const [timeForEstimates, setTimeForEstimates] = useState(false);
    const [gasPrice, setGasPrice] = useState<BigInt | undefined>(BigInt(0))
    const [ETHprice, setETHprice] = useState("");
    const [rETHSavingsToETH, setrETHSavingsToETH] = useState<BigInt>()
    const [USDCquote, setUSDCquote] = useState<number>()
    const [baseFee, setBaseFee] = useState<BigInt>(BigInt(0))
    

    const [balanceBoolETH, setBalanceBoolETH] = useState<boolean>(true)
    const [balanceBoolstETH, setBalanceBoolstETH] = useState<boolean>(true)




    const apiUrl = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,JPY,EUR&api_key=e81c2faadb254039651a17c32ce94db1e8e141f8ba3e82db6d81953ec6094cf8';
    const geckoApiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";


    const handleETHprice = () => {

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log("HANDLE ETH PRICE:" + data.USD);
                // Handle the data here

                setETHprice(data.USD)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });


    }

    useEffect(() => {


        const timeoutId = setTimeout(handleETHprice, 6000);

        return () => clearTimeout(timeoutId);




    }, [ETHprice])


    function roundToTwoDecimalPlaces(number) {
    // Using the toFixed method to round to 2 decimal places
    return parseFloat(number.toFixed(2));
}



    const getQuoute = async () => {






        const currentPoolAddress = computePoolAddress({
            factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
            tokenA: CurrentConfig.tokens.in,
            tokenB: CurrentConfig.tokens.out,
            fee: CurrentConfig.tokens.poolFee,
        })


        const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/713d3fd4fea04f0582ee78560e6c47e4")
        const poolContract = new ethers.Contract(
            currentPoolAddress,
            IUniswapV3PoolABI.abi,
            provider
        )



        const quoterContract = new ethers.Contract(
            '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
            Quoter.abi,
            getMainnetProvider()
        )


        const [token0, token1, fee, liquidity, slot0] = await Promise.all([
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.liquidity(),
            poolContract.slot0(),
        ])


        console.log("Token o:" + token0)

        const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
            token0, token1, fee,
            fromReadableAmount(
                CurrentConfig.tokens.amountIn,
                CurrentConfig.tokens.in.decimals
            ).toString(),

            0
        )

        let formatted = Number(formatEther(quotedAmountOut));
        let newQuote = 1 / formatted;

        console.log("quotedAmountOut" + newQuote);

        setUSDCquote(newQuote);


    }


    useEffect(() => {





        if (!depositSuccess) {

            const timeoutId = setTimeout(getQuoute, 6000);

            return () => clearTimeout(timeoutId);


        }

    }, [USDCquote])

















    // https://mainnet.infura.io/v3/713d3fd4fea04f0582ee78560e6c47e4



    const client = createPublicClient({

        chain: mainnet,

        transport: http('https://mainnet.infura.io/v3/713d3fd4fea04f0582ee78560e6c47e4')
    })
        .extend(publicActions)
        .extend(walletActions)

    const retrieveCurrentGasPrice = async () => {

        const newPrice = await client.getGasPrice()

        console.log("Format of the gasPrice" + newPrice);


        setGasPrice(newPrice)


    }


    const fetchData = () => {
        retrieveCurrentGasPrice();
    };


    useEffect(() => {



        if (!depositSuccess) {

            const timeoutId = setTimeout(fetchData, 6000);

            return () => clearTimeout(timeoutId);


        }




    }, [gasPrice]);





const getBaseFee = async() => {

    let block = await client.getBlock();


    console.log("This is the block:" + Object.keys(block))


    setBaseFee(block.baseFeePerGas);



}


useEffect(() => {


    if (!depositSuccess) {

        const timeoutId = setTimeout(getBaseFee, 6000);

        return () => clearTimeout(timeoutId);


    }



}, [baseFee])




    


    function wei(number) {
        return number * Math.pow(10, -18);
    }

    //CHECK CONTRACT BALANCE


    const getContractBalance = async () => {


        let rETH = BigInt(0);


        rETH = await client.readContract({
            address: rETHcontract,
            abi: rETHabi,
            functionName: 'balanceOf',
            args: [stETH2rETH]
        })


        const spesh = wei(Number(rETH))


        console.log("THIS IS THE rETH you're looking for:" + spesh)
        console.log("THIS IS THE estrETH you're looking for:" + estReth)


        if (estReth !== undefined && spesh >= Number(estReth)) {


            setErrorMessage("")





        } else {

            setErrorMessage("Not enough rETH in the Rocket Rebate contract.")
            setApproved(false);
            setIsReadyToApprove(false);
            setTimeForEstimates(false);

        }




    }


    function floatToBigInt(floatValue, precision = 18) {
        const multiplier = 10 ** precision;
        const intValue = Math.round(floatValue * multiplier);
        return BigInt(intValue);
    }


    const handleRETHtoETH = async () => {


        let value = Number(estReth) - altrETH;

        if (value < 0) {

            value = value * -1;
        }


        const intValue = floatToBigInt(value)

        console.log("typeof value for rETH" + typeof value)
        console.log("Lets see the intValue:" + intValue)





        let ETHAmount = await client.readContract({
            address: rETHcontract,
            abi: rETHabi,
            functionName: 'getEthValue',
            args: [intValue]
        })


        console.log("ETH amount FROM rETH savings:" + ETHAmount);

        console.log(typeof ETHAmount);








        setrETHSavingsToETH(ETHAmount);


    }


    useEffect(() => {

        handleRETHtoETH()

    }, [altrETH])


    useEffect(() => {

        console.log("rETHSavingsToETH: " + rETHSavingsToETH)

    }, [rETHSavingsToETH])




    useEffect(() => {

        generateUSDCRoute();

    }, [])







    //ESTIMATE GAS

    const estimateGas = async () => {




        let TOTAL = stETH + ETH;



        try {


            const result = await client.estimateContractGas({
                abi: stETH2rETHabi,
                args: [stETH],
                address: stETH2rETH,
                functionName: 'deposit',
                account: account,
                value: ETH
            })


            let finGas = result;



            setGas(finGas);





            const rETHAmount = await client.readContract({
                address: rETHcontract,
                abi: rETHabi,
                functionName: 'getRethValue',
                args: [TOTAL]
            })

            //const rETH = wei(parseInt(rETHAmount));

            retrieveCurrentGasPrice();

            let finrETH = bigIntToString(rETHAmount)

            console.log("rETH for equation:" + rETHAmount)

            console.log(finrETH);


            let formatrETH = wei(finrETH);


            console.log("fORMAT rETH:" + formatrETH);


            let rETHwithFee = wei(Number(rETHAmount));


           let defray = (1000000 * wei(Number(baseFee)) * (wei(Number(ETH)) + wei(Number(stETH))))/wei(32);


           console.log("This is Andy defray:" +  defray)


           let actualReth = wei(Number(rETHAmount) - defray);

          



            setEstReth(actualReth.toString());

        } catch (e) {

            console.log(e)


        }











    }


    useEffect(() => {
        if (account && client) {
            getrETHBalance();
            balanceCheck();
            console.log("And it all starts here!")
            balanceCheckStETH();
        }
    }, [account])




    //ALLOWANCE FUNCTION

    const allowanceCheck = async () => {


        let allowance;


        allowance = await client.readContract({
            address: stETHcontract,
            abi: stethAbi,
            functionName: 'allowance',
            args: [account, stETH2rETH],
            account,
        });



        if (allowance < stETH) {

            if (stETH !== BigInt(0) && stETHstring !== "" && stETHstring !== " " && stETHChecked) {
                setApproved(false);
                setIsReadyToApprove(true);
                setTimeForEstimates(false);




            }





        } else {
            if (stETH !== BigInt(0) && stETHstring !== "" && stETHChecked) {

                setTimeForEstimates(true)
                estimateGas();
                setApproved(true)

                console.log("the culprit is allowance check if...");








            } else {



                if (ETH === BigInt(0) || ETHstring === "" || !ETHChecked) {
                    setApproved(false);
                    setTimeForEstimates(false)
                } else {

                    estimateGas();
                    console.log("the culprit is allowance Check else");

                }
            }






        }
    }

    // GET DEX GAS





    //FRESH TRANSACTION

    const newTransaction = async () => {



        setETHChecked(false)
        setStETHChecked(false)
        setETH(BigInt(0))
        setStETH(BigInt(0))
        setStETHstring("");
        setETHstring("");
        setNewTransactionBool(false);
        setCurrentWETHRoute(undefined)
        setCurrentWSTETHRoute(undefined)
        setFinalGas(BigInt(0));
        setEstReth("");
        setFinrETH(false);
        setGas(BigInt(0));
        setIsReadyToApprove(false);
        setApproved(false)
        setErrorMessage2("")
        setErrorMessage("")
        setAltrETH(0)
        setDexGas(BigInt(0))
        setDexStGas(BigInt(0))
        setDexWGas(BigInt(0))
        setDepositSuccess(false);
        setRouteGenerated(false);
        setTimeForEstimates(false);
        fetchData();
        getQuoute();
        getBaseFee();

    }



    // ESTABLISH USDC UNISWAP ROUTE



    async function generateUSDCRoute(): Promise<SwapRoute | null> {


        let route;


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


        console.log(ETH);
        console.log(typeof ETH)






        route = await router.route(
            CurrencyAmount.fromRawAmount(
                USDC_TOKEN,

                100000000000000000,

            ),
            CurrentConfig.tokens.out,
            TradeType.EXACT_INPUT,
            options
        )


        setCurrentUSDCRoute(route);

        return route
    }




    // ESTABLISH wETH UNISWAP ROUTE



    async function generateWETHRoute(): Promise<SwapRoute | null> {


        let route;


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


        console.log(ETH);
        console.log(typeof ETH)






        route = await router.route(
            CurrencyAmount.fromRawAmount(
                WETH_TOKEN,

                Number(ETH),

            ),
            RETH_TOKEN,
            TradeType.EXACT_INPUT,
            options
        )


        setCurrentWETHRoute(route);

        return route
    }



    useEffect(() => {

        if (routeGenerated === true) {
            handleComprETH();

        }


    }, [routeGenerated])


    // ESTABLISH wstETH UNISWAP ROUTE



    async function generateWSTETHRoute(): Promise<SwapRoute | null> {

        let route;


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



        const wstETHAmount = await client.readContract({
            address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
            abi: wstETHAbi,
            functionName: 'getWstETHByStETH',
            args: [stETH]
        })

        console.log(typeof wstETHAmount);
        console.log(wstETHAmount);

        route = await router.route(
            CurrencyAmount.fromRawAmount(
                STETH_TOKEN,
                Number(stETH),
            ),
            RETH_TOKEN,
            TradeType.EXACT_INPUT,
            options
        )


        setCurrentWSTETHRoute(route);

        return route
    }


    const generateRoute = async () => {

        if (stETH !== BigInt(0) && ETH !== BigInt(0)) {
            await generateWETHRoute();
            await generateWSTETHRoute();
            setRouteGenerated(true);

        }

        else if (stETH !== BigInt(0) && ETH === BigInt(0)) {

            await generateWSTETHRoute();
            setRouteGenerated(true);

        }

        else if (stETH === BigInt(0) && ETH !== BigInt(0)) {
            await generateWETHRoute();
            setRouteGenerated(true);


        }

        else {
            console.log("No values to generate routes")
        }




    }














    // GET wstETH UNISWAP rETH

    async function executeWSTETHRoute(
        route: SwapRoute
    ) {


        const { functionName, args } = decodeFunctionData({
            abi: UniAbi,
            data: route?.methodParameters?.calldata
        })


        const gas = await client.estimateContractGas({
            address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            abi: UniAbi,
            functionName,
            args,
            account: '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb',
        })

        /* const value = decodeFunctionResult({
             abi: UniAbi,
             functionName,
             data: result
           })*/




        setDexStGas(gas);

        const { result } = await client.simulateContract({
            address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            abi: UniAbi,
            functionName,
            args,
            account: '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb',
        })






        return result;


    }



    // generate US Dollar data

    async function executeUSDCRoute(
        route: SwapRoute
    ) {


        const { functionName, args } = decodeFunctionData({
            abi: UniAbi,
            data: route?.methodParameters?.calldata
        })


        const gas = await client.estimateContractGas({
            address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            abi: UniAbi,
            functionName,
            args,
            account: '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb',
        })

        /* const value = decodeFunctionResult({
             abi: UniAbi,
             functionName,
             data: result
           })*/




        setDexStGas(gas);

        const { result } = await client.simulateContract({
            address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            abi: UniAbi,
            functionName,
            args,
            account: '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb',
        })






        return result;


    }



    useEffect(() => {



        const getUSD = async () => {


            if (currentUSDCRoute !== undefined) {

                try {

                    let newUSD
                    newUSD = await executeUSDCRoute(currentUSDCRoute);



                    setUSD(wei(hexToNumber(newUSD)));
                    console.log(USD)

                } catch (e) {
                    console.log(e)
                }

            }

        }

        const timeoutId = setTimeout(getUSD, 3000);

        return () => clearTimeout(timeoutId);






    }, [USD])








    // GET wETH UNISWAP rETH

    async function executeWETHRoute(
        route: SwapRoute
    ) {


        const { functionName, args } = decodeFunctionData({
            abi: UniAbi,
            data: route?.methodParameters?.calldata
        })



        const { result } = await client.simulateContract({
            address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            abi: UniAbi,
            functionName,
            args,
            account: '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb',
        })


        const gas = await client.estimateContractGas({
            address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            abi: UniAbi,
            functionName,
            args,
            account: '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb',
        })


        setDexWGas(gas);







        /* const value = decodeFunctionResult({
             abi: wagmiAbi,
             functionName: 'ownerOf',
             data: '0x000000000000000000000000a5cc3c03994db5b0d9a5eedd10cabab0813678ac'
           })*/



        return result;


    }


    const handleDexGas = () => {



        setDexGas(dexStGas + dexWGas)

    }


    useEffect(() => {

        handleDexGas();

    }, [dexStGas, dexWGas])







    const handleComprETH = async () => {




        if (currentWETHRoute !== undefined && currentWSTETHRoute !== undefined) {

            let wETH2rETH;
            let wstETH2rETH;
            wETH2rETH = await executeWETHRoute(currentWETHRoute);
            wstETH2rETH = await executeWSTETHRoute(currentWSTETHRoute);


            let TOTAL = hexToNumber(wstETH2rETH) + hexToNumber(wETH2rETH);


            setAltrETH(wei(TOTAL));




        } else if (currentWETHRoute === undefined && currentWSTETHRoute !== undefined) {

            let wstETH2rETH;
            wstETH2rETH = await executeWSTETHRoute(currentWSTETHRoute);



            setAltrETH(wei(hexToNumber(wstETH2rETH)));


        } else if (currentWETHRoute !== undefined && currentWSTETHRoute === undefined) {

            let wETH2rETH;
            wETH2rETH = await executeWETHRoute(currentWETHRoute);


            setAltrETH(wei(hexToNumber(wETH2rETH)));


        } else {
            console.log("No routes to execute!")
        }







    }








    // GET UNISWAP GAS (estimateContractGas)











    //APPROVAL FUNCTION

    const approvalCheck = async () => {

        setLoading(true)


        try {


            const approval = await wallet.writeContract({
                address: stETHcontract,
                abi: stethAbi,
                functionName: 'approve',
                args: [stETH2rETH, stETH],
                account,
            })


            setApprovalHash(approval)








        } catch (e) {
            setLoading(false);
            alert(e)
        }



    }




    useEffect(() => {
        ; (async () => {
            if (approvalHash) {
                const receipt = await client.waitForTransactionReceipt({ hash: approvalHash })
                setApprovalReceipt(receipt)


                if (receipt.status === "success") {

                    setApproved(true);
                    setLoading(false);
                    setIsReadyToApprove(false);
                    balanceCheck();



                }

            } else {
                setLoading(false);

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


        const stETHAmount = await client.readContract({
            address: stETHcontract,
            abi: stethAbi,
            functionName: 'balanceOf',
            args: [account]
        })



        const stETHResult = await wallet.writeContract({
            address: stETHcontract,
            abi: stethAbi,
            functionName: 'submit',
            args: ['0x8A60D3742EE1c5E955E9680DF3e9f986b300F791'],
            account: '0x8A60D3742EE1c5E955E9680DF3e9f986b300F791',
            value: parseEther("0.1"),
        })





    }

    const sendTransaction = async () => {

        // await handleFakestETH();
        await approvalCheck();

    }


    //BALANCE CHECKER stETH

    const balanceCheckStETH = async () => {


        let balance;



        balance = await client.readContract({
            address: stETHcontract,
            abi: stethAbi,
            functionName: 'balanceOf',
            args: [account]
        })

        if (stETH <= balance) {

            allowanceCheck();
            

            
          setBalanceBoolstETH(true)




        } else {

            setBalanceBoolstETH(false);

            if(stETHChecked) {
            setErrorMessage("You have insufficient stETH.")
            setTimeForEstimates(false);
            setApproved(false);
            setIsReadyToApprove(false)

            }
            
          
          


        }


        setstETHBalance(formatEther(balance));

    }


    //CHECKER FOR RETHTOETH


    useEffect(() => {

        console.log(rETHSavingsToETH)
        console.log(typeof rETHSavingsToETH)

    }, [rETHSavingsToETH])



    //BALANCE CHECKER ETH

    const balanceCheck = async () => {




        const balance = await client.getBalance({
            address: account,

        })






        if (ETH <= balance && ETH > 0  && !isReadyToApprove) {


            setApproved(true)
                    setTimeForEstimates(true);
                  
                    estimateGas();
                setBalanceBoolETH(true)
       


        } else {
           
            if (ETHChecked) {
                if(isReadyToApprove) {

                    setErrorMessage2("Please approve your stETH before entering the ETH value.")
                    setApproved(false)
                    setTimeForEstimates(false)
                    setIsReadyToApprove(true)
                    setBalanceBoolstETH(true)


                } else {

                    setErrorMessage2("You have insufficient ETH.")
                    setApproved(false)
                    setTimeForEstimates(false)
                           setBalanceBoolETH(false);

                }
               
               
                
              
             
               

            }


        }


        setETHBalance(formatEther(balance));

    }

    //rETH functions

    const getrETHBalance = async () => {






        const rETHAmount = await client.readContract({
            address: rETHcontract,
            abi: rETHabi,
            functionName: 'balanceOf',
            args: [account]
        })







        setrETHBalance(formatEther(rETHAmount));






    }


    //DEPOSIT functions


    const Deposit = async () => {


        setLoading(true);
        generateRoute();



        try {

            estimateGas();

            const result = await wallet.writeContract(
                {
                    account,
                    address: stETH2rETH,
                    abi: stETH2rETHabi,
                    functionName: 'deposit',
                    args: [stETH],
                    value: ETH

                }
            )
            setHash(result)




        } catch (e) {
            setLoading(false);
            alert(e);


            setNewTransactionBool(true);
        }




        //rETHBalance();
    }



    
  function convertBigIntToJSON(obj) {
    if (typeof obj === 'bigint') {
      return obj.toString();
    } else if (Array.isArray(obj)) {
      return obj.map(convertBigIntToJSON);
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        obj[key] = convertBigIntToJSON(obj[key]);
      }
    }
    return obj;
  }

    useEffect(() => {
        ; (async () => {
            if (hash) {

                const receipt = await client.waitForTransactionReceipt({ hash })
                setReceipt(receipt)



                if (receipt.status === "success") {
                    setFinrETH(true);

                    setStETHstring("");
                    setETHstring("");
                    setLoading(false);


                    let finGas = receipt.gasUsed
                   


                    console.log("Object keys for gasUsed:" + Object.keys(receipt))
                   

                 
                    setFinalGas(finGas);
                    setGas(finGas)
                    setApproved(false);
                    setNewTransactionBool(true);
                    getrETHBalance();
                    balanceCheck();
                    balanceCheckStETH();
                    setDepositSuccess(true);


                }
            }
        })()
    }, [hash])


    //CONNECTIONS


    //GET ADDRESSES FROM FOUNDRY




    const connect = async () => {
        setLoading(true);

        try {


            let newWallet = await createWalletClient({
                chain: mainnet,
                transport: custom(window.ethereum)
            })

            setWallet(newWallet);

            const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' })

            setAccount(address)
            setLoading(false)





            newWallet = null;
        } catch (e) {

            alert("You must install an Ethereum Wallet to use the app")
            setLoading(false)
            // location.reload();
        }


    }





    const disconnect = async () => {




        try {
            await window.ethereum.request({
                method: "eth_requestAccounts",
                params: [{ eth_accounts: {} }]
            })


            setAccount(undefined)
            setWallet(undefined);
            await newTransaction();

        } catch (e) {

            console.log(e)


        }






    }


    const getFoundry = async () => {

        try {
            const [address] = await client.requestAddresses()
            setFoundryAccount(address)
            alert("SUCCESS: Foundry connected!")

        } catch (e) {

            console.log(e)
            alert("FAIL: Foundry has not been connected.")

        }


    }




    //HANDLE ETH Input and processing functions



    useEffect(() => {


     


if(ETHChecked && ETH !== BigInt(0)) {
    balanceCheck();


}

        
          
           
          

          


        
      
    }, [ETH])


    const handleEth = async (newETH) => {
        setETHstring(newETH);



        if (newETH === "") {

            setErrorMessage2("");
            setETHChecked(false);
            setETH(BigInt(0))
            setApproved(false)
            setBalanceBoolETH(true);
            balanceCheckStETH();


        }
        else {




            if (evalString(newETH) === false) {

                const EthCheck = parseEther(newETH);


                if (typeof EthCheck === 'bigint') {




                    let finETH = bigIntToString(EthCheck)

                    let finStETH = bigIntToString(stETH)

                    let formatETH = wei(parseInt(finETH));
                    let formatStETH = wei(parseInt(finStETH));


                    if (formatETH > 0) {
                        let newTotal = formatETH + formatStETH



                        if (newTotal < 1) {

                            setETHChecked(true)
                            setETH(parseEther(newETH));


                            setErrorMessage2("");


                        } else {
                            setErrorMessage2("Your total deposit must be below the value of 1 ETH.")
                            setETHChecked(false);
                            setETH(BigInt(0))
                            setApproved(false)
                            setTimeForEstimates(false)

                        }
                    }

                    else {

                        setErrorMessage2("You have not input a valid number")
                        setETHChecked(false);
                        setETH(BigInt(0))
                        setApproved(false)
                        setTimeForEstimates(false)



                    }






                } else {

                    setErrorMessage2("You have not input a valid number.")
                    setETHChecked(false);
                    setETH(BigInt(0))
                    setApproved(false)
                    setTimeForEstimates(false)
                  



                }




            }

            else {

                setErrorMessage2("You have not input a number.");
                setETHChecked(false);
                setETH(BigInt(0))
                setApproved(false)
                setTimeForEstimates(false)



            }






        }


    }







    //HANDLE stETH functions


    useEffect(() => {




        if (ETHChecked || ETH !== BigInt(0)) {

            

            estimateGas();

        }




        if (stETHChecked) {

            balanceCheckStETH();
            
         


         






        } else {
            


            if (ETHChecked || ETH !== BigInt(0)) {

                console.log("Working")
                console.log(ETHChecked)

            } else {
                setTimeForEstimates(false)
                console.log("Not Working")
            }



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
                (charCode >= 123 && charCode <= 126) || (charCode === 32) || (Number(charCode) <= 0.0000000000000000000000000000)  // Some more symbols ({ to ~)
            ) {
                return true; // Found a letter or symbol.
            }
        }
        return false;
    }










    const handleStETH = async (newStETH: string) => {
        setStETHstring(newStETH);
        let stEthCheck;

        setApproved(false)
        if (newStETH === "" && ETHChecked) {

            setErrorMessage("");
            setStETHChecked(false);
            setStETH(BigInt(0))
            setBalanceBoolstETH(true);
            balanceCheck();
            setIsReadyToApprove(false)
        }

        else if (newStETH === "" && ETHChecked === false) {

            setErrorMessage("");
            setStETHChecked(false);
            setStETH(BigInt(0))
            setApproved(false)
            setIsReadyToApprove(false)

        } else {






            if (evalString(newStETH) === false) {

                stEthCheck = parseEther(newStETH)


                if (typeof stEthCheck === 'bigint') {


                    let finStETH = bigIntToString(stEthCheck)

                    let finETH = bigIntToString(ETH)

                    let formatETH = wei(parseInt(finETH));
                    let formatStETH = wei(parseInt(finStETH));

                    if (formatStETH > 0) {

                        let newTotal = formatETH + formatStETH






                        if (newTotal < 1) {

                            setStETHChecked(true)
                            setStETH(parseEther(newStETH));


                            setErrorMessage("");


                        } else {
                            setErrorMessage("Your deposit must be below the value of 1 ETH.")
                            setStETHChecked(false);
                            setIsReadyToApprove(false);
                            setApproved(false);
                            setTimeForEstimates(false)

                        }

                    } else {
                        setErrorMessage("You have not input a valid number")
                        setStETHChecked(false);
                        setStETH(BigInt(0))
                        setIsReadyToApprove(false);
                        setTimeForEstimates(false)



                    }

                } else {

                    setErrorMessage("You have not input a valid number.")
                    setStETHChecked(false)
                    setIsReadyToApprove(false);
                    setStETH(BigInt(0))
                    setTimeForEstimates(false)

                }
            } else {

                setErrorMessage("You have not input a valid number.");
                setFinalGas(BigInt(0));
                setIsReadyToApprove(false);
                setStETHChecked(false);
                setStETH(BigInt(0))
                setTimeForEstimates(false)


            }

        }
    }


    function bigIntToString(bigIntValue) {
        if (typeof bigIntValue === 'bigint') {
            return bigIntValue.toString();
        } else {
            throw new Error('Input is not a BigInt.');
        }
    }


    const handleView = async () => {

        setShowModal2(true);


        generateRoute();
    }



    useEffect(() => {

        getContractBalance();

    }, [estReth])



    return (





        <div className={classes.container}>



            <div className={classes.wrapper}>
                <div className={classes.box}>
                    <h3>Connect to your Wallet</h3>


                    {(account) &&
                        (
                            <>
                                <h5 className={classes.specialH5}><span>Connected:</span> {account}</h5>

                            </>
                        )

                    }

                    {(account && !loading) && (








                        <fieldset className={classes.balances} >
                            <legend>Wallet Balances:</legend>
                            < >
                                <h5><span>rETH:</span> {rETHBalance}</h5>
                            </>


                            <>
                                <h5><span>ETH: </span>{ETHBalance}</h5>
                            </>



                            <>
                                <h5><span>stETH:</span> {stETHBalance}</h5>
                            </>
                        </fieldset>


                    )
                    }
                    {(!account) &&
                        (

                            <button onClick={connect}>Connect Wallet</button>

                        )

                    }
                    {account && <button className={classes.disconnect} onClick={disconnect}>Disconnect Wallet</button>}






{/*
                    <button className={classes.foundry} onClick={getFoundry}>CONNECT FOUNDRY</button>
                <button className={classes.fakestETH} onClick={handleFakestETH}>Fund Test Account</button> */}







                </div>
                <div className={classes.box}>

                    <h3>Trade your ETH and/or stETH</h3>




                    <ClipLoader
                        color={color}
                        loading={loading}
                        cssOverride={override}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />



                    {(!newTransactionBool && account && !loading) &&
                        (
                            <>

                                <h5><span>Value of ETH:</span></h5>
                                <input value={ETHstring} onChange={(e) => handleEth(e.target.value)
                                } />


                                <h5> <span>Value of stETH:</span></h5>
                                <input value={stETHstring} onChange={(e) => handleStETH(e.target.value)
                                } />

                            </>
                        )

                    }

                    {(!approved && !newTransactionBool && account && !loading && isReadyToApprove &&  balanceBoolETH && balanceBoolstETH) &&


                        <button onClick={sendTransaction}>Approve</button>

                    }

                    {(approved && !newTransactionBool && !loading && balanceBoolETH && balanceBoolstETH) &&

                        <button id={classes.buttonId} onClick={Deposit}>Deposit</button>

                    }





                    {(newTransactionBool && !loading) &&


                        <button onClick={newTransaction}>New Transaction</button>

                    }


                    <div className={classes.error2}><p>{errorMessage2}</p><p>{errorMessage}</p>  </div>









                </div>
                <div className={classes.box}>

                    <h3>{depositSuccess ? ("Final receipt") : ("Estimated fees/rETH ")}</h3>





                    <ClipLoader
                        color={color}
                        loading={loading}
                        cssOverride={override}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />



                    {(gas !== BigInt(0) && finalGas === BigInt(0) && !loading && timeForEstimates && balanceBoolETH && balanceBoolstETH) && (
                        <>
                            <h5><span>Estimated transaction cost (ETH):</span> {formatEther(gas * gasPrice)}</h5>
                        </>
                    )

                    }


                    {(finalGas !== BigInt(0) && !loading && balanceBoolETH && balanceBoolstETH) && (<>
                        <h5><span>Transaction cost (ETH):</span> {formatEther(finalGas * gasPrice)}</h5>
                    </>)}






                    {(estReth !== "" && !loading && !finrETH && timeForEstimates && balanceBoolETH && balanceBoolstETH) && (
                        <>
                            <h5><span>You'll get (in rETH):</span>  {estReth}</h5>
                        </>

                    )}

                    {(estReth !== "" && !loading && finrETH && balanceBoolETH && balanceBoolstETH) && (
                        <>
                            <h5><span> rETH Received:</span> {estReth}</h5>
                        </>

                    )}


                    {(depositSuccess) && (

                        <>





                            <ClipLoader
                                color={color}
                                loading={altrETH === 0}
                                cssOverride={override}
                                size={130}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />


                            {
                                (altrETH !== 0 && dexGas !== BigInt(0)) && (
                                    <>
                                        <>
                                            <h5 className={classes.rebateH5}>

                                                {depositSuccess ? ("You saved") : ("You will save")}   {

                                                    Number(dexGas * gasPrice) - Number(gas * gasPrice) >= 0 ?
                                                        (<span className={classes.speshSpan} style={{ color: "green" }}>{wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))}</span>)
                                                        : (<span className={classes.speshSpan} style={{ color: "red" }}>{wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))}</span>)
                                                } ETH in gas and  {depositSuccess ? ("you earned") : ("you will earn")} {


                                                    Number(estReth) - altrETH >= 0 ?
                                                        (<span className={classes.speshSpan} style={{ color: "green" }}>{Number(estReth) - altrETH}</span>)
                                                        : (<span className={classes.speshSpan} style={{ color: "red" }}>{Number(estReth) - altrETH}</span>)


                                                } extra rETH.   </h5>
                                        </>
                                        <>


                                            <h5 className={classes.rebateH5}><span> {depositSuccess ? ("Your total rebate is ") : ("Your total rebate will be ")}  {






                                                (wei(Number(rETHSavingsToETH)) + wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))) * Number(USDCquote) >= 0 ?
                                                    (<span className={classes.speshSpan} style={{ color: "green" }}>${


                                                        Number(estReth) >= altrETH ? (

                                                            roundToTwoDecimalPlaces((wei(Number(rETHSavingsToETH)) + wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))) * Number(USDCquote))


                                                        ) : (

                                                            roundToTwoDecimalPlaces(((wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))) - wei(Number(rETHSavingsToETH))) * Number(USDCquote))

                                                        )


                                                    }
                                                    </span>)
                                                    : (<span className={classes.speshSpan} style={{ color: "red" }}>${


                                                        Number(estReth) >= altrETH ? (

                                                            roundToTwoDecimalPlaces((wei(Number(rETHSavingsToETH)) + wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))) * Number(USDCquote))


                                                        ) : (

                                                            roundToTwoDecimalPlaces(
                                                                ((wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))) - wei(Number(rETHSavingsToETH))) * Number(USDCquote)
                                                                )

                                                        )








                                                    }



                                                    </span>)










                                            }</span></h5>



                                        </>

                                    </>

                                )



                            }







                        </>)




                    }




                    {(!depositSuccess && !loading && approved && (stETH !== BigInt(0) || ETH !== BigInt(0)) && balanceBoolETH && balanceBoolstETH) &&
                        <>
                            <button onClick={handleView}>ESTIMATE SAVINGS</button>
                        </>

                    }













                </div>













                <br />






            </div>


            {showModal2 && (
                <Modal
                    isOpen={showModal2}
                    onRequestClose={() => setShowModal2(false)}
                    contentLabel="Delete User Modal"
                    className={classes.speshModal}
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        content: {
                            alignSelf: 'center',
                            margin: '5px',
                            fontFamily: '"Roboto", sans-serif',
                            maxWidth: '90%',
                            width: '300px',
                            height: 'auto',
                            padding: "5vh 0",
                            zIndex: "999",
                            position: 'fixed',
                            top: '55%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#222',
                            backgroundColor: '#faf9f6',
                            border: '0',
                            borderRadius: '20px',
                            boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.25)',

                            gap: "2"
                        },
                    }}



                >

                    <AiOutlineClose onClick={() => {
                        setShowModal2(false);
                        setCurrentWETHRoute(undefined)
                        setCurrentWSTETHRoute(undefined)
                        setRouteGenerated(false)
                        setAltrETH(0)
                        setDexWGas(BigInt(0))
                        setDexStGas(BigInt(0))
                    }} className={classes.removeIcon} />
                    <div className={classes.modalCont}>





                        <ClipLoader
                            color={color}
                            loading={altrETH === 0}
                            cssOverride={override}
                            size={130}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />



                        {
                            (altrETH !== 0) && (
                                <>
                                    <>
                                        <h5><span>rETH returned on Dex:</span> {altrETH}</h5>
                                    </>

                                </>
                            )
                        }
                        {
                            (dexGas !== BigInt(0)) && (
                                <>
                                    <>
                                        <h5><span>Gas on Dex:</span> {formatEther(dexGas * gasPrice)}</h5>
                                    </>




                                </>
                            )
                        }



                        {
                            (altrETH !== 0 && dexGas !== BigInt(0)) && (
                                <>
                                    <>
                                        <h5>

                                            {depositSuccess ? ("You saved") : ("You will save")}   {

                                                Number(dexGas * gasPrice) - Number(gas * gasPrice) >= 0 ?
                                                    (<span className={classes.speshSpan} style={{ color: "green" }}>{wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))}</span>)
                                                    : (<span className={classes.speshSpan} style={{ color: "red" }}>{wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))}</span>)
                                            } ETH in gas and  {depositSuccess ? ("you earned") : ("you will earn")} {


                                                Number(estReth) - altrETH >= 0 ?
                                                    (<span className={classes.speshSpan} style={{ color: "green" }}>{Number(estReth) - altrETH}</span>)
                                                    : (<span className={classes.speshSpan} style={{ color: "red" }}>{Number(estReth) - altrETH}</span>)


                                            } extra rETH.   </h5>
                                    </>
                                    <>


                                        <h5><span> {depositSuccess ? ("Your total rebate is ") : ("Your total rebate will be ")}  {






                                            (wei(Number(rETHSavingsToETH)) + wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))) * Number(USDCquote) >= 0 ?
                                                (<span className={classes.speshSpan} style={{ color: "green" }}>${


                                                    Number(estReth) >= altrETH ? (

                                                        

                                                        roundToTwoDecimalPlaces((wei(Number(rETHSavingsToETH)) + wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))) * Number(USDCquote))


                                                    ) : (
                                                        

                                                        roundToTwoDecimalPlaces(((wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))) - wei(Number(rETHSavingsToETH))) * Number(USDCquote))

                                                    )


                                                }
                                                </span>)
                                                : (<span className={classes.speshSpan} style={{ color: "red" }}>${


                                                    Number(estReth) >= altrETH ? (

                                                        roundToTwoDecimalPlaces((wei(Number(rETHSavingsToETH)) + wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))) * Number(USDCquote))


                                                    ) : (

                                                        roundToTwoDecimalPlaces((((wei(Number(dexGas * gasPrice) - Number(gas * gasPrice))) - wei(Number(rETHSavingsToETH))) * Number(USDCquote)))

                                                    )








                                                }



                                                </span>)










                                        }</span></h5>



                                    </>

                                </>

                            )



                        }

                    </div>

                </Modal>
            )}





            {(approved && !newTransactionBool && !loading && balanceBoolETH && balanceBoolstETH) &&

                <button className={classes.lonerButton} onClick={Deposit}>Deposit</button>

            }










            <div className={classes.error}><p>{errorMessage2}</p><p>{errorMessage}</p>  </div>




        </div>







    );


}

export default Main;
