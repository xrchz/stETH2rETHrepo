import React, { useEffect, useState } from 'react'
import classes from "./table.module.css"
import { createPublicClient, http, webSocket, decodeEventLog } from 'viem';
import { mainnet, foundry, goerli } from 'viem/chains';
import abi from "../../abi/stETH2rETH.json"


const transport = webSocket('wss://eth-mainnet.g.alchemy.com/v2/iXYPKPNVzY3OKROW2emJzNoE3ooToaRa');








const Table = ({ onDataFromChild }, USD) => {

  const [allTransactions, setAllTransactions] = useState<Array<object>>([])
  const [rebateTotal, setRebateTotal] = useState(0)
  


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


  const getEvents = async () => {
    try {


      const logs = await client.getContractEvents({
        address: '0xfAaBbE302750635E3F918385a1aEb4A9eb45977a',
        abi: abi,
        fromBlock: 18198548n
        
      });

      const processedLogs = convertBigIntToJSON(logs);
      const decodedLogs = [];

      processedLogs.forEach(element => {
        const topics = decodeEventLog({
          abi: abi,
          data: element.data,
          topics: [...element.topics]
        })

        console.log(topics)

        
      });

      console.log(processedLogs)





      function getLastFiftyElements(arr) {
        // If the array has 50 or fewer elements, return the whole array
        if (arr.length <= 50) {
          return arr;
        }
      
        // If the array has more than 50 elements, return the last 50 elements
        return arr.slice(arr.length - 50);
      }





      const getRebates = async (arr: Array<object>) => {

        let newArr: Array<object> = [];
        
        for (let log of arr) {
          const transaction = await client.getTransactionReceipt({
            hash: log.transactionHash
          });
      
          console.log("Transaction Receipt:", transaction);

          log["effectiveGasPrice"] = transaction.effectiveGasPrice;
          log["gasUsed"] = transaction.gasUsed;


          const block = await client.getBlock({
            blockHash: log.blockHash,
            includeTransactions: false 
          })


          console.log("This is the BLOCK" + block.timestamp);

          log["timestamp"] = block.timestamp

          console.log(log)


          newArr.push(log)

         
        }

        return newArr;

      };


      

      let newLogs = await getRebates(processedLogs);
      let newJSON = convertBigIntToJSON(newLogs);

      console.log("These are the rebated logs" + convertBigIntToJSON(newLogs))


      let total = 0;


      for (const log of newJSON) {

       


       let newNum =  wei(((1.5 * log.gasUsed) * log.effectiveGasPrice) - (log.gasUsed * log.effectiveGasPrice)) * 2000;


        total = total + newNum;

      }

      setAllTransactions(getLastFiftyElements(newLogs.reverse()));
      setRebateTotal(total);


      console.log("REBATE TOTAL ON TABLE:" + total)



    } catch (error) {
      console.log(error)
    }

  }


  useEffect(() => {
    getEvents();
  }, []);


  const sendDataToParent = () => {
    const data = 'Hello from the child!';
     // Invoke the callback with the data
  };

  useEffect(() => {


    if(rebateTotal !== 0) {

      onDataFromChild(rebateTotal);

    }

   

  }, [rebateTotal])





  function wei(number) {
    return number * Math.pow(10, -18);
  }


  return (
    <table className={classes.container}>


      <tr>
     
      <th>Event Type</th>
        
       
        <th>Ethereum (Deposit/Drain)</th>
        <th>stETH (Deposit)</th>
        <th>rETH (Returned)</th>
        <th>Total Rebate</th>
        <th>Effective Gas Price</th>
        <th>Gas Used</th>
        <th>Date:</th>
        <th>Transaction Hash</th>
        
        <th>Block Number</th>
      </tr>
      {allTransactions?.map((trans, index) => (


        <tr key={"row" + index}>
         

           <td style={trans.eventName === "Deposit"? {backgroundColor: "#f8ec85"} : { backgroundColor: "rgb(30, 132, 124)", color: "white"}} id={classes.eventName}>{trans.eventName}</td>

          
         

          <td>{wei(trans.args[1])}</td>
          <td>{trans.eventName === "Deposit"? wei(trans.args[3]) : "N/A"}</td>
          <td >{trans.eventName === "Deposit"? wei(trans.args[2]) : "N/A"}</td>
          <td className={classes.specialTD}> ${roundToTwoDecimalPlaces((wei(((1.5 * trans.gasUsed) * trans.effectiveGasPrice) - (trans.gasUsed * trans.effectiveGasPrice))) * 2000)}
          
          </td>
          <td>{trans.effectiveGasPrice}</td>
        <td>{trans.gasUsed}</td>
        <td>{convertTimestampToDate(trans.timestamp)}</td>
         
          <td>

            {trans.transactionHash}
          </td>
          
          
        </tr>
      ))}
    </table>
  )
}

export default Table