import React, {useState, useEffect} from 'react';
import { readUser, logout } from '../utils/api';
import ErrorAlert from "../layout/ErrorAlert";
import { useParams, useHistory } from "react-router-dom";

const UserDashboard = () => {

    const [user,setUser] = useState({})
    const [userError, setUserError] = useState(null)
    const { user_id} = useParams();

    const history = useHistory()
    
    async function loadUser(userId) {
        const abortController = new AbortController();
        setUserError(null);
        readUser(userId, abortController.signal)
          .then(setUser)
          .catch(setUserError);
        return () => abortController.abort();
      }

    const onLogoutClick= async (event)=>{
        event.preventDefault()
        const abortController = new AbortController()
        logout(abortController.signal)
        .then(()=>history.push("/users"))
        .catch(setUserError);

    }

    useEffect(()=>{
        loadUser(user_id)
    }, [user_id])



    return ( 
        <>
        <h1 className="mb-3 mt-3">Welcome {user.user_name}</h1>
        <ErrorAlert error={userError} />
        <button onClick={onLogoutClick}>Logout</button>
        </>
     );
}
 
export default UserDashboard;