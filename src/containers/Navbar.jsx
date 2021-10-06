import React from "react";
import { useBlockchain } from "../contexts/BlockchainContext";

function Navbar() {
  const { account } = useBlockchain();

  return (
    <nav className="p-1  text-center sticky-top bg-gray">
      <p className="mb-0 text-danger">
        <strong>Note:</strong> Connect to appropriate account in MetaMask while
        creating accounts or during transaction!!!
      </p>
      <p className="mb-0 text-muted">Current: {account}</p>
    </nav>
  );
}

export default Navbar;
