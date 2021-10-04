import React, { useState } from "react";
import { Button } from "react-bootstrap";
import SearchAccount from "../common/SearchAccount";

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
  const [selectedMode, setSelectedMode] = useState(modes[0]);
  const [type, setType] = useState("transfer");
  const [searchedAccount, setSearchedAccount] = useState(null);
  const [makeTransaction, setMakeTransaction] = useState(false);

  const openModal = () => setMakeTransaction(true);
  const closeModal = () => setMakeTransaction(false);

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
        {/* Make payment modal */}
        {/* Loader modal */}
      </div>
    </div>
  );
}

export default Home;
