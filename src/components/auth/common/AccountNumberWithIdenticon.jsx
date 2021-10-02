import React from "react";
import IdenticonAvatar from "./IdenticonAvatar";

function AccountNumberWithIdenticon({ account }) {
  return (
    <div className="d-flex align-items-center">
      <IdenticonAvatar account={account} />
      <h6 style={{ marginLeft: 10 }} className="card-text">
        <small>{account}</small>
      </h6>
    </div>
  );
}

export default AccountNumberWithIdenticon;
