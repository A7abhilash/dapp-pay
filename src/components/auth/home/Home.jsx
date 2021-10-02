import React from "react";
import { Button } from "react-bootstrap";

function Home() {
  return (
    <div className="row">
      <div className="col-md-4 mx-2 mx-md-auto">
        <div className="mb-2">
          <h5 className="text-info">Transfer Money</h5>
          <div className="d-flex align-items-center-justify-content-between flex-wrap">
            <Button variant="primary" size="sm" className="m-1">
              To Account Number
            </Button>
            <Button variant="primary" size="sm" className="m-1">
              To Mobile Number
            </Button>
            <Button variant="primary" size="sm" className="m-1">
              To DPay Id
            </Button>
            <Button variant="primary" size="sm" className="m-1">
              To Self Account
            </Button>
          </div>
        </div>
        <div className="mb-2">
          <h5 className="text-info">Request Money</h5>
          <div className="d-flex align-items-center-justify-content-between flex-wrap">
            <Button variant="primary" size="sm" className="m-1">
              To Account Number
            </Button>
            <Button variant="primary" size="sm" className="m-1">
              To Mobile Number
            </Button>
            <Button variant="primary" size="sm" className="m-1">
              To DPay Id
            </Button>
            <Button variant="primary" size="sm" className="m-1">
              To Self Account
            </Button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        Search for account <br /> Make transaction
      </div>
    </div>
  );
}

export default Home;
