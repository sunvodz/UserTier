const db = require("../models");
const Admin = db.admin;
const passport = require("passport");

// !! Admin
// TODO: FindAdmin
exports.FindAdmin = (req, res, next) => {
  passport.authenticate("admin_jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      console.log(info.message);
      res.status(401).send({
        status: false,
        message: info.message,
      });
    } else if (user) {
      Admin.findOne({
        username: user.username,
      }).then((userInfo) => {
        if (userInfo != null) {
          console.log("admin account is found in db from findUsers");
          res.status(200).send({
            status: true,
            auth: true,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            username: userInfo.username,
            password: userInfo.password,
            message: "admin account is found in db",
          });
        } else {
          console.error("no user exists in db with that username");
          res.status(401).send({
            status: false,
            message: "no user exists in db with that username",
          });
        }
      });
    } else {
      console.error("jwt id and username do not match");
      res.status(403).send({
        status: false,
        message: "username and jwt token do not match",
      });
    }
  })(req, res, next);
};

// TODO: UpdateAdmin
exports.UpdateAdmin = (req, res, next) => {
  passport.authenticate("admin_jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.error(err);
    }
    if (info !== undefined) {
      console.error(info.message);
      res.status(403).send({
        status: false,
        message: info.message,
      });
    } else {
      Admin.findOne({
        username: req.body.username,
      }).then((userInfo) => {
        if (userInfo != null) {
          console.log("admin account is  found in db");
          userInfo
            .update({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
            })
            .then(() => {
              console.log("admin account updated");
              res.status(200).send({
                status: true,
                auth: true,
                message: "admin account updated",
              });
            });
        } else {
          console.error("no user exists in db to update");
          res.status(401).send({
            status: false,
            message: "no user exists in db to update",
          });
        }
      });
    }
  })(req, res, next);
};

// TODO: FIND
exports.Find = (req, res, next) => {
  passport.authenticate("admin_jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      console.log(info.message);
      res.status(401).send({
        status: false,
        message: info.message,
      });
    } else if (user) {
      Admin.findOne({
        username: user.username,
      }).then((userInfo) => {
        if (userInfo != null) {
          console.log("admin account is found in db from findUsers");
          res.status(200).send({
            status: true,
            auth: true,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            username: userInfo.username,
            password: userInfo.password,
            message: "admin account is found in db",
          });
        } else {
          console.error("no user exists in db with that username");
          res.status(401).send({
            status: false,
            message: "no user exists in db with that username",
          });
        }
      });
    } else {
      console.error("jwt id and username do not match");
      res.status(403).send({
        status: false,
        message: "username and jwt token do not match",
      });
    }
  })(req, res, next);
};
