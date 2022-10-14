import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import ReservationsTable from "./Reservations Table";
import ErrorAlert from "../../layout/ErrorAlert";
import { listReservations, cancelReservation } from "../../utils/api";
import { previous, next, today } from "../../utils/date-time";

/**
 * Defines the Card that holds the reservation information on the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element} Bootstrap card with Date selector buttons and reservations listed in table format below (table imported from ReservationsTable component)
 */
const ReservationsCard = ({ date }) => {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  //On mount and date change load the reservations for the selected date
  useEffect(loadReservations, [date]);

  /**helper function that loads reservations that are of status "booked" or "seated" for the date passed in component*/
  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  //Cancel reservation click handler
  //To be passed to reservations table component and to be used on the cancel button for each reservation
  const handleCancelClick = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    //Prompt to confirm before changing current reservation status
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      //On Confirm, try call to API to change reservation status to cancelled and reload reservations
      try {
        await cancelReservation(event.target.id, abortController.signal);
        await loadReservations();
      } catch (error) {
        //catch any errors and set the errors to be displayed on ErrorAlert component
        setReservationsError(error);
      }
    }
    return () => abortController.abort();
  };
  //convert date given in query as YYY-MM-DD to string to be displayed on card title
  //ex: 'Wed, Oct 3, 2022'
  const dateString = new Date(`${date}T00:00`).toLocaleString("en-us", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  //****** Button Click Handlers Used To Change View Date on Dashboard ******//
  //use history to change dashboard date query triggering re-render of reservations for the selected date
  const history = useHistory();
  //declare var for url string to be passed when changing date on Dashboard
  let urlQueryString = `/dashboard?date=`;

  const previousClick = () => {
    history.push(urlQueryString + previous(date));
  };
  const todayClick = () => {
    history.push(urlQueryString + today());
  };
  const nextClick = () => {
    history.push(urlQueryString + next(date));
  };

  //Return Card with Reservations Table
  return (
    <div className="card shadow border-light rounded">
      <div className="card-body">
        <h2 className="card-title fs-5 ms-1 text-secondary row">
          Reservations for {dateString}
        </h2>
        <div className="align-top row ms-3">
          <p className="accentFontColor col">Go To: </p>
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
        </div>
        <ErrorAlert error={reservationsError} />
        <ReservationsTable
          reservations={reservations}
          date={date}
          handleCancelClick={handleCancelClick}
        />
      </div>
    </div>
  );
};

export default ReservationsCard;
