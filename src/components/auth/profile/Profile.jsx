import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useBlockchain } from "../../../contexts/BlockchainContext";
import { useDAppPay } from "../../../contexts/DAppPayContext";
import AccountInputs from "./AccountInputs";
import DisplayMyAccounts from "./DisplayMyAccounts";
import ProfileCard from "./ProfileCard";

function Profile() {
  const { dAppPayContract, getErrorMessage } = useBlockchain();
  const { loadBlockchainData } = useDAppPay();
  const { user } = useAuth();
  const [editingAccount, setEditingAccount] = useState(null);
  const [mode, setMode] = useState(editingAccount === null ? "create" : "edit");

  useEffect(() => {
    setMode(editingAccount === null ? "create" : "edit");
  }, [editingAccount]);

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
          loadBlockchainData();
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

  async function editAccount(
    accountNo,
    accountHolderName,
    dpayId,
    phoneNo,
    oldPin,
    newPin,
    isPrimaryAccount
  ) {
    try {
      await dAppPayContract.methods
        .editAccount(
          accountHolderName,
          dpayId,
          phoneNo,
          oldPin,
          newPin,
          isPrimaryAccount
        )
        .send({ from: accountNo })
        .on("receipt", () => {
          loadBlockchainData();
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
      <div className="col-md-4 mx-1 mx-md-auto p-1">
        <DisplayMyAccounts
          editingAccount={editingAccount}
          setEditingAccount={setEditingAccount}
          mode={mode}
          setMode={setMode}
        />
      </div>
      <div className="col-md-4 mx-1 mx-md-auto p-1">
        <AccountInputs
          submit={mode === "create" ? createAccount : editAccount}
          data={editingAccount}
          mode={mode}
        />
      </div>
    </div>
  );
}

export default Profile;
