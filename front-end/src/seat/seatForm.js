import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { listTables, seatTable } from "../utils/api";
import ErrorAlert from "../../src/layout/ErrorAlert";

/**
 * Defines the Seat from used to assign a table a reservation Id and change the reservation status to seated.
 *
 * @returns {JSX.Element} Select input label and box for tables
 */
const SeatForm = () => {
  //get the reservation id from url parameter
  //Used to add the Id to the table in the db
  const { reservation_id } = useParams();
  //Used to set the list of all tables for select options
  const [tables, setTables] = useState([]);
  const [seatError, setSeatError] = useState(null);
  //used to define which table was selected from the options
  const [selectedTable, setSelectedTable] = useState(null);

  //Use history to go to dashboard after submit, and go back on cancel
  const history = useHistory();

  useEffect(loadTables, []);

  /**
   * Helper function that loads all tables from the API
   * Then sets the tables on the component
   */
  function loadTables() {
    const abortController = new AbortController();
    setSeatError(null);
    listTables(abortController.signal).then(setTables).catch(setSeatError);
    return () => abortController.abort();
  }

  /**
   * Form change handler that sets the table selected when the option is changed
   * Need to define the table selected to know which table to update in db
   */
  const handleTableChange = ({ target }) => {
    setSelectedTable(target.value);
  };

  /**
   * Form Submit handler.
   * Submits form data to API to update the table instance with the reservation id and update the reservation status to seated
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await seatTable(selectedTable, reservation_id, abortController.signal);
      history.push("/dashboard");
    } catch (error) {
      setSeatError(error);
    }
    return () => abortController.abort();
  };

  //Variable to maps all tables into the options on a select input element displayed as {table name - table capacity}
  const tableOptions = tables.map((table) => {
    const { table_id, table_name, capacity } = table;
    return (
      <option
        key={table_id}
        value={table_id}
        name={table_name}
      >{`${table_name} - ${capacity}`}</option>
    );
  });

  //Render the form with the select input box and table options
  return (
    <main>
      <h1>Seating Reservation {reservation_id}</h1>
      <form className="shadow-lg p-4 rounded" onSubmit={handleSubmit}>
        <ErrorAlert error={seatError} />
        <div className="form-group row">
          <label htmlFor="table_id" className="col">
            Select Table
          </label>
          <select
            id="table_id"
            name="table_id"
            className="form-control col"
            onChange={handleTableChange}
          >
            <option defaultValue>Select a table</option>
            {tableOptions}
          </select>
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

export default SeatForm;
