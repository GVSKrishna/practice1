/*jslint node: true */
/*jslint es6 */
/*jshint esversion: 6 */
'use strict';

const Express = require('express');
const router = Express.Router();
const Authenticated = require('../middleware/auth_check');
const User = require('../models/user');

const debug = require('debug')('equipment-api:employee_route');

/* Fetch the current user identified by the token */
router.get('/', Authenticated, (req, res, next) => {

    const user = res.locals.user;
    if (!user) {

        const error = Error('Bad auth');
        error.status = 401;
        next(error);
    }
    else {
        debug(user);
        res.json({
            name: user.name,
            username: user.username,
            jobtitle: user.jobtitle,
            department: user.department
        });
    }
});

/* Update an existing user identified by a token */
router.patch('/', Authenticated, (req, res, next) => {

    // Can update:
    const updateable_properties = [
        'name',
        'jobtitle',
        'department'
    ];

    // Build the update from the allowable list
    const update = {};
    updateable_properties.forEach((property) => {

        debug(req.body[property]);
        if (req.body.hasOwnProperty(property)) {
            update[property] = req.body[property];
        }
    });

    debug('The update is: ', update);

    const user = res.locals.user;
    if (!user) {

        const error = Error('Bad auth');
        error.status = 401;
        next(error);
    }
    else {
        debug(user);
        User.update(
            {
                username: user.username
            },
            update,
            (err) => {

                if (err) {
                    next(err);
                }
                else {
                    res.status(204).end();
                }
            }
        );
    }
});

/* Create a new user */
router.post('/', (req, res, next) => {

    /*{
    'name': 'Katie Wilson',
    'job-title': 'Senior Driver',
    'department': 'Logistics',
    'username': 'kwilson',
    'password': 'nosliwk',
    'role': 'employee'
    }*/

    if (req.body.name &&
        req.body.jobtitle &&
        req.body.department &&
        req.body.username &&
        req.body.password &&
        req.body.role) {

        const user_data = {
            name: req.body.name,
            jobtitle: req.body.jobtitle,
            department: req.body.department,
            username: req.body.username,
            password: req.body.password,
            role: req.body.role
        };

        debug(user_data);

        User.create(user_data, (err, user) => {

            if (err) {
                err.status = 400;
                next(err);
            }
            else {
                res.status(201).end();
            }
        });
    }
    else {
        res.status(400).end();
    }
});

module.exports = router;
