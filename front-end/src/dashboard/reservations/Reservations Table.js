import React from "react";
import "./ReservationsTable.css";
import { useLocation } from "react-router";

function ReservationsTable({ reservations, handleCancelClick }) {
  const path = useLocation().pathname;
  //if there are reservations for the selected date, map each reservation to a table row.
  //else, state that there are no reservations
  if (reservations.length) {
    /********************************Map each reservation to a table row*****************************************/
    const tableBody = reservations.map((reservation) => {
      //get reservation properties
      const {
        reservation_id,
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
        status,
      } = reservation;

      const seatButton = (
        <a
          href={`/reservations/${reservation_id}/seat`}
          className={
            status === "booked" ? "dropdown-item" : "dropdown-item disabled"
          }
        >
          Seat
        </a>
      );
      const cancelButton = (
        <button
          className={
            status == "booked"
              ? "btn btn-sm btn-danger"
              : "btn btn-sm btn-danger disabled"
          }
          data-reservation-id-cancel={reservation_id}
          onClick={(e) => handleCancelClick(e)}
          id={reservation_id}
          title="Cancel Reservation"
        >
          X
        </button>
      );
      const editButton = (
        <a
          href={`/reservations/${reservation_id}/edit`}
          className={
            status === "booked" || status === "cancelled"
              ? "dropdown-item"
              : "dropdown-item disabled"
          }
        >
          Edit
        </a>
      );
      //convert the reservation, created, and updated at time and date values to a locale string
      const options = {
        month: "numeric",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      };
      const reservationTime = new Date(
        reservation_date + "T" + reservation_time
      ).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const reservationDate = new Date(
        reservation_date + "T" + reservation_time
      ).toLocaleDateString([], options);
      /*****************************RETURN THE MAPPED RESERVATION PROPERTIES TO A TABLE ROW**********************************/
      return (
        <>
          <tr
            key={reservation_id}
            id={reservation_id}
            className="border-bottom"
          >
            <td className="text-nowrap">{path === "/search" ? reservationDate : reservationTime}</td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td className="text-nowrap">{mobile_number}</td>
            <td className="text-center">{people}</td>
            <td data-reservation-id-status={reservation_id}>{status}</td>
            <td>
              {status !== "finished" ? (
                <div
                  class="btn-group btn-group-sm"
                  role="group"
                  aria-label="Basic example"
                >
                  <div class="btn-group dropstart">
                    <button
                      class="btn btn-sm btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Actions
                    </button>
                    <div class="dropdown-menu">
                      {status === "booked" ? seatButton : null}
                      {editButton}
                    </div>
                  </div>
                  {status !== "cancelled" ? cancelButton : null}
                </div>
              ) : (
                <p>Actions Unavailable</p>
              )}
            </td>
          </tr>
        </>
      );
    });
    /************************************************************************************************************/
    /***Render the Table ***/
    return (
      <div className="table-responsive">
        <table className="table table-borderless w-100">
          <thead className="border-bottom table-success">
            <tr>
              <th scope="col">{path === "/search" ? "Date/Time" : "Time"}</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col" className="text-nowrap">
                Mobile
              </th>
              <th scope="col">People</th>
              <th scope="col">Status</th>
              <th scope="col">Edit/Cancel</th>
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
