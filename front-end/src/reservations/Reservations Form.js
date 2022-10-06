import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import { formatAsDate, formatAsTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
/**
 * Defines the Reservations from used to edit and create new reservations.
 *
 * @returns {JSX.Element}
 */
const ReservationsForm = ({ reservation }) => {
  const history = useHistory();

  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    people: 1,
    reservation_time: "",
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(() => {
    if (reservation) {
      setFormData({ ...initialFormData, ...reservation });
    }
  }, [reservation]);

  const handleFormChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const findErrors = (date, time, errors) => {
    const setDate = new Date(`${date}T${time}`);
    const now = new Date();
    if (setDate.getDay() === 2) {
      errors.push("Restaurant is closed on Tuesdays");
    }
    if (setDate < now) {
      errors.push("Requested date must be a future date");
    }
  };

  const handleSubmit = async (event) => {
    const abortController = new AbortController();
    const errors = [];
    const { reservation_date, reservation_time, people } = formData;
    event.preventDefault();
    findErrors(reservation_date, reservation_time, errors);
    if (errors.length) {
      setReservationsError({ message: errors.join(" , ") });
      return;
    }
    setFormData((curr) => {
      curr.reservation_date = formatAsDate(reservation_date);
      curr.reservation_time = formatAsTime(reservation_time);
      return curr;
    });
    try {
      await createReservation(formData, abortController.signal);
      history.push(`/dashboard?date=${reservation_date}`);
    } catch (error) {
      setReservationsError(error);
    }
    return () => abortController.abort();
  };

  return (
    <main>
      <h1 className="mb-3 mt-3">New Reservation</h1>
      <form className="shadow-lg p-4 rounded" onSubmit={handleSubmit}>
        <ErrorAlert error={reservationsError} />
        <div className="form-group row">
          <label htmlFor="first_name" className="col-3">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            className="form-control col"
            placeholder="Enter First Name"
            value={formData.first_name}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="form-group row">
          <label htmlFor="last_name" className="col-3">
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            className="form-control col"
            placeholder="Enter Last Name"
            value={formData.last_name}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="form-group row">
          <label htmlFor="mobile_number" className="col-3">
            Mobile Number
          </label>
          <input
            id="mobile_number"
            name="mobile_number"
            type="tel"
            className="form-control col"
            placeholder="012-345-6789"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            value={formData.mobile_number}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="form-group row">
          <label htmlFor="reservation_date" className="col-3">
            Reservation Date
          </label>
          <input
            id="reservation_date"
            name="reservation_date"
            type="date"
            className="form-control col"
            placeholder="Enter Desired Date of Reservation"
            value={formData.reservation_date}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="form-group row">
          <label htmlFor="reservation_time" className="col-3">
            Reservation Time
          </label>
          <input
            id="reservation_time"
            name="reservation_time"
            type="time"
            className="form-control col"
            value={formData.reservation_time}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="form-group row">
          <label htmlFor="people" className="col-3">
            Number of People
          </label>
          <input
            id="people"
            name="people"
            min="1"
            type="number"
            className="form-control col"
            placeholder="Enter Number of People Needing to be Seated"
            value={formData.people}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="form-group row justify-content-end">
          <button type="submit" className="btn btn-primary mx-3 col-1">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-danger mx-3 col-1"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
};

export default ReservationsForm;
