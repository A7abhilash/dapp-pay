import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import EnterDPayPin from "../common/EnterDPayPin";

function AccountInputs({ mode, data, submit }) {
  const [accountNo, setAccountNo] = useState("");
  const [accountHolderName, setAccountHolderName] = useState();
  const [phoneNo, setPhoneNo] = useState("");
  const [dpayId, setDpayId] = useState("");
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [isPrimaryAccount, setIsPrimaryAccount] = useState(false);

  const setInitialInputs = () => {
    setAccountNo("");
    setAccountHolderName("");
    setPhoneNo("");
    setDpayId("");
    setIsPrimaryAccount(false);
    erasePinValues();
  };

  const erasePinValues = () => {
    setOldPin("");
    setNewPin("");
    setConfirmNewPin("");
  };

  useEffect(() => {
    if (data) {
      setAccountNo(data.accountNo);
      setAccountHolderName(data.accountHolderName);
      setPhoneNo(data.phoneNo);
      setDpayId(data.dpayId.slice(0, data.dpayId.length - 5));
      setIsPrimaryAccount(data.isPrimaryAccount);
      erasePinValues();
    } else {
      setInitialInputs();
    }
  }, [data]);

  const handleCreateNewAccount = (e) => {
    e.preventDefault();
    // console.log(accountNo, accountHolderName, phoneNo, dpayId);
    // console.log(oldPin, newPin, confirmNewPin);
    if (newPin) {
      if (newPin === confirmNewPin) {
        submit(accountNo, accountHolderName, dpayId + "@dpay", phoneNo, newPin);
        setInitialInputs();
      } else {
        alert("New pin and confirm pin fields are not same");
      }
    } else {
      alert("Please set your DPay Pin!");
    }
  };

  const handleEditAccount = (e) => {
    e.preventDefault();
    // console.log(accountNo, accountHolderName, phoneNo, dpayId);
    // console.log(oldPin, newPin, confirmNewPin);
    // console.log(isPrimaryAccount);
    if (oldPin) {
      if (newPin) {
        // If pin is being changed
        if (newPin === confirmNewPin) {
          submit(
            accountNo,
            accountHolderName,
            dpayId + "@dpay",
            phoneNo,
            oldPin,
            newPin,
            isPrimaryAccount
          );
          erasePinValues();
        } else {
          alert("New pin and confirm pin fields are not same");
        }
      } else {
        // If pin is not being changed
        submit(
          accountNo,
          accountHolderName,
          dpayId + "@dpay",
          phoneNo,
          oldPin,
          oldPin,
          isPrimaryAccount
        );
        erasePinValues();
      }
    } else {
      alert("Please enter your current DPay Pin!");
    }
  };

  return (
    <div>
      <h4 className="text-info">
        {mode === "create" ? "Create New Account" : "Edit Account"}
      </h4>
      <Form
        onSubmit={
          mode === "create" ? handleCreateNewAccount : handleEditAccount
        }
      >
        <Form.Group className="my-2">
          <Form.Label className="text-secondary">Account No.</Form.Label>
          <Form.Control
            placeholder="Account No."
            type="text"
            className="form-control"
            required
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
            readOnly={mode !== "create"}
          />
        </Form.Group>
        <Form.Group className="my-2">
          <Form.Label className="text-secondary">
            Account Holder Name
          </Form.Label>
          <Form.Control
            placeholder="Account Holder Name"
            type="text"
            className="form-control"
            required
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="my-2">
          <Form.Label className="text-secondary">Phone No.</Form.Label>
          <Form.Control
            placeholder="Phone No."
            type="number"
            className="form-control"
            required
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
          />
        </Form.Group>
        {mode !== "create" && (
          <Form.Group className="my-2">
            <Form.Check
              type="checkbox"
              label="Set as your primary Account?"
              className="text-muted"
              value={isPrimaryAccount}
              onChange={(e) => {
                // setIsPrimaryAccount(e.target.value);
                setIsPrimaryAccount((prev) => !prev);
                // console.log(e.target.value);
              }}
              checked={isPrimaryAccount ? true : false}
            />
          </Form.Group>
        )}
        <Form.Group className="my-2">
          <Form.Label className="text-secondary">DPay Id</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              placeholder="DPay Id"
              type="text"
              className="form-control"
              required
              value={dpayId}
              onChange={(e) => setDpayId(e.target.value)}
            />
            <span style={{ marginLeft: 5 }}>
              <strong>@dpay</strong>
            </span>
          </div>
        </Form.Group>
        {/* Create Mode: Set new pin and confirm new pin 
		Edit Mode: Enter old pin, Set new pin and confirm new pin */}
        <Form.Group className="my-2">
          <Form.Label className="text-secondary">
            DPay Pin
            {mode === "edit" && (
              <small className="card-text text-muted">
                <br />
                Make sure to enter the current pin of your account even if you
                are not resetting your account password!
              </small>
            )}
          </Form.Label>
          <div className="d-flex align-items-center">
            {mode !== "create" && (
              <EnterDPayPin
                text="Enter Current Pin"
                value={oldPin}
                setValue={setOldPin}
              />
            )}
            <EnterDPayPin
              text="Set New Pin"
              value={newPin}
              setValue={setNewPin}
            />
            <EnterDPayPin
              text="Confirm New Pin"
              value={confirmNewPin}
              setValue={setConfirmNewPin}
            />
          </div>
        </Form.Group>
        <Form.Group className="border-top py-2">
          <Button type="submit">{mode === "create" ? "Create" : "Edit"}</Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default AccountInputs;
