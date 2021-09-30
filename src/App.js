import React from "react";
import BlockchainProvider from "./contexts/BlockchainContext";
import DAppPayProvider from "./contexts/DAppPayContext";
import Login from "./components/guest/Login";
import Navbar from "./containers/Navbar";
import Main from "./components/auth/Main";
import { useAuth } from "./contexts/AuthContext";

import "./App.css";

function App() {
  const { user } = useAuth();

  return user !== null ? (
    <BlockchainProvider>
      <DAppPayProvider>
        <Navbar />
        <Main />
      </DAppPayProvider>
    </BlockchainProvider>
  ) : (
    <Login />
  );
}

export default App;
