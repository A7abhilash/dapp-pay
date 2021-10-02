import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useBlockchain } from "../../../contexts/BlockchainContext";
import AccountInputs from "./AccountInputs";
import ProfileCard from "./ProfileCard";

function Profile() {
  const { dAppPayContract, getErrorMessage } = useBlockchain();
  const { user } = useAuth();

  async function createAccount(
    accountNo,
    accountHolderName,
    dpayId,
    phoneNo,
    pin
  ) {
    try {
      await dAppPayContract.methods
        .createAccount(accountHolderName, dpayId, phoneNo, user.googleId, pin)
        .send({ from: accountNo })
        .on("receipt", () => {
          window.location.reload();
        });
    } catch (error) {
      // console.log(error);
      let message = error.message;
      if (message.includes("revert")) {
        message = getErrorMessage(message);
        alert(message);
      } else {
        alert(message);
      }
    }
  }

  return (
    <div className="row align-items-start">
      <div className="col-md-3 mx-1 mx-md-auto p-1">
        <ProfileCard />
      </div>
      <div className="col-md-4 mx-1 mx-md-auto p-1">List of user accounts</div>
      <div className="col-md-4 mx-1 mx-md-auto p-1">
        <AccountInputs submit={createAccount} />
      </div>
    </div>
  );
}

export default Profile;
