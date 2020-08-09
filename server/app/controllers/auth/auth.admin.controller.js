const db = require("../../models");
const Admin = db.admin;

const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const jwtSecret = require("../../config/auth.config")

const BCRYPT_SALT_ROUNDS = 12;

// TODO: LoginAdmin
exports.LoginAdmin = (req, res, next) => {
    passport.authenticate('admin_login', (err, users, info) => {
        if (err) {
            console.error(`error ${err}`);
        }
        if (info !== undefined) {
            console.error(info.message);
            if (info.message === 'bad username') {
                res.status(401).send({
                    status: false,
                    message: info.message
                });
            } else {
                res.status(403).send({
                    status: false,
                    message: info.message
                });
            }
        } else {
            req.logIn(users, () => {
                Admin.findOne({
                    username: req.body.username,
                }).then(user => {
                    console.error(user);
                    const token = jwt.sign({ id: user._id }, jwtSecret.secret, {
                        expiresIn: 31556926,
                    });
                    res.status(200).send({
                        status: true,
                        auth: true,
                        _id: user._id,
                        token,
                        message: 'admin account is found & logged in',
                    });
                });
            });
        }
    })(req, res, next);
    //res.json({ message:  })
}

// TODO: REGISTER
exports.Register = (req, res, next) => {
    passport.authenticate('admin_register', (err, user, info) => {
        console.log("Register",req.body)
        if (err) {
            console.error(err);
        }
        if (info !== undefined) {
            console.error(info.message);
            res.status(403).send({
                status: false,
                message: info.message
            });
        } else {
            // eslint-disable-next-line no-unused-vars
            req.logIn(user, error => {
                console.log(user);
                const data = {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    username: user.username
                };
                Admin.findOne({
                    username: data.username,
                }).then(user => {
                    console.log(user);
                    user
                        .update({
                            first_name: data.first_name,
                            last_name: data.last_name,
                            email: data.email
                        })
                        .then(() => {
                            console.log('admin account is created in db');
                            res.status(200).send({
                                status: true,
                                message: 'admin created',
                                user: user
                            });
                        });
                });
            })
        }
    })(req, res, next);
}

// TODO: UpdatePassword
exports.UpdatePassword = (req, res, next) => {
    // passport.authenticate('admin_jwt', { session: false }, (err, user, info) => {
    //     if (err) {
    //         console.error(err);
    //     }
    //     if (info !== undefined) {
    //         console.error(info.message);
    //         res.status(403).send({
    //             status: false,
    //             message: info.message
    //         });
    //     } else {
            Admin.findOne({
                username: req.body.username
            }).then((userInfo) => {
                if (userInfo != null) {
                    console.log('admin account is found in db');
                    bcrypt
                        .hash(req.body.password, BCRYPT_SALT_ROUNDS)
                        .then((hashedPassword) => {
                            userInfo.update({
                                password: hashedPassword,
                            }).then(() => {
                                console.log('admin account updatedPassword');
                                res.status(200).send({
                                    status: true,
                                    auth: true,
                                    message: 'admin account updatedPassword'
                                });
                            });
                        })
                } else {
                    console.error('no user exists in db to update');
                    res.status(404).json({
                        status: false,
                        message: 'no user exists in db to update'
                    });
                }
            });
    //     }
    // })(req, res, next);
};


// TODO: UpdateAdmin
exports.UpdateAdUpdatePasswordViaEmailmin = (req, res, next) => {
    passport.authenticate('admin_jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error(err);
        }
        if (info !== undefined) {
            console.error(info.message);
            res.status(403).send({
                status: false,
                message: info.message
            });
        } else {
            Admin.findOne({
                username: req.body.username
            }).then((userInfo) => {
                if (userInfo != null) {
                    console.log('admin account is found in db');
                    userInfo
                        .update({
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            email: req.body.email,
                            resetPasswordToken: req.body.reset_password_token,
                            resetPasswordExpires: req.body.resetPasswordExpires
                        })
                        .then(() => {
                            console.log('admin account updated');
                            res.status(200).send({
                                status: true,
                                auth: true,
                                message: 'admin account updated'
                            });
                        });
                } else {
                    console.error('no user exists in db to update');
                    res.status(401).send({
                        status: false,
                        message: 'no user exists in db to update'
                    });
                }
            });
        }
    })(req, res, next);
};


