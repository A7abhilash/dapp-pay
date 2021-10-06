import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useBlockchain } from "../../../contexts/BlockchainContext";
import { useDAppPay } from "../../../contexts/DAppPayContext";
import Loader from "../common/Loader";
import AccountInputs from "./AccountInputs";
import DisplayMyAccounts from "./DisplayMyAccounts";
import ProfileCard from "./ProfileCard";

function Profile() {
  const { dAppPayContract, getErrorMessage } = useBlockchain();
  const { loadBlockchainData } = useDAppPay();
  const { user } = useAuth();
  const [editingAccount, setEditingAccount] = useState(null);
  const [mode, setMode] = useState(editingAccount === null ? "create" : "edit");

  const [loadingMsg, setLoadingMsg] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (!loadingMsg) {
      setColor("");
    }
  }, [loadingMsg]);

  useEffect(() => {
    setMode(editingAccount === null ? "create" : "edit");
    setLoadingMsg("");
  }, [editingAccount]);

  async function createAccount(
    accountNo,
    accountHolderName,
    dpayId,
    phoneNo,
    pin
  ) {
    try {
      setLoadingMsg("Creating new account...");
      setColor("warning");
      await dAppPayContract.methods
        .createAccount(accountHolderName, dpayId, phoneNo, user.googleId, pin)
        .send({ from: accountNo })
        .on("receipt", () => {
          setColor("success");
          setLoadingMsg("Successfully created new account!!!");
          loadBlockchainData();
        });
    } catch (error) {
      // console.log(error);
      setColor("danger");
      let message = error.message;
      if (message.includes("revert")) {
        message = getErrorMessage(message);
      }
      setLoadingMsg(message);
    } finally {
      setTimeout(() => {
        setLoadingMsg("");
      }, 2500);
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
      setLoadingMsg("Editing account...");
      setColor("warning");
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
          setColor("success");
          setLoadingMsg("Successfully edited your account!!!");
        });
    } catch (error) {
      // console.log(error);
      setColor("danger");
      let message = error.message;
      if (message.includes("revert")) {
        message = getErrorMessage(message);
      }
      setLoadingMsg(message);
    } finally {
      setTimeout(() => {
        setLoadingMsg("");
      }, 2500);
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
      <Loader loadingMsg={loadingMsg} color={color} />
    </div>
  );
}

export default Profile;
