
import React, { useState, useEffect } from "react";
import classes from './main.module.css';
import { Address, createPublicClient, http, publicActions, createWalletClient, walletActions, custom, parseEther,  formatEther } from 'viem';
import { mainnet, goerli } from 'viem/chains';
import "viem/window";
import stETH2rETHabi from "../../abi/stETH2rETH.json"
import rETHabi from "../../abi/rETH.json"
import stethAbi from "../../abi/stETH.json"

import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";



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


    const [isReadyToApprove, setIsReadyToApprove] = useState(false);


    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState("#ffffff");

    const stETH2rETH = '0xfAaBbE302750635E3F918385a1aEb4A9eb45977a';
    const rETHcontract = '0xae78736Cd615f374D3085123A210448E74Fc6393';
    const stETHcontract = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';

    




    const wallet = createWalletClient({
        chain: goerli,
        transport: custom(window.ethereum)
    })


    const client = createPublicClient({
        account,

        chain: goerli,
        transport: http('https://rpc.ankr.com/eth_goerli')
    })
        .extend(publicActions)
        .extend(walletActions)



















    function wei(number) {
        return number * Math.pow(10, -18);
    }

    //CHECK CONTRACT BALANCE


    const getContractBalance = async () => {



        const rETH = await client.readContract({
            address: '0x178E141a0E3b34152f73Ff610437A7bf9B83267A',
            abi: rETHabi,
            functionName: 'balanceOf',
            args: [account]
        })

        if (rETH >= estReth) {
            console.log("Enough rETH in contract");
            console.log("rETH CONTRACT balance:" + rETH)
            setApproved(false);

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
            address: '0x8d69e9bd46d3234a43fac3861b2a591c23546ec2',
            functionName: 'deposit',
            account,
            value: ETH
        })

        console.log(typeof result)
        let finGas = bigIntToString(result);
        console.log("Gas Estimate Call result:" + result);


        setGas(finGas);





        const rETHAmount = await client.readContract({
            address: '0x178E141a0E3b34152f73Ff610437A7bf9B83267A',
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
        if (account && client) {
            getrETHBalance();
            balanceCheck();
            balanceCheckStETH();
        }
    }, [account, client])




    //ALLOWANCE FUNCTION

    const allowanceCheck = async () => {
        const allowance: BigInt = await client.readContract({
            address: '0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F',
            abi: stethAbi,
            functionName: 'allowance',
            args: [account, '0x8d69e9bd46d3234a43fac3861b2a591c23546ec2'],
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
        setFinrETH(false);
        setGas("");
    }




    //GET ADDRESSES FROM FOUNDRY





    //APPROVAL FUNCTION

    const approvalCheck = async () => {

        setLoading(true)
        const approval = await wallet.writeContract({
            address: '0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F',
            abi: stethAbi,
            functionName: 'approve',
            args: [stETH2rETH, stETH],
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




        const stETHResult = await wallet.writeContract({
            address: '0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F',
            abi: stethAbi,
            functionName: 'submit',
            args: [account],
            account,
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
            address: '0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F',
            abi: stethAbi,
            functionName: 'balanceOf',
            args: [account]
        })

        if (stETH <= balance ) {

            if( stETH !== BigInt(0)) {
            setIsReadyToApprove(true);
            }


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




        if (ETH <= balance) {
            console.log("Balance is sufficient");
            if(stETH === BigInt(0) && ETH !== BigInt(0)) {
                setApproved(true)
            }


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
            address: '0x178E141a0E3b34152f73Ff610437A7bf9B83267A',
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

        setLoading(true)
        const result = await wallet.writeContract(
            {
                account,
                address: '0x8d69e9bd46d3234a43fac3861b2a591c23546ec2',
                abi: stETH2rETHabi,
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
                    setFinrETH(true);

                    setStETHstring("");
                    setETHstring("");
                    setLoading(false)
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


    //CONNECTIONS


    const connect = async () => {
        setLoading(true);

        try {
            const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' })
            setAccount(address)
            setLoading(false)
        } catch (e) {
            console.log("error in request", e);
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




        setAccount(undefined)



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
        setApproved(false)
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

                    <h3>1. Connect to your Wallet</h3>


                    <button onClick={connect}>Connect Wallet</button>
                    <button className={classes.disconnect} onClick={disconnect}>Disonnect Wallet</button>



                    {(account) &&
                        (
                            <>
                                <h5><span>Connected:</span> {account}</h5>

                            </>
                        )

                    }

                   {/*  <button className={classes.foundry} onClick={getFoundry}>CONNECT FOUNDRY</button>
                    <button className={classes.fakestETH} onClick={handleFakestETH}>Fund Test Account</button>*/}






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


                    <div className={classes.error2}><p>{errorMessage}</p>  <p>{errorMessage2}</p></div>









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







                </div>













                <br />






            </div>



            <div className={classes.error}><p>{errorMessage}</p>  <p>{errorMessage2}</p></div>




        </div>




    );
}

export default Main;
