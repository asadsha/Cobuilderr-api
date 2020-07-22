const mongoose = require("mongoose");

const phaseSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  color: {
    type: String,
    default: "black",
    required: true
  },

  // item: { type: mongoose.Schema.Types.ObjectId },

  status: {
    type: Boolean,
    default: false
  },

  adminDefault: {
    type: Boolean,
    default: false
  },

  totalBudget: {
    type: Number,
    default: 0
  },

  totalSpent: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// phaseSchema.virtual("phase-items", {
//   ref: "Item",
//   localField: "item",
//   foreignField: "phaseid"
// });

// phaseSchema.set("toObject", { virtuals: true });
// phaseSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Phase", phaseSchema);
