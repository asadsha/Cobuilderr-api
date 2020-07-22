// const jwt = require('jsonwebtoken');

const jwt = require("../auth/jwt");

// const config = require("../config/config");

const model = require("../models/Model");

const bcrypt = require("bcryptjs");
const phaseHandler = require("./phase");
const itemsHandler = require("./items");

createUser = (user, id, type) => {
  return new Promise((resolve, reject) => {
    username = "@" + user.username;
    if (type === "admin") {
      model.userModel.findOne(
        { $or: [{ email: user.email }, { username: user.username }] },
        function(err, user2) {
          if (err) {
            reject(error);
          } else {
            if (!user2) {
              //Create The New User here
              let userDoc = model.userModel({
                email: user.email,
                password: user.password,
                username: user.username,
                type: user.type,
                name: user.name,
                imageUrl: user.imageUrl,
                contact: user.contact,
                location: user.location,
                project: user.project,
                adminid: id
              });
              userDoc.save((err, user) => {
                if (err) {
                  reject("User cannot be created" + err.message);
                } else {
                  defaultDataForUser(user._id)
                    .then(phase => {
                      console.log(phase);
                      resolve({
                        user
                      });
                    })
                    .catch(err => {
                      reject(user);
                    });
                  // getUsers();
                  // resolve(user);
                }
              });
            } else {
              if (user2.email === user.email) {
                reject("Email Already Exists");
              } else if (user2.username === user.username) {
                reject("username already exists");
              }
            }
          }
        }
      );
    } else {
      reject("You are not authorized for this action");
    }
  });
};

createAdmin = user => {
  return new Promise((resolve, reject) => {
    user.username = "@" + user.username;

    model.adminModel.findOne(
      { $or: [{ email: user.email }, { username: user.username }] },
      function(err, user2) {
        if (err) {
          reject(error);
        } else {
          console.log(!user2);
          if (!user2) {
            //Create The New User here
            let userDoc = model.adminModel({
              email: user.email,
              password: user.password,
              username: user.username,
              type: user.type,
              name: user.name,
              imageUrl: user.imageUrl
              // gender: user.gender,
              // Dateofbirth: user.dateofbirth
            });
            userDoc.save((err, user) => {
              if (err) {
                reject("Admin cannot be created" + err.message);
              } else {
                resolve(user);
              }
            });
          } else {
            if (user2.email === user.email) {
              reject("Email Already Exists");
            } else if (user2.username === user.username) {
              reject("username already exists");
            }
          }
        }
      }
    );
  });
};

signinAdmin = User => {
  return new Promise((resolve, reject) => {
    model.adminModel.findOne({ email: User.email }, function(err, user) {
      console.log(User.email);
      if (err) {
        reject(err);
      } else if (user === null) {
        reject("No User Exist With This Email.");
      } else {
        payloadobj = {
          userEmail: user.email,
          userId: user._id,
          userType: user.type,
          userAvatar: user.imageUrl,
          username: user.username
        };
        verifyPassword(User.password, user.password, payloadobj)
          .then(token => {
            resolve({
              token: token,
              id: user._id
            });
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  });
};

verifyPassword = (password, EncryptedPassword, payloadobj) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, EncryptedPassword, (err, res) => {
      // Password did not match

      if (res === false) {
        reject("Incorrect Password");
      } else {
        //if Password Matches Generate A Jwt Token and send it back in Response
        jwt
          .generateJwt(payloadobj)
          .then(token => {
            resolve(token);
          })
          .catch(err => {
            reject(
              "Internal Server Error. Failed To generate Authorization Token."
            );
          });
      }
    });
  });
};

getUsers = () => {
  return new Promise((resolve, reject) => {
    model.userModel
      .find({})
      .sort({ createdAt: -1 })
      .exec((err, doc) => {
        if (err) {
          reject("Can Not Get Users. " + err.message);
        } else {
          if (doc.length === 0) {
            reject("No Users Exist.");
          } else {
            resolve(doc);
          }
        }
      });
  });
};

updateUser = (id, user) => {
  return new Promise((resolve, reject) => {
    model.userModel
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name: user.name,
            email: user.email,
            contact: user.contact,
            location: user.location,
            username: user.username,
            project: user.project,
            imageUrl: user.imageUrl
          }
        },
        { new: true }
        // (err, doc) => {
        //   if (err) {
        //     reject("Can Not update User . " + err.message);
        //   } else {
        //     resolve(doc);
        //   }
        // }
      )
      .sort({ createdAt: -1 })
      .exec((err, doc) => {
        if (err) {
          reject("Can Not update User . " + err.message);
        } else {
          resolve(doc);
        }
      });
  });
};

deleteUser = id => {
  return new Promise((resolve, reject) => {
    model.userModel.findByIdAndRemove(id, (err, doc) => {
      if (err) {
        reject("Can Not Delete User from db. " + err.message);
      } else {
        if (doc == null) {
          reject("This User Does not Exist");
        } else {
          resolve(doc);
        }
      }
    });
  });
};

defaultDataForUser = id => {
  return new Promise((resolve, reject) => {
    //getting default phases
    model.phaseModel.find({ adminDefault: true }, (err, phase) => {
      if (err) {
        reject("Can Not find default Phases from db. " + err.message);
      } else {
        if (phase == null || phase.length === 0) {
          resolve(" No default phases Exist");
        } else {
          //now applying map on default phases to copy them for new user
          phase.map((doc, index) => {
            const newDoc = {
              name: doc.name,
              description: doc.description,
              userid: id,
              color: doc.color
            };
            phaseHandler
              .createPhase(newDoc)
              .then(newPhase => {
                // now getting items of default phases
                copyDefaultItemsForUser(doc._id, newPhase._id)
                  .then(item => {
                    resolve(item);
                  })
                  .catch(err => {
                    reject("cant copy this item for user");
                  });
                console.log(newPhase);
              })
              .catch(err => {
                reject("Internal Server Error. failed to create new phase.");
              });
          });
        }
      }
    });
  });
};

//here we are gonna get iitems from default phases and will copy the, to new user's phases phases
copyDefaultItemsForUser = (id, newid) => {
  return new Promise((resolve, reject) => {
    model.itemsModel.find({ phaseid: id }, (err, items) => {
      if (err) {
        reject("Can Not Get Items from db. " + err.message);
      } else {
        if (items.length === 0) {
          resolve("No Item Exist in the db.");
        } else {
          items.map((doc, index) => {
            const newDoc = {
              name: doc.name,
              description: doc.description,
              phaseid: newid,
              status: doc.status,
              note: doc.note,
              diy: doc.diy,
              nextStep: doc.nextStep,
              trade: doc.trade
            };
            itemsHandler
              .createItem(newDoc)
              .then(newItem => {
                resolve(newItem);
                console.log(newItem);
              })
              .catch(err => {
                reject("Internal Server Error. failed to copy  items.");
              });
          });
        }
      }
    });
  });
};

module.exports = {
  createUser,
  createAdmin,
  signinAdmin,
  verifyPassword,
  getUsers,
  updateUser,
  deleteUser
};
