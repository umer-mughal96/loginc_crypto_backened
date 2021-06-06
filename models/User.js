const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin","user"],
      default: "user",
    },
    package: {
      type: String,
      enum: ["Pro Plan","Trader Plan","Hobbyist",null],
      default: null,
    },
    paid: {
      type: Number,
      default: null,
    },
    active : {
      type : Boolean,
      default : true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
