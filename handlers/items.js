const model = require("../models/Model");

createItem = item => {
  return new Promise((resolve, reject) => {
    let itemsDoc = model.itemsModel({
      name: item.name,

      phaseid: item.phaseid,

      note: item.note,

      diy: item.diy,

      nextStep: item.nextStep,

      trade: item.trade,

      status: item.status,

      description: item.description
    });

    itemsDoc.save((err, item) => {
      if (err) {
        reject({
          Message: "Internal Server Error. Cannot Create Item in Database",
          error: err
        });
      } else {
        resolve(item);
      }
    });
  });
};

deleteItem = id => {
  return new Promise((resolve, reject) => {
    model.itemsModel.findByIdAndRemove(id, (err, doc) => {
      if (err) {
        reject("Can Not Delete Item from db. " + err.message);
      } else {
        if (doc == null) {
          reject("This Item Does not Exist");
        } else {
          resolve(doc);
        }
      }
    });
  });
};

// getItem = id => {
//   return new Promise((resolve, reject) => {
//     model.itemsModel.findById(id, (err, doc) => {
//       if (err) {
//         reject("Can Not Get item from db. " + err.message);
//       } else {
//         if (doc == null) {
//           reject("This item Does not Exist");
//         } else {
//           resolve(doc);
//         }
//       }
//     });
//   });
// };

getItems = id => {
  return new Promise((resolve, reject) => {
    model.itemsModel.find({ phaseid: id }, (err, doc) => {
      if (err) {
        reject("Can Not Get Items from db. " + err.message);
      } else {
        if (doc.length === 0) {
          resolve("No Item Exist in the db.");
        } else {
          resolve(doc);
        }
      }
    });
  });
};

updateItem = (id, item) => {
  return new Promise((resolve, reject) => {
    model.itemsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name: item.name,
          description: item.description,
          trade: item.trade,
          note: item.note,
          diy: item.diy,
          nextStep: item.nextStep
        }
      },
      { new: true },
      (err, doc) => {
        if (err) {
          reject("Can Not update Item . " + err.message);
        } else {
          resolve(doc);
        }
      }
    );
  });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  updateItem
};
