import React, { useState } from "react";
import Topbar from "./Topbar";
import Home from "./home/Home";
import Profile from "./profile/Profile";
import History from "./history/History";
import Requests from "./requests/Requests";

const views = ["Home", "Profile", "Transactions", "Requests"];
function Main() {
  const [currentView, setCurrentView] = useState(views[0]);

  const getCurrentView = () => {
    switch (currentView) {
      case views[0]:
        return <Home />;
      case views[1]:
        return <Profile />;
      case views[2]:
        return <History />;
      case views[3]:
        return <Requests />;
      default:
        return null;
    }
  };
  return (
    <div className="container mt-3 mt-md-5">
      <div className="row">
        <div
          className="col-md-6 mx-1 mx-md-auto p-2 bg-secondary"
          style={{ borderRadius: 20 }}
        >
          <Topbar
            views={views}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        </div>
      </div>
      <div className="row align-items-start">
        <div className="col-12 mt-3 mt-md-5 mx-1 mx-md-auto">
          {getCurrentView()}
        </div>
      </div>
    </div>
  );
}

export default Main;
