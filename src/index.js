import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import BlockchainProvider from "./contexts/BlockchainContext";
import DAppPayProvider from "./contexts/DAppPayContext";

ReactDOM.render(
  <BlockchainProvider>
    <DAppPayProvider>
      <App />
    </DAppPayProvider>
  </BlockchainProvider>,
  document.getElementById("root")
);
