import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import OtpInput from "react-otp-input";

function EnterDPayPin({ text, value, setValue }) {
  const [visible, setVisible] = useState(false);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const cancel = () => {
    setValue("");
    closeModal();
  };

  const proceed = () => {
    if (value.length === 4) {
      closeModal();
    } else {
      alert("DPay pin must be 4 digits");
    }
  };

  return (
    <>
      <Button size="sm" variant="warning" className="mx-1" onClick={openModal}>
        {text}
      </Button>
      <Modal
        show={visible}
        onHide={closeModal}
        backdrop="static"
        centered
        className="bg-dark"
      >
        <Modal.Header>
          <Modal.Title className="text-dark">{text}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OtpInput
            numInputs={4}
            value={value}
            onChange={setValue}
            containerStyle="justify-content-around"
            inputStyle={{
              backgroundColor: "#eee",
              borderWidth: 0,
              width: 50,
              height: 50,
            }}
            isInputNum
            // isInputSecure
          />
          <p className="text-muted card-text mt-2">
            <small>
              Make sure to click proceed to save the input you have entered.
              Clicking cancel would clear your input!
            </small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={cancel}>
            Cancel
          </Button>
          <Button onClick={proceed}>Proceed</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EnterDPayPin;
