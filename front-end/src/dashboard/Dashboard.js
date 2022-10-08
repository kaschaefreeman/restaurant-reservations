import React from "react";
import "./Dashboard.css";
import ReservationsCard from "./reservations/Reservations Card";
import TablesCard from "./tables/TablesCard";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
 

  /*Return JSX Dashboard heading with bootstrap card below
   **Card will display the date selected (today's date by default)
   **With buttons to go to previous, today, and next date
   **And a table below with all reservations for specified date
   */
  return (
    <main>
      <h1 className="mb-3 mt-3">Dashboard</h1>
      <article className="row">
        <section className="col col-lg-7">
          <ReservationsCard date={date}/>
        </section>
        <section className="col mt-4 mt-lg-0 col-lg-5">
          <TablesCard/>
        </section>
      </article>
      
    </main>
  );
}

export default Dashboard;
