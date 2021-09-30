import React from "react";
import Identicon from "identicon.js";

function IdenticonAvatar({ account }) {
  return (
    <img
      className="rounded-circle"
      width="30"
      height="30"
      src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
      alt="Avatar"
    />
  );
}

export default IdenticonAvatar;
