const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true }
  },
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },

  type: String,

  password: String,

  name: String,

  imageUrl: String,

  Dateofbirth: Date,

  gender: String,

  age: Number,

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Execute before each admin.save() call
adminSchema.pre("save", function(callback) {
  var admin = this;

  // Break out if the password hasn't changed
  if (!admin.isModified("password")) return callback();

  // Password changed so we need to hash it
  var salt = bcrypt.genSaltSync(10);
  admin.password = bcrypt.hashSync(admin.password, salt);
  callback();
});

module.exports = mongoose.model("Admin", adminSchema);
