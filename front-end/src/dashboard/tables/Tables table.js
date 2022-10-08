import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const TablesTable = ({ tables, handleFinishClick}) => {

    const history = useHistory()
  /**Click handler for finish button on a table's row.
   * Will make call to api to remove the reservation id and mark table free
   * @param {Event} event is the event in the DOM
   **/


  /********************Declare tableRows by mapping through each table**********************/
  const tableRows = tables.map((table, index) => {
    const { table_id, table_name, capacity, reservation_id } = table;
    //Conditionally state the status of a table.
    const status = reservation_id ? "occupied" : "free";
    //Variable that renders a finish Button to unassign reservation Id
    const finishButton =
      status === "occupied" ? (
        <button
          data-table-id-finish={table_id}
          type="button"
          onClick={handleFinishClick}
          className="btn btn-sm btn-primary"
          id={`${table_id}`}
        >
          Finish
        </button>
      ) : null;
    // Return the table row for each table instance with the id, name, capacity, status, and finish button
    return (
      <tr scope="row">
        <td>{table_id}</td>
        <td>{table_name}</td>
        <td>{capacity}</td>
        <td
          className={status == "free" ? "text-success" : null}
          data-table-id-status={table_id}
        >
          {status}
        </td>
        <td>{finishButton}</td>
      </tr>
    );
  });
  /*************************** END - Declare tableRows ****************************************/

  //Component renders a table with each table instance row
  return (
    <div className="table-responsive">
      <table className="table table-sm table-borderless">
        <thead className="text-secondary">
          <th scope="col">Id</th>
          <th scope="col">Name</th>
          <th scope="col">Capacity</th>
          <th scope="col">Status</th>
          <th></th>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
};

export default TablesTable;