// TODO: ForgotPassword
exports.ForgotPassword = (req, res, next) => {
    if (req.body.email === '') {
        res.status(400).send({
            status: false,
            message: 'email required'
        });
    }
    console.error(req.body.email);
    Admin.findOne({
        email: req.body.email
    }).then((user) => {
        if (user === null) {
            console.error('email not in database');
            res.status(403).send({
                status: false,
                message: 'email not in db'
            });
        } else {
            const token = crypto.randomBytes(20).toString('hex');
            console.log("user:",user)

            console.log("token")

            user.updateOne({
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 3600000
            }).then(() => {
                console.log('resetPassword updated');
            });
            console.error(user);
            console.error(Date.now() + 3600000);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 465,
                secure: true,
                auth: {
                    user: `gmail.com`,
                    pass: `pppp`,
                },
            });

            const mailOptions = {
                from: `app`,
                to: `gmail.com`,
                subject: 'Link To Reset Password',
                text:
                    'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                    + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
                    + `http://localhost:3000/resetPassword/${token}\n\n`
                    + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
            };

            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.error('there was an error: ', err);
                } else {
                    console.log('here is the res: ', response);
                    res.status(200).json({
                        status: true,
                        message: 'recovery email sent'
                    });
                }
            });
        }
    });
};

// TODO: ResetPassword
exports.ResetPassword = (req, res, next) => {
    Admin.findOne({
        resetPasswordToken: req.params.resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
    })
        .then((user) => {
            console.log(user);
            if (user == null) {
                console.error('password reset link is invalid or has expired');
                res.status(403).send({
                    status: false,
                    message: 'password reset link is invalid or has expired'
                });
            } else {
                res.status(200).send({
                    status: true,
                    username: user.username,
                    message: 'password reset link a-ok',
                });
            }
        })
    // .catch(err => {
    //     console.error(err);})
};


// TODO: DeleteAdmin
exports.DeleteAdmin = (req, res, next) => {
    passport.authenticate('admin_jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error(err);
        }
        if (info !== undefined) {
            console.error(info.message);
            res.status(403).send({
                status: false,
                message: info.message
            });
        } else {
            Admin.deleteOne({
                username: req.body.username,
            })
                .then((userInfo) => {
                    if (userInfo.n == 1) {
                        console.log('admin account is deleted from db');
                        res.status(200).send({
                            status: true,
                            message: 'admin account is deleted from db'
                        });
                    } else {
                        console.error('user not found in db');
                        res.status(404).send({
                            status: false,
                            message: 'no user with that username to delete'
                        });
                    }
                })
                .catch((error) => {
                    console.error('problem communicating with db');
                    res.status(500).send({
                        status: false,
                        message: error
                    });
                });
        }
    })(req, res, next);
};


// TODO: DeleteTransporter
exports.DeleteTransporter = (req, res, next) => {
    passport.authenticate('admin_jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error(err);
        }
        if (info !== undefined) {
            console.error(info.message);
            res.status(403).send({
                status: false,
                message: info.message
            });
        } else {
            Transporter.deleteOne({
                username: req.body.username,
            })
                .then((userInfo) => {
                    if (userInfo.n == 1) {
                        console.log('transporter account deleted from db');
                        res.status(200).send({
                            status: true,
                            message: 'transporter account deleted from db'
                        });
                    } else {
                        console.error('transporter account not found in db');
                        res.status(404).send({
                            status: false,
                            message: 'no transporter account with that username to delete'
                        });
                    }
                })
                .catch((error) => {
                    console.error('problem communicating with db');
                    res.status(500).send({
                        status: false,
                        message: error
                    });
                });
        }
    })(req, res, next);
};