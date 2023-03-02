import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";
import { isAuthorized } from "../utils/api";


/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
//Set state of user logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

/**Calls API to see if req.user is saved.  
 * API Returns error object or object with req.user 
 * If user is returned set user and loggin
 */
  const getUser = () => {
    const abortController = new AbortController()
    isAuthorized(abortController.signal)
      .then((response) => {
        if (response.user_id) {
          setUser(response)
          setIsLoggedIn(true)
        } else{
          setUser(null)
          setIsLoggedIn(false)
        }
      })
      .catch(() => null)
    return () => abortController.abort()
  }

  // On mount get and set the user
  useEffect(getUser,[])

  // Whenever the user is updated updated login boolean
  useEffect(()=>user ? setIsLoggedIn(true): setIsLoggedIn(false),[user])

  // Props to be passed to child components
  const props = {isLoggedIn, user, setUser}

  return (
    <div className="main-container" >
      <div className="col-md-1 col-12 side-bar shadow sticky">
        <Menu isLoggedIn={isLoggedIn} />
      </div>
      <div className="col-md-8 col-lg-9 ms-md-4 mt-sm-4 mt-lg-1">
        <Routes props={props} />
      </div>
    </div>
  );
}

export default Layout;
