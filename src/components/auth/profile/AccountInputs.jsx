import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import EnterDPayPin from "../common/EnterDPayPin";

function AccountInputs({ mode = "create", data, submit }) {
  const { user } = useAuth();
  const [accountNo, setAccountNo] = useState("");
  const [accountHolderName, setAccountHolderName] = useState(user?.name || "");
  const [phoneNo, setPhoneNo] = useState("");
  const [dpayId, setDpayId] = useState(
    user?.name?.toLowerCase().replaceAll(" ", "") || ""
  );
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");

  useEffect(() => {
    if (data) {
      setAccountNo(data.accountNo);
      setAccountHolderName(data.accountName);
      setPhoneNo(data.phoneNo);
      setDpayId(data.dpayId);
      setOldPin(data.pin);
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(accountNo, accountHolderName, phoneNo, dpayId);
    // console.log(oldPin, newPin, confirmNewPin);
    if (newPin) {
      if (newPin === confirmNewPin) {
        submit(accountNo, accountHolderName, dpayId + "@dpay", phoneNo, newPin);
      } else {
        alert("New pin and confirm pin fields are not same");
      }
    } else {
      alert("Invalid pin!!!");
    }
  };

  return (
    <div>
      <h4 className="text-primary">
        {mode === "create" ? "Create New Account" : "Edit Account"}
      </h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-2">
          <Form.Label className="text-secondary">Account No.</Form.Label>
          <Form.Control
            placeholder="Account No."
            type="text"
            className="form-control"
            required
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
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
          <Form.Label className="text-secondary">DPay Pin</Form.Label>
          <div className="d-flex align-items-center">
            {mode !== "create" && (
              <EnterDPayPin
                text="Enter Old Pin"
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
