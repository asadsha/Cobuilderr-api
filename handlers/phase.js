const model = require("../models/Model");

createPhase = phase => {
  return new Promise((resolve, reject) => {
    let phaseDoc = model.phaseModel({
      name: phase.name,

      status: phase.status,

      description: phase.description,

      color: phase.color,

      userid: phase.userid,

      adminDefault: phase.adminDefault
    });

    phaseDoc.save((err, phase) => {
      if (err) {
        reject({
          Message: "Internal Server Error. Cannot Create phase in Database",
          error: err
        });
      } else {
        resolve(phase);
      }
    });
  });
};

getPhases = userid => {
  return new Promise((resolve, reject) => {
    model.phaseModel.find({ userid: userid }, (err, doc) => {
      if (err) {
        reject("Can Not Get Phases from db. " + err.message);
      } else {
        if (doc.length === 0) {
          resolve("No phase Exist in the db");
        } else {
          resolve(doc);
        }
      }
    });
  });
};

getDefaultPhases = () => {
  return new Promise((resolve, reject) => {
    model.phaseModel.find({ adminDefault: true }, (err, doc) => {
      if (err) {
        reject("Can Not Get Phases from db. " + err.message);
      } else {
        if (doc.length === 0) {
          resolve("No phase Exist in the db");
        } else {
          resolve(doc);
        }
      }
    });
  });
};

// getPhase = (id, userid) => {
//   return new Promise((resolve, reject) => {
//     model.phaseModel
//       .findById({ _id: id })
//       .populate({
//         path: "item",
//         match: { userid: userid, phaseid: id }
//         // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
//         // select: "name -_id"
//       })
//       .exec()
//       .then(res => {
//         resolve(res);
//       })
//       .catch(err => reject(err));
//   });
// };

updatePhase = (phase, id) => {
  return new Promise((resolve, reject) => {
    model.phaseModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name: phase.name,
          description: phase.description,
          color: phase.color
        }
      },
      { new: true },
      (err, doc) => {
        if (err) {
          reject("Can Not update Phase . " + err.message);
        } else {
          resolve(doc);
        }
      }
    );
  });
};

deletePhase = id => {
  return new Promise((resolve, reject) => {
    model.phaseModel.findByIdAndRemove(id, (err, doc) => {
      if (err) {
        reject("Can Not Delete Phase from db. " + err.message);
      } else {
        if (doc == null) {
          reject("This Phase Does not Exist");
        } else {
          deleteAllItems(id)
            .then(items => {
              resolve(items);
            })
            .catch(err => {
              reject(err);
            });
        }
      }
    });
  });
};

deleteAllItems = id => {
  return new Promise((resolve, reject) => {
    model.itemsModel.deleteMany({ phaseid: id }, (err, doc) => {
      if (err) {
        reject("Can Not Delete Items of phase from db. " + err.message);
      } else {
        if (doc == null) {
          reject("items of this phase Does not Exist");
        } else {
          resolve("items deleted of this phase");
        }
      }
    });
  });
};
module.exports = {
  createPhase,
  getPhases,
  getDefaultPhases,
  deleteAllItems,
  deletePhase,
  updatePhase
};
