import React from "react";
import Identicon from "identicon.js";

function Navbar({ account }) {
  return (
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <div className="container d-block d-md-flex align-items-center justify-content-between">
        <div className="navbar-brand col-sm-3 col-md-2 mr-0">DAppBox</div>
        <div>
          <span className="text-info">{account}</span>
          {account && (
            <img
              className="ml-2"
              width="30"
              height="30"
              src={`data:image/png;base64,${new Identicon(
                account,
                30
              ).toString()}`}
              alt="Avatar"
            />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
