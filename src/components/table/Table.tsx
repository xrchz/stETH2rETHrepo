import React, { useEffect, useState } from 'react'
import classes from "./table.module.css"
import { createPublicClient, http, webSocket, decodeEventLog } from 'viem';
import { mainnet, foundry, goerli } from 'viem/chains';
import abi from "../../abi/stETH2rETH.json"

const transport = webSocket('wss://eth-mainnet.g.alchemy.com/v2/iXYPKPNVzY3OKROW2emJzNoE3ooToaRa');








const Table = () => {

  const [allTransactions, setAllTransactions] = useState([])


  const client = createPublicClient({
    chain: goerli,
    transport: http( 'https://rpc.ankr.com/eth_goerli')
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


  const getEvents = async () => {
    try {


      const logs = await client.getContractEvents({
        address: '0x8d69e9bd46d3234a43fac3861b2a591c23546ec2',
        abi: abi,
        fromBlock: 18198548n,
        toBlock: 18200553n
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

      setAllTransactions(processedLogs);

    } catch (error) {
      console.log(error)
    }

  }


  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
   console.log("All table entries" +allTransactions)
  }, [allTransactions]);



  function wei(number) {
    return number * Math.pow(10, -18);
  }


  return (
    <table className={classes.container}>


      <tr>
        <th>Transaction Hash</th>
        <th >Log Index</th>
        <th>Event Type</th>
        <th>Ethereum (Deposit)</th>
        <th>stEth (Deposit)</th>
        <th>rEth (Returned)</th>
        <th>Sender</th>
        <th>Block Number</th>
      </tr>
      {allTransactions?.map((trans, index) => (


        <tr key={"row" + index}>

          <td >

            {trans.transactionHash ? (
              `${trans.transactionHash.slice(0, 13)}${trans.transactionHash.length > 13 ? '...' : ''}`
            ) : ("")}
          </td>
          <td >{trans.logIndex}</td>
          <td id={classes.eventName}>{trans.eventName}</td>

          <td>{wei(trans.args[1])}</td>
          <td>{wei(trans.args[2])}</td>
          <td>{trans.eventName === "Deposit"? wei(trans.args[3]) : "N/A"}
          
          </td>
          <td>


            {trans.args[0]}




          </td>

          <td >{trans.blockNumber}</td>
        </tr>
      ))}
    </table>
  )
}

export default Table