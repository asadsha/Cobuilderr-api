const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  adminid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },

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

  imageUrl: {
    type: String,
    default: ""
  },

  contact: {
    type: String,
    default: ""
  },

  location: {
    type: String,
    default: ""
  },

  project: {
    type: String,
    default: ""
  },

  pinterestUserName: {
    type: String,
    default: ""
  },

  pinterestBoardName: {
    type: String,
    default: ""
  },

  pinterestFirstTime: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Execute before each admin.save() call
userSchema.pre("save", function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified("password")) return callback();

  // Password changed so we need to hash it
  var salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
  callback();
});

module.exports = mongoose.model("User", userSchema);
