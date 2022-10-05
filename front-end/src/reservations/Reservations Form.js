import React from "react";

/**
 * Defines the Reservations from used to edit and create new reservations.
 *
 * @returns {JSX.Element}
 */
const ReservationsForm = () => {
  // const [formData, setFormData] = useState({
  //   first_name: "",
  //   last_name: "",
  //   mobile_number: "",
  //   reservation_date: "",
  //   people: 1,
  //   reservation_time: "",
  // });

  return (
    <main>
      <h1>Reservation</h1>
      <form className="shadow-lg p-4 rounded">
        <div className="form-group row">
          <label htmlFor="first_name" className="col-3">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            className="form-control col"
            placeholder="Enter First Name"
          />
          </div>
          <div className="form-group row">
            <label htmlFor="last_name" className="col-3">
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              className="form-control col"
              placeholder="Enter Last Name"
            />
          </div>
          <div className="form-group row">
            <label htmlFor="mobile_number" className="col-3">
              Mobile Number
            </label>
            <input
              id="mobile_number"
              type="text"
              className="form-control col"
              placeholder="Enter Mobile Number"
            />
          </div>
          <div className="form-group row">
            <label htmlFor="reservation_date" className="col-3">
              Reservation Date
            </label>
            <input
              id="reservation_date"
              type="date"
              className="form-control col"
              placeholder="Enter Desired Date of Reservation"
            />
          </div>
          <div className="form-group row">
            <label htmlFor="people" className="col-3">
              Number of People
            </label>
            <input
              id="people"
              type="text"
              className="form-control col"
              placeholder="Enter Number of People Needing to be Seated"
            />
          </div>
      </form>
    </main>
  );
};

export default ReservationsForm;
