/*jslint node: true */
/*jslint es6 */
/*jshint esversion: 6 */
'use strict';

const Express = require('express');
const router = Express.Router();

const User = require('../models/user');
const Uuid = require('uuid/v4');

const debug = require('debug')('equipment-api:auth_route');

router.post('/token', (req, res, next) => {

    if (req.body === null || req.body === undefined) {
        return res.status(400).end();
    }

    debug(req.body);

    const username = req.body.username || null;
    const password = req.body.password || null;
    const scope = req.body.scope || null;

    if (username !== null &&
        password !== null &&
        scope !== null) {

        User.authenticate(username, password, scope, (error, user) => {

            if (error) {
                next(error);
            }
            else {
                // User is authenticated, so update the token *if*
                // the scope they asked for matches
                debug('We found this user: ', user);
                debug('User\'s scope:', user.role);
                debug('Request\'s scope:', scope);

                if (user.role === scope) {

                    const new_token = Buffer.from(Uuid()).toString('base64');
                    debug('New token is %s', new_token);

                    User.update(
                        {
                            username,
                            role: scope
                        },
                        {
                            token: new_token
                        },
                        (err) => {

                            if (err) {
                                res.next(err);
                            }
                            else {
                                res.json({ access_token: new_token });
                            }
                        }
                    );
                }
                else {
                    res.status(401).end();
                }
            }
        });
    }
    else {
        res.status(400).end();
    }


});


module.exports = router;
