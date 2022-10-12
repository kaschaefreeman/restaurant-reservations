import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  createReservation,
  readReservations,
  updateReservation,
} from "../utils/api";
import { formatAsDate, formatAsTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import InputMask from "react-input-mask";
import { useParams } from "react-router-dom";

/**
 * Defines the Reservations from used to edit and create new reservations.
 *
 * @returns {JSX.Element}
 */
const ReservationsForm = () => {
  const [reservationsError, setReservationsError] = useState(null);
  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    people: 1,
    reservation_time: "",
    status: "booked",
  };

  const [formData, setFormData] = useState({});

  const history = useHistory();
  
  const { reservation_id } = useParams({ ...initialFormData });
  const heading = reservation_id ? 'Edit Reservation' : 'New Reservation'
  console.log(reservation_id);

  function loadReservation(reservationId) {
    const abortController = new AbortController();
    setReservationsError(null);
    readReservations(reservationId, abortController.signal)
      .then(setFormData)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  console.log(formData);
  useEffect(() => {
    if (reservation_id) {
      loadReservation(reservation_id);
    }
  }, []);

  const handleFormChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    const abortController = new AbortController();
    const { reservation_date, reservation_time } = formData;
    event.preventDefault();
    setFormData((curr) => {
      curr.reservation_date = formatAsDate(reservation_date);
      curr.reservation_time = formatAsTime(reservation_time);
      return curr;
    });
    if (reservation_id) {
      delete formData.reservation_id;
      delete formData.created_at;
      delete formData.updated_at;
    }
    try {
      reservation_id
        ? await updateReservation(
            formData,
            reservation_id,
            abortController.signal
          )
        : await createReservation(formData, abortController.signal);
      history.push(`/dashboard?date=${reservation_date}`);
    } catch (error) {
      setReservationsError(error);
    }
    return () => abortController.abort();
  };

  return (
    <main>
      <h1 className="mb-3 mt-3">{heading}</h1>
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
          <InputMask
            mask="999-999-9999"
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
          <button type="submit" className="btn btn-primary mx-3 col-2 ">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-danger mx-3 col-2 "
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
