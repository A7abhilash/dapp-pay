import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import EnterDPayPin from "../common/EnterDPayPin";

function MakePaymentModal({
  visible,
  closeModal,
  receiverAccountNo,
  handleTransaction,
  type,
  value = null,
}) {
  const [amount, setAmount] = useState(0);
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (visible) {
      setAmount(value ? value : 0);
      setPin("");
    }
  }, [visible, value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      if (type === "transfer" && pin) {
        handleTransaction(amount.toString(), pin);
      } else {
        handleTransaction(amount.toString());
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setAmount(0);
    setPin("");
    closeModal();
  };

  return (
    <Modal
      show={visible}
      onHide={handleClose}
      backdrop="static"
      centered
      className="bg-secondary text-dark"
      size="md"
    >
      <Modal.Header closeButton>
        <Modal.Title>Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Receiver: {receiverAccountNo}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="float-left">Amount</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                min={0}
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value.toString())}
                readOnly={value !== null}
              />
              <div className="input-group-append">
                <div className="input-group-text">ETH</div>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        {type === "transfer" && (
          <EnterDPayPin text="Enter DPay Pin" value={pin} setValue={setPin} />
        )}
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={type === "transfer" && !pin}
        >
          {type === "transfer" ? "Send" : "Request"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MakePaymentModal;
