import React, {useState, useEffect} from 'react';
import { readUser, logout } from '../utils/api';
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";

const UserDashboard = ({props}) => {

    const {user, setUser} = props

    const [userError, setUserError] = useState(null)

    const history = useHistory()
    
    async function loadUser(userId) {
        const abortController = new AbortController();
        setUserError(null);
        readUser(userId, abortController.signal)
          .catch(setUserError);
        return () => abortController.abort();
      }
      
      useEffect(()=>{
        loadUser(user.user_id)
    }, [user])


    const onLogoutClick= async (event)=>{
        event.preventDefault()
        const abortController = new AbortController()
        logout(abortController.signal)
        .then(()=>setUser(null))
        .then(()=>history.push("/"))
        .catch(setUserError);
    }


    return ( 
        <>
        <h1 className="mb-3 mt-3">Welcome {user.user_name}</h1>
        <ErrorAlert error={userError} />
        <button onClick={onLogoutClick}>Logout</button>
        </>
     );
}
 
export default UserDashboard;