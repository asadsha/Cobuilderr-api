const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  folderName: {
    type: String
  },
  documents: [
    {
      pdfurl: {
        type: String
      },

      createdAt: {
        type: Date,
        default: Date.now()
      },
      creator: {
        type: String
      }
    }
  ],
  creator: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Document", documentSchema);
