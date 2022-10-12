import React, { useState } from "react";
import { cancelReservation } from "../../utils/api";

function ReservationsTable({ reservations, date, handleCancelClick }) {
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
        reservation_time,
        people,
        status,
      } = reservation;

      const seatButton = (
        <a
          href={`/reservations/${reservation_id}/seat`}
          className="btn btn-primary"
        >
          Seat
        </a>
      );
      
      
      //convert the reservation, created, and updated at time and date values to a locale string
      const reservationDate = new Date(
        date + "T" + reservation_time
      ).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

      /*****************************RETURN THE MAPPED RESERVATION PROPERTIES TO A TABLE ROW**********************************/
      return (
        <>
          <tr
            key={reservation_id}
            id={reservation_id}
            className="border-bottom"
          >
            {/* <th scope="row">{reservation_id}</th> */}
            <td className="text-nowrap">{reservationDate}</td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td className="text-nowrap">{mobile_number}</td>
            <td className="text-center">{people}</td>
            <td data-reservation-id-status={reservation_id}>{status}</td>
            <td>
              <div className="btn-group-vertical btn-group-sm">
                {status === "booked" ? seatButton : null}

                <a
                  href={`/reservations/${reservation_id}/edit`}
                  className="btn btn-secondary"
                >
                  Edit
                </a>
                <button
                  type='button'
                  className="btn btn-danger"
                  data-reservation-id-cancel={reservation_id}
                  onClick={handleCancelClick}
                  id={reservation_id}
                >
                  Cancel
                </button>
              </div>
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
              <th scope="col">Time</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col" className="text-nowrap">
                Mobile
              </th>
              <th scope="col">People</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
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
