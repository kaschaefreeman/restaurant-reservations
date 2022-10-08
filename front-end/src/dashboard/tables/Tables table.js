const TablesTable = ({ tables }) => {
  const tableRows = tables.map((table, index) => {
    const { table_id, table_name, capacity, reservation_id } = table;
    const status = reservation_id ? "Occupied" : "Free";
    return (
      <tr scope="row">
        <td>{table_id}</td>
        <td>{table_name}</td>
        <td>{capacity}</td>
        <td
          data-table-id-status={table_id}
          className={status == "Free" ? "text-success" : null}
        >
          {status}
        </td>
      </tr>
    );
  });

  return (
    <div className="table-responsive">
      <table className="table table-sm table-borderless">
        <thead className="text-secondary">
          <th scope="col">Id</th>
          <th scope="col">Name</th>
          <th scope="col">Capacity</th>
          <th scope="col">Status</th>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
};

export default TablesTable;
