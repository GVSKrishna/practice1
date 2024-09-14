/*jslint node: true */
/*jslint es6 */
/*jshint esversion: 6 */
'use strict';

const Mongoose = require('mongoose');
const BCrypt = require('bcrypt');

/*{
    'name': 'Katie Wilson',
    'job-title': 'Senior Driver',
    'department': 'Logistics',
    'username': 'kwilson',
    'password': 'nosliwk',
    'role': 'employee'
}*/

const UserSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    jobtitle: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    }
});

UserSchema.statics.authenticate = (username, password, scope, callback) => {

    User.findOne({
        username
    })
        .exec((err, user) => {

            if (err) {
                callback(err);
            }
            else if (!user) {
                const err = Error();
                err.status = 401;
                callback(err);
            }
            else {

                // Otherwise, check the password:
                BCrypt.compare(password, user.password, (err, result) => {

                    if (err) {
                        callback(err);
                    }
                    else if (result === true) {
                        callback(null, user);
                    }
                    else {
                        const err = Error();
                        err.status = 401;
                        callback(err);
                    }
                });
            }
        });
};

//Hash the password before saving it to the database
UserSchema.pre('save', function (next) {

    BCrypt.hash(this.password, 10, (err, hash) => {

        if (err) {
            return next(err);
        }
        this.password = hash;
        next();
    });
});

const User = Mongoose.model('User', UserSchema);
module.exports = User;
