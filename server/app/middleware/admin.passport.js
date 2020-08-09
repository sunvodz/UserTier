const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');

const BCRYPT_SALT_ROUNDS = 12;

const jwtSecret = require("../config/auth.config");
const db = require("../models");
const Admin = db.admin;

passport.use('admin_register',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
            session: false,
        },
        (req, username, password, done) => {
            console.log(username);
            console.log(req.body.email);

            try {
                Admin.findOne({
                    $or: [
                        {
                            username,
                        },
                        { email: req.body.email }
                    ],
                }).then(user => {
                    if (user != null) {
                        console.log('username or email already taken');
                        return done(null, false, {
                            message: 'username or email already taken',
                        });
                    }
                    bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
                        Admin.create({
                            username,
                            password: hashedPassword,
                            email: req.body.email,
                        }).then(user => {
                            console.log('user created');
                            return done(null, user);
                        });
                    });
                });
            } catch (err) {
                return done(err);
            }
        },
    ),
);
passport.use('admin_login',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            session: false,
        },
        (username, password, done) => {
            try {
                Admin.findOne({
                    username
                }).then(user => {
                    if (user === null) {
                        return done(null, false, { message: 'bad username' });
                    }
                    bcrypt.compare(password, user.password).then(response => {
                        if (response !== true) {
                            console.log('passwords do not match');
                            return done(null, false, { message: 'passwords do not match' });
                        }
                        console.log('user found & authenticated');
                        return done(null, user);
                    });
                });
            } catch (err) {
                done(err);
            }
        },
    ),
);

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: jwtSecret.secret,
};

passport.use('admin_jwt',
 new JWTStrategy(opts, (jwt_payload, done) => {
    try {
        console.log(jwt_payload)
        Admin.findOne({
            _id: jwt_payload.id,
        }).then(user => {
            if (user) {
                console.log('user found in db in passport');
                done(null, user);
            } else {
                console.log('user not found in db');
                done(null, false);
            }
        });
    } catch (err) {
        done(err);
    }
}),
);