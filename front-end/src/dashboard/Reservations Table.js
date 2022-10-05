import React from "react";

function ReservationsTable({ reservations, date }) {
  //if there are reservations for the selected date, map each reservation to a table row.
  //else, state that there are no reservations
  if (reservations.length) {
    const tableBody = reservations.map((reservation, index) => {
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

      //convert the reservation, created, and updated at time and dates to a locale string
      const reservationDate = new Date(
        date + "T" + reservation_time
      ).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const createdAt = new Date(created_at).toLocaleString();
      const updatedAt = new Date(updated_at).toLocaleString();

      return (
        <tr key={reservation_id} className="border-bottom">
          <th scope="row">{index + 1}</th>
          <td>{reservation_id}</td>
          <td>{reservationDate}</td>
          <td>{first_name}</td>
          <td>{last_name}</td>
          <td>{people}</td>
          <td>{mobile_number}</td>
          <td>{createdAt}</td>
          <td>{updatedAt}</td>
        </tr>
      );
    });
    return (
      <table className="table table-hover table-borderless roundedTable table-responsive ">
        <thead className="border-bottom table-success">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Id</th>
            <th scope="col">Time</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">People</th>
            <th scope="col">Mobile #</th>
            <th scope="col">Created At</th>
            <th scope="col">Updated At</th>
          </tr>
        </thead>
        <tbody className="">{tableBody}</tbody>
      </table>
    );
  } else {
    return (
      <p className="text-warning fw-semibold">No Reservations for This Date</p>
    );
  }
}

export default ReservationsTable;
