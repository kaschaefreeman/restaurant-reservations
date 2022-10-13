import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { listTables, seatTable } from "../utils/api";
import ErrorAlert from "../../src/layout/ErrorAlert";

const SeatForm = () => {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [seatError, setSeatError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const history = useHistory();

  useEffect(loadTables, []);
  function loadTables() {
    const abortController = new AbortController();
    setSeatError(null);
    listTables(abortController.signal).then(setTables).catch(setSeatError);
    return () => abortController.abort();
  }

  const handleTableChange = ({ target }) => {
    setSelectedTable(target.value);
  };

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
