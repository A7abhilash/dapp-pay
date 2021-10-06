import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useBlockchain } from "../../../contexts/BlockchainContext";
import { useDAppPay } from "../../../contexts/DAppPayContext";
import Loader from "../common/Loader";
import MakePaymentModal from "./MakePaymentModal";
import SearchAccount from "./SearchAccount";

const modes = [
  {
    title: "Account Number",
    mode: "accountNo",
  },
  {
    title: "Phone Number",
    mode: "phoneNo",
  },
  {
    title: "DPay Id",
    mode: "dpayId",
  },
  {
    title: "Self Account",
    mode: "self",
  },
];

function Home() {
  const { account, dAppPayContract, getErrorMessage } = useBlockchain();
  const { loadBlockchainData, userAccounts } = useDAppPay();
  const [selectedMode, setSelectedMode] = useState(modes[0]);
  const [type, setType] = useState("transfer");
  const [searchedAccount, setSearchedAccount] = useState(null);
  const [makeTransaction, setMakeTransaction] = useState(false);

  const openModal = () => setMakeTransaction(true);
  const closeModal = () => setMakeTransaction(false);

  const [loadingMsg, setLoadingMsg] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (!loadingMsg) {
      setColor("");
    }
  }, [loadingMsg]);

  const sendAmount = async (amount, pin) => {
    // console.log("sendAmount");
    // console.log(amount, pin);
    try {
      if (!userAccounts.includes(account)) {
        alert("Check your account connected to MetaMask and try again!");
        return;
      }
      setLoadingMsg("Processing Transaction...");
      setColor("warning");
      await dAppPayContract.methods
        .sendAmount(searchedAccount?.accountNo, pin)
        .send({
          from: account,
          value: window.web3.utils.toWei(amount, "ether"),
        })
        .on("receipt", () => {
          loadBlockchainData();
          setColor("success");
          setLoadingMsg("Transaction success!!!");
        });
    } catch (error) {
      // console.log(error);
      setColor("danger");
      let message = error.message;
      if (message.includes("revert")) {
        message = getErrorMessage(message);
      }
      setLoadingMsg(message);
    } finally {
      setTimeout(() => {
        setLoadingMsg("");
      }, 2500);
    }
  };

  const requestAmount = async (amount, pin) => {
    console.log("reqAmount");
    console.log(amount, pin);
    // covert amount to wei
  };

  return (
    <div className="row">
      <div className="col-md-4 mx-2 mx-md-auto">
        <div className="mb-2">
          <h5 className="text-info">Transfer Money</h5>
          <div className="d-flex align-items-center-justify-content-between flex-wrap">
            {modes.map((item, index) => (
              <Button
                variant={
                  selectedMode.mode === item.mode && type === "transfer"
                    ? "light"
                    : "outline-light"
                }
                size="sm"
                className="m-1"
                key={"transfer" + item.mode + index}
                onClick={() => {
                  setSelectedMode(item);
                  setType("transfer");
                }}
              >
                To {item.title}
              </Button>
            ))}
          </div>
        </div>
        <div className="mb-2">
          <h5 className="text-info">Request Money</h5>
          <div className="d-flex align-items-center-justify-content-between flex-wrap">
            {modes.map((item, index) => (
              <Button
                variant={
                  selectedMode.mode === item.mode && type === "request"
                    ? "light"
                    : "outline-light"
                }
                size="sm"
                className="m-1"
                key={"request" + item.mode + index}
                onClick={() => {
                  setSelectedMode(item);
                  setType("request");
                }}
              >
                To {item.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <SearchAccount
          selectedMode={selectedMode}
          openModal={openModal}
          searchedAccount={searchedAccount}
          setSearchedAccount={setSearchedAccount}
        />
        <MakePaymentModal
          visible={makeTransaction}
          closeModal={closeModal}
          receiverAccountNo={searchedAccount?.accountNo}
          handleTransaction={type === "transfer" ? sendAmount : requestAmount}
        />
        <Loader loadingMsg={loadingMsg} color={color} />
      </div>
    </div>
  );
}

export default Home;
