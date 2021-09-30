import React from "react";

function Navbar() {
  return (
    <nav className="p-1 sticky-top bg-gray">
      <p className="mb-0 text-center text-danger">
        <strong>Note:</strong> Connect to appropriate account in MetaMask while
        creating accounts or during transaction!!!
      </p>
    </nav>
  );
}

export default Navbar;
