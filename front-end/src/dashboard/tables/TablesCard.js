import React, { useState, useEffect } from "react";
import { listTables } from "../../utils/api";
import ErrorAlert from "../../layout/ErrorAlert";
import TablesTable from "./Tables table";

const TablesCard = () => {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadTables,[])

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <div className="card border-light shadow border-light rounded">
        <div className="card-header bg-warning">

        </div>
        <div className="card-body">
          <h2 className="card-title fs-5 ms-1 text-secondary row">
            Tables
          </h2>
          
          <div className="row">
            <ErrorAlert error={tablesError} />
            <TablesTable tables={tables}/>
          </div>
        </div>
      </div>
  )
};

export default TablesCard;
