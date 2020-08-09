const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  image: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
},
  { timestamps: true }
)

const Admin = mongoose.model('admin', AdminSchema);
module.exports = Admin;