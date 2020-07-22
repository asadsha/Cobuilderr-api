// const levenshtein = require("js-levenshtein");
const model = require("../models/Model");

addDocumentFolder = (folderName, userId, userType) => {
  return new Promise((resolve, reject) => {
    let documentDoc = model.documentModel({
      folderName: folderName,
      creator: userType,
      userid: userId
    });
    documentDoc.save((err, doc) => {
      if (err) {
        reject({
          Message: "Internal Server Error. Cannot Create Folder in Database",
          error: err
        });
      } else {
        resolve(doc);
      }
    });
  });
};

deleteDocumentFolder = id => {
  return new Promise((resolve, reject) => {
    model.documentModel.findByIdAndRemove(id, (err, doc) => {
      if (err) {
        reject("Can Not Delete Folder from db. " + err.message);
      } else {
        if (doc == null) {
          reject("This Folder Does not Exist");
        } else {
          resolve(doc);
        }
      }
    });
  });
};

getDocuments = userId => {
  return new Promise((resolve, reject) => {
    model.documentModel
      .find({ userid: userId })
      .sort({ createdAt: -1 })
      .exec((err, doc) => {
        if (err) {
          reject("Can Not Get Documents of user. " + err.message);
        } else {
          if (doc.length === 0) {
            resolve("No Documents exist for user.");
          } else {
            resolve(doc);
          }
        }
      });
  });
};

updateDocumentFolder = (id, folderName) => {
  return new Promise((resolve, reject) => {
    model.documentModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          folderName: folderName,
          updatedAt: Date.now()
        }
      },
      { new: true },
      (err, doc) => {
        if (err) {
          reject("Can Not update folder . " + err.message);
        } else {
          resolve(doc);
        }
      }
    );
  });
};

deleteDocumentFile = (docid, id) => {
  return new Promise((resolve, reject) => {
    model.documentModel.updateOne(
      { _id: docid },
      { $pull: { documents: { _id: id } } },
      { multi: true },
      (err, doc) => {
        if (err) {
          reject("Internal Server error. Cannot delete file " + err.message);
        } else {
          resolve(doc);
        }
      }
    );
  });
};

addDocumentFile = (document, docId) => {
  return new Promise((resolve, reject) => {
    model.documentModel.findOneAndUpdate(
      { _id: docId },
      { $push: { documents: document } },
      { upsert: true, new: true },

      (err, doc) => {
        if (err) {
          reject("Internal Server error. Cannot add file " + err.message);
        } else {
          resolve(doc);
        }
      }
    );
  });
};

module.exports = {
  addDocumentFolder,
  getDocuments,
  deleteDocumentFolder,
  updateDocumentFolder,
  deleteDocumentFile,
  addDocumentFile
};
