import React from "react";
import { Button } from "react-bootstrap";

function Topbar({ currentView, setCurrentView, views }) {
  return (
    <div className="d-flex align-items-center justify-content-around">
      {views.map((view, index) => (
        <div className="m-1" key={"View-" + view + index}>
          <Button
            onClick={() => setCurrentView(view)}
            variant={currentView === view ? "info" : "dark"}
            style={{
              borderRadius: 20,
            }}
          >
            {view}
          </Button>
        </div>
      ))}
    </div>
  );
}

export default Topbar;
