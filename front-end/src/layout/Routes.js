import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationsForm from '../reservations/Reservations Form'
import SearchReservationForm from "../reservations/Search Form";
import SeatForm from "../seat/seatForm";
import TablesForm from "../tables/Tables Form";
import { today } from "../utils/date-time";
import useQuery from '../utils/useQuery'
import Register from "../users/newUser";
import Login from "../users/Login";
import NotFound from "./NotFound";
import UserDashboard from "../users/userDashboard";


/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes({props}) {
  //get date from url query params for Dashboard 
  const query = useQuery();
  const date = query.get("date");

  const {isLoggedIn, user, setUser} = props

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/users/new">
        <Register />
      </Route>
      <Route exact={true} path="/users/:user_id">
        {isLoggedIn && user ? <UserDashboard props={props} /> : <Redirect to={"/users"} />}
      </Route>
      <Route exact={true} path="/users" >
        {isLoggedIn && user ? <Redirect to={`users/${user.user_id}`} /> : <Login setUser={setUser}/>}
      </Route>
      <Route exact={true} path="/reservations/new">
        <ReservationsForm />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatForm />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <ReservationsForm />
      </Route>
      <Route exact={true} path="/tables/new">
        <TablesForm />
      </Route>
      <Route exact={true} path="/search">
        <SearchReservationForm />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date ? date : today()}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
