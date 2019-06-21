const express = require ('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

const port = 8000;

app.use(logger('dev'));
app.use(bodyParser.json());
// to process URL in encoded form on its own
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

require('./app/routes')(app, {});

app.listen(port, () => {
    console.log("We are live in port " + port);
})
