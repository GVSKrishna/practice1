/*jslint node: true */
/*jslint es6 */
/*jshint esversion: 6 */
'use strict';

const Express = require('express');
const Logger = require('morgan');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');

const debug = require('debug')('equipment-api:main');

// Connect to MongoDB
//connect to MongoDB
Mongoose.connect('mongodb://mongodb/testForAuth');
const DB = Mongoose.connection;

//handle mongo error
DB.on('error', console.error.bind(console, 'connection error:'));
DB.once('open', () => {
    // we're connected!
    debug('Database connection open');
});


const Auth = require('./routes/auth');
const Equipment = require('./routes/equipment');
const Employee = require('./routes/employees');

const app = Express();

app.use(Logger('dev'));
app.use(BodyParser.json());

app.use('/auth', Auth);
app.use('/equipment', Equipment);
app.use('/employee', Employee);

// catch 404 and forward to error handler
app.use((req, res, next) => {

    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    debug(err);

    // render the error page
    res.status(err.status || 500);
    res.end();
});

module.exports = app;
