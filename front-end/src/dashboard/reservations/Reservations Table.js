import React, { useState } from "react";
import { Link } from "react-router-dom";

function ReservationsTable({ reservations, date }) {
  //Reservation info is set to display in a table with a nested table of additional reservation info
  //This useState hook is used to state whether to show the additional info or not
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  //this useState hook is used to set which reservation id to show
  const [showingId, setShowingId] = useState(null);

  /*Click handler that is used to set the reservation Id showing and if to show the additional info
   * To be used on each table row
   */
  const handleReservationClick = ({ target }) => {
    //will need to get parentNode to allow for click of any table data element within the row
    setShowingId(target.parentNode.id);
    setShowAdditionalInfo(!showAdditionalInfo);
  };
  //if there are reservations for the selected date, map each reservation to a table row.
  //else, state that there are no reservations
  if (reservations.length) {
    /********************************Map each reservation to a table row*****************************************/
    const tableBody = reservations.map((reservation, index) => {
      //get reservation properties
      const {
        reservation_id,
        first_name,
        last_name,
        mobile_number,
        reservation_time,
        people,
        created_at,
        updated_at,
      } = reservation;

      //convert the reservation, created, and updated at time and date values to a locale string
      const reservationDate = new Date(
        date + "T" + reservation_time
      ).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

      const createdAt = new Date(created_at).toLocaleString();
      const updatedAt = new Date(updated_at).toLocaleString();

      //Create variable that renders the Mobile number, created at, and updated at properties to its own table
      //Will be conditionally rendered as a nested table on click of the table row
      const additionalInfo = (
        <tr>
          <td colSpan={7}>
            <table className="table table-sm m-0 ms-3">
              <thead>
                <tr>
                  <th>Mobile Number</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-bottom">
                  <td>{mobile_number}</td>
                  <td>{createdAt}</td>
                  <td>{updatedAt}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      );

      /*****************************RETURN THE MAPPED RESERVATION PROPERTIES TO A TABLE ROW**********************************/
      return (
        <>
          <tr
            key={reservation_id}
            id={reservation_id}
            //conditionally render the className to add bottom border style if the reservations additional info is not showing
            className={
              showingId == reservation_id && showAdditionalInfo
                ? "reservationRow"
                : "reservationRow border-bottom"
            }
            onClick={handleReservationClick}
          >
            <th scope="row">{index + 1}</th>
            <td>{reservation_id}</td>
            <td>{reservationDate}</td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td className="text-center">{people}</td>
            <td className="btn">
              <a
                href={`/reservations/${reservation_id}/seat`}
                className="badge badge-warning"
              >
                SEAT
              </a>
            </td>
          </tr>
          {showAdditionalInfo && showingId == reservation_id
            ? additionalInfo
            : null}
        </>
      );
    });
    /************************************************************************************************************/
    /***Render the Table ***/
    return (
      <div className="table-responsive">
        <table className="table table-borderless">
          <thead className="border-bottom table-success">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Id</th>
              <th scope="col">Time</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">People</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{tableBody}</tbody>
        </table>
      </div>
    );
  } else {
    return (
      <p className="text-warning fw-semibold">No Reservations for This Date</p>
    );
  }
}

export default ReservationsTable;
