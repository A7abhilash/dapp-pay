import React from "react";
import IdenticonAvatar from "./IdenticonAvatar";

function AccountNumberWithIdenticon({ account }) {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="mr-2">{account}</div>
      <IdenticonAvatar account={account} />
    </div>
  );
}

export default AccountNumberWithIdenticon;
