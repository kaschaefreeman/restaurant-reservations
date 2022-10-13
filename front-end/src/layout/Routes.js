import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationsForm from '../reservations/Reservations Form'
import SearchReservationForm from "../reservations/Search Form";
import SeatForm from "../seat/seatForm";
import TablesForm from "../tables/Tables Form";
import { today } from "../utils/date-time";
import useQuery from '../utils/useQuery'
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  //get date from url query params for Dashboard 
  const query = useQuery();
  const date = query.get("date");

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
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
        <SearchReservationForm/>
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date? date : today()}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
