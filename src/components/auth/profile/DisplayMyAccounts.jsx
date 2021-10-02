import React from "react";
import { useDAppPay } from "../../../contexts/DAppPayContext";
import AccountNumberWithIdenticon from "../common/AccountNumberWithIdenticon";

function DisplayMyAccounts() {
  const { accounts } = useDAppPay();
  return (
    <div>
      <h4>My Accounts</h4>
      <div className="my-2">
        {accounts?.length ? (
          accounts.map((account) => (
            <div
              className="mb-2 bg-gray p-2 rounded cursor-pointer hover-section"
              key={account.accountNo}
            >
              <AccountNumberWithIdenticon account={account.accountNo} />
              <p className="card-text text-muted mt-1">
                Balance: {account.balance} ETH
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted">
            <small>No accounts created</small>
          </p>
        )}
      </div>
    </div>
  );
}

export default DisplayMyAccounts;
