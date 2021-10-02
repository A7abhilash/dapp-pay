import React, { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import DAppPay from "../abis/DAppPay.json";
import Loading from "../containers/Loading";

const BlockchainContext = createContext();

export const useBlockchain = () => useContext(BlockchainContext);

function BlockchainProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [account, setAccount] = useState("");
  const [dAppPayContract, setDAppPayContract] = useState({});

  useEffect(() => {
    if (!loading) {
      setLoadingMsg("");
    }
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    setLoadingMsg("Connecting to blockchain...");
    loadWeb3().then(() => connectToBlockchain().then(() => setLoading(false)));
  }, []);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async function connectToBlockchain() {
    const web3 = window.web3;
    //Load accounts
    const accounts = await web3.eth.getAccounts();
    //Add first account the the state
    const _account = accounts[0];
    setAccount(_account);

    //Get network ID
    const networkId = await web3.eth.net.getId();
    //Get network data
    const networkData = DAppPay.networks[networkId];

    //Check if net data exists, then
    if (networkData) {
      //Assign contract to a variable
      const _dAppPayContract = new web3.eth.Contract(
        DAppPay.abi,
        networkData.address
      );
      //   console.log(_dAppPayContract);
      setDAppPayContract(_dAppPayContract);
    } else {
      //If network data doesn't exists, log error
      alert(" Contract is not deployed to detected network!!!");
    }
  }

  function getErrorMessage(message) {
    let revertIndex = message.indexOf("revert");
    // console.log(revertIndex);
    let slicedMessage = message.slice(revertIndex);
    // console.log(slicedMessage);
    let nearestEnd = slicedMessage.indexOf('"');
    let requiredMessage = slicedMessage.slice(0, nearestEnd);
    return requiredMessage.replace("revert ", "");
  }

  return (
    <BlockchainContext.Provider
      value={{ account, dAppPayContract, getErrorMessage }}
    >
      {loading ? <Loading loadingMsg={loadingMsg} /> : children}
    </BlockchainContext.Provider>
  );
}

export default BlockchainProvider;
