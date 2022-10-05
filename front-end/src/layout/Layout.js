import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="container-fluid bg-opacity-10" >
      <div className="row vh-100">
        <div className="col-md-2 side-bar shadow">
          <Menu />
        </div>
        <div className="col-md-8 col-lg-9 ms-md-4 mt-sm-4 mt-lg-1">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
