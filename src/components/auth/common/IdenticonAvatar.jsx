import React from "react";
import Identicon from "identicon.js";

function IdenticonAvatar({ account }) {
  return (
    <img
      className="rounded-circle"
      width="25"
      height="25"
      src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
      alt="Avatar"
    />
  );
}

export default IdenticonAvatar;
