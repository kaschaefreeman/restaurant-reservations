import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  createReservation,
  readReservations,
  updateReservation,
} from "../utils/api";
import { formatAsDate, formatAsTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import InputMask from "comigo-tech-react-input-mask"
import { useParams } from "react-router-dom";
import handleFormChange from "../utils/handleFormChange";

/**
 * Defines the Reservations from used to edit and create new reservations.
 *
 * @returns {JSX.Element} Form with input labels and fields for the First Name, Last Name, Mobile Number, Date, Time, and people 
 */
const ReservationsForm = () => {
  const [reservationsError, setReservationsError] = useState(null);
  const initialFormData = {
    first_name: "", 
    last_name: "", 
    mobile_number: "", 
    reservation_date: "",
    reservation_time: "",
    people: 1, 
    status: "booked"
  }

  const [formData, setFormData] = useState({...initialFormData});

  //Use history to push dashboard to date of the reservation that is created/edited or go back a page on cancel of form input
  const history = useHistory();

  //get the reservation id from url parameter if available.
  //Will be used to read the reservation from API and load its data to the form for editing.
  const { reservation_id } = useParams();

  //If there is a reservation to be edited change the heading of the page
  const heading = reservation_id ? "Edit Reservation" : "New Reservation";

  /**
   * Helper function that makes call to api to read a reservation by the reservation id that is given in the url parameter.
   * Will then load the reservations information onto the form
   * @param reservationId - the id of a reservation instance.  Should be given from the url parameter
   */
  function loadReservation(reservationId) {
    const abortController = new AbortController();
    setReservationsError(null);
    readReservations(reservationId, abortController.signal)
      .then(setFormData)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  //On mount and change of the reservation id load the reservation
  useEffect(() => {
    if (reservation_id) {
      loadReservation(reservation_id);
    }
  }, [reservation_id]);

  /**
   * Form change handler.  Sets form data key matching the name of the elements name to the value of the elements value
   * @param target the events target element
   */
  const handleReservationFormChange = ({ target }) => {
    handleFormChange(formData,setFormData,target)
  };

  /**
   * Form Submit handler.
   * Submits form data to API to create or update the reservation instance in the db.
   */
  const handleSubmit = async (event) => {
    const abortController = new AbortController();
    const { reservation_date, reservation_time } = formData;
    event.preventDefault();
    //format the reservation date and time to match the input in the database
    setFormData((curr) => {
      curr.reservation_date = formatAsDate(reservation_date);
      curr.reservation_time = formatAsTime(reservation_time);
      return curr;
    });
    try {
      //if there is a reservation id then the reservation with the specified id is to be edited
      reservation_id
        ? await updateReservation(
            formData,
            reservation_id,
            abortController.signal
          )
        : //If not, then this is a new reservation instance needed to be created
          await createReservation(formData, abortController.signal);
      //on completion of the update or create action, go to the dashboard with the date of the reservation date
      history.push(`/dashboard?date=${reservation_date}`);
    } catch (error) {
      setReservationsError(error);
    }
    return () => abortController.abort();
  };
  //Variable that renders the form label and select type input to chang the status of a reservation
  //Needed to conditionally render this input only if the reservation status needed to be changed from booked to cancelled and vice versa
  const statusFormField = (
    <div className="form-group row">
      <label htmlFor="status" className="col-4">
        Reservation Status
      </label>
      <select
        id="status"
        name="status"
        className="form-control col"
        onChange={handleReservationFormChange}
        value={formData.status}
      >
        <option value="booked">booked</option>
        <option value="cancelled">cancelled</option>
      </select>
    </div>
  );

  return (
    <main>
      <h1 className="mb-3 mt-3">{heading}</h1>
      <form className="shadow-lg p-4 rounded" onSubmit={handleSubmit}>
        <ErrorAlert error={reservationsError} />
        <div className="form-group row">
          <label htmlFor="first_name" className="col-4">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            className="form-control col"
            placeholder="Enter First Name"
            value={formData.first_name}
            onChange={handleReservationFormChange}
            required
          />
        </div>
        <div className="form-group row">
          <label htmlFor="last_name" className="col-4">
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            className="form-control col"
            placeholder="Enter Last Name"
            value={formData.last_name}
            onChange={handleReservationFormChange}
            required
          />
        </div>
        <div className="form-group row">
          <label htmlFor="mobile_number" className="col-4">
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
            onChange={handleReservationFormChange}
            required
          />
        </div>
        <div className="form-group row">
          <label htmlFor="reservation_date" className="col-4">
            Reservation Date
          </label>
          <input
            id="reservation_date"
            name="reservation_date"
            type="date"
            className="form-control col"
            placeholder="Enter Desired Date of Reservation"
            value={formData.reservation_date}
            onChange={handleReservationFormChange}
            required
          />
        </div>
        <div className="form-group row">
          <label htmlFor="reservation_time" className="col-4">
            Reservation Time
          </label>
          <input
            id="reservation_time"
            name="reservation_time"
            type="time"
            className="form-control col"
            value={formData.reservation_time}
            onChange={handleReservationFormChange}
            required
          />
        </div>
        <div className="form-group row">
          <label htmlFor="people" className="col-4">
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
            onChange={handleReservationFormChange}
            required
          />
        </div>
        {formData.status !== "cancelled" ? null : statusFormField}
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
