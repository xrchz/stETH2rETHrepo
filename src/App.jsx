
import React from "react";
import classes from './app.module.css';
import Table from './components/table/Table.tsx';
import Title from './components/title/Title.jsx';
import ContractTag from './components/contractTag/ContractTag';
import Main from "./components/Main/Main.tsx";

import NewCode from "./components/uniTest/newCode.tsx";
import UniTest from "./components/uniTest/UniTest.tsx";



function App() {

  return (
   
    
    <div className={classes.app}>
      <Title />

    <Main/>







      <ContractTag />

      <div className={classes.tableCont}>
        <Table />

        

      </div>

      <UniTest/>

    </div>
   
  );
}

export default App;
