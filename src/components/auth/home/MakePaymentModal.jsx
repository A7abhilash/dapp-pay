import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import EnterDPayPin from "../common/EnterDPayPin";

function MakePaymentModal({
  visible,
  closeModal,
  receiverAccountNo,
  handleTransaction,
}) {
  const [amount, setAmount] = useState();
  const [pin, setPin] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && pin) {
      handleTransaction(amount.toString(), pin);
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
              />
              <div className="input-group-append">
                <div className="input-group-text">ETH</div>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <EnterDPayPin text="Enter DPay Pin" value={pin} setValue={setPin} />
        <Button size="sm" onClick={handleSubmit} disabled={!pin || !amount}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MakePaymentModal;
