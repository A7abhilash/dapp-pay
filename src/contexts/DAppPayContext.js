import React, { createContext, useContext, useEffect, useState } from "react";
import Loading from "../containers/Loading";
import { useAuth } from "./AuthContext";
import { useBlockchain } from "./BlockchainContext";

const DAppPayContext = createContext();

export const useDAppPay = () => useContext(DAppPayContext);

function DAppPayProvider({ children }) {
  const { user } = useAuth();
  const { dAppPayContract } = useBlockchain();
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("");
  // Accounts array with all details
  const [accounts, setAccounts] = useState([]);
  // Accounts array with only account no.
  const [userAccounts, setUserAccounts] = useState([]);
  //   User's transaction list
  const [transactions, setTransactions] = useState([]);
  //   User's request list
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!loading) {
      setLoadingMsg("");
    }
  }, [loading]);

  useEffect(() => {
    if (dAppPayContract) {
      setLoading(true);
      setLoadingMsg("Loading your data...");
      loadBlockchainData().then(() => setLoading(false));
    }
  }, [dAppPayContract]);

  async function loadBlockchainData() {
    try {
      /*? Get user's accounts */
      const _accountsCount = await dAppPayContract.methods
        .accountsCount()
        .call();
      console.log(_accountsCount.toString());
      const _accounts = [];
      const _accountsNumber = [];
      for (let i = 1; i <= _accountsCount; i++) {
        let _account = await dAppPayContract.methods.accounts(i).call();
        if (_account.googleId === user?.googleId) {
          let _balance = await window.web3.eth.getBalance(_account.accountNo);
          _account.balance = window.web3.utils.fromWei(_balance);
          _accounts.push(_account);
          _accountsNumber.push(_account.accountNo);
        }
      }
      console.log("Accounts", _accounts);
      console.log("Account numbers", _accountsNumber);
      setAccounts(_accounts);
      setUserAccounts(_accountsNumber);

      /*? Get user's transactions */
      const _transactionsCount = await dAppPayContract.methods
        .transactionsCount()
        .call();
      const _transactions = [];
      for (let i = 1; i <= _transactionsCount; i++) {
        let _transaction = await dAppPayContract.methods.transactions(i).call();
        if (_accountsNumber.includes(_transaction.sender)) {
          _transaction["sent-by-me"] = true;
          _transactions.push(_transaction);
        } else if (_accountsNumber.includes(_transaction.receiver)) {
          _transaction["sent-by-me"] = false;
          _transactions.push(_transaction);
        }
      }
      console.log("Transactions", _transactions);
      setTransactions(_transactions.reverse());

      /*? Get user's transactions */
      const _requestsCount = await dAppPayContract.methods
        .requestsCount()
        .call();
      const _requests = [];
      for (let i = 1; i <= _requestsCount; i++) {
        let _request = await dAppPayContract.methods.requests(i).call();
        if (_accountsNumber.includes(_request.requestingFrom)) {
          _request["id"] = i;
          _request["requested-by-me"] = true;
          _requests.push(_request);
        } else if (_accountsNumber.includes(_request.requestingTo)) {
          _request["id"] = i;
          _request["requested-by-me"] = false;
          _requests.push(_request);
        }
      }
      console.log("Requests", _requests);
      setRequests(_requests.reverse());
    } catch (error) {
      console.log(error);
      alert("Couldn't load your data, please try again");
    }
  }

  return (
    <DAppPayContext.Provider
      value={{
        accounts,
        userAccounts,
        transactions,
        requests,
        loadBlockchainData,
      }}
    >
      {loading ? <Loading loadingMsg={loadingMsg} /> : children}
    </DAppPayContext.Provider>
  );
}

export default DAppPayProvider;
