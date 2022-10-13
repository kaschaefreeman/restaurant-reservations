import React, { useState } from "react";
import { findReservationByMobileNumber } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsTable from "../dashboard/reservations/Reservations Table";

const SearchReservationForm = () => {
  const [reservations, setReservations] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [formData, setFormData] = useState({ mobile_number: "" });

  const handleFormChange = ({ target }) => {
    setSubmitClicked(false);
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };
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

  let reservationsInfo;

  if (submitClicked) {
    if (reservations.length) {
      reservationsInfo = (
        <div className="card shadow-lg p-4 mt-3 rounded">
          <ReservationsTable reservations={reservations} />
        </div>
      );
    } else {
      reservationsInfo = (
        <div className="card shadow-lg p-4 mt-3 rounded">
          <h2 className="text-warning">No reservations found</h2>
        </div>
      );
    }
  } else reservationsInfo = null;

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
