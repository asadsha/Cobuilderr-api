// const levenshtein = require("js-levenshtein");
const model = require("../models/Model");
const phaseHandler = require("./phase");

getBudgeter = userid => {
  return new Promise((resolve, reject) => {
    getPhases(userid)
      .then(phases => {
        //creating budget and spent variables for getting total budget
        let budget = 0;
        let spent = 0;
        const phaseIdArray = [];
        phases.map(val => {
          budget += val.totalBudget;
          spent += val.totalSpent;
          phaseIdArray.push(val._id);
        });
        //applying for each for counting items, and paiditems of each phases
        countItems(phaseIdArray)
          .then(count => {
            const newDoc = {
              phasesArray: phases,
              totalBudget: budget,
              totalSpent: spent,
              totalItems: count.itemsCount,
              totalPaidItems: count.itemsPaidCount
            };
            resolve(newDoc);
          })
          .catch(Error => {
            reject(Error);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
};

//middleware for getBudgeter
countItems = phaseIdArray => {
  return new Promise((resolve, reject) => {
    model.itemsModel.find({ phaseid: { $in: phaseIdArray } }, (err, doc) => {
      if (err) {
        reject("Can Not Get Items for these phases. " + err.message);
      } else {
        if (doc.length === 0) {
          reject("No phase Exist in the db");
        } else {
          let itemsCount = 0;
          let itemsPaidCount = 0;
          //now we will get total items count and total paid items count
          doc.map(val => {
            itemsCount++;
            if (val.paidCost > 0) {
              itemsPaidCount++;
            }
          });
          const count = {
            itemsCount: itemsCount,
            itemsPaidCount: itemsPaidCount
          };
          resolve(count);
        }
      }
    });
  });
};

updateBudgeter = (id, itemBudget) => {
  return new Promise((resolve, reject) => {
    model.itemsModel.find({ _id: id }, (err, item) => {
      if (err) {
        reject("Can Not Get Item from db. " + err.message);
      } else {
        if (item.length === 0) {
          reject("No Item Exist with this id");
        } else {
          //will compare previous values of spent or estimated... if changed then we will change phase budget too
          if (
            item[0].estimatedCost !== itemBudget.estimatedCost ||
            item[0].paidCost !== itemBudget.paidCost
          ) {
            //after updating phase we will update items
            updatePhase(
              item[0].phaseid,
              item[0].estimatedCost,
              item[0].paidCost,
              itemBudget
            )
              .then(phase => {
                //now phase is updated we will update item
                item[0].estimatedCost = itemBudget.estimatedCost;
                item[0].paidCost = itemBudget.paidCost;
                item[0].save((err, item) => {
                  if (err) {
                    reject("item cannot be saved" + err.message);
                  } else {
                    //now we will get updated count of total items and total items paid
                    updateItemsCount(itemBudget.userid)
                      .then(data => {
                        const newDoc = {
                          totalItems: data.totalItems,
                          totalPaidItems: data.totalPaidItems,
                          totalBudget: data.totalBudget,
                          totalSpent: data.totalSpent,
                          newItem: item
                        };
                        resolve(newDoc);
                      })
                      .catch(Error => {
                        reject(Error);
                      });
                  }
                });
              })
              .catch(Error => {
                reject(Error);
              });
          } else {
            resolve("Same values as previous");
          }
        }
      }
    });
  });
};

updateItemsCount = userid => {
  return new Promise((resolve, reject) => {
    //first we will get phases array
    model.phaseModel.find({ userid: userid }, (err, phase) => {
      if (err) {
        reject("Can Not Get phase for this user. " + err.message);
      } else {
        if (phase.length === 0) {
          reject("No phase Exist in the db");
        } else {
          //creating budget and spent variables for getting total budget
          let budget = 0;
          let spent = 0;
          const phaseIdArray = [];
          phase.map(val => {
            budget += val.totalBudget;
            spent += val.totalSpent;
            phaseIdArray.push(val._id);
          });
          countItems(phaseIdArray)
            .then(count => {
              //combining measured data
              const measuredData = {
                totalBudget: budget,
                totalSpent: spent,
                totalItems: count.itemsCount,
                totalPaidItems: count.itemsPaidCount
              };
              resolve(measuredData);
            })
            .catch(Error => {
              reject(Error);
            });
        }
      }
    });
  });
};

updatePhase = (id, estimatedCost, paidCost, itemBudget) => {
  return new Promise((resolve, reject) => {
    model.phaseModel.find({ _id: id }, (err, phase) => {
      if (err) {
        reject("Can Not Get Phase to update from db. " + err.message);
      } else {
        if (phase.length === 0) {
          reject("No Phase exist with this id");
        } else {
          //will compare previous values of spent or estimated ,if they are greater then previous or smaller  then we will inc or dec on these basis
          if (estimatedCost > itemBudget.estimatedCost) {
            const diff = estimatedCost - itemBudget.estimatedCost;
            phase[0].totalBudget = phase[0].totalBudget - diff;
          }
          if (estimatedCost < itemBudget.estimatedCost) {
            const diff = itemBudget.estimatedCost - estimatedCost;
            phase[0].totalBudget = phase[0].totalBudget + diff;
          }
          if (paidCost > itemBudget.paidCost) {
            const diff = paidCost - itemBudget.paidCost;
            phase[0].totalSpent = phase[0].totalSpent - diff;
          }
          if (paidCost < itemBudget.paidCost) {
            const diff = itemBudget.paidCost - paidCost;
            phase[0].totalSpent = phase[0].totalSpent + diff;
          }
          phase[0].save((err, doc) => {
            if (err) {
              reject("phase cannot be saved" + err.message);
            } else {
              resolve(doc);
            }
          });
        }
      }
    });
  });
};

//middleware for getBudgeter and updateBudgeter
getPhases = userid => {
  return new Promise((resolve, reject) => {
    model.phaseModel.find({ userid: userid }, (err, doc) => {
      if (err) {
        reject("Can Not Get Phases from db. " + err.message);
      } else {
        if (doc.length === 0) {
          reject("No phase Exist in the db");
        } else {
          resolve(doc);
        }
      }
    });
  });
};

module.exports = {
  getBudgeter,
  updateBudgeter
};
