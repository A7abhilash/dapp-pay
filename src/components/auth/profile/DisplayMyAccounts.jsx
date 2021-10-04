import React from "react";
import { useDAppPay } from "../../../contexts/DAppPayContext";
import AccountNumberWithIdenticon from "../common/AccountNumberWithIdenticon";

function DisplayMyAccounts({ mode, editingAccount, setEditingAccount }) {
  const { accounts } = useDAppPay();
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h4 className="text-info">My Accounts</h4>
        {mode !== "create" && (
          <div
            onClick={() => setEditingAccount(null)}
            className="cursor-pointer"
          >
            <i className="fas fa-plus-square text-light"></i>
          </div>
        )}
      </div>
      <div className="my-2">
        {accounts?.length ? (
          accounts.map((account) => (
            <div
              className={`mb-2 bg-gray p-2 rounded cursor-pointer ${
                account.accountNo === editingAccount?.accountNo
                  ? "bg-secondary"
                  : "bg-gray"
              }`}
              key={account.accountNo}
              onClick={() => setEditingAccount(account)}
              //   disabled={account.accountNo === editingAccount?.accountNo}
            >
              <AccountNumberWithIdenticon account={account.accountNo} />
              <p className="card-text mt-1">Balance: {account.balance} ETH</p>
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
