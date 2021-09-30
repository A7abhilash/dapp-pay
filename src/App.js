import React, { useEffect, useState } from "react";
import Navbar from "./containers/Navbar";
import { useBlockchain } from "./contexts/BlockchainContext";

function App() {
  const { account } = useBlockchain();

  return (
    <>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="text-center">
            <h3>Hello World!!</h3>
            <p>{account}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
