const fetch = require("cross-fetch");
const { response } = require("../../back-end/src/app");

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = { "Content-Type": "application/json" };

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
    const response = await fetch(url, options)
      .then((resp) => {
        const cookie = resp.headers.get('set-cookie')
        if(cookie) headers['cookie'] = cookie
        return resp
      });

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

async function getCSRF() {
  const url = new URL(`${API_BASE_URL}/csrf`)
  return await fetchJson(url, {
    method: 'GET',
    credentials: "include"
  }, [])
}

/**
 * Creates a new reservation
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to the newly created reservation.
 */
async function createReservation(reservation, signal) {
  const csrfResponse = await getCSRF()
  headers['x-csrf-token'] = await csrfResponse
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
    credentials: 'include'
  };
  return await fetchJson(url, options, reservation);
}

/**
 * Creates a new table
 * @returns {Promise<[table]>}
 *  a promise that resolves to the newly created table.
 */
async function createTable(table, signal) {
  const csrfResponse = await getCSRF()
  headers['x-csrf-token'] = csrfResponse
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
    credentials: 'include'
  };
  return await fetchJson(url, options, table);
}

async function seatReservation(reservation_id, table_id) {
  const csrfResponse = await getCSRF()
  headers['x-csrf-token'] = csrfResponse
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { reservation_id } }),
    headers,
    credentials: 'include'
  };
  return await fetchJson(url, options, {});
}

module.exports = {
  createReservation,
  createTable,
  seatReservation,
  getCSRF
};
