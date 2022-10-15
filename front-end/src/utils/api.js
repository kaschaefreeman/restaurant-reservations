/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**replacer function to be used to in JSON.stringify.
/*parses the value of people property in a reservation back to a number for db input
/*Also parses the value of capacity property in a table to a number
/* input should be a nested object of {data: yourObject}
* @param nullKey key returned from the input is null
* @param object the value of input of function is the data object
* @returns {Object} returns the formatted object
*/
const replacer = (nullKey, object) => {
  const { data } = object;
  for (let key in data) {
    let value = data[key];
    const parseKeys = ["people", "capacity", "reservation_id"];
    if (parseKeys.includes(key)) {
      data[key] = Number(value);
    }
  }
  return object;
};
/*****************************Reservations API Functions*****************************/
/**
 * Retrieves all existing reservation that are not cancelled or finished status.
 * @returns {Promise<[reservations]>}
 *  a promise that resolves to a possibly empty array of reservations saved in the database.
 */
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves an existing reservation by reservation Id
 * @returns {Promise<reservation>}
 *  a promise that resolves to a possibly empty object of a reservation saved in the database.
 */
export async function readReservations(reservationId, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}`);
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}
/**
 * Creates a new reservation
 * @returns {Promise<reservation>}
 *  a promise that resolves to a an object of a new reservation
 */
export async function createReservation(reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }, replacer),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Updates an existing reservation
 * @returns {Promise<reservation>}
 *  a promise that resolves to a an object of an updated reservation
 */
export async function updateReservation(reservation, reservationId, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: reservation }, replacer),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Updates the status of an existing reservation to cancelled
 * @returns {Promise<reservation>}
 *  a promise that resolves to a an object of a reservation with updated status
 */
export async function cancelReservation(reservationId, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}/status`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: "cancelled" } }),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Retrieves all existing reservations that match a mobile_number.
 * @returns {Promise<[reservations]>}
 *  a promise that resolves to a possibly empty array of reservations saved in the database.
 */
export async function findReservationByMobileNumber(mobile_number, signal) {
  const url = new URL(
    `${API_BASE_URL}/reservations/?mobile_number=${mobile_number}`
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/*****************************Tables API Functions*****************************/
/**
 * Retrieves all existing tables.
 * @returns {Promise<[tables]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database.
 */
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}
/**
 * Creates a new table
 * @returns {Promise<table>}
 *  a promise that resolves to a an object of a new table
 */
export async function createTable(table, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }, replacer),
    signal,
  };
  return await fetchJson(url, options, {});
}

/*****************************Seat API Functions*****************************/

/**
 * Adds the reservation id to the table and changes the reservations status to seated
 * @param {*} tableId the table to be updated with reservation id
 * @param {*} reservation_id the reservation id to be added to table
 * @param {*} signal Abort controller signal
 * @returns {Promise<reservation>} promise resolves with updated reservation
 */
export async function seatTable(tableId, reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(
      { data: { reservation_id: reservation_id } },
      replacer
    ),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Removes the reservation id from the table and changes the reservation status to finished
 * @param {*} tableId table to delete reservation id
 * @param {*} signal abort controller signal
 * @returns {Promise<>} promise resolves with no returned data
 */
export async function unassignSeat(tableId, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
  const options = {
    method: "DELETE",
    headers,
    body: "",
    signal,
  };
  return await fetchJson(url, options, {});
}
