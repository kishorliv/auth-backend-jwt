require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const validateJwt = require('./_middlewares/auth');
const globalErrorHandler = require('./_middlewares/error-handler');
require('./_db/db');

const environment = process.env.NODE_ENV;
const stage = require('./config')[environment];
const PORT = stage.port;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(validateJwt());

// api routes
app.use('/users', require('./users/user.controller'));

// global error handler
app.use(globalErrorHandler);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
