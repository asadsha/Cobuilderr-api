// const jwt = require('jsonwebtoken');

const jwt = require("../auth/jwt");

// const config = require("../config/config");

const model = require("../models/Model");

const bcrypt = require("bcryptjs");

signinUser = User => {
  return new Promise((resolve, reject) => {
    model.userModel.findOne({ email: User.email }, function(err, user) {
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
          username: user.username,
          name: user.name,
          pinterestUserName: user.pinterestUserName,
          pinterestBoardName: user.pinterestBoardName,
          pinterestFirstTime: user.pinterestFirstTime
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

updatePinterestCredentials = (id, data) => {
  return new Promise((resolve, reject) => {
    model.userModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          pinterestUserName: data.pinterestUserName,
          pinterestBoardName: data.pinterestBoardName,
          pinterestFirstTime: true
        }
      },
      { new: true },
      (err, doc) => {
        if (err) {
          reject("Can Not add pinterest credentials in userr . " + err.message);
        } else {
          resolve(doc);
        }
      }
    );
  });
};

deletePinterestCredentials = id => {
  return new Promise((resolve, reject) => {
    model.userModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          pinterestUserName: "",
          pinterestBoardName: "",
          pinterestFirstTime: false
        }
      },
      { new: true },
      (err, doc) => {
        if (err) {
          reject("Can Not add pinterest credentials in userr . " + err.message);
        } else {
          resolve(doc);
        }
      }
    );
  });
};

module.exports = {
  signinUser,
  verifyPassword,
  updatePinterestCredentials,
  deletePinterestCredentials
};
