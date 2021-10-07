import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useBlockchain } from "../../../contexts/BlockchainContext";
import { useDAppPay } from "../../../contexts/DAppPayContext";
import Loader from "../common/Loader";
import MakePaymentModal from "../home/MakePaymentModal";
import DisplayRequests from "./DisplayRequests";

function Requests() {
  const { dAppPayContract, account, getErrorMessage } = useBlockchain();
  const { requests, loadBlockchainData } = useDAppPay();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [fulfilledRequests, setFulfilledRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);

  const [request, setRequest] = useState(null);
  const [makeTransaction, setMakeTransaction] = useState(false);

  const openModal = () => setMakeTransaction(true);
  const closeModal = () => setMakeTransaction(false);

  const [loadingMsg, setLoadingMsg] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (requests) {
      setPendingRequests(
        requests.filter(
          (_request) => !_request.isFulfilled && !_request.isRejected
        )
      );
      setFulfilledRequests(requests.filter((_request) => _request.isFulfilled));
      setRejectedRequests(requests.filter((_request) => _request.isRejected));
    }
    setRequest(null);
  }, [requests]);

  useEffect(() => {
    if (request) {
      setMakeTransaction(true);
    }
  }, [request]);

  const handleFulfillRequestAmount = async (requestId, amount, receiver) => {
    // console.log(requestId);
    setRequest({
      requestId,
      amount,
      receiver,
    });
  };

  const fulfillRequestAmount = async (amount, pin) => {
    console.log(amount, pin);
    try {
      setLoadingMsg("Fulfilling requested...");
      setColor("warning");
      await dAppPayContract.methods
        .fulfillRequestedAmount(request?.requestId, pin)
        .send({
          from: account,
          value: window.web3.utils.toWei(amount, "ether"),
        })
        .on("receipt", () => {
          loadBlockchainData();
          setColor("success");
          setLoadingMsg("Request has been fulfilled...!");
        });
    } catch (error) {
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
      setRequest(null);
    }
  };

  const rejectRequestAmount = async (requestId) => {
    // console.log(requestId);
    try {
      setLoadingMsg("Rejecting requested...");
      setColor("warning");
      await dAppPayContract.methods
        .rejectRequestedAmount(requestId)
        .send({ from: account })
        .on("receipt", () => {
          loadBlockchainData();
          setColor("success");
          setLoadingMsg("Request has been rejected...!");
        });
    } catch (error) {
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
      setRequest(null);
    }
  };

  return (
    <div className="row">
      <div className="col-md-6 mx-1 mx-md-auto p-1">
        <Tabs defaultActiveKey="requests">
          <Tab
            eventKey="requests"
            title={`Requests(${pendingRequests.length})`}
          >
            {pendingRequests.length ? (
              <DisplayRequests
                allowAction={true}
                requests={pendingRequests}
                handleFulfillRequestAmount={handleFulfillRequestAmount}
                rejectRequestAmount={rejectRequestAmount}
              />
            ) : (
              <p className="text-muted">
                <small>No pending requests</small>
              </p>
            )}
          </Tab>
          <Tab
            eventKey="fulfilled-requests"
            title={`Fulfilled Requests(${fulfilledRequests.length})`}
          >
            {fulfilledRequests.length ? (
              <DisplayRequests
                allowAction={false}
                requests={fulfilledRequests}
              />
            ) : (
              <p className="text-muted">
                <small>No fulfilled requests</small>
              </p>
            )}
          </Tab>
          <Tab
            eventKey="rejected-requests"
            title={`Rejected Requests(${rejectedRequests.length})`}
          >
            {rejectedRequests.length ? (
              <DisplayRequests
                allowAction={false}
                requests={rejectedRequests}
              />
            ) : (
              <p className="text-muted">
                <small>No rejected requests</small>
              </p>
            )}
          </Tab>
        </Tabs>
      </div>

      <MakePaymentModal
        visible={makeTransaction}
        closeModal={closeModal}
        receiverAccountNo={request?.receiver}
        value={request?.amount}
        handleTransaction={fulfillRequestAmount}
        type="transfer"
      />
      <Loader loadingMsg={loadingMsg} color={color} />
    </div>
  );
}

export default Requests;
