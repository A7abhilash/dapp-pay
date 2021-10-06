import React from "react";
import { Modal, Spinner } from "react-bootstrap";

function Loader({ loadingMsg, color }) {
  return (
    <Modal
      show={loadingMsg !== ""}
      backdrop="static"
      centered
      className={`bg-${color}`}
    >
      <Modal.Body className="text-center">
        {color === "warning" && (
          <Spinner animation="grow" variant="warning" size={50} />
        )}
        {color === "success" && (
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="clipboard-check"
            className={`svg-inline--fa fa-clipboard-check text-${color}`}
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            style={{
              width: 50,
              height: 50,
            }}
          >
            <path
              fill="currentColor"
              d="M336 64h-53.88C268.9 26.8 233.7 0 192 0S115.1 26.8 101.9 64H48C21.5 64 0 85.48 0 112v352C0 490.5 21.5 512 48 512h288c26.5 0 48-21.48 48-48v-352C384 85.48 362.5 64 336 64zM192 64c17.67 0 32 14.33 32 32s-14.33 32-32 32S160 113.7 160 96S174.3 64 192 64zM282.9 262.8l-88 112c-4.047 5.156-10.02 8.438-16.53 9.062C177.6 383.1 176.8 384 176 384c-5.703 0-11.25-2.031-15.62-5.781l-56-48c-10.06-8.625-11.22-23.78-2.594-33.84c8.609-10.06 23.77-11.22 33.84-2.594l36.98 31.69l72.52-92.28c8.188-10.44 23.3-12.22 33.7-4.062C289.3 237.3 291.1 252.4 282.9 262.8z"
            ></path>
          </svg>
        )}
        {color === "danger" && (
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="circle-exclamation"
            className={`svg-inline--fa fa-circle-exclamation text-${color}`}
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            style={{
              width: 50,
              height: 50,
            }}
          >
            <path
              fill="currentColor"
              d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM232 152C232 138.8 242.8 128 256 128s24 10.75 24 24v128c0 13.25-10.75 24-24 24S232 293.3 232 280V152zM256 400c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 385.9 273.4 400 256 400z"
            ></path>
          </svg>
        )}

        <h3 className={`text-${color} text-center`}>{loadingMsg}</h3>
      </Modal.Body>
    </Modal>
  );
}

export default Loader;
