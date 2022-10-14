import React from "react";

/**
 * Defines the Table displays the tables. Will be used on the dashboard
 * @param tables the array of table objects to be displayed in table format.
 * @param handleFinishClick the click handler function that will dictate actions when the finishButton next to each table is clicked.  Should remove reservation Id and change the reservation status to finished
 * @returns {JSX.Element} Table of tables listed by Table Name, capacity, and status (table status is dictated by if reservation id is listed in instance or not) and a button to finish the reservation
 */
const TablesTable = ({ tables, handleFinishClick }) => {
  /********************Declare tableRows by mapping through each table**********************/
  const tableRows = tables.map((table) => {
    const { table_id, table_name, capacity, reservation_id } = table;
    //Conditionally state the status of a table. If reservation id listed in table instance then it is occupied, else it is free
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

    // Return the table row for each table instance with the name, capacity, status, and finish button
    return (
      <tr key={table_id}>
        <td>{table_name}</td>
        <td>{capacity}</td>
        <td
          className={status === "free" ? "text-success" : null}
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
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
};

export default TablesTable;
