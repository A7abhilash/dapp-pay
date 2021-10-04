import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useBlockchain } from "../../../contexts/BlockchainContext";
import AccountNumberWithIdenticon from "./AccountNumberWithIdenticon";

function SearchAccount({
  selectedMode,
  openModal,
  searchedAccount,
  setSearchedAccount,
}) {
  const { account, dAppPayContract } = useBlockchain();
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery("");
    setMessage("");
    setSearchedAccount(null);
  }, [selectedMode]);

  const getAppropriateMethod = (param) => {
    switch (selectedMode.mode) {
      case "accountNo":
        return dAppPayContract.methods
          ._getAccountUsingAccountNumber(param)
          .call({ from: account });
      case "phoneNo":
        return dAppPayContract.methods
          ._getAccountUsingPhoneNumber(param)
          .call({ from: account });
      case "dpayId":
        return dAppPayContract.methods
          ._getAccountUsingDpayId(param)
          .call({ from: account });
      case "self":
        return dAppPayContract.methods
          ._getAccountUsingAccountNumber(param)
          .call({ from: account });
      default:
        return null;
    }
  };

  const searchAccount = async () => {
    setSearchedAccount(null);
    if (!query) {
      setMessage("Query is empty!!!");
      return;
    }
    try {
      setMessage("Searching accounts...");
      let _searchedAccount = await getAppropriateMethod(query);
      if (_searchedAccount.accountId !== "0") {
        setMessage("");
        // console.log(_searchedAccount);
        if (_searchedAccount.accountNo === account) {
          setMessage("It's your current account connected to MetaMask.");
        } else {
          setSearchedAccount(_searchedAccount);
        }
      } else {
        setMessage("No accounts found");
      }
    } catch (error) {
      console.log(error);
      setMessage("Couldn't fetch any account...");
    }
  };

  return (
    <Card bg="light" className="text-dark">
      <Card.Header>
        <h4 className="text-info">Search Accounts</h4>
      </Card.Header>
      <Card.Body>
        <Form.Group className="d-md-flex align-items-center">
          <Form.Control
            type={selectedMode.mode === "phoneNo" ? "number" : "text"}
            label={`Enter ${selectedMode.title}`}
            placeholder={`Enter ${selectedMode.title} of the recipient`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            size="sm"
            variant="dark"
            onClick={searchAccount}
            className="m-1"
          >
            Search
          </Button>
        </Form.Group>
        {message && (
          <Card.Subtitle className="text-muted text-center my-2">
            {message}
          </Card.Subtitle>
        )}
        {query && searchedAccount && (
          <div className="mt-3 p-2 border rounded">
            <AccountNumberWithIdenticon account={searchedAccount.accountNo} />
            <div className="mt-2">
              <Card.Title>
                Account Holder Name: {searchedAccount.accountHolderName}
              </Card.Title>
              <Card.Text>DPay Id: {searchedAccount.dpayId}</Card.Text>
            </div>
          </div>
        )}
      </Card.Body>
      {searchedAccount && (
        <Card.Footer>
          <Button variant="success" onClick={openModal}>
            Make Transaction
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
}

export default SearchAccount;
