import React from "react";
import { Button } from "react-bootstrap";
import AccountNumberWithIdenticon from "../common/AccountNumberWithIdenticon";
import IdenticonAvatar from "../common/IdenticonAvatar";

function DisplayRequests({
  allowAction,
  requests,
  handleFulfillRequestAmount,
  rejectRequestAmount,
}) {
  return requests.map((request) => (
    <div key={request.time} className="bg-gray my-2 border-rounded p-2">
      <AccountNumberWithIdenticon
        account={
          request["requested-by-me"]
            ? request.requestingTo
            : request.requestingFrom
        }
      />
      <div className="d-flex align-items-end justify-content-between mt-2">
        <div>
          <p className="text-warning my-0">{request.amount} ETH</p>
          <small className="text-muted">
            On {new Date(request.time * 1000).toDateString()} At{" "}
            {new Date(request.time * 1000).toLocaleTimeString()}
          </small>
        </div>
        <div className="d-flex align-items-center">
          <small style={{ marginRight: 10 }}>
            {request["requested-by-me"] ? "Requested from" : "Requested to"}
          </small>
          <IdenticonAvatar
            account={
              request["requested-by-me"]
                ? request.requestingFrom
                : request.requestingTo
            }
          />
        </div>
      </div>
      {allowAction && !request["requested-by-me"] && (
        <div className="d-flex align-items-start justify-content-end mt-3 mb-2">
          <Button
            variant="outline-secondary"
            style={{
              marginRight: 10,
            }}
            onClick={() => rejectRequestAmount(request.id)}
          >
            Reject
          </Button>
          <Button
            variant="success"
            style={{
              marginLeft: 10,
            }}
            onClick={() =>
              handleFulfillRequestAmount(
                request.id,
                request.amount,
                request.requestingFrom
              )
            }
          >
            FulFill
          </Button>
        </div>
      )}
    </div>
  ));
}

export default DisplayRequests;
