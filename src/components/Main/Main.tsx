
import React, { useState, useEffect } from "react";
import classes from './main.module.css';
import { Address, createPublicClient, hexToNumber, createTestClient, http, publicActions, createWalletClient, walletActions, custom, decodeFunctionData, decodeFunctionResult, parseEther, formatEther } from 'viem';
import { mainnet, goerli } from 'viem/chains';
import "viem/window";
import stETH2rETHabi from "../../abi/stETH2rETH.json"
import rETHabi from "../../abi/rETH.json"
import stethAbi from "../../abi/stETH.json"
import wstETHAbi from "../../abi/wstETH.json"
import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { TradeType, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import { CurrentConfig } from '../uniTest/libs/config.ts'
import { fromReadableAmount } from '../uniTest/libs/conversion.ts'
import { providers } from 'ethers';
import UniAbi from "../uniTest/libs/UniAbi.json"
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
} from '../uniTest/libs/providers.ts'
import {
    MAX_FEE_PER_GAS,
    MAX_PRIORITY_FEE_PER_GAS,
    ERC20_ABI,
    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
    V3_SWAP_ROUTER_ADDRESS,
    WSTETH_TOKEN,
} from '../uniTest/libs/constants.ts'



const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};




function Main() {


    const [account, setAccount] = useState<Address>()
    const [foundryAccount, setFoundryAccount] = useState<Address>()
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
    const [stETHBalance, setstETHBalance] = useState<string | undefined>("")
    const [finrETH, setFinrETH] = useState<boolean>(false);
    const [noWallet, setNoWallet] = useState<boolean>(false);
    const [isReadyToApprove, setIsReadyToApprove] = useState(false);
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState("#ffffff");
    const stETH2rETH = '0xfAaBbE302750635E3F918385a1aEb4A9eb45977a';
    const rETHcontract = '0xae78736Cd615f374D3085123A210448E74Fc6393';
    const stETHcontract = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';
    const [wallet, setWallet] = useState(undefined);
    const [currentWETHRoute, setCurrentWETHRoute] = useState<SwapRoute | undefined>(undefined)
    const [currentWSTETHRoute, setCurrentWSTETHRoute] = useState<SwapRoute | undefined>(undefined)
    const [altrETH, setAltrETH] = useState(0)


    


    const client = createTestClient({

        chain: mainnet,
        mode: "anvil",
        transport: http('http://127.0.0.1:8545')
    })
        .extend(publicActions)
        .extend(walletActions)




    function wei(number) {
        return number * Math.pow(10, -18);
    }

    //CHECK CONTRACT BALANCE


    const getContractBalance = async () => {



        const rETH = await client.readContract({
            address: rETHcontract,
            abi: rETHabi,
            functionName: 'balanceOf',
            args: [account]
        })

        if (rETH >= estReth) {
            console.log("Enough rETH in contract");
            console.log("rETH CONTRACT balance:" + rETH)


        } else {

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
            abi: stETH2rETHabi,
            args: [stETH],
            address: stETH2rETH,
            functionName: 'deposit',
            account,
            value: ETH
        })

   
        let finGas = bigIntToString(result);
        


        setGas(finGas);





        const rETHAmount = await client.readContract({
            address: rETHcontract,
            abi: rETHabi,
            functionName: 'getRethValue',
            args: [TOTAL]
        })

        //const rETH = wei(parseInt(rETHAmount));

        let finrETH = bigIntToString(rETHAmount)
        let formatrETH = wei(finrETH);



        setEstReth(formatrETH.toString());



     







    }


    useEffect(() => {
        if (account && client) {
            getrETHBalance();
            balanceCheck();
            balanceCheckStETH();
        }
    }, [account, client])




    //ALLOWANCE FUNCTION

    const allowanceCheck = async () => {
        const allowance: BigInt = await client.readContract({
            address: stETHcontract,
            abi: stethAbi,
            functionName: 'allowance',
            args: [account, stETH2rETH],
            account,
        });


        console.log("Allowance:" + allowance)
        if (allowance < stETH) {
            setApproved(false);
            setIsReadyToApprove(true);





        } else {
            setApproved(true)
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
        setFinalGas("");
        setEstReth("");
        setFinrETH(false);
        setGas("");
        setIsReadyToApprove(false);
        setErrorMessage2("")
        setErrorMessage("")

    }




    // ESTABLISH wETH UNISWAP ROUTE

  

    async function generateWETHRoute(): Promise<SwapRoute | null> {
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

        console.log("ETH into wETH" + ETH)

        const route = await router.route(
            CurrencyAmount.fromRawAmount(
                CurrentConfig.tokens.in,
                fromReadableAmount(
                    Number(ETH),
                    CurrentConfig.tokens.in.decimals
                ).toString()
            ),
            CurrentConfig.tokens.out,
            TradeType.EXACT_INPUT,
            options
        )


        setCurrentWETHRoute(route);

        return route
    }



    useEffect(() => {

        console.log("Current wETH route:" + currentWETHRoute)

        if (currentWETHRoute !== undefined && currentWSTETHRoute !== undefined) {
            handleComprETH();

        }
        

    }, [currentWETHRoute, currentWSTETHRoute])


     // ESTABLISH wstETH UNISWAP ROUTE

  

     async function generateWSTETHRoute(): Promise<SwapRoute | null> {
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
            functionName: 'getStETHByWstETH',
            args: [stETH]
          })

          console.log(wstETHAmount);

        const route = await router.route(
            CurrencyAmount.fromRawAmount(
                WSTETH_TOKEN,
                fromReadableAmount(
                    wei(Number(wstETHAmount)),
                    WSTETH_TOKEN.decimals
                ).toString()
            ),
            CurrentConfig.tokens.out,
            TradeType.EXACT_INPUT,
            options
        )


        setCurrentWSTETHRoute(route);

        return route
    }


  const generateRoute =  async() => {



       await generateWETHRoute();
        await generateWSTETHRoute();


  }

    


  

   

    

   



    // GET wstETH UNISWAP rETH

    async function executeWSTETHRoute(
        route: SwapRoute
    ) {
    

        const { functionName, args } = decodeFunctionData({
            abi: UniAbi,
            data: route?.methodParameters?.calldata
          })

         const {result}  = await client.simulateContract({
            address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            abi: UniAbi,
            functionName,
            args,
            account: '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb',
          })




          const gas  = await client.estimateContractGas({
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

  
        console.log("DEX GAS: " + gas);
       
        console.log(functionName);
        console.log(args);
        console.log(result);

        return result;


    }


    // GET wETH UNISWAP rETH

    async function executeWETHRoute(
        route: SwapRoute
    ) {
    

        const { functionName, args } = decodeFunctionData({
            abi: UniAbi,
            data: route?.methodParameters?.calldata
          })

         const resultWETH  = await client.simulateContract({
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
        console.log(resultWETH)

        return resultWETH;


    }

    const handleComprETH = async() => {


      
           // const wETH2rETH =  await executeWETHRoute(currentWETHRoute);
            const wstETH2rETH =  await executeWSTETHRoute(currentWSTETHRoute);
      
          
        console.log("wstETH 2 rETH" + wstETH2rETH);
            setAltrETH(wei(hexToNumber(wstETH2rETH)));
      
            return wstETH2rETH;

      

  

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
            console.log("Approval:" + approval)

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
                console.log("Approval receipt" + receipt.status)

                if (receipt.status === "success") {

                    setApproved(true);
                    setLoading(false);
                    estimateGas();

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



        await wallet.writeContract({
            address: stETHcontract,
            abi: stethAbi,
            functionName: 'submit',
            args: ['0x8A60D3742EE1c5E955E9680DF3e9f986b300F791'],
            account: '0x8A60D3742EE1c5E955E9680DF3e9f986b300F791',
            value: parseEther("0.1"),
        })

        console.log("Fake stETH return:" + stETHResult)



    }

    const sendTransaction = async () => {

        // await handleFakestETH();
        await approvalCheck();

    }


    //BALANCE CHECKER stETH

    const balanceCheckStETH = async () => {



        const balance = await client.readContract({
            address: stETHcontract,
            abi: stethAbi,
            functionName: 'balanceOf',
            args: [account]
        })

        if (stETH <= balance) {

            console.log("You have sufficient stETH");
            allowanceCheck();




        } else {
            setErrorMessage("You have insufficient stETH.")


        }

        console.log("stETH Balance:" + balance)
        setstETHBalance(formatEther(balance));

    }




    //BALANCE CHECKER ETH

    const balanceCheck = async () => {




        const balance = await client.getBalance({
            address: account,

        })

        console.log("ETH account balance:" + balance);




        if (ETH <= balance && ETH > 0) {
            console.log("Balance is sufficient");
            if (ETHChecked && stETHstring === "") {
                setApproved(true)
            }


        } else {
            if(ETHChecked) {
                setErrorMessage2("You have insufficient ETH.")
                setApproved(false)

            }
          

        }

        console.log("Balance:" + balance)

        setETHBalance(formatEther(balance));

    }

    //rETH functions

    const getrETHBalance = async () => {



        console.log("sTETH + rETH total:" + TOTAL)


        const rETHAmount = await client.readContract({
            address: rETHcontract,
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


        setLoading(true);
        console.log("Eth at deposit:" + ETH)
        console.log("stEth at deposit:" + stETH)


        try {

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
            console.log("Deposit Result:" + result);


        } catch (e) {
            setLoading(false);
            alert(e);
            console.log("DEPOSIT ERROR:" + e);
        }




        //rETHBalance();
    }

    useEffect(() => {
        ; (async () => {
            if (hash) {
                const receipt = await client.waitForTransactionReceipt({ hash })
                setReceipt(receipt)
                console.log("Deposit receipt" + receipt.status)


                if (receipt.status === "success") {
                    setFinrETH(true);

                    setStETHstring("");
                    setETHstring("");
                    setLoading(false)
                    setETHChecked(false);
                    setStETHChecked(false);
                    generateRoute();
                    setStETH(BigInt(0));
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


    //CONNECTIONS


    //GET ADDRESSES FROM FOUNDRY




    const connect = async () => {
        setLoading(true);

        try {
           

           let newWallet =  await createWalletClient({
                chain: mainnet,
                transport: custom(window.ethereum)
            })

            setWallet(newWallet);

            const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    
            setAccount(address)
            setLoading(false)

           

            newWallet = null;
        } catch (e) {
            console.log("error in request", e);
            alert("You must install an Ethereum Wallet to use the app")
            setLoading(false)
            // location.reload();
        }


    }


    useEffect(() => {

        if (account) {
            getrETHBalance();
            balanceCheck();
            balanceCheckStETH();
        }

    }, [account])


    const disconnect = async () => {




        try {
            await window.ethereum.request({
                method: "eth_requestAccounts",
                params: [{eth_accounts: {}}]
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


        if (newETH === "") {

            setErrorMessage2("");
            setETHChecked(false);
            setETH(BigInt(0))
            setApproved(false)


        }
        else {




            if (evalString(newETH) === false) {

                const EthCheck = parseEther(newETH);
                console.log(EthCheck);

                if (typeof EthCheck === 'bigint') {




                    let finETH = bigIntToString(EthCheck)

                    let finStETH = bigIntToString(stETH)

                    let formatETH = wei(parseInt(finETH));
                    let formatStETH = wei(parseInt(finStETH));


                    if (formatETH > 0) {
                        let newTotal = formatETH + formatStETH
                        console.log("To see if ETH is above 1: " + newTotal);


                        if (newTotal < 1) {

                            setETHChecked(true)
                            setETH(parseEther(newETH));


                            setErrorMessage2("");


                        } else {
                            setErrorMessage2("Your total deposit must be below the value of 1 ETH.")
                            setETHChecked(false);
                            setETH(BigInt(0))
                            setApproved(false)

                        }
                    }

                    else {

                        setErrorMessage2("You have not input a valid number")
                        setETHChecked(false);
                        setETH(BigInt(0))
                        setApproved(false)



                    }






                } else {
                    console.log("You have not input a valid number.");
                    setErrorMessage2("You have not input a valid number.")
                    setETHChecked(false);
                    setETH(BigInt(0))
                    setApproved(false)



                }




            }

            else {
                console.log("Not valid");
                setErrorMessage2("You have not input a number.");
                setETHChecked(false);
                setETH(BigInt(0))
                setApproved(false)



            }






        }


    }






    //HANDLE stETH functions


    useEffect(() => {



        console.log("CURRENT stETH:" + stETH)


        console.log(stETHChecked)

        if (stETHChecked) {

            balanceCheckStETH();
            getContractBalance();
            





        } else {
            setIsReadyToApprove(false)

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
                (charCode >= 123 && charCode <= 126) || (charCode === 32)   // Some more symbols ({ to ~)
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


           

            console.log("This is new stETH" + newStETH)

            if (evalString(newStETH) === false) {

                stEthCheck = parseEther(newStETH)
                console.log(stEthCheck)

                if (typeof stEthCheck === 'bigint') {


                    let finStETH = bigIntToString(stEthCheck)

                    let finETH = bigIntToString(ETH)

                    let formatETH = wei(parseInt(finETH));
                    let formatStETH = wei(parseInt(finStETH));

                    if (formatStETH > 0) {

                        let newTotal = formatETH + formatStETH
                        console.log("To see if ETH is above 1: " + newTotal);





                        if (newTotal < 1) {

                            setStETHChecked(true)
                            setStETH(parseEther(newStETH));


                            setErrorMessage("");


                        } else {
                            setErrorMessage("Your deposit must be below the value of 1 ETH.")
                            setStETHChecked(false);
                            setIsReadyToApprove(false);
                            setApproved(false);

                        }

                    } else {
                        setErrorMessage("You have not input a valid number")
                        setStETHChecked(false);
                        setStETH(BigInt(0))
                        setIsReadyToApprove(false);

                    }

                } else {

                    setErrorMessage("You have not input a valid number.")
                    setStETHChecked(false)
                    setIsReadyToApprove(false);
                    setStETH(BigInt(0))


                }
            } else {

                setErrorMessage("You have not input a valid number.");
                setFinalGas("");
                setIsReadyToApprove(false);
                setStETHChecked(false);


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




    return (

        
    


        <div className={classes.container}>
         {noWallet? 
         (<div className={classes.wrapper}>
            <div className={classes.box}>
                <h3>You cannot connect to stETH2rETH without a wallet.</h3>
                <button><a href="https://metamask.io/">Connect to MetaMask</a></button>
            </div>
         </div>)   : (
         
         <div className={classes.wrapper}>
                <div className={classes.box}>
                    <h3>1. Connect to your Wallet</h3>


                    <button onClick={connect}>Connect Wallet</button>
              {account  &&     <button className={classes.disconnect} onClick={disconnect}>Disonnect Wallet</button>}



                    {(account) &&
                        (
                            <>
                                <h5><span>Connected:</span> {account}</h5>

                            </>
                        )

                    }

                 <button className={classes.foundry} onClick={getFoundry}>CONNECT FOUNDRY</button>
                    <button className={classes.fakestETH} onClick={handleFakestETH}>Fund Test Account</button>






                </div>
                <div className={classes.box}>

                    <h3>2. Select your stETH and/or ETH values</h3>




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

                                Value of ETH:
                                <input value={ETHstring} onChange={(e) => handleEth(e.target.value)
                                } />


                                Value of stETH:
                                <input value={stETHstring} onChange={(e) => handleStETH(e.target.value)
                                } />

                            </>
                        )

                    }

                    {(!approved && !newTransactionBool && account && !loading && isReadyToApprove) &&


                        <button onClick={sendTransaction}>Approve</button>

                    }

                    {(approved && !newTransactionBool && !loading) &&

                        <button onClick={Deposit}>Deposit</button>

                    }

                    {(newTransactionBool && !loading) &&


                        <button onClick={newTransaction}>New Transaction</button>

                    }


                    <div className={classes.error2}><p>{errorMessage2}</p><p>{errorMessage}</p>  </div>









                </div>
                <div className={classes.box}>

                    <h3>3. View your balance, your estimated fees & final receipt</h3>


                    <ClipLoader
                        color={color}
                        loading={loading}
                        cssOverride={override}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />

                    {(gas !== "" && finalGas === "" && !loading) && (
                        <>
                            <h5><span>Estimated Gas:</span> {gas}</h5>
                        </>
                    )

                    }

                    {(finalGas !== "" && !loading) && (<>
                        <h5><span>Final Gas:</span> {finalGas}</h5>
                    </>)}

                    {(estReth !== "" && !loading && !finrETH) && (
                        <>
                            <h5><span>rETH estimate for transaction:</span>  {estReth}</h5>
                        </>

                    )}

                    {(estReth !== "" && !loading && finrETH) && (
                        <>
                            <h5><span> rETH Received:</span> {estReth}</h5>
                        </>

                    )}
                    {(account && !loading) && (
                        <>
                            <>
                                <h5><span>rETH Balance:</span> {rETHBalance}</h5>
                            </>


                            <>
                                <h5><span>ETH Balance: </span>{ETHBalance}</h5>
                            </>



                            <>
                                <h5><span>stETH:</span> {stETHBalance}</h5>
                            </>
                        </>
                    )
                    }
                    {
                        (altrETH !== 0) && (
                            <>
                                <>
                                    <h5><span>rETH returned on Dex:</span> {altrETH}</h5>
                                </>
    
    
                               
    
                            </>
                        )
                    }







                </div>













                <br />






            </div>)}



            <div className={classes.error}><p>{errorMessage2}</p><p>{errorMessage}</p>  </div>

                


        </div> 


        




    );


}

export default Main;
