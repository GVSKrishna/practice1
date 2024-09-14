/*jslint node: true */
/*jslint es6 */
/*jshint esversion: 6 */
'use strict';

const User = require('../models/user');

const debug = require('debug')('equipment-api:auth_check_mw');

module.exports = (req, res, next) => {

    const access_token = req.header('Authorization').split(' ')[1];
    debug('Token: \'%s\'', access_token);

    const rule = {
        token: access_token
    };

    User.findOne(rule)
        .exec(
            (err, user) => {

                if (err) {
                    const error = new Error();
                    error.status = 401;
                    debug('Access denied for %s', access_token);
                    next(error);
                }
                else {
                    res.locals.user = user;
                    debug('Found User: ', user);
                    next();
                }
            }
        );
};
