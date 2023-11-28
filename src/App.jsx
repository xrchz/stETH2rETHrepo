
import React, {useState} from "react";
import classes from './app.module.css';
import Table from './components/table/Table.tsx';
import Title from './components/title/Title.jsx';
import ContractTag from './components/contractTag/ContractTag';
import Main from "./components/Main/Main.tsx";
import { Address, createPublicClient, hexToNumber, http, publicActions, createWalletClient, decodeEventLog, walletActions, custom, decodeFunctionData, decodeFunctionResult, parseEther, formatEther } from 'viem';
import { mainnet } from 'viem/chains';






function App() {








    const [dataFromChild, setDataFromChild] = useState(0);

    const handleDataFromChild = (data) => {
      // Do something with the data received from the child
      setDataFromChild(data);
    };


  return (
   
    
    <div className={classes.app}>


      <Title />

    <Main TOTAL1={dataFromChild}/>







      <ContractTag />

      <div className={classes.tableCont}>
        <Table  onDataFromChild={handleDataFromChild} />

        

      </div>

   

    </div>
   
  );
}

export default App;
