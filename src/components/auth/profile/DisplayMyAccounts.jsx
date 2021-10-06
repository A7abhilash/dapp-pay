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
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="plus"
              className="svg-inline--fa fa-plus text-light mb-1"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              style={{
                width: 20,
                height: 20,
              }}
            >
              <path
                fill="currentColor"
                d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"
              ></path>
            </svg>
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
