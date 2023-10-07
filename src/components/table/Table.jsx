import React, { useEffect, useState } from 'react'
import axios from 'axios';
import classes from "./table.module.css"





const Table = () => {

    const [allTransactions, setAllTransactions] = useState([])

    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                const response = await axios.get('https://steth2reth.onrender.com/ethereum/getAll');
                // Assuming `setAllTransactions` is a function to update your state with the response data
                setAllTransactions(response.data);
            } catch (error) {
                // Handle any errors here
                console.error('Error fetching data:', error);
            }
        };

        // Call the function somewhere in your code
        fetchAllEvents();
    }, []);



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
                    <td>{wei(trans.args[3])}</td>
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