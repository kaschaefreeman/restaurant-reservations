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
  /*Return JSX Dashboard heading with bootstrap card with reservations and card with tables below*/
  return (
    <main>
      <h1 className="mb-3 mt-3">Dashboard</h1>
      <article className="row">
        <section className="col-12 col-lg-8">
          <ReservationsCard date={date} />
        </section>
        <section className="col-12 mt-4 mt-lg-0 col-lg-4">
          <TablesCard />
        </section>
      </article>
    </main>
  );
}

export default Dashboard;
