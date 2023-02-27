const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const cookieParser = require('cookie-parser')

/**** Token libraries and configs ****/

/** JWT Passport Config */
const passport = require("passport");
require("./utils/JWT/passport-config")(passport);

/** Double CSRF Config */
const { doubleCsrf } = require("csrf-csrf");
const { doubleCsrfOptions } = require('./utils/double-csrf/double-csrf-config');
const {
    generateToken, // Use this in your routes to provide a CSRF hash cookie and token.
    doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf(doubleCsrfOptions);
/**************************************/

/**** Routes ****/
const reservationsRouter = require("./reservations/reservations.router");
const tablesRouter = require("./tables/tables.router");
const usersRouter = require("./users/users.router");
/****************/

/**** Errors ****/
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
/****************/


const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    credentials: true,
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_BASE_URL : 'http://localhost:3000',
    allowedHeaders: 'x-csrf-token, content-type'
}));

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.use(passport.initialize());

app.get('/csrf', (req, res, next) => {
    const token = generateToken(res)
    res.status(200).json({ data: token })
});

app.use("/reservations", doubleCsrfProtection, reservationsRouter);
app.use("/tables", doubleCsrfProtection, tablesRouter);
app.use("/users", doubleCsrfProtection, usersRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
