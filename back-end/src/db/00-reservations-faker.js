const { faker: { name, datatype, phone, date } } = require('@faker-js/faker')
const timeFormat = /\d\d:\d\d/;
/**
 * Formats a Date object as YYYY-MM-DD.
 *
 * This function is *not* exported because the UI should generally avoid working directly with Date instance.
 * You may export this function if you need it.
 *
 * @param date
 *  an instance of a date object
 * @returns {string}
 *  the specified Date formatted as YYYY-MM-DD
 */
function asDateString(date) {
    return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
      .toString(10)
      .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
  }

/**
 * Format a time string in HH:MM:SS format (which is what is returned from PostgreSQL) as HH:MM.
 * @param timeString
 *  HH:MM:SS time string
 * @returns {*}
 *  the specified time string formatted as YHH:MM.
 */
function formatAsTime(timeString) {
    return timeString.match(timeFormat)[0];
  }

const generateReservations = () =>{
    const reservations = []
    for (let i = 0; i <= 100; i++) {
        const reservation = {
            first_name: name.firstName(),
            last_name: name.lastName(),
            mobile_number: phone.number('###-###-####'),
            reservation_date: asDateString(date.between('2023-02-15T00:00:00.000Z', '2023-06-30T00:00:00.000Z')),
            reservation_time: formatAsTime(datatype.datetime().toString()),
            people: datatype.number(8),
        }
        reservations.push(reservation)
    }
    return reservations
}


const fakerReservations = generateReservations()

module.exports = {fakerReservations}