const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const checklistSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  meetings: [
    {
      month: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },

      dueDate: {
        type: String,
        required: true
      },

      description: String,

      state: {
        type: Boolean,
        default: false
      },

      createdAt: {
        type: Date,
        default: Date.now()
      },
      updatedAt: {
        type: Date
      }
    }
  ],

  progress: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Checklist", checklistSchema);
