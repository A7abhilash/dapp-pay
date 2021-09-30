import React, { createContext, useContext, useEffect, useState } from "react";
import Loading from "../containers/Loading";
import { useBlockchain } from "./BlockchainContext";

const DAppPayContext = createContext();

export const useDAppPay = () => useContext(DAppPayContext);

function DAppPayProvider({ children }) {
  const { dAppPayContract } = useBlockchain();
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("");
  // Accounts array with all details
  const [accounts, setAccounts] = useState([]);
  // Accounts array with only account no.
  const [userAccounts, setUserAccounts] = useState([]);
  //   User's transaction list
  const [transactions, setTransactions] = useState([]);

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
      const _accountsCount = await dAppPayContract.methods.accountsCount();
      const _accounts = [];
      const _accountsNumber = [];
      for (let i = 1; i <= _accountsCount; i++) {
        let _account = await dAppPayContract.methods.accounts(i);
        //   TODO Check with google id and push it to array
        _accounts.push(_account);
        _accountsNumber.push(_account.accountNo);
      }
      console.log("Accounts", _accounts);
      console.log("Account numbers", _accountsNumber);
      setAccounts(_accounts);
      setUserAccounts(_accountsNumber);

      /*? Get user's transactions */
      const _transactionsCount =
        await dAppPayContract.methods.transactionsCount();
      const _transactions = [];
      for (let i = 1; i <= _transactionsCount; i++) {
        let _transaction = await dAppPayContract.methods.transactions(i);
        if (
          _accountsNumber.includes(_transaction.sender) ||
          _accountsNumber.includes(_transaction.receiver)
        ) {
          _transactions.push(_transaction);
        }
      }
      console.log("Transactions", _transactions);
      setTransactions(_transactions);
    } catch (error) {
      console.log(error);
      alert("Couldn't load your data, please try again");
    }
  }

  return (
    <DAppPayContext.Provider value={{ accounts, userAccounts, transactions }}>
      {loading ? <Loading loadingMsg={loadingMsg} /> : children}
    </DAppPayContext.Provider>
  );
}

export default DAppPayProvider;
