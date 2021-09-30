import React from "react";
import BlockchainProvider from "./contexts/BlockchainContext";
import DAppPayProvider from "./contexts/DAppPayContext";
import Login from "./components/guest/Login";
import Navbar from "./containers/Navbar";

import "./App.css";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user } = useAuth();

  return user !== null ? (
    <BlockchainProvider>
      <DAppPayProvider>
        <Navbar />
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="text-center">
              <h3>Hello World!!</h3>
              {user.googleId} <br />
              {user.name}
            </div>
          </div>
        </div>
      </DAppPayProvider>
    </BlockchainProvider>
  ) : (
    <Login />
  );
}

export default App;
