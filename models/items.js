const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  phaseid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase"
  },

  status: {
    type: Boolean,
    default: false
  },

  estimatedCost: {
    type: Number,
    default: 0
  },
  paidCost: {
    type: Number,
    default: 0
  },
  costSaved: {
    type: Number,
    default: 0
  },

  description: {
    type: String,
    required: true
  },

  note: {
    type: String,
    default: ""
  },

  diy: {
    type: String,
    default: ""
  },

  nextStep: {
    type: String,
    default: ""
  },

  trade: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Item", itemsSchema);
