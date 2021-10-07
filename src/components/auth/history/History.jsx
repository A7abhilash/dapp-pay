import React from "react";
import { useDAppPay } from "../../../contexts/DAppPayContext";
import AccountNumberWithIdenticon from "../common/AccountNumberWithIdenticon";
import IdenticonAvatar from "../common/IdenticonAvatar";

function History() {
  const { transactions } = useDAppPay();
  return (
    <div className="row">
      <div className="col-md-6 mx-1 mx-md-auto p-1">
        {transactions.length ? (
          transactions.map((transaction) => (
            <div
              key={transaction.time}
              className="bg-gray my-2 border-rounded p-2"
            >
              <AccountNumberWithIdenticon
                account={
                  transaction["sent-by-me"]
                    ? transaction.receiver
                    : transaction.sender
                }
              />
              <div className="d-flex align-items-end justify-content-between mt-2">
                <div>
                  <p className="text-warning my-0">
                    {window.web3.utils.fromWei(transaction.amount, "ether")} ETH
                  </p>
                  <small className="text-muted">
                    On {new Date(transaction.time * 1000).toDateString()} At{" "}
                    {new Date(transaction.time * 1000).toLocaleTimeString()}
                  </small>
                </div>
                <div className="d-flex align-items-center">
                  <small style={{ marginRight: 10 }}>
                    {transaction["sent-by-me"] ? "Debited from" : "Credited to"}
                  </small>
                  <IdenticonAvatar
                    account={
                      transaction["sent-by-me"]
                        ? transaction.sender
                        : transaction.receiver
                    }
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">
            <small>No transactions made</small>
          </p>
        )}
      </div>
    </div>
  );
}

export default History;
