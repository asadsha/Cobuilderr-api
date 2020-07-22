// const levenshtein = require("js-levenshtein");
const checklistModel = require("../models/checklist");

addChecklist = (checklist, userId) => {
  return new Promise((resolve, reject) => {
    checklistModel.findOneAndUpdate(
      { userid: userId },
      { $push: { checklists: checklist } },
      { upsert: true, new: true },

      (err, doc) => {
        if (err) {
          reject("Internal Server error. Cannot add checklist " + err.message);
        } else {
          resolve(doc);
        }
      }
    );
  });
};

deleteChecklist = (id, userId, userType) => {
  return new Promise((resolve, reject) => {
    checklistModel.updateOne(
      { userid: userId },
      { $pull: { checklists: { _id: id } } },
      { multi: true },
      (err, doc) => {
        if (err) {
          reject(
            "Internal Server error. Cannot delete checklist " + err.message
          );
        } else {
          resolve(doc);
        }
      }
    );
  });
};

// getChecklists = userId => {
//   return new Promise((resolve, reject) => {
//     checklistModel.find({ userid: userId }, (err, doc) => {
//       if (err) {
//         reject("Can Not Get Checklists of user. " + err.message);
//       } else {
//         if (doc.length === 0) {
//           reject("No Checklists exist for user.");
//         } else {
//           console.log(doc);

//           // let i = 0;
//           // doc.checklists.map(chklist => {
//           //   if (chklist.state === true) {
//           //     i = i + 1;
//           //   }
//           // });
//           // console.log(i);
//           // console.log(doc.checklists.progress);
//           // doc.progress = (i / doc.checklists.length) * 100;
//           // console.log(doc);
//           // resolve(doc);
//         }
//       }
//     });
//   });
// };

getChecklists = userId => {
  return new Promise((resolve, reject) => {
    // checklistModel
    //   .aggregate([
    //     {
    //       $group: {
    //         _id: {
    //           month: { $month: "$checklists.createdAt" },
    //           year: { $year: "$checklists.createdAt" }
    //         },
    //         count: { $sum: 1 }
    //       }
    //     }
    //   ])
    //   .exec(() => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log(d);
    //     }
    //   });
  });
};

updateChecklist = (id, userId, checklist) => {
  return new Promise((resolve, reject) => {
    checklistModel.findOneAndUpdate(
      { userid: userId, "checklists._id": id },
      {
        $set: {
          "checklists.$.name": checklist.name,
          "checklists.$.description": checklist.description,
          "checklists.$.dueDate": checklist.dueDate,
          "checklists.$.updatedAt": Date.now()
        }
      },
      { new: true },
      (err, doc) => {
        if (err) {
          reject("Can Not update Checklist. " + err.message);
        } else {
          resolve(doc);
        }
      }
    );
  });
};

updateChecklistStatus = (id, userId, state) => {
  return new Promise((resolve, reject) => {
    checklistModel.updateOne(
      { userid: userId, "checklists._id": id },
      {
        $set: {
          "checklists.$.state": state
        }
      },
      (err, doc) => {
        if (err) {
          reject("Can Not update status of Checklist. " + err.message);
        } else {
          resolve(doc);
        }
      }
    );
  });
};

module.exports = {
  addChecklist,
  getChecklists,
  deleteChecklist,
  updateChecklist,
  updateChecklistStatus
};
