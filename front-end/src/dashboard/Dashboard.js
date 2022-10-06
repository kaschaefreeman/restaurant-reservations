import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsTable from "./Reservations Table";
import { useHistory } from "react-router";
import { next, previous, today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const history = useHistory();

  useEffect(loadDashboard, [date]);
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  //convert date given in query as YYY-MM-DD to string to be displayed on card title
  //ex: 'Wed, Oct 3, 2022'
  const dateString = new Date(`${date}T00:00`).toLocaleString("en-us", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  
  //****** Button Click Handlers Used To Change View Date on Dashboard ******//
  //declare var for url string to be passed when changing date on Dashboard
  let urlQueryString = `/dashboard?date=`;

  //Test date set for quick access of bulk of seeded data. ** To be removed...
  const testDate = urlQueryString+'2020-12-30'
  const previousClick = () => {
    history.push(urlQueryString + previous(date));
  };

  const nextClick = () => {
    history.push(urlQueryString + next(date));
  };

  const todayClick = () => {
    history.push(urlQueryString + today());
  };
  const testDateClick = () =>{
    history.push(testDate)
  }

  /*Return JSX Dashboard heading with bootstrap card below
   **Card will display the date selected (today's date by default)
   **With buttons to go to previous, today, and next date
   **And a table below with all reservations for specified date
   */
  return (
    <main>
      <h1 className="mb-3 mt-3">Dashboard</h1>

      <div className="card shadow border-light rounded">
        <div className="card-body row align-middle">
          <h2 className="card-title fs-5 text-secondary col-lg-6 ">
            Reservations for {dateString}
          </h2>
          <div className="align-top col-lg-6">
            <span className="row">
              <p className="accentFontColor col text-lg-end">Go To Date: </p>
              <button
                className="btn m-0 btn-sm btn-block col dateButtons"
                onClick={previousClick}
              >
                Prev
              </button>
              <button
                className="btn m-0 btn-sm btn-block col dateButtons"
                onClick={todayClick}
              >
                Today
              </button>
              <button
                className="btn m-0 btn-sm btn-block col dateButtons"
                onClick={nextClick}
              >
                Next
              </button>
            </span>
          </div>
          <div className="row">
            <ErrorAlert error={reservationsError} />
            <ReservationsTable reservations={reservations} date={date} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
