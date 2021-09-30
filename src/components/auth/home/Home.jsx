import React from "react";
import { Button } from "react-bootstrap";

function Home() {
  return (
    <div>
      <div>
        <h6 className="text-info">Transfer Money</h6>
        <div className="d-flex align-items-center-justify-content-between flex-wrap">
          <Button variant="info" size="sm" className="m-1">
            To Account Number
          </Button>
          <Button variant="info" size="sm" className="m-1">
            To Mobile Number
          </Button>
          <Button variant="info" size="sm" className="m-1">
            To DPay Id
          </Button>
          <Button variant="info" size="sm" className="m-1">
            To Self Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
