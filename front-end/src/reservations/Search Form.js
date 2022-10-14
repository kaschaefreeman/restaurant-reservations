import React, { useState } from "react";
import { findReservationByMobileNumber } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsTable from "../dashboard/reservations/Reservations Table";

/**
 * Defines the Search from used to find reservations given a mobile number.
 *
 * @returns {JSX.Element} Search input label and box for Mobile number with matching reservations in table below
 */
const SearchReservationForm = () => {
  const [reservations, setReservations] = useState([]);
  const [searchError, setSearchError] = useState(null);
  //Used to conditionally render reservations info table if submit was clicked and/or form input is being entered
  const [submitClicked, setSubmitClicked] = useState(false);
  const [formData, setFormData] = useState({ mobile_number: "" });

  /**
   * Form change handler.  Sets form data key matching the name of the elements name to the value of the elements value
   * Will also set submit clicked to false since the input is being changed.  This will hide the reservations table until submit is clicked
   * @param target the events target element
   */
  const handleFormChange = ({ target }) => {
    setSubmitClicked(false);
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  /**
   * Form Submit handler.
   * Submits form data to API to get all reservation instances in the db matching the mobile number entered in the form.
   */
  const handleSubmit = async (event) => {
    const abortController = new AbortController();
    event.preventDefault();
    try {
      const response = await findReservationByMobileNumber(
        formData.mobile_number
      );
      await response;
      setReservations(response);
      setSubmitClicked(true);
    } catch (error) {
      setSearchError(error);
    }
    return () => abortController.abort();
  };

  //declare variable to render the reservations table.  
  let reservationsInfo;

  //conditionally set the HTML to render in the variable if submit is clicked.  If not clicked return null
  if (submitClicked) {
    //if clicked and reservations were found, render the reservations table
    if (reservations.length) {
      reservationsInfo = (
        <div className="card shadow-lg p-4 mt-3 rounded">
          <ReservationsTable reservations={reservations} />
        </div>
      );
    } else {
      //Else display heading "No reservations found"
      reservationsInfo = (
        <div className="card shadow-lg p-4 mt-3 rounded">
          <h2 className="text-warning">No reservations found</h2>
        </div>
      );
    }
  } else reservationsInfo = null;

  //Return a form with input for mobile number, and then render the table of reservations found with the given mobile number
  return (
    <main>
      <h1 className="mb-3 mt-3">Search For Reservation</h1>
      <form className="shadow-lg p-4 rounded" onSubmit={handleSubmit}>
        <ErrorAlert error={searchError} />
        <div className="form-group row">
          <label htmlFor="mobile_number" className="col-2">
            Mobile Number
          </label>
          <input
            id="mobile_number"
            type="text"
            name="mobile_number"
            className="form-control col"
            placeholder="Enter First Name"
            value={formData.mobile_number}
            onChange={handleFormChange}
          />
          <button type="submit" className="btn btn-primary mx-3 col-2 ">
            Submit
          </button>
        </div>
      </form>
      {reservationsInfo}
    </main>
  );
};

export default SearchReservationForm;
