import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { listTables, unassignSeat } from "../../utils/api";
import ErrorAlert from "../../layout/ErrorAlert";
import TablesTable from "./Tables table";

const TablesCard = () => {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  //use history to push path to dashboard once the finish button is clicked.
  //Needed since updating the table as finished marks reservation as finished and will need to load reservations again
  const history = useHistory();

  useEffect(loadTables, []);

  //helper function that makes call to API to load the tables and set the tables on the component
  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }
  /**Click handler for finish button on a table's row. Will ask to confirm before continuing
   * On Ok, makes call to api to remove the reservation id and mark table free by function on tables table component
   * @param {Event} event is the event in the DOM
   **/
  const handleFinishClick = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    //Prompt to confirm before removing current reservation assignment
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      //On Confirm, try call to API and catch errors
      try {
        await unassignSeat(event.target.id, abortController.signal);
        history.go("/dashboard");
      } catch (error) {
        setTablesError(error);
      }
    }
    return () => abortController.abort();
  };

  //Render bootstrap card with a table of all tables
  return (
    <div className="card border-light shadow border-light rounded">
      <div className="card-header bg-warning"></div>
      <div className="card-body">
        <h2 className="card-title fs-5 ms-1 text-secondary row">Tables</h2>
        <TablesTable tables={tables} handleFinishClick={handleFinishClick} />
        <ErrorAlert error={tablesError} />
      </div>
    </div>
  );
};

export default TablesCard;
