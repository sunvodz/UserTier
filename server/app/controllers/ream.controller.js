const db = require("../models");
const Ream = db.ream;
const passport = require("passport");

// TODO: FindReam
exports.FindReam = (req, res, next) => {
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
      try {
        Ream.find({})
          .populate("admin")
          .then((userInfo) => {
            if (userInfo != null) {
              console.log("Ream <all> is found in db");
              res.status(200).send({
                status: true,
                auth: true,
                message: "Ream <all> is found in db",
                info: userInfo,
              });
            } else {
              console.error("no Ream exists in db");
              res.status(401).send({
                status: false,
                message: "no user exists in db",
              });
            }
          });
      } catch (error) {
        console.error("problem communicating with db");
        res.status(500).send({
          status: false,
          message: error,
        });
      }
    } else {
      console.error("jwt id and username do not match");
      res.status(403).send({
        status: false,
        message: "username and jwt token do not match",
      });
    }
  })(req, res, next);
};

// TODO : Create Ream
exports.CreateReam = (req, res, next) => {
  passport.authenticate("admin_jwt", (err, user, info) => {
    console.log("Create Ream");
    // console.log("Info:", info);
    // console.log("Req:", req.body);

    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      console.log(info.message);
      res.status(401).send({
        status: false,
        message: info.message,
      });
    } else {
      try {
        var countMouth = 0;

        if (req.body.ream > 0 && req.body.ream < 11) {
          console.log("< 11");
          Ream.find({}).then((userInfo) => {
            if (userInfo.length < 3 && req.body.ream >= 5) {
              const data = new Ream({
                ream: req.body.ream,
                tier: "Member",
                admins: req.body.admins,
              });

              data.save((err, data) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
                console.log(data);
                res.send({
                  status: true,
                  message: "create Ream successfully!",
                  info: data,
                });
              });
            } else {
              const data = new Ream({
                ream: req.body.ream,
                tier: "Silver",
                admins: req.body.admins,
              });

              data.save((err, data) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
                console.log(data);
                res.send({
                  status: true,
                  message: "create Ream successfully!",
                  info: data,
                });
              });
            }
          });
        } else if (req.body.ream > 11 && req.body.ream <= 50) {
          console.log("11-50");

          const data = new Ream({
            ream: req.body.ream,
            tier: "Silver",
            admins: req.body.admins,
          });

          data.save((err, data) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            console.log(data);
            res.send({
              status: true,
              message: "create Ream successfully!",
              info: data,
            });
          });
        } else if (req.body.ream > 50 && req.body.ream <= 150) {
          console.log("50-150");

          const data = new Ream({
            ream: req.body.ream,
            tier: "Gold",
            admins: req.body.admins,
          });

          data.save((err, data) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            console.log(data);
            res.send({
              status: true,
              message: "create Ream successfully!",
              info: data,
            });
          });
        } else if (req.body.ream > 150 && req.body.ream <= 1000) {
          console.log("150-1000");

          const data = new Ream({
            ream: req.body.ream,
            tier: "Platinum",
            admins: req.body.admins,
          });

          data.save((err, data) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            console.log(data);
            res.send({
              status: true,
              message: "create Ream successfully!",
              info: data,
            });
          });
        } else if (req.body.ream > 1000) {
          console.log("> 1000");

          const data = new Ream({
            ream: req.body.ream,
            tier: "Platinum +",
            admins: req.body.admins,
          });

          data.save((err, data) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            console.log(data);
            res.send({
              status: true,
              message: "create Ream successfully!",
              info: data,
            });
          });
        } else {
          const data = new Ream({
            ream: req.body.ream,
            tier: "Free",
            admins: req.body.admins,
          });

          data.save((err, data) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            console.log(data);
            res.send({
              status: true,
              message: "create Ream successfully!",
              info: data,
            });
          });
        }
      } catch (error) {
        console.error("problem communicating with db");
        res.status(500).send({
          status: false,
          message: error,
        });
      }
    }
  })(req, res, next);
};
