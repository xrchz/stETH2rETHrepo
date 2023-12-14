import React, { useEffect, useState } from 'react'
import classes from "./table.module.css"
import { createPublicClient, http, webSocket, decodeEventLog } from 'viem';
import { mainnet, foundry, goerli } from 'viem/chains';
import abi from "../../abi/stETH2rETH.json"
import { ethers } from "ethers";
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { computePoolAddress } from '@uniswap/v3-sdk'
import {
  getMainnetProvider,

} from '../uniTest/libs/providers.ts'

import { Address,  publicActions, createWalletClient,  walletActions, custom, decodeFunctionData, decodeFunctionResult, parseEther, formatEther } from 'viem';
import { CurrentConfig } from '../uniTest/libs/config.ts'
import { fromReadableAmount } from '../uniTest/libs/conversion.ts'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'


const transport = webSocket('wss://eth-mainnet.g.alchemy.com/v2/iXYPKPNVzY3OKROW2emJzNoE3ooToaRa');








const Table = ({ onDataFromChild }) => {

  const [allTransactions, setAllTransactions] = useState<Array<object>>([])
  const [rebateTotal, setRebateTotal] = useState(0)
  const [USDCquote, setUSDCquote] = useState<number>(0)



  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://mainnet.infura.io/v3/713d3fd4fea04f0582ee78560e6c47e4')
  });




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


  function roundToTwoDecimalPlaces(number) {
    // Using the toFixed method to round to 2 decimal places
    return parseFloat(number.toFixed(2));
  }

  function roundToFiveDecimalPlaces(number) {
    // Using the toFixed method to round to 5 decimal places


    let newNum = Number(number)
    return parseFloat(newNum.toFixed(5));
}







  function convertTimestampToDate(timestamp) {
    // Convert the timestamp to milliseconds and create a Date object
    var date = new Date(timestamp * 1000);

    // Get the day, month, and year
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are zero-based
    var year = date.getFullYear();

    // Add leading zeros if needed
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    // Format the date as "dd/mm/yyyy"
    var formattedDate = day + '/' + month + '/' + year;

    return formattedDate;
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



    setUSDCquote(newQuote);


}


useEffect(() => {


  getQuoute();



}, [])








function getLastFiftyElements(arr) {
  // If the array has 50 or fewer elements, return the whole array
  if (arr.length <= 50) {
    return arr;
  }

  // If the array has more than 50 elements, return the last 50 elements
  return arr.slice(arr.length - 50);
}



useEffect(() => {

if(USDCquote !== 0) {
  getEvents();
}
}, [USDCquote]);


const getRebates = async (arr: Array<object>) => {

  let newArr: Array<object> = [];

  for (let log of arr) {
    try {
      const transaction = await client.getTransactionReceipt({
        hash: log.transactionHash
      });


      
      const block = await client.getBlock({
        blockHash: log.blockHash,
        includeTransactions: true
      })

      log["effectiveGasPrice"] = transaction.effectiveGasPrice;
      log["gasUsed"] = transaction.gasUsed;
      log["timestamp"] = block.timestamp


      if(log["eventName"] !== "Drain") {

      newArr.push(log)


      }

    } catch (e) {


      console.log(e)


      

   

    }


  



  }


  console.log("loop finished")

  return newArr;

};



  const getEvents = async () => {
 

      const logs = await client.getContractEvents({
        address: '0xfAaBbE302750635E3F918385a1aEb4A9eb45977a',
        abi: abi,
        fromBlock: 18198548n

      });

      const processedLogs = convertBigIntToJSON(logs);
      const decodedLogs = [];


      console.log("FIRST PART DONE")

      processedLogs.forEach(element => {
        const topics = decodeEventLog({
          abi: abi,
          data: element.data,
          topics: [...element.topics]
        })

      });



      let newLogs = await getRebates(processedLogs);
      let newJSON = convertBigIntToJSON(newLogs);


      console.log( newJSON)

      let total = 0;

      for (const log of newJSON) {


       if(log["args"][3] !== "0") {

        console.log(log.gasUsed)

        let newNum = wei((230000 * log.effectiveGasPrice) - (log.gasUsed * log.effectiveGasPrice)) * USDCquote;
        total = total + newNum;

       } else {

        let newNum = wei((117000 * log.effectiveGasPrice) - (log.gasUsed * log.effectiveGasPrice)) * USDCquote;
        total = total + newNum;

       }

      }


      console.log(total);

      console.log("SECOND BIT DONE");

      console.log(newJSON)

      setAllTransactions(getLastFiftyElements(newLogs.reverse()));
      setRebateTotal(total);
  }





  const sendDataToParent = () => {
    const data = 'Hello from the child!';
    // Invoke the callback with the data
  };

  useEffect(() => {



    console.log("This is the rebateTotal" + rebateTotal)


    if (rebateTotal !== 0) {

      onDataFromChild(rebateTotal);

    }



  }, [rebateTotal])





  function wei(number) {
    return number * Math.pow(10, -18);
  }


  return (
    <table className={classes.container}>

<thead>
      <tr>

        <th>Event Type</th>


        <th>Ethereum (Deposit)</th>
        <th>stETH (Deposit)</th>
        <th>rETH (Returned)</th>
        <th>Estimated Rebate</th>
        <th>Transaction Cost</th>
        
        <th>Date:</th>
        <th>Transaction Hash</th>


      </tr>
      </thead>
      <tbody>
      {allTransactions?.map((trans, index) => (


        <tr key={"row" + index}  >


          <td style={trans.eventName === "Deposit" ? { backgroundColor: "#f8ec85" } : { backgroundColor: "rgb(30, 132, 124)", color: "white" }} id={classes.eventName}>{trans.eventName}</td>




          <td>{roundToFiveDecimalPlaces(wei(trans.args[1]))}</td>
          <td>{trans.eventName === "Deposit" ? roundToFiveDecimalPlaces(wei(trans.args[3])) : "N/A"}</td>
          <td >{trans.eventName === "Deposit" ? roundToFiveDecimalPlaces(wei(trans.args[2])) : "N/A"}</td>


          {  trans.args[3] !== "0"?
          (<td className={classes.specialTD}> ${roundToTwoDecimalPlaces((wei((230000 * trans.effectiveGasPrice) - (trans.gasUsed * trans.effectiveGasPrice))) * USDCquote)} </td>):
          (<td className={classes.specialTD}> ${roundToTwoDecimalPlaces((wei((117000 * trans.effectiveGasPrice) - (trans.gasUsed * trans.effectiveGasPrice))) * USDCquote)} </td>)
          }
         
          <td>{roundToFiveDecimalPlaces(wei(trans.effectiveGasPrice * trans.gasUsed))}</td>
          
          <td>{convertTimestampToDate(trans.timestamp)}</td>

          <td>

            {trans.transactionHash}
          </td>


        </tr>

       
      ))}
       </tbody>
    </table>
  )
}

export default Table