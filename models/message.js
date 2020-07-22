const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  // content: {
  text: { type: String },
  // file: { type: String }
  // can add any other properties to the message here.
  // for example, the message can be an image!
  // },

  sender: {
    name: {
      type: String,
      required: true
    },
    idd: { type: String, required: true },
    avatar: { type: String, default: "" }
  },
  receiver: {
    name: {
      type: String,
      required: true
    },
    idd: { type: String, required: true },
    avatar: { type: String, default: "" }
  },
  read: { type: Boolean, default: false },

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Message", messageSchema);
