const mongoose = require("mongoose");

const ReamSchema = mongoose.Schema(
  {
    ream: {
      type: String,
    },
    tier: {
      type: String,
    },
    admins: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
  },
  { timestamps: true }
);

const Ream = mongoose.model("ream", ReamSchema);
module.exports = Ream;
