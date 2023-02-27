import React, { useState } from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";
import { loggedIn } from "../utils/cookie";
/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {

  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn())

  return (
    <div className="main-container" >
        <div className="col-md-1 col-12 side-bar shadow sticky">
          <Menu isLoggedIn={isLoggedIn}/>
        </div>
        <div className="col-md-8 col-lg-9 ms-md-4 mt-sm-4 mt-lg-1">
          <Routes setIsLoggedIn={setIsLoggedIn}/>
        </div>
    </div>
  );
}

export default Layout;
