import React from "react";

function Loading({ loadingMsg }) {
  return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-grow mb-2" role="status">
          <span className="sr-only"></span>
        </div>
        <p>{loadingMsg}</p>
      </div>
    </div>
  );
}

export default Loading;
