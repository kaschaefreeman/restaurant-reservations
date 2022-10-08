import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

const TablesForm = ({ table }) => {
  const history = useHistory();
  const initialFormData = {
    table_name: "",
    capacity: "",
  };
  const [formData, setFormData] = useState({ ...initialFormData });
  const [tablesError, setTablesError] = useState(null)

  useEffect(() => {
    if (table) {
      setFormData({ ...initialFormData, ...table });
    }
  }, [table]);

  const handleFormChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event)=>{
    const abortController = new AbortController();
    event.preventDefault();
    try {
      await createTable(formData, abortController.signal);
      history.push(`/dashboard`);
    } catch (error) {
      setTablesError(error);
    }
    return () => abortController.abort();
  }
  return (
    <main>
      <h1 className="mb-3 mt-3">New Table</h1>
      <form className="shadow-lg p-4 rounded" onSubmit={handleSubmit}>
        <ErrorAlert error={tablesError} />
        <div className="form-group row">
          <label htmlFor="first_name" className="col-3">
            Table Name
          </label>
          <input
            id="table_name"
            type="text"
            name="table_name"
            className="form-control col"
            placeholder="Enter Name of Table"
            value={formData.table_name}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="form-group row">
          <label htmlFor="capacity" className="col-3">
            Capacity
          </label>
          <input
            id="capacity"
            name="capacity"
            type="text"
            className="form-control col"
            placeholder="Enter Capacity of Table"
            value={formData.capacity}
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

export default TablesForm;