import React from "react";
import "./ReservationsTable.css";
import { useLocation } from "react-router";

/**
 * Defines the Table displays the reservations. Will be used on the dashboard and the search components
 * @param reservations the array of reservation objects to be displayed in the table.
 * @param handleCancelClick the click handler function that will dictate actions when the cancelButton next to each reservation is clicked
 * @returns {JSX.Element} Table of reservations listed by Date/Time, First Name, Last name, Mobile Number, People, Status, and buttons for Seat, Edit, and Cancel
 */
function ReservationsTable({ reservations, handleCancelClick }) {
  //Get the current path to dictate how table will be displayed.
  //Table will be used on the Search Form and the Dashboard and will have different layouts depending on the current path
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

      /***************Declare the buttons for each reservation*******************/
      //The actions for each reservation are Seat, Edit, and cancel.
      //Seat and Edit will be in a dropdown button labeled Actions and Cancel will be a red icon button

      //drop down option used to seat reservation at a table.  Links to Seat Form component
      const seatButton = (
        <a
          href={`/reservations/${reservation_id}/seat`}
          className="dropdown-item"
        >
          Seat
        </a>
      );

      //drop down option that links to the reservation form to edit the reservation
      //The option will be available only if the reservation is booked or cancelled.
      //May not edit reservations that are seated or finished.
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
      //Button that will cancel the reservation.  Will be disabled if status is not booked.
      const cancelButton = (
        <button
          className={
            status === "booked"
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
      /*****************RETURN THE RESERVATION PROPERTIES MAPPED TO A TABLE ROW FOR EACH RESERVATION*********************/
      /*Reservation Rows mapped to table with data as follows: 
      /*TIME   FIRST NAME   LAST NAME   MOBILE NUMBER   PEOPLE   STATUS   ACTIONS{drop down button}/CANCEL 
      * Time will be Date with Time on Search component
      */
      return (
          <tr
            key={reservation_id}
            id={reservation_id}
            className="border-bottom"
          >
            <td className="text-nowrap">
              {path === "/search" ? reservationDate : reservationTime}
            </td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td className="text-nowrap">{mobile_number}</td>
            <td className="text-center">{people}</td>
            <td data-reservation-id-status={reservation_id}>{status}</td>
            {/* Table data column of the button group for Actions (dropdown with seat and edit links) and the cancel button
             * The Action drop down button will only display if the reservation is not in status of finished */}
            <td>
              {status !== "finished" ? (
                <div
                  className="btn-group btn-group-sm"
                  role="group"
                  aria-label="Basic example"
                >
                  <div className="btn-group dropstart">
                    <button
                      className="btn btn-sm btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Actions
                    </button>
                    <div className="dropdown-menu">
                      {/*seat button only displays if status is booked.  Can only change a booked reservation to seated*/}
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
      );
    });
    /************************************************************************************************************/
    /***Render the Table With the mapped reservation rows
     * Table will display as follows:
     * TIME      FIRST     LAST      MOBILE        PEOPLE   STATUS   EDIT/CANCEL
     * 07:30 PM  Kaschae   Freeman   555-555-5555    2      booked   Actions->Seat, Edit | X (cancel)
     * ** Time will be date with time on search path
     */
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
