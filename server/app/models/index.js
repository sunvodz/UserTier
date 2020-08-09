const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};

db.mongoose = mongoose;

db.admin = require("./admin.model");
db.ream = require("./ream.model");


module.exports = db;