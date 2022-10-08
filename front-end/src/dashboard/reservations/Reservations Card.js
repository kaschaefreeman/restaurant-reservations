import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import ReservationsTable from "./Reservations Table";
import ErrorAlert from "../../layout/ErrorAlert";
import { listReservations } from "../../utils/api";
import { previous, next, today } from "../../utils/date-time";

const ReservationsCard = ({date}) => {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const history = useHistory();

  useEffect(loadReservations, [date]);
  
  function loadReservations() {
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

  const previousClick = () => {
    history.push(urlQueryString + previous(date));
  };

  const nextClick = () => {
    history.push(urlQueryString + next(date));
  };

  const todayClick = () => {
    history.push(urlQueryString + today());
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
          <div className="row">
            <ErrorAlert error={reservationsError} />
            <ReservationsTable reservations={reservations} date={date} />
          </div>
        </div>
      </div>
  );
};

export default ReservationsCard;
